import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/require-admin.ts';

export const runtime = 'nodejs';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  return NextResponse.json({ username: session.username });
}
