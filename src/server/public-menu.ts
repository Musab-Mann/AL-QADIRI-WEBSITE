// Drop-in, database-backed replacement for the read side of `@/data/menu`'s helper functions.
// Server components that only browsed the static 58-dish list before (pages, MenuCategory,
// SignatureDishes, MenuIndex, Footer, StoryTeaser, schema.ts, sitemap.ts) import from here
// instead, so admin-added items and availability/price/description/image edits appear on the
// live site. `src/data/menu.ts` itself is never imported by name from these call sites anymore,
// but its exported data is still the seed for every "base" row (see db.ts) and is still exactly
// what `npm run validate` checks against docs/MENU_DATA.md.
import {
  categories as baseCategories,
  menuItems as baseMenuItems,
  featuredOrder,
  type Category,
  type CategoryId,
  type MenuItem,
} from '../data/menu.ts';
import { getEffectiveCategories, getEffectiveMenuItems, type EffectiveMenuItem } from './menu-overlay.ts';

const baseBySlug = new Map(baseMenuItems.map((item) => [item.slug, item]));
const baseCategoryById = new Map(baseCategories.map((category) => [category.id, category]));

// The site deployed to Vercel is the public menu only: there is no writable disk there for SQLite,
// so it reads the printed menu straight from src/data/menu.ts. The copy that runs on the
// restaurant's own computer has the database and the admin dashboard, exactly as before.
// STATIC_MENU=1 forces this mode locally, which is how the deployment is tested.
const STATIC_MENU = Boolean(process.env.VERCEL) || process.env.STATIC_MENU === '1';

function toMenuItem(effective: EffectiveMenuItem): MenuItem {
  const base = baseBySlug.get(effective.slug);
  if (base) {
    // A "base" (original 58-dish) row: keep every bilingual/audit field from menu.ts, and only
    // let the admin-editable fields (name, description, prices, image, category) come from the
    // database, since those are the ones the admin dashboard can actually change.
    return {
      ...base,
      name: effective.name,
      description: effective.description ?? base.description,
      category: effective.category as CategoryId,
      prices: effective.prices,
      image: effective.image ?? base.image,
    };
  }
  // An admin-added dish has no printed-menu audit trail or translations yet.
  return {
    slug: effective.slug,
    name: effective.name,
    nameUr: '',
    nameAr: '',
    sourceName: effective.name,
    category: effective.category as CategoryId,
    prices: effective.prices,
    sourcePrice: `${effective.prices.join('/')} AED`,
    image: effective.image ?? undefined,
    imageAlt: effective.image ? effective.name : undefined,
    description: effective.description ?? undefined,
  };
}

function toCategory(id: string, label: string, printedHeading: string | null, leadSlug: string): Category {
  const base = baseCategoryById.get(id as CategoryId);
  if (base) return { ...base, label, printedHeading: printedHeading ?? base.printedHeading };
  return {
    id: id as CategoryId,
    label,
    labelUr: '',
    labelAr: '',
    printedHeading: printedHeading ?? label,
    leadSlug,
  };
}

/** Only items that are not archived; unavailable items are still included (so they can render as "Currently unavailable") except from ordering. */
export function getPublicMenuItems(): MenuItem[] {
  if (STATIC_MENU) return [...baseMenuItems];
  return getEffectiveMenuItems().map(toMenuItem);
}

export function getPublicCategories(): Category[] {
  if (STATIC_MENU) return [...baseCategories];
  const items = getEffectiveMenuItems();
  return getEffectiveCategories()
    .map((c) => {
      const firstSlug = items.find((item) => item.category === c.id)?.slug;
      if (!firstSlug) return null; // an empty category has nothing to lead with; hide it rather than crash
      return toCategory(c.id, c.label, c.printedHeading, firstSlug);
    })
    .filter((c): c is Category => c !== null);
}

export function getPublicCategory(id: string): Category | undefined {
  return getPublicCategories().find((c) => c.id === id);
}

export function getPublicItemsByCategory(id: string): MenuItem[] {
  return getPublicMenuItems().filter((item) => item.category === id);
}

export function getPublicItem(slug: string): MenuItem | undefined {
  if (STATIC_MENU) return baseBySlug.get(slug);
  const effective = getEffectiveMenuItems().find((item) => item.slug === slug);
  return effective ? toMenuItem(effective) : undefined;
}

/** Whether a dish can currently be added to an order. Missing/archived slugs are also unavailable. */
export function isItemAvailable(slug: string): boolean {
  if (STATIC_MENU) return baseBySlug.has(slug);
  const effective = getEffectiveMenuItems().find((item) => item.slug === slug);
  return Boolean(effective?.available);
}

export function getPublicFeatured(): MenuItem[] {
  const all = getPublicMenuItems();
  const bySlug = new Map(all.map((item) => [item.slug, item]));
  return featuredOrder.map((slug) => bySlug.get(slug)).filter((item): item is MenuItem => Boolean(item));
}

export function getPublicLead(id: string): MenuItem | undefined {
  const category = getPublicCategory(id);
  return category ? getPublicItem(category.leadSlug) : undefined;
}
