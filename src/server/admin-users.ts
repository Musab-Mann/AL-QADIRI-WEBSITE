import { randomBytes } from 'node:crypto';
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { db, nowIso } from './db.ts';
import { hashPassword, verifyPassword, checkPasswordStrength } from './auth.ts';

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

let bootstrapped = false;

// Runs on the first real admin request, not when this module is imported: `next build` imports
// every route to collect its config, and two build workers racing to create the first account used
// to fail the build. Nothing here ever runs on the published public site, which has no dashboard.
function bootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;
  const row = db.prepare('SELECT COUNT(*) as n FROM admin_users').get() as { n: number };
  if (row.n > 0) return;

  const username = process.env.ADMIN_DEFAULT_USERNAME?.trim() || 'admin';
  let password = process.env.ADMIN_DEFAULT_PASSWORD;
  let generated = false;
  if (!password || checkPasswordStrength(password).valid === false) {
    password = randomBytes(9).toString('base64url');
    generated = true;
  }

  const now = nowIso();
  const created = db
    .prepare('INSERT OR IGNORE INTO admin_users (username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)')
    .run(username, hashPassword(password), now, now);
  if (created.changes === 0) return; // another process created it first

  if (generated) {
    // Never printed to the browser and never committed: written once to a gitignored file
    // (see .gitignore: `data/`) plus the server log, so the first login is possible without a
    // hardcoded password anywhere in source control.
    const message =
      `Al Qadri admin account created.\nUsername: ${username}\nPassword: ${password}\n` +
      'Log in at /admin/login, then change this password immediately from Admin Account settings.\n';
    console.warn(`\n=== ADMIN ACCOUNT CREATED ===\n${message}=============================\n`);
    try {
      writeFileSync(join(process.cwd(), 'data', 'INITIAL_ADMIN_CREDENTIALS.txt'), message, {
        flag: existsSync(join(process.cwd(), 'data', 'INITIAL_ADMIN_CREDENTIALS.txt')) ? 'a' : 'w',
      });
    } catch {
      // Non-fatal: the credentials are still in the server log above.
    }
  } else {
    console.warn(`\nAl Qadri admin account created from ADMIN_DEFAULT_USERNAME/ADMIN_DEFAULT_PASSWORD (username: ${username}).\n`);
  }
}

export function getAdminByUsername(username: string): AdminUser | undefined {
  bootstrap();
  return db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as AdminUser | undefined;
}

export function getAdminById(id: number): AdminUser | undefined {
  bootstrap();
  return db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id) as AdminUser | undefined;
}

export function verifyAdminCredentials(username: string, password: string): AdminUser | null {
  const user = getAdminByUsername(username);
  if (!user) {
    // Still run a hash to keep timing similar whether or not the username exists.
    hashPassword(password);
    return null;
  }
  return verifyPassword(password, user.password_hash) ? user : null;
}

export interface ChangeCredentialsResult {
  ok: boolean;
  error?: string;
}

export function changeAdminCredentials(
  id: number,
  opts: { currentPassword: string; newUsername?: string; newPassword?: string },
): ChangeCredentialsResult {
  const user = getAdminById(id);
  if (!user) return { ok: false, error: 'Account not found.' };
  if (!verifyPassword(opts.currentPassword, user.password_hash)) {
    return { ok: false, error: 'Current password is incorrect.' };
  }

  const nextUsername = opts.newUsername?.trim() || user.username;
  if (nextUsername !== user.username) {
    const existing = getAdminByUsername(nextUsername);
    if (existing && existing.id !== id) return { ok: false, error: 'That username is already in use.' };
  }

  let nextHash = user.password_hash;
  if (opts.newPassword) {
    const strength = checkPasswordStrength(opts.newPassword);
    if (!strength.valid) return { ok: false, error: strength.reason };
    nextHash = hashPassword(opts.newPassword);
  }

  db.prepare('UPDATE admin_users SET username = ?, password_hash = ?, updated_at = ? WHERE id = ?').run(
    nextUsername,
    nextHash,
    nowIso(),
    id,
  );
  return { ok: true };
}
