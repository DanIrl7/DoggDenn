'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/app/store/cartStore';

interface OrderDetails {
  sessionId: string;
  amount: number;
  currency: string;
  status: string;
  items: {
    id: string 
    name: string;
    quantity: number;
    price: number;
    image?: string; 
  }[];
  createdAt: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const { items: cartItems, clearCart } = useCartStore();

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        console.log('SUCCESS PAGE: Fetching order details for sessionId:', sessionId);
        const response = await fetch(`/api/orders/${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        console.log('SUCCESS PAGE: Received order data:', data);
        setOrder(data);

        // Save order to database (only once)
        if (!hasSaved) {
          console.log('SUCCESS PAGE: Calling saveOrderToDatabase, checkout items:', order );
          await saveOrderToDatabase(data);
          setHasSaved(true);
        }
      } catch (err) {
        setError('Could not load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, hasSaved]);

  const saveOrderToDatabase = async (orderDetails: OrderDetails) => {
    try {
      setSaving(true);
      console.log('SUCCESS PAGE: saveOrderToDatabase called');
      console.log('SUCCESS PAGE: orderDetails:', orderDetails);
      console.log('SUCCESS PAGE: cartItems:', cartItems);
      
      // Prepare order data with cart items
      const payloadData = {
        sessionId: orderDetails.sessionId,
        items: orderDetails.items,
        total: orderDetails.amount / 100, // Convert from cents
      };
      console.log('SUCCESS PAGE: Sending payload to /api/orders/save:', JSON.stringify(payloadData, null, 2));
      
      const saveResponse = await fetch('/api/orders/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData),
      });

      console.log('SUCCESS PAGE: Response status:', saveResponse.status);
      
      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.log('SUCCESS PAGE: Error response:', errorData);
        throw new Error('Failed to save order to database');
      }

      const result = await saveResponse.json();
      
      // Clear cart after successful save (or if order already saved)
      clearCart();
      console.log('Order saved successfully:', result.message);
    } catch (err) {
      console.error('Error saving order to database:', err);
      // Don't throw error - payment was successful even if save fails
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-6 max-w-4xl mx-auto bg-[#FAF8F3]">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#7d3d23] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading your order...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-6 max-w-4xl mx-auto bg-[#FAF8F3]">
        <div className="text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-red-600 mb-2">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
          <Link
            href="/products"
            className="inline-block bg-[#7d3d23] text-white px-6 py-3 rounded-full hover:opacity-90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen p-6 max-w-4xl mx-auto bg-[#FAF8F3]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <Link
            href="/products"
            className="inline-block bg-[#7d3d23] text-white px-6 py-3 rounded-full hover:opacity-90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto bg-[#FAF8F3]">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
        <p className="text-xl text-gray-600">Thank you for your purchase</p>
      </div>

      {/* Order Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Order Info */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Order Details</h2>

          {/* Order Number */}
          <div className="mb-6 pb-6 border-b">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-gray-900 font-mono break-all">{order.sessionId}</p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ${(item.price / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-semibold mb-1">Status</p>
            <p className="text-lg text-blue-900 capitalize font-bold">{order.status}</p>
          </div>

          {/* Order Date */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Date</p>
            <p className="text-gray-900">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 h-fit">
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>

          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${((order.amount / 1.1) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (10%)</span>
              <span className="font-semibold">${(((order.amount / 1.1) / 100) * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">Free</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold">Total</span>
            <span className="text-3xl font-bold text-[#7d3d23]">
              ${(order.amount / 100).toFixed(2)}
            </span>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <p className="text-sm text-green-700">
              ✓ Payment processed successfully
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your email address with order details.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-[#f0ede5] rounded-2xl border border-[#e0ddd5] p-8 mb-8">
        <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">What&#39;s Next?</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="mr-3">📦</span>
            <span>Your order will be prepared and shipped within 2-3 business days</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3">📧</span>
            <span>You&#39;ll receive shipping updates via email</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3">🔍</span>
            <span>Track your order status anytime from this page using your order number</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/products"
          className="inline-block text-center bg-[#7d3d23] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="inline-block text-center bg-gray-200 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
