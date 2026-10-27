// The printed menu in src/data/menu.ts stays exactly as documented in docs/MENU_DATA.md - this
// file never edits it. Instead, every dish and category is mirrored into the database once
// (see db.ts seedIfEmpty) and the database becomes the live, admin-editable copy that the site
// actually renders. `source: 'base'` rows are the original 58 dishes / 6 categories; `source:
// 'admin'` rows are ones the admin dashboard added. Deleting a base or admin item only ever sets
// `archived`, so past orders (which store their own name/price snapshot) are never affected.
import { db, nowIso } from './db.ts';
import type { CategoryId, Prices } from '../data/menu.ts';

export interface EffectiveCategory {
  id: string;
  label: string;
  printedHeading: string | null;
  order: number;
  source: 'base' | 'admin';
}

export interface EffectiveMenuItem {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  prices: Prices;
  portionLabels: readonly [string, string] | null;
  image: string | null;
  available: boolean;
  order: number;
  source: 'base' | 'admin';
}

interface CategoryRow {
  id: string;
  label: string;
  printed_heading: string | null;
  sort_order: number;
  source: string;
}

interface MenuItemRow {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category_id: string;
  price1: number;
  price2: number | null;
  price3: number | null;
  portion_labels: string | null;
  image: string | null;
  available: number;
  sort_order: number;
  source: string;
}

function toPrices(row: MenuItemRow): Prices {
  const parts = [row.price1];
  if (row.price2 !== null) parts.push(row.price2);
  if (row.price3 !== null) parts.push(row.price3);
  const strings = parts.map((n) => (Number.isInteger(n) ? String(n) : String(n)));
  return strings as unknown as Prices;
}

function toItem(row: MenuItemRow): EffectiveMenuItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category_id,
    prices: toPrices(row),
    portionLabels: row.portion_labels ? (JSON.parse(row.portion_labels) as [string, string]) : null,
    image: row.image,
    available: row.available === 1,
    order: row.sort_order,
    source: row.source === 'admin' ? 'admin' : 'base',
  };
}

export function getEffectiveCategories(): EffectiveCategory[] {
  const rows = db
    .prepare('SELECT * FROM categories WHERE archived = 0 ORDER BY sort_order ASC')
    .all() as CategoryRow[];
  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    printedHeading: r.printed_heading,
    order: r.sort_order,
    source: r.source === 'admin' ? 'admin' : 'base',
  }));
}

export function getEffectiveMenuItems(): EffectiveMenuItem[] {
  const rows = db
    .prepare(
      `SELECT * FROM menu_items WHERE archived = 0
       ORDER BY category_id ASC, sort_order ASC, id ASC`,
    )
    .all() as MenuItemRow[];
  return rows.map(toItem);
}

export function getEffectiveItemsByCategory(categoryId: string): EffectiveMenuItem[] {
  return getEffectiveMenuItems().filter((item) => item.category === categoryId);
}

export function getEffectiveItem(slug: string): EffectiveMenuItem | undefined {
  const row = db.prepare('SELECT * FROM menu_items WHERE slug = ? AND archived = 0').get(slug) as
    | MenuItemRow
    | undefined;
  return row ? toItem(row) : undefined;
}

export function getEffectiveItemById(id: number): EffectiveMenuItem | undefined {
  const row = db.prepare('SELECT * FROM menu_items WHERE id = ? AND archived = 0').get(id) as
    | MenuItemRow
    | undefined;
  return row ? toItem(row) : undefined;
}

/** True only for a slug that exists and is currently orderable. Unknown slugs are not available. */
export function isAvailable(slug: string): boolean {
  const item = getEffectiveItem(slug);
  return Boolean(item?.available);
}

// --- Admin write operations -------------------------------------------------

export interface MenuItemInput {
  slug: string;
  name: string;
  description?: string | null;
  category: CategoryId | string;
  prices: string[]; // 1-3 values
  image?: string | null;
  available?: boolean;
  order?: number;
}

function validatePrices(prices: string[]): { p1: number; p2: number | null; p3: number | null; labels: string | null } {
  if (prices.length < 1 || prices.length > 3) throw new Error('An item needs between 1 and 3 prices.');
  const nums = prices.map((p) => Number(p));
  if (nums.some((n) => !Number.isFinite(n) || n < 0)) throw new Error('Prices must be positive numbers.');
  return {
    p1: nums[0],
    p2: nums[1] ?? null,
    p3: nums[2] ?? null,
    labels: nums.length === 2 ? JSON.stringify(['Half', 'Full']) : null,
  };
}

