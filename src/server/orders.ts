import { db, nowIso } from './db.ts';
import { getEffectiveItem } from './menu-overlay.ts';
import { buildWhatsAppMessage, notifyNewOrder, orderWhatsAppUrl } from './whatsapp.ts';
// Status labels/types live in a client-safe module (no node:sqlite import) so that client
// components can use them directly instead of importing this server-only file. Re-exported here
// so every existing server-side caller of '@/server/orders.ts' keeps working unchanged.
import {
  PICKUP_STATUSES,
  DELIVERY_STATUSES,
  STATUS_LABELS,
  statusesFor,
  type FulfillmentType,
  type PaymentMethod,
  type OrderStatus,
} from '@/lib/order-status.ts';

export { PICKUP_STATUSES, DELIVERY_STATUSES, STATUS_LABELS, statusesFor };
export type { FulfillmentType, PaymentMethod, OrderStatus };

export interface OrderLineInput {
  slug: string;
  /** 0-based index into the item's prices array (portion). */
  portion: number;
  quantity: number;
}

export interface PlaceOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  items: OrderLineInput[];
  /** Client-generated key so a double click / retry cannot create two orders. */
  idempotencyKey: string;
}

export class OrderValidationError extends Error {
  field?: string;
  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}

function assertNonEmptyString(value: unknown, field: string, maxLen = 200): string {
  if (typeof value !== 'string' || !value.trim()) throw new OrderValidationError(`${field} is required.`, field);
  const trimmed = value.trim();
  if (trimmed.length > maxLen) throw new OrderValidationError(`${field} is too long.`, field);
  return trimmed;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts a loose international phone shape; exact formatting is the restaurant's call to make on WhatsApp.
const PHONE_RE = /^[+0-9()\s-]{7,20}$/;

export interface PlacedOrder {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  fulfillmentType: FulfillmentType;
  etaMinutesLabel: string;
  /** Opens WhatsApp to the restaurant with this order written out, so it arrives even without the Cloud API. */
  whatsappUrl: string;
}

function generateOrderNumber(): string {
  const today = new Date();
  const y = today.getUTCFullYear();
  const m = String(today.getUTCMonth() + 1).padStart(2, '0');
  const d = String(today.getUTCDate()).padStart(2, '0');
  const datePart = `${y}${m}${d}`;
  const countRow = db
    .prepare(`SELECT COUNT(*) as n FROM orders WHERE order_number LIKE ?`)
    .get(`ALQ-${datePart}-%`) as { n: number };
  let seq = countRow.n + 1;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = `ALQ-${datePart}-${String(seq).padStart(4, '0')}`;
    const exists = db.prepare('SELECT 1 FROM orders WHERE order_number = ?').get(candidate);
    if (!exists) return candidate;
    seq += 1;
  }
  // Astronomically unlikely fallback: date + random suffix.
  return `ALQ-${datePart}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/**
 * Validates and creates an order. Every quantity, item id, availability check and price comes
 * from the trusted server-side menu (getEffectiveItem), never from the request body - a browser
 * can send whatever prices it likes and they are ignored (rule: never trust the price sent by
 * the frontend).
 */
export function placeOrder(input: PlaceOrderInput): PlacedOrder {
  const customerName = assertNonEmptyString(input.customerName, 'Name', 120);
  const customerEmail = assertNonEmptyString(input.customerEmail, 'Email', 200);
  if (!EMAIL_RE.test(customerEmail)) throw new OrderValidationError('Please enter a valid email address.', 'customerEmail');
  const customerPhone = assertNonEmptyString(input.customerPhone, 'WhatsApp / phone number', 30);
  if (!PHONE_RE.test(customerPhone)) throw new OrderValidationError('Please enter a valid WhatsApp number.', 'customerPhone');

  if (input.fulfillmentType !== 'pickup' && input.fulfillmentType !== 'delivery') {
    throw new OrderValidationError('Choose pickup or free home delivery.', 'fulfillmentType');
  }
  let deliveryAddress: string | null = null;
  if (input.fulfillmentType === 'delivery') {
    deliveryAddress = assertNonEmptyString(input.deliveryAddress, 'Delivery address', 400);
  }

  if (input.paymentMethod !== 'cash') {
    throw new OrderValidationError('Choose a payment method.', 'paymentMethod');
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new OrderValidationError('Your order is empty.', 'items');
  }
  if (input.items.length > 40) throw new OrderValidationError('That is too many different items for one order.', 'items');

  const idempotencyKey = assertNonEmptyString(input.idempotencyKey, 'Request key', 100);
  const existingOrder = db.prepare('SELECT * FROM orders WHERE idempotency_key = ?').get(idempotencyKey) as
    | { id: number; order_number: string; status: OrderStatus; total: number; subtotal: number; fulfillment_type: FulfillmentType }
    | undefined;
  if (existingOrder) {
    // Double-submit protection: return the order that was already created instead of making another.
    return {
      id: existingOrder.id,
      orderNumber: existingOrder.order_number,
      status: existingOrder.status,
      total: existingOrder.total,
      subtotal: existingOrder.subtotal,
      fulfillmentType: existingOrder.fulfillment_type,
      etaMinutesLabel: etaLabel(existingOrder.fulfillment_type),
      whatsappUrl: orderWhatsAppUrl(`Assalam o Alaikum, I placed order ${existingOrder.order_number} on your website.`),
    };
  }

  const resolvedLines = input.items.map((line, index) => {
    if (typeof line.slug !== 'string' || !line.slug) {
      throw new OrderValidationError(`Item ${index + 1} is invalid.`, 'items');
    }
    const item = getEffectiveItem(line.slug);
    if (!item) throw new OrderValidationError(`One of the items in your order no longer exists on the menu.`, 'items');
    if (!item.available) throw new OrderValidationError(`${item.name} is currently unavailable.`, 'items');
    const portion = Number(line.portion);
    if (!Number.isInteger(portion) || portion < 0 || portion >= item.prices.length) {
      throw new OrderValidationError(`Invalid portion selected for ${item.name}.`, 'items');
    }
    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      throw new OrderValidationError(`Invalid quantity for ${item.name}.`, 'items');
    }
    const unitPrice = Number(item.prices[portion]);
    const portionLabel = item.portionLabels ? item.portionLabels[portion] : null;
    return {
      slug: item.slug,
      name: item.name,
      portionLabel,
      unitPrice,
      quantity,
      lineTotal: Math.round(unitPrice * quantity * 100) / 100,
    };
  });

  // Merge duplicate (slug, portion) lines rather than trusting the client to have done so.
  const merged = new Map<string, (typeof resolvedLines)[number]>();
  for (const line of resolvedLines) {
    const key = `${line.slug}::${line.portionLabel ?? ''}`;
    const existing = merged.get(key);
    if (existing) {
      existing.quantity += line.quantity;
      existing.lineTotal = Math.round(existing.unitPrice * existing.quantity * 100) / 100;
    } else {
      merged.set(key, { ...line });
    }
  }
  const finalLines = [...merged.values()];

  const subtotal = Math.round(finalLines.reduce((sum, l) => sum + l.lineTotal, 0) * 100) / 100;
  const total = subtotal; // No delivery fee (free home delivery) and no tax line configured.

  const now = nowIso();
  const orderNumber = generateOrderNumber();

  db.exec('BEGIN');
  let orderId: number;
  try {
    const info = db
      .prepare(
        `INSERT INTO orders
          (order_number, customer_name, customer_email, customer_phone, fulfillment_type, delivery_address,
           payment_method, subtotal, total, status, idempotency_key, notification_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, 'pending', ?, ?)`,
      )
      .run(
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        input.fulfillmentType,
        deliveryAddress,
        input.paymentMethod,
        subtotal,
        total,
        idempotencyKey,
        now,
        now,
      );
    orderId = Number(info.lastInsertRowid);

    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, menu_item_slug, name, portion_label, unit_price, quantity, line_total)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
    for (const line of finalLines) {
      insertItem.run(orderId, line.slug, line.name, line.portionLabel, line.unitPrice, line.quantity, line.lineTotal);
    }
    db.prepare(
      'INSERT INTO order_status_history (order_id, status, changed_at, changed_by) VALUES (?, ?, ?, ?)',
    ).run(orderId, 'new', now, 'system');

    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  // The order is already committed at this point. A notification failure must never lose it
  // (rule: WhatsApp/email notification failure must not cause a successfully created order to
  // disappear) - notifyNewOrder swallows its own errors and just logs them.
  const notification = {
    id: orderId,
    orderNumber,
    customerName,
    customerEmail,
    customerPhone,
    fulfillmentType: input.fulfillmentType,
    deliveryAddress,
    paymentMethod: input.paymentMethod,
    subtotal,
    total,
    items: finalLines,
  };
  void notifyNewOrder(notification);

  return {
    id: orderId,
    orderNumber,
    status: 'new',
    total,
    subtotal,
    fulfillmentType: input.fulfillmentType,
    etaMinutesLabel: etaLabel(input.fulfillmentType),
    whatsappUrl: orderWhatsAppUrl(buildWhatsAppMessage(notification)),
  };
}

export function etaLabel(type: FulfillmentType): string {
  const minutes = getEtaMinutes();
  return type === 'pickup'
    ? `Your order will be ready for pickup in approximately ${minutes} minutes.`
    : `Your order should reach you in approximately ${minutes} minutes.`;
}

function getEtaMinutes(): string {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'eta_minutes'").get() as { value: string } | undefined;
  return row?.value ?? '35 to 40';
}

// --- Admin reads/writes ------------------------------------------------------

export interface OrderRow {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  fulfillment_type: FulfillmentType;
  delivery_address: string | null;
  payment_method: PaymentMethod;
  subtotal: number;
  total: number;
  status: OrderStatus;
  notification_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: number;
  menu_item_slug: string;
  name: string;
  portion_label: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface OrderFilters {
  status?: string;
  fulfillmentType?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export function listOrders(filters: OrderFilters = {}): { orders: OrderRow[]; total: number } {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.status) {
    clauses.push('status = ?');
    params.push(filters.status);
  }
  if (filters.fulfillmentType) {
    clauses.push('fulfillment_type = ?');
    params.push(filters.fulfillmentType);
  }
  if (filters.dateFrom) {
    clauses.push('created_at >= ?');
    params.push(filters.dateFrom);
  }
  if (filters.dateTo) {
    clauses.push('created_at <= ?');
    params.push(filters.dateTo);
  }
  if (filters.search) {
    clauses.push('(order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)');
    const like = `%${filters.search}%`;
    params.push(like, like, like);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const total = db.prepare(`SELECT COUNT(*) as n FROM orders ${where}`).get(...params) as { n: number };
  const limit = Math.min(filters.limit ?? 50, 200);
  const offset = filters.offset ?? 0;
  const orders = db
    .prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset) as OrderRow[];
  return { orders, total: total.n };
}

export function getOrderDetail(id: number): { order: OrderRow; items: OrderItemRow[] } | null {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow | undefined;
  if (!order) return null;
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id) as OrderItemRow[];
  return { order, items };
}

export function updateOrderStatus(id: number, status: OrderStatus, changedBy: string): OrderRow {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow | undefined;
  if (!order) throw new Error('Order not found.');
  const allowed = statusesFor(order.fulfillment_type);
  if (!allowed.includes(status)) {
    throw new Error(`"${STATUS_LABELS[status] ?? status}" is not a valid status for a ${order.fulfillment_type} order.`);
  }
  const now = nowIso();
  db.exec('BEGIN');
  try {
    db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
    db.prepare(
      'INSERT INTO order_status_history (order_id, status, changed_at, changed_by) VALUES (?, ?, ?, ?)',
    ).run(id, status, now, changedBy);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  return db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow;
}

export interface DashboardStats {
  totalOrders: number;
  todaysOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSales: number;
  todaysSales: number;
}

export function getDashboardStats(): DashboardStats {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  const totalOrders = (db.prepare('SELECT COUNT(*) as n FROM orders').get() as { n: number }).n;
  const todaysOrders = (
    db.prepare('SELECT COUNT(*) as n FROM orders WHERE created_at >= ?').get(todayIso) as { n: number }
  ).n;
  const pendingOrders = (
    db
      .prepare("SELECT COUNT(*) as n FROM orders WHERE status NOT IN ('completed', 'cancelled')")
      .get() as { n: number }
  ).n;
  const completedOrders = (
    db.prepare("SELECT COUNT(*) as n FROM orders WHERE status = 'completed'").get() as { n: number }
  ).n;
  const cancelledOrders = (
    db.prepare("SELECT COUNT(*) as n FROM orders WHERE status = 'cancelled'").get() as { n: number }
  ).n;
  // Cancelled orders are never counted as sales.
  const totalSales = (
    db.prepare("SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status != 'cancelled'").get() as {
      s: number;
    }
  ).s;
  const todaysSales = (
    db
      .prepare("SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status != 'cancelled' AND created_at >= ?")
      .get(todayIso) as { s: number }
  ).s;

  return { totalOrders, todaysOrders, pendingOrders, completedOrders, cancelledOrders, totalSales, todaysSales };
}
