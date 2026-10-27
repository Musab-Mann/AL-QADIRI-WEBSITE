import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/require-admin.ts';
import { listOrders } from '@/server/orders.ts';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const url = new URL(request.url);
  const params = url.searchParams;
  const page = Math.max(Number(params.get('page') ?? '1') || 1, 1);
  const limit = 20;

  const result = listOrders({
    status: params.get('status') || undefined,
    fulfillmentType: params.get('fulfillmentType') || undefined,
    search: params.get('search') || undefined,
    dateFrom: params.get('dateFrom') || undefined,
    dateTo: params.get('dateTo') || undefined,
    limit,
    offset: (page - 1) * limit,
  });

  return NextResponse.json({ ...result, page, pageSize: limit });
}
