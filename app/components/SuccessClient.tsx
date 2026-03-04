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

export default function SuccessClient() {
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
        total: orderDetails.amount / 100,
      };

      console.log('SUCCESS PAGE: Sending payload:', payloadData);

      const saveResponse = await fetch('/api/orders/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadData),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save order');
      }

      console.log('SUCCESS PAGE: Order saved successfully');
      clearCart();
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Order was processed but could not be saved. Please contact support.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/products"
              className="inline-block bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No order details found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-4xl font-bold text-center text-primary mb-2">Payment Successful!</h1>
          <p className="text-center text-gray-600 mb-8">Thank you for your order</p>

          {/* Order Summary */}
          <div className="bg-background rounded-2xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Order ID:</span>
                <span className="font-semibold text-primary">{order.sessionId.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Amount:</span>
                <span className="font-semibold text-primary">${(order.amount / 100).toFixed(2)} {order.currency.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Status:</span>
                <span className={`font-semibold ${order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Date:</span>
                <span className="font-semibold text-primary">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="bg-background rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-primary mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">A confirmation email has been sent to you.</p>
            {saving && <p className="text-sm text-yellow-600">Saving order details...</p>}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/products"
              className="block w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="block w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-background transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
