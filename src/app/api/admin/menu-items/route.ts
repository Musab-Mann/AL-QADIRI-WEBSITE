import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/require-admin.ts';
import { getEffectiveMenuItems, createMenuItem, type MenuItemInput } from '@/server/menu-overlay.ts';

export const runtime = 'nodejs';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  return NextResponse.json({ items: getEffectiveMenuItems() });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const input = body as Partial<MenuItemInput>;
  if (!input.slug || !input.name || !input.category || !Array.isArray(input.prices)) {
    return NextResponse.json({ error: 'Slug, name, category and at least one price are required.' }, { status: 400 });
  }

  try {
    const item = createMenuItem(input as MenuItemInput);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not create item.' }, { status: 400 });
  }
}
