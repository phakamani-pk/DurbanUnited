# Testing plan

- **Unit:** pricing totals, fixture status mapping, role policy, schema validators, assistant intent routing.
- **Integration:** registration and refresh cookies, Google callback, product inventory, order/payment transitions, verified Stripe and PayFast webhooks.
- **UI:** Playwright smoke coverage for mobile navigation, fixture browsing, add-to-bag, fan login, and admin denial for non-admin users.
- **Security:** SQL injection payloads against every query boundary, XSS in news fields, CSRF mutation rejection, rate-limit enforcement, authorization bypass attempts, upload MIME/size validation.

CI should run typecheck, lint, unit/integration tests, Playwright smoke tests, and coverage thresholds on every pull request. Production deploys should run migrations and a post-deploy health check.
