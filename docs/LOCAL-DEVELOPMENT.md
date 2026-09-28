# Local development

Run `npm ci` once, then `npm run dev:local`. The site is at `http://localhost:3000` and its API is at `http://localhost:4000`. This command generates a temporary session signing key, starts both services, and uses sample data held only in memory. Accounts and admin edits disappear when the API restarts. It never connects to the existing hosted database and does not create a permanent admin account.

To change ports, set `LOCAL_WEB_PORT` and `LOCAL_API_PORT` to distinct free ports. Stop the command with Ctrl+C. Keep `NODE_ENV=development` locally.

## Optional existing PostgreSQL database

Using a hosted database is a separate, explicit choice: local development works without it. A database already existing on Render does **not** establish that the application's schema and seed data were applied. Do not apply `db/schema.sql` or `db/seed.sql` to an existing database without checking its tables and backing up data; `db/schema.sql` includes non-repeatable `CREATE TABLE` statements. Never share, commit, or paste a connection URL or password into chat. The database password previously exposed outside the provider must be rotated before anyone reuses that database connection.

For an authorized private connection, set `DATABASE_URL` and `JWT_SECRET` (at least 32 random characters) in an ignored local `.env` file, set `DATA_MODE=postgres`, and run `npm run dev:api` and `npm run dev` separately. Set `NEXT_PUBLIC_API_URL=http://localhost:4000` and `ALLOWED_ORIGINS=http://localhost:3000`. Check schema compatibility before attempting any writes. This is not a production deployment.
