'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/app/store/cartStore';
import CartItemComponent from '@/app/components/CartItemComponent';
import OrderHistory from '@/app/components/OrderHistory';
import { useToast } from '@/app/components/ToastProvider';

export default function CartPage() {
  const { items, clearCart, getTotal, isHydrating, hasHydrated } = useCartStore();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const total = getTotal();
  const finalTotal = total * 1.1; // with tax

  const handleClearCart = async () => {
    if (isClearingCart) return;

    setIsClearingCart(true);
    setError(null);

    try {
      const response = await fetch('/api/cart', { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error((data as { message?: string } | null)?.message || 'Failed to clear cart');
      }

      clearCart();
      showToast('Cart cleared', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsClearingCart(false);
    }
  };

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
    if (!hasHydrated || isHydrating) {
      return (
        <main className="min-h-screen p-6 max-w-6xl mx-auto bg-background">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="mx-auto mb-4 w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xl text-gray-600">Loading your cart…</p>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen p-6 max-w-6xl mx-auto bg-background">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto bg-background">
      <div className="mb-8">
        <h1 className="text-4xl text-amber-600 font-bold mb-6">Account</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-amber-200">
          <button
            onClick={() => setActiveTab('cart')}
            className={`relative px-6 py-3 font-semibold transition-colors duration-700
              after:content-[''] after:absolute after:left-0 after:-bottom-px after:h-0.5 after:w-full after:bg-amber-600 after:origin-left after:transition-transform after:duration-700 after:ease-out
              ${
                activeTab === 'cart'
                  ? 'text-amber-600 after:scale-x-100'
                  : 'text-gray-500 hover:text-gray-900 after:scale-x-0'
              }`}
          >
            Shopping Cart
            {items.length > 0 && (
              <span className="ml-2 bg-amber-600 text-white text-sm rounded-full px-2 py-0.5">
                {items.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`relative px-6 py-3 font-semibold transition-colors duration-200
              after:content-[''] after:absolute after:left-0 after:-bottom-px after:h-0.5 after:w-full after:bg-amber-600 after:origin-left after:transition-transform after:duration-300 after:ease-out
              ${
                activeTab === 'orders'
                  ? 'text-amber-600 after:scale-x-100'
                  : 'text-gray-500 hover:text-gray-900 after:scale-x-0'
              }`}
          >
            Order History
          </button>
        </div>
      </div>

      {activeTab === 'cart' && items.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleClearCart}
            disabled={isClearingCart}
            className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 ${
              isClearingCart
                ? 'bg-black opacity-70 text-white cursor-not-allowed'
                : 'bg-black text-white hover:opacity-90'
            }`}
          >
            {isClearingCart && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isClearingCart ? 'Clearing…' : 'Clear Cart'}
          </button>
        </div>
      )}

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
              <span className="text-2xl font-bold text-primary">
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
                  ? 'bg-black cursor-not-allowed opacity-70'
                  : 'bg-black hover:opacity-90'
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
              onClick={handleClearCart}
              disabled={isClearingCart}
              className={`w-full border py-2 rounded-full font-semibold transition-colors mb-3 flex items-center justify-center gap-2 ${
                isClearingCart
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isClearingCart && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {isClearingCart ? 'Clearing…' : 'Clear Cart'}
            </button>

            <Link
              href="/products"
              className="block text-center text-primary font-semibold hover:opacity-80 transition-opacity text-sm"
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
