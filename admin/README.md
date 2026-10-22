# De-Shahzaib business desk

Open `/admin/inventory.html` on Cloudflare Pages. The inventory and private product API require `INVENTORY_DB` and an encrypted `INVENTORY_ADMIN_PASSWORD` of at least 16 characters. Never commit or share this secret. Sessions last 12 hours and use secure HttpOnly cookies. Password changes invalidate sessions.

Apply the numbered SQL migrations in order. Migration 0003 adds only photo storage. Existing prices, stock counts and movement history are preserved.

## Product management

Products & pricing → Add product opens the editor. Enter the name, category, regular price, optional private cost and discount. Choose collar sizes in Attributes & collars and upload photos in Website & media. Save creates the product and its uncounted collar records in one D1 transaction. Retrying an identical creation request does not duplicate it. Record opening stock separately in Collar inventory. Existing products retain their collar history.

The catalogue is database-backed and includes dashboard-created products. The public `/api/storefront` script is loaded from `https://de-shazeb.pages.dev` by all storefront pages, including the existing GitHub-hosted domain. Custom-domain DNS migration is not required for product updates. The legacy `/products.js` function remains available on Cloudflare. `products.js` in the repository is a static fallback/reference and is no longer the storefront data source. `catalog-base.mjs` supplies legacy default metadata only.

Photos can be uploaded from a computer (JPEG/PNG/WebP, up to 15 MB input each). The browser resizes to at most 1600 pixels and compresses to JPEG below 500 KB. The authenticated upload stores the photo in D1; public immutable `/api/media/:hash` URLs work on both hosting origins. Up to 10 photos per product. SVG and executable uploads are rejected. External HTTPS image URLs and existing `assets/` paths also work. Uploaded images are retained if a form is abandoned; no automatic deletion risks removing published photos.

Regular prices use whole PKR. Discounts accept 0–99%, with up to two decimal places. Sale prices round to the nearest rupee, minimum PKR 1. Enter 0% to end a sale. Public costs and internal notes are excluded through an explicit field allow-list. Profit and selling-value estimates use the actual discounted price; shipping, taxes and operating expenses are excluded. Cost is stored in integer paisa, and blank cost remains unknown.

## Inventory

Stock adjustments are immutable movements with optimistic version checks and idempotent request IDs. A correction retains the original history. Product edits never change quantities. Sync imports product metadata and collar sizes without overwriting counts. Exported history is limited to the displayed latest 500 movements. New and uncounted stock is not treated as zero in valuation labels.

WhatsApp requests do not automatically deduct or reserve stock. Record an issue on dispatch. Full purchase orders, invoices, expenses, taxes, payments and automated WhatsApp notifications remain separate integrations.
