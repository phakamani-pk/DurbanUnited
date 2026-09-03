# API contract

All routes are prefixed with `/api/v1`. JSON errors use `{ "error": { "code": "...", "message": "..." } }`.

| Area | Routes | Auth |
|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `POST /auth/logout`, `GET /auth/me` | Public / session |
| Content | `GET /news`, `GET /news/:slug`, `GET /categories`, `GET /gallery`, `GET /sponsors` | Public |
| Club | `GET /teams`, `GET /players`, `GET /fixtures`, `GET /fixtures/:id`, `GET /table` | Public |
| Fan | `PATCH /me`, `POST /me/avatar`, `GET /me/orders`, `GET /me/tickets`, `POST /me/favorites` | Fan |
| Store | `GET /products`, `GET /products/:slug`, `POST /orders`, `GET /me/orders/:id` | Public / Fan |
| Payments | `POST /checkout/session`, `POST /webhooks/stripe`, `POST /webhooks/payfast` | Fan / signed provider |
| Assistant | `POST /assistant/message` | Public, rate limited |
| Admin | CRUD for `/admin/users`, `/admin/players`, `/admin/news`, `/admin/products`, `/admin/fixtures`, `/admin/orders`, `/admin/gallery`, `/admin/sponsors` | Admin/editor |

Pagination uses `page` and `limit` with a server-enforced maximum of 50. Mutating requests require a CSRF token and an idempotency key where money or inventory is involved.
