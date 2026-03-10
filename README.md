# DoggDenn
Vercel Deployment- https://doggdenn.vercel.app/

E-commerce website for dogs built with Next.js (App Router), Clerk auth, Prisma/Postgres, Stripe checkout, and Tailwind.

## Tech Stack

- Next.js 15 (App Router) + React + TypeScript
- Tailwind CSS (theme via CSS variables)
- Clerk authentication
- Prisma + PostgreSQL (`pg` + `@prisma/adapter-pg`)
- Stripe checkout + webhooks
- Cloudinary (image uploads)
- SWR (client-side data fetching) + Zustand (cart state)

## Getting Started

1) Install dependencies

```bash
npm install
```

1) Create a `.env` file in the project root (see required variables below).

1) Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — generate Prisma client and build Next.js
- `npm run start` — start production server
- `npm run lint` — run Next.js lint

Note: Prisma client generation also runs on `postinstall`.

## Environment Variables

These are the variables referenced in the codebase.

### Database

- `DATABASE_URL` — PostgreSQL connection string (required)

### Clerk (Auth)

Clerk also requires its standard Next.js env vars (see Clerk docs), typically:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### Stripe

- `STRIPE_SECRET_KEY` — Stripe secret key (required)
- `STRIPE_CHECKOUT_SECRET_KEY_DEV` — Stripe webhook secret for local/ngrok (required for local webhooks)
- `STRIPE_CHECKOUT_SECRET_KEY_PROD` — Stripe webhook secret for production (required for prod webhooks)

### Clerk Webhooks

- `CLERK_WEBHOOK_SECRET_DEV` — Clerk webhook secret for local/ngrok
- `CLERK_WEBHOOK_SECRET_PROD` — Clerk webhook secret for production


### Cloudinary

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Navigation Loading UI

This project shows a dog-themed loading experience during navigation:

- `app/loading.tsx` — Next.js route-segment fallback while a route is being fetched/streamed.
- `app/components/NavigationLoader.tsx` — click-triggered overlay that starts immediately on internal link clicks and fades/scales out after the route changes.
- `app/components/PageTransition.tsx` — top loading bar wired to the same navigation state.

You can tune the minimum display duration in `app/store/navigationStore.ts` (`minDurationMs`).
