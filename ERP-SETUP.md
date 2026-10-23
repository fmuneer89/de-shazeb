# Orders, stock reservations and invoices

Open `/admin/orders.html` on the Cloudflare-hosted site and use the existing inventory admin login. The inventory dashboard links to Orders & invoices.

## Operations

- Website bags transfer product IDs, collars and quantities to the Cloudflare checkout through the URL fragment; personal delivery details are entered only in the order form.
- The server calculates current product prices and discounts. Client-supplied prices are ignored.
- A website request reserves stock for 1 hour. Dashboard-created pending orders reserve it for 24 hours. Pending expiry automatically releases availability through the reservation view. “Close expired reservations” records their expired status.
- Confirm the order and agreed delivery charge before requesting payment. Pakistan orders strictly over PKR 4,000 receive free delivery.
- Record a full payment only after independently checking your bank/wallet receipt. This is bookkeeping, not a customer charge.
- Dispatch requires a paid order and courier reference. A database trigger issues the stock exactly once, in the same transaction as the status change.
- Cancel an unpaid order to release its reservation. Paid or dispatched orders cannot be cancelled through this first release; refunds/returns require a later controlled workflow. Do not manually issue the same order again in Inventory.
- Physical stock cannot be adjusted below active reservations. “Reserved stock” shows physical, reserved and available quantities.
- Prices, discounts, names, SKUs and product costs are snapshotted at order creation. Changes to the catalogue do not rewrite existing invoices.
- Print / save invoice PDF opens an authenticated invoice. Pending orders produce a pro forma; paid orders show payment received. Invoices never expose internal product costs. A visibly labelled sample is available at `/admin/invoice-preview.html`.
- Product margin excludes courier costs, payment fees and overheads. This is a sales/stock desk, not a statutory accounting or tax filing system.
- No automatic email or WhatsApp messages are sent. The customer may choose to send the saved order reference on WhatsApp.

## SafePay sandbox

Sandbox testing is admin-only and always uses PKR 100; it cannot credit a customer order or alter stock. There is no production payment endpoint in this release.

Add these **encrypted secrets** to the production deployment of the `de-shazeb` Cloudflare Pages project, then redeploy:

- `SAFEPAY_SANDBOX_SECRET_KEY`: sandbox merchant secret used by the v3 API (not a login password or public identifier).
- `SAFEPAY_SANDBOX_WEBHOOK_SECRET`: the sandbox endpoint's shared HMAC secret.

Never commit secret values, paste them into chat, put them in public JavaScript or send them in URLs.

In the sandbox SafePay dashboard register:
`https://de-shazeb.pages.dev/api/payments/safepay-sandbox`

Subscribe to `payment.succeeded`, version `2.0.0`. The HMAC verifier follows the official `@sfpy/node-sdk` SHA-512 signature over `JSON.stringify(event.data)`; mismatched signatures, trackers, amounts or currency are rejected. Unsupported webhook versions are rejected. Duplicate successful events are idempotent. Redirects do not prove payment.

Use Orders → SafePay sandbox → Create sandbox test link. Only use SafePay test cards. Confirm that a success appears as `sandbox_succeeded` in the dashboard. Actual provider testing remains required after secrets and webhook registration; mocked tests do not prove account configuration. Production payments require a separate explicit implementation and live onboarding.

Primary references:
- https://safepay.helpscoutdocs.com/article/173-asp-net-integration-guide
- https://github.com/getsafepay/node-core/blob/main/src/resources/Payments/Session.ts
- https://github.com/getsafepay/safepay-node/blob/main/src/resources/verify.ts
- https://safepay-docs.netlify.app/developers/webhooks/webhook-types/

## Deployment and validation

Apply additive migration `migrations/0004_orders.sql` to the bound inventory D1 database **before** deploying the catalogue query. It does not change existing stock or credentials. Do not seed production with test orders.

Run `node tests/orders.test.mjs`, `node tests/inventory.test.mjs`, `node tests/discount.test.mjs`, `node tests/stock.test.mjs`, and `node tests/merchandising.test.mjs`.

Tests use an in-memory SQLite database and runtime-generated credentials. Reservation, fulfillment and payment tests do not touch live stock or provider accounts.
