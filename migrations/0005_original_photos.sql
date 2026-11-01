-- Original photo bytes, split below D1 row limits; legacy photo URLs remain valid.
CREATE TABLE IF NOT EXISTS inv_media_originals (
 id TEXT PRIMARY KEY, mime TEXT NOT NULL CHECK(mime IN ('image/jpeg','image/png','image/webp')),
 chunk_count INTEGER NOT NULL CHECK(chunk_count BETWEEN 2 AND 34),
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS inv_media_chunks (
 media_id TEXT NOT NULL, part INTEGER NOT NULL CHECK(part BETWEEN 0 AND 33),
 data_base64 TEXT NOT NULL CHECK(length(data_base64)<=600000),
 PRIMARY KEY(media_id,part)
);
