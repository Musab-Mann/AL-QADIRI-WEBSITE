import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/require-admin.ts';
import { changeAdminCredentials } from '@/server/admin-users.ts';
import { clearAdminSession } from '@/server/require-admin.ts';

export const runtime = 'nodejs';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  return NextResponse.json({ username: session.username });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const { currentPassword, newUsername, newPassword, confirmNewPassword } = (body ?? {}) as {
    currentPassword?: unknown;
    newUsername?: unknown;
    newPassword?: unknown;
    confirmNewPassword?: unknown;
  };

  if (typeof currentPassword !== 'string' || !currentPassword) {
    return NextResponse.json({ error: 'Current password is required.' }, { status: 400 });
  }
  if (newPassword !== undefined && newPassword !== confirmNewPassword) {
    return NextResponse.json({ error: 'New password and confirmation do not match.' }, { status: 400 });
  }

  const result = changeAdminCredentials(session.sub, {
    currentPassword,
    newUsername: typeof newUsername === 'string' ? newUsername : undefined,
    newPassword: typeof newPassword === 'string' && newPassword ? newPassword : undefined,
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  // The credential change already invalidated the token's pwv snapshot; clear the cookie too so
  // the browser doesn't hold on to a session that requireAdmin will reject on the very next call.
  await clearAdminSession();
  return NextResponse.json({ ok: true, requiresRelogin: true });
}
