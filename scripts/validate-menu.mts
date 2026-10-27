// Checks src/data/menu.ts against the human-audited table in docs/MENU_DATA.md, plus copy and image rules.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, menuItems, featuredOrder } from '../src/data/menu.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors: string[] = [];
const warnings: string[] = [];
const fail = (msg: string) => errors.push(msg);

// 1. Parse the audited table
interface Row { slug: string; name: string; printed: string; prices: string[]; printedPrice: string; category: string }
const doc = readFileSync(join(root, 'docs', 'MENU_DATA.md'), 'utf8');
const headingToCategory: Record<string, string> = {
  'Breakfast': 'breakfast',
  'BBQ / Grill': 'bbq-grill',
  'Curry': 'curry',
  'Rice': 'rice',
  'Special Lunch & Dinner': 'special',
  'Refreshment': 'refreshment',
};
const rows: Row[] = [];
let current = '';
for (const line of doc.split(/\r?\n/)) {
  const heading = line.match(/^## (.+?) \(\d+\)/);
  if (heading) {
    current = headingToCategory[heading[1]] ?? '';
    continue;
  }
  const cells = line.split('|').map((c) => c.trim());
  if (current && cells.length >= 8 && /^\d+$/.test(cells[1])) {
    rows.push({
      slug: cells[2],
      name: cells[3],
      printed: cells[4],
      prices: cells[5].split('/').map((p) => p.trim()),
      printedPrice: cells[6],
      category: current,
    });
  }
}

// 2. Totals
const expectedCounts: Record<string, number> = { breakfast: 18, 'bbq-grill': 9, curry: 13, rice: 3, special: 6, refreshment: 9 };
if (rows.length !== 58) fail(`MENU_DATA.md has ${rows.length} rows, expected 58`);
if (menuItems.length !== 58) fail(`menu.ts has ${menuItems.length} items, expected 58`);
for (const [id, count] of Object.entries(expectedCounts)) {
  const actual = menuItems.filter((i) => i.category === id).length;
  if (actual !== count) fail(`Category ${id}: ${actual} items, expected ${count}`);
}
if (categories.length !== 6) fail(`Expected 6 categories, found ${categories.length}`);

// 3. Row-by-row comparison, same order
const slugs = new Set<string>();
menuItems.forEach((item, index) => {
  if (slugs.has(item.slug)) fail(`Duplicate slug ${item.slug}`);
  slugs.add(item.slug);
  const row = rows[index];
  if (!row) return fail(`No MENU_DATA row for ${item.slug}`);
  const where = `#${index + 1} ${item.slug}`;
  if (row.slug !== item.slug) fail(`${where}: slug differs from doc (${row.slug})`);
  if (row.name !== item.name) fail(`${where}: name "${item.name}" differs from doc "${row.name}"`);
  if (row.printed !== item.sourceName) fail(`${where}: sourceName "${item.sourceName}" differs from doc "${row.printed}"`);
  if (row.category !== item.category) fail(`${where}: category ${item.category} differs from doc ${row.category}`);
  if (row.printedPrice !== item.sourcePrice) fail(`${where}: sourcePrice "${item.sourcePrice}" differs from doc "${row.printedPrice}"`);
  if (row.prices.join('/') !== item.prices.join('/')) fail(`${where}: prices ${item.prices.join('/')} differ from doc ${row.prices.join('/')}`);
  if (item.prices.length < 1 || item.prices.length > 3) fail(`${where}: must have 1 to 3 prices`);
  for (const p of item.prices) if (!/^\d+(\.\d+)?$/.test(p)) fail(`${where}: invalid price "${p}"`);
  const printedValues = item.sourcePrice.replace(' AED', '').split('/').map((v) => String(Number(v)));
  if (printedValues.join('/') !== item.prices.join('/')) fail(`${where}: prices do not match printed "${item.sourcePrice}"`);
  if (item.image) {
    const file = join(root, 'public', item.image);
    if (!existsSync(file)) fail(`${where}: image missing at public${item.image}`);
    // filename is the slug, optionally with a version suffix (-v2) used to bust caches when a photo is replaced
    const base = item.image.split('/').pop()?.replace(/\.\w+$/, '').replace(/-v\d+$/, '');
    const shared = item.slug.replace(/-(breakfast|curry)$/, '');
    if (base !== item.slug && base !== shared) fail(`${where}: image filename "${base}" must match slug`);
    if (!item.imageAlt) fail(`${where}: image without imageAlt`);
  }

  // Urdu and Arabic names: present, and actually written in Arabic script.
  const arabicScript = /^[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿\s()0-9]+$/;
  if (!item.nameUr) fail(`${where}: missing nameUr`);
  else if (!arabicScript.test(item.nameUr)) fail(`${where}: nameUr "${item.nameUr}" is not Urdu script`);
  if (!item.nameAr) fail(`${where}: missing nameAr`);
  else if (!arabicScript.test(item.nameAr)) fail(`${where}: nameAr "${item.nameAr}" is not Arabic script`);
});
for (const id of categories.map((c) => c.leadSlug)) if (!slugs.has(id)) fail(`Category lead ${id} is not a menu item`);
for (const slug of featuredOrder) if (!slugs.has(slug)) fail(`Featured ${slug} is not a menu item`);

// 4. Copy rules across src/
const dashFiles: string[] = [];
const placeholders: string[] = [];
function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(ts|tsx|css|md)$/.test(entry)) {
      const text = readFileSync(path, 'utf8');
      if (/[–—]/.test(text)) dashFiles.push(path.replace(root, ''));
      if (text.includes('[PLACEHOLDER')) placeholders.push(path.replace(root, ''));
    }
  }
}
walk(join(root, 'src'));
for (const f of dashFiles) fail(`Em-dash or en-dash found in ${f}`);
for (const f of placeholders) warnings.push(`Placeholder text remains in ${f}`);

// 5. Report
const twoPrice = menuItems.filter((i) => i.prices.length === 2).length;
const threePrice = menuItems.filter((i) => i.prices.length === 3).length;
console.log(`Menu items: ${menuItems.length} (single ${menuItems.length - twoPrice - threePrice}, Half/Full ${twoPrice}, three-price ${threePrice})`);
console.log(`Categories: ${categories.map((c) => `${c.label} ${menuItems.filter((i) => i.category === c.id).length}`).join(', ')}`);
console.log(`Images linked: ${menuItems.filter((i) => i.image).length}/58`);
for (const w of warnings) console.log(`WARN  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`FAIL  ${e}`);
  console.error(`\nMenu validation failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log('\nMenu validation passed.');
