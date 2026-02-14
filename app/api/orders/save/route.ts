import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

interface SaveOrderRequest {
  sessionId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - user not authenticated' },
        { status: 401 }
      );
    }

    const { sessionId, items, total }: SaveOrderRequest = await request.json();

    // Log the incoming data for debugging
    console.log('DEBUG: /api/orders/save POST request received');
    console.log('DEBUG: sessionId:', sessionId);
    console.log('DEBUG: items:', JSON.stringify(items, null, 2));
    console.log('DEBUG: total:', total);
    console.log('DEBUG: userId:', userId);

    // Validate inputs
    if (!sessionId || !items || items.length === 0 || !total) {
      console.log('DEBUG: Validation failed');
      console.log('  sessionId:', !!sessionId);
      console.log('  items exists:', !!items);
      console.log('  items length:', items?.length);
      console.log('  total:', total);
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, items, total' },
        { status: 400 }
      );
    }

    // Check if order already exists (prevent duplicates)
    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (existingOrder) {
      return NextResponse.json(
        { orderId: existingOrder.id, message: 'Order already saved' },
        { status: 200 }
      );
    }

    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid Stripe session' },
        { status: 400 }
      );
    }

  const customerDetails = session.customer_details;

    // Ensure user exists in database (sync from Clerk)
    // Fetch user from Clerk to get their email
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.local`;
    const userName = clerkUser.firstName || null;

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: userEmail,
        name: userName,
      },
    });



    // Create order in database with transaction
    const order = await prisma.order.create({
      data: {
        userId,
        stripeSessionId: sessionId,
        total: total.toString(),
          shippingName: customerDetails?.name || '',
          shippingEmail: customerDetails?.email || '',
          shippingAddress: customerDetails?.address?.line1 || '',
          shippingCity: customerDetails?.address?.city || '',
          shippingState: customerDetails?.address?.state || '',
          shippingPostalCode: customerDetails?.address?.postal_code || '',
          shippingCountry: customerDetails?.address?.country || '',
        items: {
          create: items.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(
      { 
        orderId: order.id,
        message: 'Order saved successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json(
      {
        error: 'Failed to save order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
