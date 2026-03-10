import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/products(.*)',
  '/about(.*)',
  '/contact(.*)',
  '/api/categories(.*)',
  '/api/products(.*)',
  '/api/webhooks/clerk(.*)',
  '/api/webhooks/stripe(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/admin-categories(.*)',
  '/api/admin(.*)',
  '/admin-dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const debug = process.env.NODE_ENV !== 'production' && process.env.DEBUG_MIDDLEWARE === 'true';

  if (debug) {
    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('Path:', req.nextUrl.pathname);
    console.log('User ID:', userId);
    console.log('=== END DEBUG ===');
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  if (isAdminRoute(req)) {
    if (debug) console.log('Checking admin route access...');
    
    if (!userId) {
      if (debug) console.log('No userId found - redirecting to sign-in');
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // For now, allow all authenticated users to access admin routes
    // The role check will happen in API routes via requireAdmin()
    if (debug) console.log('User authenticated - allowing access to admin route');
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};