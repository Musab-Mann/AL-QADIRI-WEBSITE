import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/require-admin.ts';
import { getEffectiveCategories, createCategory, type CategoryInput } from '@/server/menu-overlay.ts';

export const runtime = 'nodejs';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  return NextResponse.json({ categories: getEffectiveCategories() });
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
  const input = body as Partial<CategoryInput>;
  if (!input.id || !input.label) {
    return NextResponse.json({ error: 'A category id and label are required.' }, { status: 400 });
  }

  try {
    const category = createCategory(input as CategoryInput);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not create category.' }, { status: 400 });
  }
}
