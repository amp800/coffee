-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  coffee_type TEXT NOT NULL,
  milk_type TEXT,
  sugars INTEGER DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
