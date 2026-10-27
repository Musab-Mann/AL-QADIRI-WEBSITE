import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/require-admin.ts';
import { updateMenuItem, archiveMenuItem, setMenuItemAvailability, type MenuItemInput } from '@/server/menu-overlay.ts';

export const runtime = 'nodejs';

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid item id.' }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const input = body as Partial<MenuItemInput> & { availableOnly?: boolean };

  try {
    if (input.availableOnly && typeof input.available === 'boolean') {
      return NextResponse.json({ item: setMenuItemAvailability(id, input.available) });
    }
    const item = updateMenuItem(id, input);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not update item.' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid item id.' }, { status: 400 });

  try {
    archiveMenuItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not remove item.' }, { status: 400 });
  }
}
