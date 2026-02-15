'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/app/store/cartStore';

interface OrderWithItems {
  id: string;
  createdAt: string;
  total: string;
  items: Array<{
    id: string;
    quantity: number;
    price: string;
    product: {
      name: string;
    };
  }>;
}

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCartStore();

  useEffect(() => {
    if(!sessionId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${sessionId}`);
        const data = await res.json();
        setOrder(data);

        clearCart();
      }
      catch (err) {
        console.error('error loading orders', err)
      }
      finally {
        setLoading(false)
      }
    }

    fetchOrder()

  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen p-6 max-w-2xl mx-auto flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Order</h1>
          <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
          <Link
            href="/products"
            className="inline-block bg-[#7d3d23] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Shopping
          </Link>
        </div>
      </main>
    );
  }
  

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 text-lg">Thank you for your order!</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Order Number:</span>
          </p>
          <p className="text-2xl font-bold text-[#7d3d23] mb-4">{order?.id?.slice(0, 8)}...</p>
          <p className="text-gray-600 text-sm mb-4">
            Ordered on {new Date(order?.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-sm">
            A confirmation email has been sent to your email address.
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order?.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div className="text-left">
                  <p className="font-medium text-gray-900">{item.product?.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">Total:</p>
              <p className="text-2xl font-bold text-[#7d3d23]">${order?.total}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-gray-700">
            Your order is being processed and will be shipped soon. You can track your order status in your account.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/products"
            className="block w-full bg-[#7d3d23] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
