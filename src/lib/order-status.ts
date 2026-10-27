// Client-safe order status constants/types shared between server code and client components.
// Deliberately has ZERO imports from src/server/* (which pulls in node:sqlite) so that client
// components (e.g. StatusUpdateForm) can use these values without the database ending up in the
// browser bundle. src/server/orders.ts re-exports everything here for server-side callers.
export type FulfillmentType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash';

export const PICKUP_STATUSES = ['new', 'confirmed', 'preparing', 'ready_for_pickup', 'completed', 'cancelled'] as const;
export const DELIVERY_STATUSES = ['new', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'] as const;
export type OrderStatus = (typeof PICKUP_STATUSES)[number] | (typeof DELIVERY_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function statusesFor(type: FulfillmentType): readonly OrderStatus[] {
  return type === 'pickup' ? PICKUP_STATUSES : DELIVERY_STATUSES;
}
