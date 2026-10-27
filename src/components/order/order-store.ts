'use client';

import { useSyncExternalStore } from 'react';

// The cart lives only in the browser until checkout. Each line carries its own snapshot of the
// dish (name, prices, portion) taken at add-to-order time, instead of looking a slug back up in
// a shared menu list - the effective menu (base dishes + admin-added ones) lives in the database
// on the server, so there is nothing for a client component to import and look values up in.
// The server re-validates every slug, portion and price again from the database when the order
// is actually placed (see src/server/orders.ts placeOrder), so this snapshot is only ever used
// for display in the cart drawer, never trusted for the final price.
export interface CartItemInfo {
  slug: string;
  name: string;
  category: string;
  prices: readonly string[];
}

export interface OrderLine {
  slug: string;
  name: string;
  category: string;
  prices: readonly string[];
  portion: number;
  qty: number;
}

const KEY = 'alqadri-order-v2';
const EMPTY: OrderLine[] = [];
let lines: OrderLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isValid(line: unknown): line is OrderLine {
  if (!line || typeof line !== 'object') return false;
  const l = line as Partial<OrderLine>;
  return (
    typeof l.slug === 'string' &&
    typeof l.name === 'string' &&
    typeof l.category === 'string' &&
    Array.isArray(l.prices) &&
    l.prices.length > 0 &&
    Number.isInteger(l.portion) &&
    (l.portion as number) >= 0 &&
    (l.portion as number) < l.prices.length &&
    Number.isInteger(l.qty) &&
    (l.qty as number) > 0
  );
}

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    if (Array.isArray(parsed)) lines = parsed.filter(isValid);
  } catch {
    lines = EMPTY;
  }
}

function commit(next: OrderLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable (private mode); the list still works for this visit
  }
  listeners.forEach((listener) => listener());
}

export const orderStore = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    load();
    return lines;
  },
  getServerSnapshot() {
    return EMPTY;
  },
  add(item: CartItemInfo, portion: number) {
    const existing = lines.find((l) => l.slug === item.slug && l.portion === portion);
    commit(
      existing
        ? lines.map((l) => (l === existing ? { ...l, qty: l.qty + 1 } : l))
        : [...lines, { slug: item.slug, name: item.name, category: item.category, prices: item.prices, portion, qty: 1 }],
    );
  },
  setQty(slug: string, portion: number, qty: number) {
    commit(
      qty <= 0
        ? lines.filter((l) => !(l.slug === slug && l.portion === portion))
        : lines.map((l) => (l.slug === slug && l.portion === portion ? { ...l, qty } : l)),
    );
  },
  clear() {
    commit(EMPTY);
  },
};

export function useOrder(): OrderLine[] {
  return useSyncExternalStore(orderStore.subscribe, orderStore.getSnapshot, orderStore.getServerSnapshot);
}

export function portionName(line: Pick<OrderLine, 'prices' | 'portion'>): string | null {
  if (line.prices.length === 2) return line.portion === 0 ? 'Half' : 'Full';
  return null;
}

export function unitPrice(line: Pick<OrderLine, 'prices' | 'portion'>): number {
  return Number(line.prices[line.portion]);
}

export function formatAmount(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `AED ${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)}`;
}

export function describeLine(line: OrderLine): string {
  const portion = portionName(line);
  const price = formatAmount(unitPrice(line));
  return `${line.qty} x ${line.name}${portion ? ` (${portion}, ${price})` : ` (${price})`}`;
}

// Lets the tray animate a small marker from the button that was pressed.
export const ORDER_ADDED_EVENT = 'alqadri:order-added';
