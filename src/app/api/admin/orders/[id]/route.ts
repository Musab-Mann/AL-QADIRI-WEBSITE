import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/require-admin.ts';
import { getOrderDetail, updateOrderStatus, statusesFor, type OrderStatus } from '@/server/orders.ts';

export const runtime = 'nodejs';

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid order id.' }, { status: 400 });

  const detail = getOrderDetail(id);
  if (!detail) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  return NextResponse.json(detail);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid order id.' }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const { status } = (body ?? {}) as { status?: unknown };
  if (typeof status !== 'string') {
    return NextResponse.json({ error: 'A status is required.' }, { status: 400 });
  }

  const detail = getOrderDetail(id);
  if (!detail) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  const allowed = statusesFor(detail.order.fulfillment_type);
  if (!allowed.includes(status as OrderStatus)) {
    return NextResponse.json(
      { error: `That status is not valid for a ${detail.order.fulfillment_type} order.`, allowed },
      { status: 400 },
    );
  }

  try {
    const updated = updateOrderStatus(id, status as OrderStatus, session.username);
    return NextResponse.json({ order: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not update order.' }, { status: 400 });
  }
}
