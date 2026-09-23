# Delivery architecture

## Runtime split

Durban United uses a split deployment:

- **GitHub Pages** serves the statically exported Next.js frontend at the repository path.
- **HTTPS API service** runs `server/index.ts` and owns authentication, authorization and all protected writes.
- **PostgreSQL** stores users, roles, content, products, orders, tickets and communications.

GitHub Pages cannot run Express, hide server secrets or connect directly to PostgreSQL. The frontend therefore calls the public API URL configured at build time with `NEXT_PUBLIC_API_URL`. Production must use HTTPS on both sides. `ALLOWED_ORIGINS` must include the exact GitHub Pages origin, and the API session cookie is `httpOnly`, `Secure` and `SameSite=None` for the cross-origin frontend/API split.

## Roles and routing

Public registration always creates a `fan` account. There are two application experiences:

- **User (`fan`)**: browse public content, then use `/profile/` to view private orders and club communications.
- **Admin (`admin`)**: login redirects to `/admin/`, where management APIs provide overview metrics, user visibility, order fulfilment and product stock controls.

The frontend redirects users for convenience, but security is enforced only by the API. Every `/api/v1/admin/*` route authenticates the session and checks `role === 'admin'`; fan accounts receive HTTP 403. Private `/api/v1/me/*` routes return only the authenticated user's records.

## First admin

1. Register the intended account normally so its password is hashed through the standard flow.
2. On a trusted backend environment with `DATABASE_URL` configured, run:

   `npm run admin:promote -- admin@example.com`

Do not add a public “become admin” route and do not store an administrator password in the repository.

## Production variables

Frontend build:

- `NEXT_PUBLIC_API_URL=https://api.example.com`

API runtime:

- `NODE_ENV=production`
- `DATA_MODE=postgres`
- `DATABASE_URL=...`
- `JWT_SECRET=...` (at least 32 random characters)
- `ALLOWED_ORIGINS=https://phakamani-pk.github.io`
- `PORT=4000` (or the platform-provided port)

## Current management coverage

Implemented now:

- Secure role-aware login and server-side authorization.
- Fan order history and communications endpoints/profile.
- Admin overview, users, orders and products endpoints/dashboard.
- Order status and product stock updates.

Next business modules:

- Checkout/order creation and payment provider integration.
- Admin CRUD for fixtures, players, news and media.
- Notification creation and delivery channels.
- Object storage for uploads, audit logs, password reset and email verification.
