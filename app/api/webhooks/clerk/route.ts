import { Webhook } from 'svix';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ClerkEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{
      email_address: string;
    }>;
    first_name?: string;
    last_name?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get the webhook secret from environment
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_DEV;
    
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get signature headers from request
    const signature = request.headers.get('svix-signature');
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');

    if (!signature || !svixId || !svixTimestamp) {
      console.error('Missing webhook headers');
      return NextResponse.json(
        { error: 'Missing webhook headers' },
        { status: 400 }
      );
    }

    // Get the raw body for verification
    const body = await request.text();

    // Verify the webhook signature using Svix
    const wh = new Webhook(webhookSecret);
    const event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': signature,
    }) as ClerkEvent;

    // Handle user.created event
    if (event.type === 'user.created') {
      const { id, email_addresses, first_name } = event.data;

      const userEmail = email_addresses?.[0]?.email_address;
      if (!userEmail) {
        console.error('No email found for user', id);
        return NextResponse.json(
          { error: 'No email provided' },
          { status: 400 }
        );
      }

      // Create user in database
      await prisma.user.create({
        data: {
          id, // Clerk user ID
          email: userEmail,
          name: first_name || null,
        },
      });

      console.log('User created in database:', id);
    }

    // Handle user.updated event
    if (event.type === 'user.updated') {
      const { id, email_addresses, first_name } = event.data;

      const userEmail = email_addresses?.[0]?.email_address;

      // Update user in database
      await prisma.user.update({
        where: { id },
        data: {
          email: userEmail || undefined,
          name: first_name || undefined,
        },
      });

      console.log('User updated in database:', id);
    }

    // Handle user.deleted event
    if (event.type === 'user.deleted') {
      const { id } = event.data;

      // Option 1: Soft delete (mark as inactive)
      // Option 2: Hard delete (remove from database)
      // For now, we'll keep the user but mark deletion
      console.log('User deleted in Clerk:', id);
      // You can implement soft delete here if needed
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}