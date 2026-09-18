import Stripe from 'stripe';
import { Resend } from 'resend';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

export interface StripeOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

/**
 * Builds order line items from a Stripe Checkout Session's line_items.
 * The session must have been retrieved with
 * `expand: ['line_items', 'line_items.data.price.product']`.
 */
export function extractOrderItemsFromSession(
  session: Stripe.Checkout.Session
): StripeOrderItem[] {
  return (session.line_items?.data || []).map((item) => {
    const stripeProduct = item.price?.product;
    const product =
      stripeProduct && typeof stripeProduct === 'object'
        ? (stripeProduct as Stripe.Product)
        : undefined;
    const productId = product?.metadata?.productId || product?.id || item.id;

    return {
      productId,
      name: product?.name || item.description || 'Unknown Product',
      quantity: item.quantity || 1,
      price: (item.price?.unit_amount || 0) / 100,
    };
  });
}

/**
 * Creates the Order/OrderItem rows for a completed Stripe Checkout Session,
 * deriving everything (price, quantity, product identity, total) from
 * Stripe's own session data — never from client-supplied values, since
 * those can be tampered with between the browser and the server.
 *
 * Safe to call more than once for the same session (from both the webhook
 * and the success-page fallback): it no-ops if the order already exists.
 */
export async function createOrderFromStripeSession(
  stripe: Stripe,
  sessionId: string
): Promise<{ order: OrderWithItems; created: boolean }> {
  const existingOrder = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: { items: true },
  });
  if (existingOrder) {
    return { order: existingOrder, created: false };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

  if (session.payment_status !== 'paid') {
    throw new Error(
      `Refusing to create order for session ${sessionId}: payment_status is "${session.payment_status}", not "paid"`
    );
  }

  const userId = session.metadata?.userId;
  if (!userId) {
    throw new Error(`Missing userId in metadata for session ${sessionId}`);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  const total =
    session.amount_total && session.amount_total > 0
      ? session.amount_total / 100
      : null;
  if (total === null) {
    throw new Error(`Total amount is null for session ${sessionId}`);
  }

  const orderItems = extractOrderItemsFromSession(session);
  const customerDetails = session.customer_details;

  const order = await prisma.order.create({
    data: {
      userId,
      total: total.toString(),
      stripeSessionId: sessionId,
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
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          price: item.price.toString(),
        })),
      },
    },
    include: { items: true },
  });

  return { order, created: true };
}

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

/**
 * Sends the order confirmation email. Failures are logged, not thrown —
 * a flaky email provider shouldn't undo an order that's already paid for.
 */
export async function sendOrderConfirmationEmail(order: OrderWithItems) {
  if (!order.shippingEmail) return;

  try {
    const itemsList = order.items
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - $${parseFloat(item.price.toString()).toFixed(2)}`
      )
      .join('\n');

    const emailContent = `Hello ${order.shippingName || 'Valued Customer'},

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
      to: order.shippingEmail,
      subject: `Order Confirmation #${order.id.slice(-6)}`,
      text: emailContent,
    });

    console.log('Confirmation email sent to', order.shippingEmail);
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }
}
