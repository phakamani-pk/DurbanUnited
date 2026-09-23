# Durban United Football Club

A production-shaped Next.js foundation for the Durban United public site, fan portal, store, content operations, and analytics surfaces.

## Run locally

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and provide secrets.
4. Create a PostgreSQL database and run `psql "$env:DATABASE_URL" -f db/schema.sql`.
5. Run `npm run dev` and open `http://localhost:3000`.

The current slice includes the responsive public home experience, live nav state, matchday fixture cards, news, squad, store add-to-bag flow, fan hub entry, and floating fan assistant. The data and commerce boundaries are ready to be connected to Express route handlers and the schema in `db/schema.sql`.

## Delivery architecture

- **Web:** Next.js App Router, React, TypeScript, Tailwind-ready CSS surface, optimized route metadata.
- **API:** Express service recommended under `server/`, with `helmet`, strict CORS allow-list, `express-rate-limit`, `zod` validation, parameterized `pg` queries, JWT in httpOnly secure cookies, and CSRF tokens for mutations.
- **Media:** Cloudinary signed uploads; never expose the API secret to the browser.
- **Payments:** Stripe Checkout and PayFast ITN webhooks. Verify signatures, make webhook handlers idempotent, and persist payment state before fulfillment.
- **Deployment:** Vercel for the Next app, Railway for Express and PostgreSQL. Keep secrets in platform secret stores and run migrations as a release step.

## API surface

Recommended versioned endpoints are documented in `docs/API.md`: auth, club content, fixtures, squad, store, checkout, fan profile, tickets, and admin CRUD. Admin routes require a role claim and server-side authorization checks; UI visibility is never treated as authorization.

## Quality and security gates

Run typecheck and production build in CI. Add Vitest unit tests, Supertest API integration tests, and Playwright smoke tests for auth, checkout, responsive nav, and admin authorization. Target 80%+ coverage. The API should reject unknown input, cap pagination, rate-limit auth and chat endpoints, sanitize rich text at render time, and log security events without secrets or payment data.

## Client preview status — 23 September 2026

The static preview now includes responsive desktop/mobile navigation, current fixture presentation, squad profiles, store browsing, honest non-persistent auth/contact states, and explicit sample-data labelling for the admin UI. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build:pages` before review.

The live API, authentication, payments, CMS persistence, uploads, and verified club contact/content data remain production dependencies and are intentionally not simulated in the preview.
