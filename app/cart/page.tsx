'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/app/store/cartStore';
import CartItemComponent from '@/app/components/CartItemComponent';
import OrderHistory from '@/app/components/OrderHistory';

export default function CartPage() {
  const { items, clearCart, getTotal } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const total = getTotal();
  const finalTotal = total * 1.1; // with tax

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the checkout API route
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          total: finalTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Checkout failed');
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && activeTab === 'cart') {
    return (
      <main className="min-h-screen p-6 max-w-6xl mx-auto bg-[#FAF8F3]">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-[#7d3d23] text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto bg-[#FAF8F3]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Account</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'cart'
                ? 'border-[#7d3d23] text-[#7d3d23]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Shopping Cart
            {items.length > 0 && (
              <span className="ml-2 bg-[#7d3d23] text-white text-sm rounded-full px-2 py-0.5">
                {items.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'orders'
                ? 'border-[#7d3d23] text-[#7d3d23]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Order History
          </button>
        </div>
      </div>

      {/* Cart Tab Content */}
      {activeTab === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Cart Summary & Checkout */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 border-b pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%):</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-[#7d3d23]">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className={`w-full text-white py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed opacity-70'
                  : 'bg-[#7d3d23] hover:opacity-90'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>

            <button
              onClick={() => clearCart()}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-full font-semibold hover:bg-gray-50 transition-colors mb-3"
            >
              Clear Cart
            </button>

            <Link
              href="/products"
              className="block text-center text-[#7d3d23] font-semibold hover:opacity-80 transition-opacity text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Orders Tab Content */}
      {activeTab === 'orders' && <OrderHistory />}
    </main>
  );
}
