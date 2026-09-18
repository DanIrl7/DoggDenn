// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CheckoutSessionRequest } from '@/app/types';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover'
  });
};

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { items }: CheckoutSessionRequest = await request.json();
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Validate inputs
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'You must be logged in to checkout' },
        { status: 401 }
      )
    }

    // Re-derive prices (and names/images) from the database — the client's
    // `item.price` is never trusted here, since it's trivial to edit in
    // devtools before this request is sent.
    const productIds = [...new Set(items.map((item) => item.id))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productById = new Map(products.map((product) => [product.id, product]));

    const missingIds = productIds.filter((id) => !productById.has(id));
    if (missingIds.length > 0) {
      return NextResponse.json(
        { error: `Product(s) no longer available: ${missingIds.join(', ')}` },
        { status: 400 }
      );
    }

    // Create line items for Stripe Checkout
    const lineItems = items.map((item) => {
      const product = productById.get(item.id)!;
      const quantity = Math.max(1, Math.floor(item.quantity));

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || undefined,
            images: product.image ? [product.image] : undefined,
            metadata: {
              productId: product.id,
            },
          },
          unit_amount: Math.round(parseFloat(product.price.toString()) * 100), // Convert to cents
        },
        quantity,
      };
    });

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'MX'],
      },
      metadata: { userId }
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        error: 'Checkout processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
