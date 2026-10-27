// Password hashing and session-token signing for the admin dashboard.
// No JWT/bcrypt dependency is added (this container cannot reach npm); everything here is
// built from Node's built-in `node:crypto`, which already ships scrypt (a memory-hard KDF,
// the same family as Argon2/bcrypt in intent) and HMAC.
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'node:crypto';

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, nStr, rStr, pStr, saltHex, hashHex] = parts;
  try {
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');
    const actual = scryptSync(password, salt, expected.length, {
      N: Number(nStr),
      r: Number(rStr),
      p: Number(pStr),
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export interface PasswordCheck {
  valid: boolean;
  reason?: string;
}

export function checkPasswordStrength(password: string): PasswordCheck {
  if (password.length < 10) return { valid: false, reason: 'Password must be at least 10 characters.' };
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain letters and numbers.' };
  }
  return { valid: true };
}

// --- Session tokens -------------------------------------------------------
// A session token is base64url(payload) + "." + base64url(HMAC-SHA256(payload)).
// It is stateless (no server-side session store needed) but still fully revocable: changing
// ADMIN_SESSION_SECRET, or the password-change routine bumping the user's `updated_at`
// (checked against the token's issued-at time), invalidates every existing token at once.

export interface SessionPayload {
  sub: number;
  username: string;
  /** Snapshot of the admin row's updated_at (as epoch ms) at the time this token was issued.
   *  Any later credential change bumps updated_at, which invalidates every token issued before
   *  the change the next time it is verified - without needing a server-side session store. */
  pwv: number;
  iat: number;
  exp: number;
}

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      'ADMIN_SESSION_SECRET is not set (or is too short). Set a long random value in your environment before starting the server.',
    );
  }
  return value;
}

function base64url(input: Buffer): string {
  return input.toString('base64url');
}

export function signSession(payload: Omit<SessionPayload, 'iat' | 'exp'>, ttlSeconds = 60 * 60 * 8): string {
  const iat = Math.floor(Date.now() / 1000);
  const full: SessionPayload = { ...payload, iat, exp: iat + ttlSeconds };
  const body = base64url(Buffer.from(JSON.stringify(full)));
  const mac = base64url(createHmac('sha256', secret()).update(body).digest());
  return `${body}.${mac}`;
}

export function verifySession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const dot = token.indexOf('.');
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expectedMac = base64url(createHmac('sha256', secret()).update(body).digest());
  const macBuf = Buffer.from(mac);
  const expectedBuf = Buffer.from(expectedMac);
  if (macBuf.length !== expectedBuf.length || !timingSafeEqual(macBuf, expectedBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = 'alqadri_admin_session';
