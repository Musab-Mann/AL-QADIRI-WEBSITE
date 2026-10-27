import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = {
  'image/jpeg': { ext: 'jpg', magic: [0xff, 0xd8, 0xff] },
  'image/png': { ext: 'png', magic: [0x89, 0x50, 0x4e, 0x47] },
  'image/webp': { ext: 'webp', magic: [0x52, 0x49, 0x46, 0x46] }, // "RIFF"; real WEBP tag checked below
} as const;

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'menu');

export class UploadError extends Error {}

function matchesMagic(bytes: Uint8Array, magic: readonly number[]): boolean {
  return magic.every((byte, index) => bytes[index] === byte);
}

/**
 * Validates a menu item image and writes it under public/uploads/menu with a random filename.
 * The original filename is never trusted or used for the path. Both the declared MIME type and
 * the file's own magic bytes must agree with an allow-listed image format, so a script renamed
 * to look like a .jpg is rejected rather than stored.
 */
export async function saveMenuItemImage(file: File): Promise<string> {
  if (!(file instanceof File)) throw new UploadError('No file was uploaded.');
  if (file.size === 0) throw new UploadError('The uploaded file is empty.');
  if (file.size > MAX_BYTES) throw new UploadError('Images must be 5MB or smaller.');

  const declared = file.type as keyof typeof ALLOWED;
  const allowed = ALLOWED[declared];
  if (!allowed) throw new UploadError('Only JPG, PNG or WEBP images are allowed.');

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesMagic(buffer, allowed.magic)) {
    throw new UploadError('The file does not look like a valid image of the declared type.');
  }
  if (declared === 'image/webp') {
    const riff = buffer.subarray(8, 12).toString('ascii');
    if (riff !== 'WEBP') throw new UploadError('The file does not look like a valid WEBP image.');
  }

  mkdirSync(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${allowed.ext}`;
  writeFileSync(join(UPLOAD_DIR, filename), buffer, { mode: 0o644 });
  return `/uploads/menu/${filename}`;
}
