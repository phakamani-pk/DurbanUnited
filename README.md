# Durban United Football Club

A production-shaped Next.js foundation for the Durban United public site, fan portal, store, content operations, and analytics surfaces.

## Preview and test locally

With Node.js 20+ installed, run `npm ci` and then `npm run dev:local`. Open `http://127.0.0.1:3000` on the **same computer**. The command starts the frontend and API on loopback only, prints fresh temporary demo-admin credentials in your terminal, and uses sample data held in memory. It does not connect to the existing hosted database or publish a live preview. You can register a fan account, test the profile, and sign in with the generated demo-admin credentials to test management. See [local testing](docs/LOCAL-DEVELOPMENT.md) for the walkthrough and limitations.

## Delivery architecture

- **Web:** Next.js App Router, React, TypeScript, Tailwind-ready CSS surface, optimized route metadata.
- **API:** Express service under `server/`, with `helmet`, strict CORS allow-list, `express-rate-limit`, `zod` validation, parameterized `pg` queries, JWT in httpOnly secure cookies, and CSRF tokens for mutations.
- **Media:** Cloudinary signed uploads; never expose the API secret to the browser.
- **Payments:** Stripe Checkout and PayFast ITN webhooks. Verify signatures, make webhook handlers idempotent, and persist payment state before fulfillment.
- **Deployment:** Vercel for the Next app, Railway for Express and PostgreSQL. Keep secrets in platform secret stores and run migrations as a release step.

## API surface

Recommended versioned endpoints are documented in `docs/API.md`: auth, club content, fixtures, squad, store, checkout, fan profile, tickets, and admin CRUD. Admin routes require a role claim and server-side authorization checks; UI visibility is never treated as authorization.

## Quality and security gates

Run typecheck and production build in CI. Add Vitest unit tests, Supertest API integration tests, and Playwright smoke tests for auth, checkout, responsive nav, and admin authorization. Target 80%+ coverage. The API should reject unknown input, cap pagination, rate-limit auth and chat endpoints, sanitize rich text at render time, and log security events without secrets or payment data.

## Client preview status — 23 September 2026

The static preview now includes responsive desktop/mobile navigation, current fixture presentation, squad profiles, store browsing, honest non-persistent auth/contact states, and explicit sample-data labelling for the admin UI. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build:pages` before review.

The first live API slice now implements authentication, public content feeds, and contact subscriptions. Payments, admin CMS mutations, uploads, verified club data, and production hosting remain the next delivery phases.
