-- Route orders to the right maker: 'coffee' goes to /barista, 'tea' to /tealady.
ALTER TABLE orders ADD COLUMN category TEXT NOT NULL DEFAULT 'coffee';

CREATE INDEX IF NOT EXISTS idx_orders_category ON orders(category);