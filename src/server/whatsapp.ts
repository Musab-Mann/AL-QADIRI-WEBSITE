import { db, nowIso } from './db.ts';
import type { FulfillmentType, PaymentMethod } from './orders.ts';
import { getWhatsAppConfig } from './settings.ts';

interface NotifyOrderInput {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress: string | null;
  paymentMethod: PaymentMethod;
  subtotal: number;
  total: number;
  items: { name: string; portionLabel: string | null; quantity: number; lineTotal: number }[];
}

function formatMoney(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `AED ${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)}`;
}

export function buildWhatsAppMessage(order: NotifyOrderInput): string {
  const lines = [
    'NEW ORDER',
    '',
    `Order ID: ${order.orderNumber}`,
    '',
    'Customer:',
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Email: ${order.customerEmail}`,
    '',
    'Order:',
    ...order.items.map(
      (item) => `- ${item.name}${item.portionLabel ? ` (${item.portionLabel})` : ''} x ${item.quantity} - ${formatMoney(item.lineTotal)}`,
    ),
    '',
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Total: ${formatMoney(order.total)}`,
    '',
    'Order Type:',
    order.fulfillmentType === 'pickup' ? 'Pickup' : 'Free Home Delivery',
  ];
  if (order.fulfillmentType === 'delivery' && order.deliveryAddress) {
    lines.push('', 'Delivery Address:', order.deliveryAddress);
  }
  lines.push('', 'Payment:', order.paymentMethod === 'cash' ? 'Cash' : order.paymentMethod);
  return lines.join('\n');
}

/** Click-to-chat link to the restaurant's WhatsApp with the order already written. Works without the Cloud API. */
export function orderWhatsAppUrl(message: string): string {
  return `https://wa.me/${getWhatsAppConfig().destination}?text=${encodeURIComponent(message)}`;
}

function logNotification(orderId: number, status: 'sent' | 'failed' | 'skipped', detail: string) {
  db.prepare(
    'INSERT INTO notifications_log (order_id, channel, status, detail, created_at) VALUES (?, ?, ?, ?, ?)',
  ).run(orderId, 'whatsapp', status, detail, nowIso());
  db.prepare('UPDATE orders SET notification_status = ? WHERE id = ?').run(status, orderId);
}

/**
 * Sends the WhatsApp Cloud API notification if credentials are configured. If they are not,
 * or if the request fails, the failure is logged and the order is left exactly as it is - an
 * order is never lost or rolled back because a notification could not be delivered.
 */
export async function notifyNewOrder(order: NotifyOrderInput): Promise<void> {
  const message = buildWhatsAppMessage(order);
  // Number, token and phone number ID come from Admin > Settings (or the environment, which wins).
  const { token, phoneNumberId, destination } = getWhatsAppConfig();

  if (!token || !phoneNumberId || !destination) {
    logNotification(
      order.id,
      'skipped',
      'WhatsApp Cloud API is not connected yet. Add the token and phone number ID in Admin > Settings to send new orders automatically.',
    );
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: destination,
        type: 'text',
        text: { body: message },
      }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      logNotification(order.id, 'failed', `WhatsApp API responded ${response.status}: ${body.slice(0, 500)}`);
      return;
    }
    logNotification(order.id, 'sent', 'Delivered via WhatsApp Cloud API.');
  } catch (error) {
    logNotification(order.id, 'failed', error instanceof Error ? error.message : 'Unknown error sending WhatsApp notification.');
  }
}
