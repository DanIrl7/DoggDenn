'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  sessionId: string | null;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      
      if (response.status === 401) {
        setError('Please sign in to view your orders');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You have not placed any orders yet</p>
        </div>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        You have <span className="font-semibold">{orders.length}</span> order{orders.length !== 1 ? 's' : ''}
      </div>

      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          {/* Order Header */}
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Order Number */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="font-mono text-sm text-gray-900 truncate">
                  {order.id.substring(0, 12)}...
                </p>
              </div>

              {/* Order Date */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Order Total */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  ${typeof order.total === 'string' ? parseFloat(order.total).toFixed(2) : order.total.toFixed(2)}
                </p>
              </div>

              {/* Order Status */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  ></div>
                  <p className="font-semibold text-gray-900 capitalize">{order.status.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
            {order.sessionId && (
              <Link
                href={`/success?session_id=${order.sessionId}`}
                className="inline-block text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                View Details →
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
