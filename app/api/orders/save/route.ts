import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { createOrderFromStripeSession, sendOrderConfirmationEmail } from '@/lib/orders';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
};

interface SaveOrderRequest {
  sessionId: string;
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - user not authenticated' },
        { status: 401 }
      );
    }

    // Only the session ID is trusted from the client — everything else
    // (items, prices, total) is re-derived from Stripe's own session data
    // below, since a client-supplied price/total can be tampered with.
    const { sessionId }: SaveOrderRequest = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing required field: sessionId' },
        { status: 400 }
      );
    }

    // Ensure user exists in database (sync from Clerk) before creating the
    // order, since createOrderFromStripeSession requires it to already exist.
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

    const { order, created } = await createOrderFromStripeSession(stripe, sessionId);

    if (created) {
      await sendOrderConfirmationEmail(order);
    }

    return NextResponse.json(
      {
        orderId: order.id,
        message: created ? 'Order saved successfully' : 'Order already saved',
      },
      { status: created ? 201 : 200 }
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
