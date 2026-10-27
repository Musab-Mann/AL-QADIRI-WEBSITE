import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync } from 'node:crypto';

const db = new DatabaseSync('./data/al-qadri.db');

const username = 'AlQADRI';
const password = 'MusabAdmin2026';

const N = 16384;
const r = 8;
const p = 1;
const KEY_LEN = 64;

const salt = randomBytes(16);
const hash = scryptSync(password, salt, KEY_LEN, { N, r, p });

const passwordHash =
  `scrypt$${N}$${r}$${p}$${salt.toString('hex')}$${hash.toString('hex')}`;

const result = db.prepare(`
  UPDATE admin_users
  SET password_hash = ?, updated_at = ?
  WHERE username = ?
`).run(passwordHash, new Date().toISOString(), username);

if (result.changes === 0) {
  console.log('ERROR: admin user was not found.');
  process.exit(1);
}

console.log('SUCCESS: Admin password has been reset.');
console.log('Username: admin');
console.log('Password: MusabAdmin2026');

db.close();
