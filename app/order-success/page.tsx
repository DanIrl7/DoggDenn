'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrderSuccess() {
  const [orderNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      // Generate a random order number for demo purposes
      return `ORD-${Date.now()}`;
    }
    return '';
  });

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
          <p className="text-2xl font-bold text-[#7d3d23] mb-4">{orderNumber}</p>
          <p className="text-gray-600 text-sm">
            A confirmation email has been sent to your email address.
          </p>
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
