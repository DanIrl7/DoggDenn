import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeWebhookSecret } from '@/lib/webhookSecrets';
import { createOrderFromStripeSession, sendOrderConfirmationEmail } from '@/lib/orders';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
};

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  const webhookSecret = getStripeWebhookSecret(req);

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return NextResponse.json(
      { error: 'Webhook Signature Verification Failed' },
      { status: 400 }
    );
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const { order, created } = await createOrderFromStripeSession(stripe, session.id);

      if (created) {
        console.log('Order created:', order.id);
        await sendOrderConfirmationEmail(order);
      } else {
        console.log('Order already exists:', order.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Disable body parser to access raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
