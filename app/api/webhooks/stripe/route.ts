import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    const body = await request.text();

    if (!webhookSecret || !signature) {
      console.error('Missing webhook secret or signature');
      return NextResponse.json(
        { error: 'Missing webhook configuration' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // TODO: Save order to database
        // Example: await saveOrder({
        //   paymentIntentId: paymentIntent.id,
        //   amount: paymentIntent.amount,
        //   status: 'paid',
        //   metadata: paymentIntent.metadata,
        // });
        
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        
        // TODO: Handle failed payment
        // Example: await updateOrder({
        //   paymentIntentId: paymentIntent.id,
        //   status: 'failed',
        // });
        
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge refunded:', charge.id);
        
        // TODO: Handle refund
        // Example: await updateOrder({
        //   chargeId: charge.id,
        //   status: 'refunded',
        // });
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
