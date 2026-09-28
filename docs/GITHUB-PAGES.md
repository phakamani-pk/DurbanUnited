# GitHub Pages frontend deployment

GitHub Pages remains the frontend host. The workflow builds a static Next.js export under the repository base path and publishes `out/`.

The working application uses a separate HTTPS backend. Configure the repository Actions variable or environment value `NEXT_PUBLIC_API_URL` with that API origin before building. GitHub Pages cannot run `server/index.ts`, host PostgreSQL or keep `DATABASE_URL`/`JWT_SECRET` private.

For the API, set `ALLOWED_ORIGINS=https://phakamani-pk.github.io`. Production sessions use a secure cross-site httpOnly cookie so the Pages frontend must call the API with credentials included.

See `docs/DELIVERY-ARCHITECTURE.md` for roles, routing and backend release variables.

The Pages workflow validates `NEXT_PUBLIC_API_URL` before the static build. It must be the API's public HTTPS origin without a trailing slash (for example, `https://api.example.com`); if it is missing or invalid, the workflow stops instead of publishing a frontend whose login cannot reach the backend. Only set it after the API health, database, and CORS checks pass.
