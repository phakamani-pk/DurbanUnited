# Backend MVP

The backend is an Express 5 TypeScript service under `server/`. It serves versioned JSON routes, PostgreSQL persistence, session authentication, and supporter email subscriptions.

## Local development

1. Copy `.env.example` to `.env.local` and set a PostgreSQL `DATABASE_URL` plus a random `JWT_SECRET` of at least 32 characters.
2. Run `psql "$DATABASE_URL" -f db/schema.sql` and then `psql "$DATABASE_URL" -f db/seed.sql`.
3. Run `npm run dev:api` for the API on port 4000.
4. In another terminal run `npm run dev` for the site on port 3000.

For API-only work without PostgreSQL, set `DATA_MODE=memory`. This uses ephemeral sample content and accounts; nothing survives a restart.

## Implemented routes

- `GET /health`
- `GET /api/v1/fixtures`
- `GET /api/v1/products`
- `GET /api/v1/players`
- `GET /api/v1/news`
- `POST /api/v1/contact/subscriptions`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Authentication uses a signed JWT in an httpOnly cookie. Production cookies are secure and cross-site ready. Login and subscription endpoints are rate limited; payloads are size-limited and validated; SQL uses parameters.

## Production configuration

Set `NODE_ENV=production`, `DATA_MODE=postgres`, `DATABASE_URL`, `JWT_SECRET`, and `ALLOWED_ORIGINS` to the exact web origins. Run schema and seed SQL once as the release migration. Never commit environment files or secrets.
