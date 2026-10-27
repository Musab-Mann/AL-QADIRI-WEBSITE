import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/server/require-admin.ts';

export const runtime = 'nodejs';

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