export function createMenuItem(input: MenuItemInput): EffectiveMenuItem {
  const slug = input.slug.trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Slug may only contain lowercase letters, numbers and hyphens.');
  const existing = db.prepare('SELECT id FROM menu_items WHERE slug = ?').get(slug);
  if (existing) throw new Error('An item with this slug already exists.');
  const category = db.prepare('SELECT id FROM categories WHERE id = ? AND archived = 0').get(input.category);
  if (!category) throw new Error('Unknown category.');
  const { p1, p2, p3, labels } = validatePrices(input.prices);
  const now = nowIso();
  const maxOrder = db
    .prepare('SELECT COALESCE(MAX(sort_order), -1) as m FROM menu_items WHERE category_id = ?')
    .get(input.category) as { m: number };

  const info = db
    .prepare(
      `INSERT INTO menu_items
        (slug, name, description, category_id, price1, price2, price3, portion_labels, image, available, sort_order, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin', ?, ?)`,
    )
    .run(
      slug,
      input.name.trim(),
      input.description?.trim() || null,
      input.category,
      p1,
      p2,
      p3,
      labels,
      input.image ?? null,
      input.available === false ? 0 : 1,
      input.order ?? maxOrder.m + 1,
      now,
      now,
    );
  return getEffectiveItemById(Number(info.lastInsertRowid))!;
}

export function updateMenuItem(id: number, input: Partial<MenuItemInput>): EffectiveMenuItem {
  const current = getEffectiveItemById(id);
  if (!current) throw new Error('Menu item not found.');

  if (input.category) {
    const category = db.prepare('SELECT id FROM categories WHERE id = ? AND archived = 0').get(input.category);
    if (!category) throw new Error('Unknown category.');
  }

  const prices = input.prices ? validatePrices(input.prices) : null;
  const now = nowIso();

  db.prepare(
    `UPDATE menu_items SET
       name = ?, description = ?, category_id = ?,
       price1 = ?, price2 = ?, price3 = ?, portion_labels = ?,
       image = ?, available = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    input.name?.trim() ?? current.name,
    input.description !== undefined ? input.description?.trim() || null : current.description,
    input.category ?? current.category,
    prices ? prices.p1 : Number(current.prices[0]),
    prices ? prices.p2 : (current.prices[1] !== undefined ? Number(current.prices[1]) : null),
    prices ? prices.p3 : (current.prices[2] !== undefined ? Number(current.prices[2]) : null),
    prices ? prices.labels : current.portionLabels ? JSON.stringify(current.portionLabels) : null,
    input.image !== undefined ? input.image : current.image,
    input.available !== undefined ? (input.available ? 1 : 0) : current.available ? 1 : 0,
    now,
    id,
  );
  return getEffectiveItemById(id)!;
}

export function setMenuItemAvailability(id: number, available: boolean): EffectiveMenuItem {
  const current = getEffectiveItemById(id);
  if (!current) throw new Error('Menu item not found.');
  db.prepare('UPDATE menu_items SET available = ?, updated_at = ? WHERE id = ?').run(
    available ? 1 : 0,
    nowIso(),
    id,
  );
  return getEffectiveItemById(id)!;
}

/** Soft delete. Historical orders keep their own name/price snapshot regardless. */
export function archiveMenuItem(id: number): void {
  const current = getEffectiveItemById(id);
  if (!current) throw new Error('Menu item not found.');
  db.prepare('UPDATE menu_items SET archived = 1, available = 0, updated_at = ? WHERE id = ?').run(nowIso(), id);
}

export function reorderMenuItem(id: number, order: number): void {
  db.prepare('UPDATE menu_items SET sort_order = ?, updated_at = ? WHERE id = ?').run(order, nowIso(), id);
}

export interface CategoryInput {
  id: string;
  label: string;
  printedHeading?: string | null;
}

export function createCategory(input: CategoryInput): EffectiveCategory {
  const id = input.id.trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error('Category id may only contain lowercase letters, numbers and hyphens.');
  const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
  if (existing) throw new Error('A category with this id already exists.');
  const now = nowIso();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) as m FROM categories').get() as { m: number };
  db.prepare(
    `INSERT INTO categories (id, label, printed_heading, sort_order, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'admin', ?, ?)`,
  ).run(id, input.label.trim(), input.printedHeading?.trim() || null, maxOrder.m + 1, now, now);
  return getEffectiveCategories().find((c) => c.id === id)!;
}

export function updateCategory(id: string, input: Partial<CategoryInput>): EffectiveCategory {
  const existing = db.prepare('SELECT id FROM categories WHERE id = ? AND archived = 0').get(id);
  if (!existing) throw new Error('Category not found.');
  db.prepare('UPDATE categories SET label = COALESCE(?, label), printed_heading = ?, updated_at = ? WHERE id = ?').run(
    input.label?.trim() ?? null,
    input.printedHeading !== undefined ? input.printedHeading?.trim() || null : null,
    nowIso(),
    id,
  );
  return getEffectiveCategories().find((c) => c.id === id)!;
}

export function archiveCategory(id: string): void {
  const itemCount = db
    .prepare('SELECT COUNT(*) as n FROM menu_items WHERE category_id = ? AND archived = 0')
    .get(id) as { n: number };
  if (itemCount.n > 0) throw new Error('Move or archive every item in this category before removing it.');
  db.prepare('UPDATE categories SET archived = 1, updated_at = ? WHERE id = ?').run(nowIso(), id);
}
