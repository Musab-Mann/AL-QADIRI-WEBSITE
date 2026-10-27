// Server-only persistence layer. Uses Node's built-in SQLite (node:sqlite), so orders and
// admin-managed menu changes survive restarts without adding a new dependency to the project
// (this container has no network access to install one). It is a real relational database with
// foreign keys and indexes, not a JSON blob. Swap this file for `better-sqlite3` or a hosted
// Postgres client later without changing any of the calling code in src/server/*.ts.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { categories as baseCategories, menuItems as baseMenuItems } from '../data/menu.ts';
// node:sqlite needs Node 22 or newer, which package.json "engines" pins for any deployment.
// The database itself is opened on first use (see connect), never on import.

const DB_PATH = process.env.DATABASE_URL ?? join(process.cwd(), 'data', 'al-qadri.db');

declare global {
  var __alqadriDb: DatabaseSync | undefined;
}

function open(): DatabaseSync {
  if (DB_PATH !== ':memory:') mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

// Opened on first use, not on import: the public site deployed to Vercel renders the menu straight
// from src/data/menu.ts and has no writable disk, so nothing must touch SQLite just by importing it.
// Reused across hot reloads in dev and across route handler invocations in the same server process.
function connect(): DatabaseSync {
  const existing = globalThis.__alqadriDb;
  if (existing) return existing;
  const opened = open();
  opened.exec(SCHEMA);
  globalThis.__alqadriDb = opened;
  seedIfEmpty(opened);
  return opened;
}

export const db = {
  prepare: (sql: string) => connect().prepare(sql),
  exec: (sql: string) => connect().exec(sql),
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  printed_heading TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'admin',
  archived INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id TEXT NOT NULL REFERENCES categories(id),
  price1 REAL NOT NULL,
  price2 REAL,
  price3 REAL,
  portion_labels TEXT,
  image TEXT,
  available INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'admin',
  archived INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  fulfillment_type TEXT NOT NULL,
  delivery_address TEXT,
  payment_method TEXT NOT NULL,
  subtotal REAL NOT NULL,
  total REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  idempotency_key TEXT UNIQUE,
  notification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  portion_label TEXT,
  unit_price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  line_total REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

CREATE TABLE IF NOT EXISTS order_status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_at TEXT NOT NULL,
  changed_by TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_status_history_order ON order_status_history(order_id);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL
);
`;

function seedIfEmpty(db: DatabaseSync) {
  const row = db.prepare('SELECT COUNT(*) as n FROM categories').get() as { n: number };
  if (row.n > 0) return;
  const now = new Date().toISOString();
  const insertCategory = db.prepare(
    `INSERT INTO categories (id, label, printed_heading, sort_order, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'base', ?, ?)`,
  );
  const insertItem = db.prepare(
    `INSERT INTO menu_items
       (slug, name, description, category_id, price1, price2, price3, portion_labels, image, available, sort_order, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'base', ?, ?)`,
  );
  const tx = db.exec.bind(db);
  tx('BEGIN');
  try {
    baseCategories.forEach((category, index) => {
      insertCategory.run(category.id, category.label, category.printedHeading, index, now, now);
    });
    baseMenuItems.forEach((item, index) => {
      const [p1, p2, p3] = item.prices;
      const labels = item.prices.length === 2 ? JSON.stringify(['Half', 'Full']) : null;
      insertItem.run(
        item.slug,
        item.name,
        item.description ?? null,
        item.category,
        Number(p1),
        p2 !== undefined ? Number(p2) : null,
        p3 !== undefined ? Number(p3) : null,
        labels,
        item.image ?? null,
        index,
        now,
        now,
      );
    });
    tx('COMMIT');
  } catch (error) {
    tx('ROLLBACK');
    throw error;
  }
}

export function nowIso(): string {
  return new Date().toISOString();
}
