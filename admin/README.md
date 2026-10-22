# De-Shahzaib inventory

Open `/admin/inventory.html` on Cloudflare Pages (GitHub Pages cannot run the API).

Before first use, set `INVENTORY_ADMIN_PASSWORD` as an encrypted **production** variable in Cloudflare Pages, using a unique password with at least 16 characters. Redeploy. Do not commit it or send it in chat. Password changes invalidate existing sessions. Login sessions last 12 hours. Failed login attempts are limited to 10 per IP per 15-minute interval.

The `INVENTORY_DB` D1 binding must reference the inventory database. Apply `migrations/0001_inventory.sql` once. Sync imports product names and sizes without changing existing quantities. Opening quantities are intentionally unknown until counted. Each size needs an opening count before receipts/issues can be recorded. Stock changes are immutable movements; use a correction with a reason to fix errors. Concurrent edits are rejected instead of silently overwriting stock. CSV exports are snapshots; history exports contain the displayed maximum of 500 movements.

This release manages inventory only. Existing WhatsApp orders do not automatically deduct stock. Record an issue when dispatching. Automatic order reservations, payments and WhatsApp notifications are separate integrations.
