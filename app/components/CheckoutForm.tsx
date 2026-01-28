'use client';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useCartStore, CartItem } from '@/app/store/cartStore';

interface CheckoutFormProps {
  total: number;
  items: CartItem[];
}

export default function CheckoutForm({ total, items }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const totalWithTax = total * 1.1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe is not loaded');
      return;
    }

    if (!email || !name) {
      setError('Please enter your email and name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment intent on backend
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: totalWithTax,
        }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await checkoutResponse.json();

      // Step 2: Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email,
            name,
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true);
        clearCart();
        
        // Reset form
        setEmail('');
        setName('');
        elements.getElement(CardElement)?.clear();

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          window.location.href = '/order-success';
        }, 2000);
      } else {
        setError('Payment was not successful. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
        <p className="text-gray-700">Thank you for your order. You will be redirected shortly...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7d3d23]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7d3d23]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#7d3d23] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Processing Payment...' : `Pay $${totalWithTax.toFixed(2)}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Use card 4242 4242 4242 4242 for testing with any future expiration and any CVC
      </p>
    </form>
  );
}
