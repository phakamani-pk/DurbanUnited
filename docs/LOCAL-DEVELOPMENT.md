# Local preview and test guide

This preview is only available **on the computer running it**. It is not a public URL and does not touch the hosted database. Use Node.js 20+ and the repository's latest preview branch. From the repository directory:

```sh
npm ci
npm run dev:local
```

Open **http://127.0.0.1:3000** on that same computer. The terminal prints a newly generated temporary demo-admin email and password; keep them private and use them only on this local preview. The API runs at **http://127.0.0.1:4000**. If those ports are occupied, set different `LOCAL_WEB_PORT` and `LOCAL_API_PORT` values before running the command. Stop with Ctrl+C. These loopback-only servers cannot be opened from another device or a hosted Kylon session.

## What to test

1. Browse the homepage, mobile menu, match centre, squad, and shop. Static page copy and some fixtures/players/products are illustrative sample content, not verified club data.
2. Visit `/login/`, select **Create an account**, register with a test email and an 8+ character test password, then check `/profile/`. Test accounts are local to this run. Do not reuse an important password.
3. Sign out, then use the temporary demo-admin credentials printed in your terminal at `/login/` to open `/admin/`. Try updating a product's stock or adding a test sponsor; revisit that management section to see the change. Admin edits stay in memory for this run only. Shop checkout and real payments are not available.
4. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` as separate checks. `npm run build:pages` is for the hosted static frontend and requires separate API configuration.

Sample accounts, subscriptions, and edits disappear when the API restarts. Do not enter real customer data. No permanent administrator account is created, and no deployment is performed. The existing Pages deployment guard remains intact; pushing or merging to `main` is a separate release decision.

## Optional existing PostgreSQL database

A hosted database is a separate, explicit choice: local preview works without it. A database already existing on Render does **not** establish that the application's schema and seed data were applied. Do not apply `db/schema.sql` or `db/seed.sql` to an existing database without inspecting tables and backing up data; `db/schema.sql` contains non-repeatable `CREATE TABLE` statements. Never share, commit, or paste a connection URL or password into chat. A previously exposed password must be rotated before reuse.

For an authorized private connection, set `DATABASE_URL` and `JWT_SECRET` (at least 32 random characters) in an ignored local `.env` file, set `DATA_MODE=postgres`, and run `npm run dev:api` and `npm run dev` separately. Set `NEXT_PUBLIC_API_URL=http://localhost:4000` and `ALLOWED_ORIGINS=http://localhost:3000`. Check schema compatibility before writes. This is not a production deployment.
