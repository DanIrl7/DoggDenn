// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CheckoutSessionRequest } from '@/app/types';
import { auth } from '@clerk/nextjs/server';
// import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover'
});

// const MAX_METADATA_LENGTH = 500;

export async function POST(request: NextRequest) {
  try {
    const { items, total }: CheckoutSessionRequest = await request.json();
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

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // Create line items for Stripe Checkout
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || undefined,
          images: item.image ? [item.image] : undefined,
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));


//     // CREATE CART ITEMS FOR STORAGE
//     const cartItems = items.map((item: CartItem) =>  ({
//       id: item.id,
//       name: item.name,
//       quantity: item.quantity,
//       price: item.price,
//     }))

//     const cartItemsJson = JSON.stringify(cartItems)

//     const metadata: Record<string, string> = { userId }

// if (cartItemsJson.length <= MAX_METADATA_LENGTH) {
//       // If small enough, store directly in metadata
//       metadata.cartItems = cartItemsJson;
//     } else {
//       const TempCart = await prisma.tempCart.create({
//         data: {
//           userId,
//           items: cartItemsJson,
//           expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
//         }
//       });
//       metadata.tempCartId = TempCart.id;
//     }

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
