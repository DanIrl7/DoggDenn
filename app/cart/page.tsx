'use client';

import Link from 'next/link';
import { useCartStore } from '@/app/store/cartStore';
import CartItemComponent from '@/app/components/CartItemComponent';

export default function CartPage() {
  const { items, clearCart, getTotal } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <main className="min-h-screen p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-[#7d3d23] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
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
              <span>Tax:</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-[#7d3d23]">
              ${(total * 1.1).toFixed(2)}
            </span>
          </div>

          <button className="w-full bg-[#7d3d23] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-3">
            Proceed to Checkout
          </button>

          <button
            onClick={() => clearCart()}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors mb-3"
          >
            Clear Cart
          </button>

          <Link
            href="/products"
            className="block text-center text-[#7d3d23] font-semibold hover:opacity-80 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
