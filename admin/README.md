# De-Shahzaib inventory

Open `/admin/inventory.html` on Cloudflare Pages (GitHub Pages cannot run the API).

Before first use, set `INVENTORY_ADMIN_PASSWORD` as an encrypted **production** variable in Cloudflare Pages, using a unique password with at least 16 characters. Redeploy. Do not commit it or send it in chat. Password changes invalidate existing sessions. Login sessions last 12 hours. Failed login attempts are limited to 10 per IP per 15-minute interval.

The `INVENTORY_DB` D1 binding must reference the inventory database. Apply `migrations/0001_inventory.sql` once. Sync imports product names and sizes without changing existing quantities. Opening quantities are intentionally unknown until counted. Each size needs an opening count before receipts/issues can be recorded. Stock changes are immutable movements; use a correction with a reason to fix errors. Concurrent edits are rejected instead of silently overwriting stock. CSV exports are snapshots; history exports contain the displayed maximum of 500 movements.

This release manages inventory and product settings. Apply `migrations/0002_product_settings.sql` before deploying the product editor. The migration is additive and seeds only absent settings. Cost is stored as integer paisa; blank costs remain unknown. Product edits use version checks and retain previous values in a private revision table. Cost and notes are excluded from the public `/products.js` response.

The Cloudflare `/products.js` function merges public settings with `catalog-base.mjs`, the source catalogue snapshot. When adding products through GitHub, update both `products.js` (static fallback) and `catalog-base.mjs` (server base), then sync in the dashboard. Existing collar sizes are retained. Product pricing is per design, shared across collars; valuation covers counted physical stock and is not recognized revenue. Publishing requires the sales and published flags. Image files are uploaded through GitHub; the dashboard accepts asset paths or HTTPS URLs. Website changes apply on Cloudflare hosting; GitHub Pages uses the static catalogue.

This is not a complete accounting ERP: invoices, purchase orders, expenses, tax calculation, reservations, customer accounts and automatic WhatsApp messaging are not implemented. Existing WhatsApp orders do not automatically deduct stock. Record an issue when dispatching. Automatic order reservations, payments and WhatsApp notifications are separate integrations.
