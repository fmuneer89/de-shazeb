-- Additive photo storage. Uploads are authenticated, optimized in the browser and capped at 500 KB.
CREATE TABLE IF NOT EXISTS inv_media (
 id TEXT PRIMARY KEY, mime TEXT NOT NULL CHECK(mime IN ('image/jpeg','image/png','image/webp')),
 data_base64 TEXT NOT NULL CHECK(length(data_base64)<=666668),
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
