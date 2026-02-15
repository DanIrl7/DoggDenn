import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// import { auth } from '@clerk/nextjs/server';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const stripe = getStripe();

// try {
//   const { userId } = await auth()

//   if (!userId) {
//     return NextResponse.json(
//       { error: 'You must be logged in to view orders' },
//         { status: 401 }
//     )
//   }
// }

// catch (error) {
//   console.error('Authentication error:', error);
//   return NextResponse.json('Failed to authenticate user', { status: 500 });
// }

  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

   // Retrieve the session with expanded line items and products
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });


    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

 

    // Format the line items
  const items = session.line_items?.data.map(item => {
    const product = item.price?.product as Stripe.Product | undefined;

    return {
      id: product?.metadata?.productId,
      name: product?.name || item.description || '',
      price: (item.price?.unit_amount || 0) / 100,
      quantity: item.quantity || 0,
      image: product?.images?.[0] || null,
    };

  }) || [];



    // Return order details
    return NextResponse.json({
      sessionId: session.id,
      amount: session.amount_total || 0,
      customer: session.customer_details,
      currency: session.currency?.toUpperCase() || 'USD',
      shipping: session.customer_details?.address,
      status: session.payment_status || 'pending',
      items,
      createdAt: new Date(session.created * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error retrieving order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve order details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
