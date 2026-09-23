# API contract

All application routes are prefixed with `/api/v1`. JSON errors use `{ "error": { "code": "...", "message": "..." } }`.

## Implemented backend MVP

| Area | Routes | Auth |
|---|---|---|
| Health | `GET /health` | Public |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Public / session |
| Content | `GET /news` | Public |
| Club | `GET /players`, `GET /fixtures` | Public |
| Store | `GET /products` | Public |
| Contact | `POST /contact/subscriptions` | Public, rate limited |

## Planned phases

| Area | Routes | Auth |
|---|---|---|
| Content | `GET /news/:slug`, `GET /categories`, `GET /gallery`, `GET /sponsors` | Public |
| Club | `GET /teams`, `GET /fixtures/:id`, `GET /table` | Public |
| Fan | `PATCH /me`, `POST /me/avatar`, `GET /me/orders`, `GET /me/tickets`, `POST /me/favorites` | Fan |
| Store | `GET /products/:slug`, `POST /orders`, `GET /me/orders/:id` | Public / Fan |
| Payments | `POST /checkout/session`, `POST /webhooks/stripe`, `POST /webhooks/payfast` | Fan / signed provider |
| Assistant | `POST /assistant/message` | Public, rate limited |
| Admin | CRUD for users, players, news, products, fixtures, orders, gallery, sponsors | Admin/editor |

Future list routes will use `page` and `limit` with a server-enforced maximum of 50. Money and inventory mutations will require idempotency keys. Admin routes require server-side role checks; UI visibility is never authorization.
