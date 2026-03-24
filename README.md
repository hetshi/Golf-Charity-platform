# Golf Charity Subscription Platform

A modern, production-ready full-stack web application where golfers contribute to charities through monthly prize draws.

## Tech Stack
-   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
-   **Backend**: Supabase (Auth, DB, Storage)
-   **Payments**: Stripe Subscriptions
-   **UI**: custom "Luxury Minimal" components based on Shadcn patterns

## Features
-   **Golf Animation**: High-fidelity hit-to-hole sequence on login.
-   **Score Management**: Standardized Stableford entry with FIFO (last 5 scores) logic.
-   **Charity System**: Directory of vetted partners with configurable contribution percentages.
-   **Monthly Draw Engine**: Algorithmic weighted number generation and prize pool distribution.
-   **Winner Verification**: Tiered flow from match discovery to proof upload and admin approval.

## Environment Variables
See `.env.example` for required keys.

## Deployment Instructions

### Supabase Setup
1. Create a new Supabase project.
2. Run the provided `schema.sql` (found in artifacts) in the SQL Editor.
3. Enable Email Auth.

### Stripe Setup
1. Create two Recurring Products: **Monthly Pro** and **Yearly Legend**.
2. Note the Price IDs and add them to `.env`.
3. Configure a Webhook pointing to `YOUR_URL/api/subscription/webhook` with the `checkout.session.completed` and `customer.subscription.deleted` events.

### Vercel Deployment
1. Import the repository to Vercel.
2. Add all environment variables from `.env.example`.
3. Deploy!

---

## Technical Details
-   **Auth Middleware**: Route protection is handled in `src/middleware.ts` using `@supabase/ssr`.
-   **FIFO Algorithm**: Implementation found in `src/app/api/scores/add/route.ts`.
-   **Draw Engine**: Logic located in `src/app/api/draw/run/route.ts`.
