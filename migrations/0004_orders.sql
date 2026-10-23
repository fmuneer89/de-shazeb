-- Additive order ledger. Physical stock stays in inv_variants; reservations are separate.
CREATE TABLE IF NOT EXISTS erp_orders (
 id TEXT PRIMARY KEY, number TEXT NOT NULL UNIQUE, fingerprint TEXT NOT NULL,
 customer_json TEXT NOT NULL CHECK(json_valid(customer_json)), source TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','paid','shipped','cancelled','expired')),
 subtotal_paisa INTEGER NOT NULL CHECK(subtotal_paisa>0), shipping_paisa INTEGER CHECK(shipping_paisa>=0),
 payment_reference TEXT NOT NULL DEFAULT '', tracking TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
 version INTEGER NOT NULL DEFAULT 0, expires_at INTEGER, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS erp_orders_created ON erp_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS erp_orders_status ON erp_orders(status,expires_at);
CREATE TABLE IF NOT EXISTS erp_lines (
 order_id TEXT NOT NULL REFERENCES erp_orders(id), variant_id TEXT NOT NULL REFERENCES inv_variants(id),
 name TEXT NOT NULL, sku TEXT NOT NULL DEFAULT '', collar TEXT NOT NULL, quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 10000),
 unit_paisa INTEGER NOT NULL CHECK(unit_paisa>0), regular_paisa INTEGER NOT NULL, cost_paisa INTEGER,
 PRIMARY KEY(order_id,variant_id)
);
CREATE INDEX IF NOT EXISTS erp_lines_variant ON erp_lines(variant_id,order_id);
CREATE TABLE IF NOT EXISTS erp_events (id INTEGER PRIMARY KEY, order_id TEXT NOT NULL REFERENCES erp_orders(id), action TEXT NOT NULL, detail TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));
CREATE INDEX IF NOT EXISTS erp_events_order ON erp_events(order_id,id);
CREATE TABLE IF NOT EXISTS erp_request_limits (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS erp_sandbox_payments (tracker TEXT PRIMARY KEY, order_id TEXT REFERENCES erp_orders(id), amount_paisa INTEGER NOT NULL, state TEXT NOT NULL DEFAULT 'created', created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));
CREATE TABLE IF NOT EXISTS erp_sandbox_events (id TEXT PRIMARY KEY, tracker TEXT NOT NULL, type TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));
CREATE VIEW IF NOT EXISTS erp_reserved AS SELECT l.variant_id,SUM(l.quantity) AS quantity FROM erp_lines l JOIN erp_orders o ON o.id=l.order_id WHERE o.status IN ('pending','confirmed','paid') AND (o.expires_at IS NULL OR o.expires_at>unixepoch()) GROUP BY l.variant_id;
CREATE TRIGGER IF NOT EXISTS erp_reserve_guard BEFORE INSERT ON erp_lines BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM inv_variants v WHERE v.id=NEW.variant_id AND v.quantity IS NOT NULL AND v.quantity-COALESCE((SELECT quantity FROM erp_reserved WHERE variant_id=v.id),0)>=NEW.quantity) THEN RAISE(ABORT,'ERP_INSUFFICIENT_STOCK') END;
END;
CREATE TRIGGER IF NOT EXISTS erp_stock_guard BEFORE UPDATE OF quantity ON inv_variants BEGIN
 SELECT CASE WHEN COALESCE(NEW.quantity,-1)<COALESCE((SELECT quantity FROM erp_reserved WHERE variant_id=NEW.id),0) AND COALESCE((SELECT quantity FROM erp_reserved WHERE variant_id=NEW.id),0)>0 THEN RAISE(ABORT,'ERP_RESERVED_STOCK') END;
END;
CREATE TRIGGER IF NOT EXISTS erp_status_audit AFTER UPDATE OF status ON erp_orders WHEN NEW.status<>OLD.status BEGIN
 INSERT INTO erp_events(order_id,action,detail) VALUES(NEW.id,NEW.status,CASE WHEN NEW.status='paid' THEN NEW.payment_reference WHEN NEW.status='shipped' THEN NEW.tracking ELSE '' END);
END;
CREATE TRIGGER IF NOT EXISTS erp_ship_stock AFTER UPDATE OF status ON erp_orders WHEN NEW.status='shipped' AND OLD.status='paid' BEGIN
 INSERT INTO inv_movements(id,variant_id,kind,amount,before_qty,after_qty,note)
 SELECT 'order:'||NEW.id||':'||l.variant_id,l.variant_id,'issue',l.quantity,v.quantity,v.quantity-l.quantity,'Dispatch '||NEW.number FROM erp_lines l JOIN inv_variants v ON v.id=l.variant_id WHERE l.order_id=NEW.id;
END;
