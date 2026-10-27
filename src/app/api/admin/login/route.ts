import { NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/server/admin-users.ts';
import { createAdminSession } from '@/server/require-admin.ts';

export const runtime = 'nodejs';

// Simple in-memory throttle per process: slows brute-force attempts against the login route
// without needing an external rate-limit store. Resets on server restart, which is an accepted
// trade-off for a single-instance restaurant deployment.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const { username, password } = (body ?? {}) as { username?: unknown; password?: unknown };
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'local';
  if (tooManyAttempts(`${ip}:${username.toLowerCase()}`)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
  }

  const user = verifyAdminCredentials(username, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  }

  await createAdminSession(user);
  return NextResponse.json({ ok: true, username: user.username });
}
