import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';
import { getStripeWebhookSecret } from '@/lib/webhookSecrets';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
};

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined');
  }
  return new Resend(process.env.RESEND_API_KEY);
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

  // Handle checkout.session.completed event
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Check if order already exists
      const existingOrder = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (existingOrder) {
        console.log('Order already exists:', existingOrder.id);
        return NextResponse.json(
          { message: 'Order already saved' },
          { status: 200 }
        );
      }

      // Retrieve full session with line items and product data
      const expandedSession = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ['line_items', 'line_items.data.price.product'],
        }
      );

      const customerDetails = session.customer_details;
      const userId = session.metadata?.userId;

      // Validate userId
      if (!userId) {
        console.error('No userId found in session metadata');
        return NextResponse.json(
          { error: 'Missing userId in session metadata' },
          { status: 400 }
        );
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.error('User not found:', userId);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Validate total amount
      const total =
        session.amount_total && session.amount_total > 0
          ? session.amount_total / 100
          : null;

      if (total === null) {
        console.error('Total amount is null for session:', session.id);
        return NextResponse.json(
          { error: 'Total amount is null' },
          { status: 400 }
        );
      }

      // Build order items from line items
      const orderItems = (expandedSession.line_items?.data || []).map(
        (item) => {
          const stripeProduct = item.price?.product;
          const productId =
            stripeProduct &&
            typeof stripeProduct === 'object' &&
            'metadata' in stripeProduct
              ? stripeProduct.metadata?.productId || stripeProduct.id
              : item.price?.product;

          return {
            name: item.description || 'Unknown Product',
            productId: productId || item.id,
            quantity: item.quantity || 1,
            price: (item.price?.unit_amount || 0) / 100,
          };
        }
      );

      // Create order in database
      const order = await prisma.order.create({
        data: {
          userId,
          total: total.toString(),
          stripeSessionId: session.id,
          status: 'PROCESSING',
          shippingName: customerDetails?.name || '',
          shippingEmail: customerDetails?.email || '',
          shippingAddress: customerDetails?.address?.line1 || '',
          shippingCity: customerDetails?.address?.city || '',
          shippingState: customerDetails?.address?.state || '',
          shippingPostalCode: customerDetails?.address?.postal_code || '',
          shippingCountry: customerDetails?.address?.country || '',
          items: {
            create: orderItems.map((item) => ({
              name: item.name,
              product: {
                connect: {
                  id: item.productId as string,
                },
              },
              quantity: item.quantity,
              price: item.price.toString(),
            })),
          },
        },
        include: {
          items: true,
        },
      });

      console.log('Order created:', order.id);

      // Send confirmation email
      const customerEmail = customerDetails?.email;
      const customerName = customerDetails?.name || 'Valued Customer';

      if (customerEmail) {
        try {
          const itemsList = order.items
            .map(
              (item) =>
                `${item.quantity}x ${item.name} - $${parseFloat(
                  item.price.toString()
                ).toFixed(2)}`
            )
            .join('\n');

          const emailContent = `Hello ${customerName},

Thank you for your order! Here are your order details:

Order #${order.id.slice(-6)}
Date: ${new Date().toLocaleDateString()}

Items:
${itemsList}

Total: $${parseFloat(order.total.toString()).toFixed(2)}

Shipping Address:
${order.shippingName}
${order.shippingAddress}
${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}
${order.shippingCountry}

We'll notify you when your items have shipped.

Thank you for your business!`;

          await getResend().emails.send({
            from: process.env.EMAIL_FROM || 'orders@yourdomain.com',
            to: customerEmail,
            subject: `Order Confirmation #${order.id.slice(-6)}`,
            text: emailContent,
          });

          console.log('Confirmation email sent to', customerEmail);
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Continue - don't fail webhook if email fails
        }
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