import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

// *************VERIFY WEBHOOK SIGNATURE **********
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_CHECKOUT_SECRET_KEY!
        );
    } catch (err) {
        console.error('Webhook signature verification failed', err);
        return NextResponse.json({ error: 'Webhook Signature Verification Failed' }, { status: 400 });
    }

    //********** */ HANDLE THE CHECKOUT SESSION COMPLETED EVENT *****************
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session

            //******* CHECK IF ORDER ALREADY EXIST *******//
        const existingOrder = await prisma.order.findUnique({
            where: { stripeSessionId: session.id },
        })

    if (existingOrder) {
        console.log("order already exist", existingOrder);
        return NextResponse.json({ message: 'Order already saved' }, { status: 200 });
    }   

//******* Retrieve Complete session with line Items *********/
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product']
    })

      // Get customer and shipping details
      

//******* CUSTOMER INFORMATION ****/
    const customerDetails = session.customer_details;

// Get the userId from metadata
    const userId = session.metadata?.userId; 
       
if (!userId) {
        console.error('No userId found in session metadata');
        return NextResponse.json(
          { error: 'Missing userId in session metadata' },
          { status: 400 }
        );
      }    
       // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        console.error('User not found:', userId);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const total = session.amount_total ? session.amount_total / 100 : null; // Convert from cents to dollars

      if (total === null) {
        console.error('Total amount is null for session:', session.id);
        return NextResponse.json(
          { error: 'Total amount is null' },
          { status: 400 }
        ) 
      }

       // Create order items array from line items
      const orderItems = (expandedSession.line_items?.data || []).map(item => {
        // Get the product ID - could be in metadata or use Stripe product ID
        const stripeProduct = item.price?.product;
        const productId = (stripeProduct && typeof stripeProduct === 'object' && 'metadata' in stripeProduct) 
          ? stripeProduct.metadata?.productId || stripeProduct.id 
          : item.price?.product;
        
        return {
          name: item.description || 'Unknown Product',
          productId: productId || item.id, // Fallback to line item ID
          quantity: item.quantity || 1,
          price: (item.price?.unit_amount || 0) / 100,
        };
      });

 // Create the order using your schema
      const order = await prisma.order.create({
        data: {
          userId: userId,
          total: total.toString(), // Convert to string for Decimal
          stripeSessionId: session.id,
          status: 'PROCESSING',
          
          // Shipping information - extract from the most appropriate source
          shippingName: customerDetails?.name || '',
          shippingEmail: customerDetails?.email || '', // Email usually comes from customer_details
          shippingAddress: customerDetails?.address?.line1 || '',
          shippingCity: customerDetails?.address?.city || '',
          shippingState: customerDetails?.address?.state || '',
          shippingPostalCode: customerDetails?.address?.postal_code || '',
          shippingCountry: customerDetails?.address?.country || '',
          
          // Create order items
          items: {
            create: orderItems.map(item => ({
                name: item.name, 
                product: {
                    connect: {
                        id: item.productId as string,
                    },
                },
              quantity: item.quantity,
              price: item.price.toString(), // Convert to string for Decimal
            })),
          },
        },
        include: {
          items: true,
        },
      });

      console.log('Order created:', order.id);
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

// Disable the body parser so we can access the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};