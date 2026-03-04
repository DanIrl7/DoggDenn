import { NextRequest } from 'next/server';

/**
 * Determines if the request is from a local/testing environment (ngrok)
 */
export const isLocalEnvironment = (req: NextRequest): boolean => {
  const host = req.headers.get('host') || '';
  
  return host.includes('ngrok') || host.includes('localhost') || host.includes('127.0.0.1');
};

/**
 * Determines if the request is from production environment (Vercel)
 */
export const isProductionEnvironment = (req: NextRequest): boolean => {
  const host = req.headers.get('host') || '';
  
  return host.includes('dogg-denn.vercel.app');
};

/**
 * Get the appropriate Stripe webhook secret based on the request origin
 */
export const getStripeWebhookSecret = (req: NextRequest): string => {
  if (isLocalEnvironment(req)) {
    const secret = process.env.STRIPE_CHECKOUT_SECRET_KEY_DEV;
    if (!secret) throw new Error('Missing STRIPE_CHECKOUT_SECRET_KEY_DEV environment variable');
    return secret;
  }
  
  if (isProductionEnvironment(req)) {
    const secret = process.env.STRIPE_CHECKOUT_SECRET_KEY_PROD;
    if (!secret) throw new Error('Missing STRIPE_CHECKOUT_SECRET_KEY_PROD environment variable');
    return secret;
  }
  
  throw new Error(`Unknown environment: ${req.headers.get('host')}. Cannot determine webhook secret.`);
};

/**
 * Get the appropriate Clerk webhook secret based on the request origin
 */
export const getClerkWebhookSecret = (req: NextRequest): string => {
  if (isLocalEnvironment(req)) {
    const secret = process.env.CLERK_WEBHOOK_SECRET_DEV;
    if (!secret) throw new Error('Missing CLERK_WEBHOOK_SECRET_DEV environment variable');
    return secret;
  }
  
  if (isProductionEnvironment(req)) {
    const secret = process.env.CLERK_WEBHOOK_SECRET_PROD;
    if (!secret) throw new Error('Missing CLERK_WEBHOOK_SECRET_PROD environment variable');
    return secret;
  }
  
  throw new Error(`Unknown environment: ${req.headers.get('host')}. Cannot determine webhook secret.`);
};
