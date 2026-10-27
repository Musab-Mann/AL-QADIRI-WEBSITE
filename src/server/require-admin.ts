import { cookies } from 'next/headers';
import { SESSION_COOKIE, signSession, verifySession, type SessionPayload } from './auth.ts';
import { getAdminById, type AdminUser } from './admin-users.ts';

const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export async function createAdminSession(user: AdminUser): Promise<void> {
  const token = signSession(
    { sub: user.id, username: user.username, pwv: Date.parse(user.updated_at) },
    SESSION_TTL_SECONDS,
  );
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

// Every admin API route calls this itself. Middleware also blocks unauthenticated requests to
// /admin and /api/admin earlier, but route handlers never rely on that alone (rule: "Do not rely
// only on hiding the admin page from the navigation" / API security must be enforced server-side
// on every protected action).
export async function requireAdmin(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const payload = verifySession(token);
  if (!payload) return null;
  const user = getAdminById(payload.sub);
  if (!user) return null;
  // A password or username change bumps updated_at, which invalidates every session token
  // issued before the change (see SessionPayload.pwv), instead of leaving old tokens valid
  // until their natural expiry.
  if (Date.parse(user.updated_at) !== payload.pwv) return null;
  return payload;
}
