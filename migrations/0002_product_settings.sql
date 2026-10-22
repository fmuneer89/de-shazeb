-- Additive: does not change stock quantities, movements or credentials.
CREATE TABLE IF NOT EXISTS inv_product_settings (
 product_id TEXT PRIMARY KEY REFERENCES inv_products(id),
 version INTEGER NOT NULL DEFAULT 0,
 cost_paisa INTEGER CHECK(cost_paisa IS NULL OR (cost_paisa>=0 AND cost_paisa<=1000000000)),
 price_rupees INTEGER NOT NULL CHECK(price_rupees BETWEEN 1 AND 10000000),
 settings_json TEXT NOT NULL CHECK(json_valid(settings_json)),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS inv_product_revisions (
 id INTEGER PRIMARY KEY, product_id TEXT NOT NULL, version INTEGER NOT NULL,
 cost_paisa INTEGER, price_rupees INTEGER NOT NULL, settings_json TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TRIGGER IF NOT EXISTS inv_product_revision AFTER UPDATE ON inv_product_settings
BEGIN
 INSERT INTO inv_product_revisions(product_id,version,cost_paisa,price_rupees,settings_json)
 VALUES (OLD.product_id,OLD.version,OLD.cost_paisa,OLD.price_rupees,OLD.settings_json);
END;
INSERT OR IGNORE INTO inv_product_settings(product_id,price_rupees,settings_json) SELECT '20','1999','{"name":"Blue & White Striped Shirt","colour":"Blue & white","category":"Stripes","description":"A clear blue-and-white stripe for a considered everyday wardrobe. Pair with charcoal trousers or dark denim.","image":"assets/blue-white-striped-shirt.webp","images":["assets/blue-white-striped-shirt.webp"],"published":true,"sales_enabled":true,"purchase_enabled":true}' WHERE EXISTS (SELECT 1 FROM inv_products WHERE id='20');
INSERT OR IGNORE INTO inv_product_settings(product_id,price_rupees,settings_json) SELECT '19','1999','{"name":"Pink Classic Formal Cotton Shirt","colour":"Pink","category":"Plain","description":"A softer expression of formal dressing. Subtle pink brings a little colour to an otherwise neutral look.","image":"assets/pink-classic-formal-cotton-shirt.webp","images":["assets/pink-classic-formal-cotton-shirt.webp"],"published":true,"sales_enabled":true,"purchase_enabled":true}' WHERE EXISTS (SELECT 1 FROM inv_products WHERE id='19');
INSERT OR IGNORE INTO inv_product_settings(product_id,price_rupees,settings_json) SELECT '17','1999','{"name":"Blue Micro-Dobby Cotton Shirt","colour":"Blue","category":"Dobby","description":"Familiar blue, with a closer look at texture. An understated choice for workdays and evenings alike.","image":"assets/blue-micro-dobby-cotton-shirt.webp","images":["assets/blue-micro-dobby-cotton-shirt.webp"],"published":true,"sales_enabled":true,"purchase_enabled":true}' WHERE EXISTS (SELECT 1 FROM inv_products WHERE id='17');
INSERT OR IGNORE INTO inv_product_settings(product_id,price_rupees,settings_json) SELECT '18','1998','{"name":"Micro-Dot Dobby Shirt","colour":"Blue","category":"Dobby","description":"Fine dotted detail adds quiet character. Let the texture do the talking with a simple trouser pairing.","image":"assets/micro-dot-dobby-shirt.webp","images":["assets/micro-dot-dobby-shirt.webp"],"published":true,"sales_enabled":true,"purchase_enabled":true}' WHERE EXISTS (SELECT 1 FROM inv_products WHERE id='18');
INSERT OR IGNORE INTO inv_product_settings(product_id,price_rupees,settings_json) SELECT '16','1999','{"name":"Light Blue Dobby Shirt","colour":"Light blue","category":"Dobby","description":"An easy light-blue palette with subtle surface detail. A fresh starting point for everyday dressing.","image":"assets/light-blue-dobby-shirt.webp","images":["assets/light-blue-dobby-shirt.webp"],"published":true,"sales_enabled":true,"purchase_enabled":true}' WHERE EXISTS (SELECT 1 FROM inv_products WHERE id='16');
INSERT OR IGNORE INTO inv_product_settings(product_id,price_rupees,settings_json) SELECT '7','1999','{"name":"Light Blue Textured Shirt","colour":"Light blue","category":"Dobby","description":"A wardrobe staple with an extra layer of texture. Keep the rest of the look clean and simple.","image":"assets/light-blue-textured-shirt.webp","images":["assets/light-blue-textured-shirt.webp"],"published":true,"sales_enabled":true,"purchase_enabled":true}' WHERE EXISTS (SELECT 1 FROM inv_products WHERE id='7');
