// Optimizes approved raw images from assets-source/ into /public as WebP, with one shared treatment
// (target crop, gentle grade, faint grain) so every photo reads as part of the same shoot.
// Usage: node scripts/optimize-images.mts <source file> <public path> <width> [ratio w:h] [focus x%,y%]
//   node scripts/optimize-images.mts assets-source/karahi.png images/hero/chicken-fresh-karahi-wide.webp 2400 16:9 60,50
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [source, target, widthArg, ratioArg, focusArg] = process.argv.slice(2);

if (!source || !target || !widthArg) {
  console.error('Usage: node scripts/optimize-images.mts <source> <public path> <width> [ratio w:h] [focus x%,y%]');
  process.exit(1);
}

const width = Number(widthArg);
const input = sharp(join(root, source)).rotate();
const meta = await input.metadata();
if (!meta.width || !meta.height) throw new Error(`Cannot read ${source}`);

// 1. crop to the target ratio around a focus point
let region = { left: 0, top: 0, width: meta.width, height: meta.height };
if (ratioArg) {
  const [rw, rh] = ratioArg.split(':').map(Number);
  const [fx, fy] = (focusArg ?? '50,50').split(',').map((v) => Number(v) / 100);
  const targetRatio = rw / rh;
  if (meta.width / meta.height > targetRatio) {
    const w = Math.round(meta.height * targetRatio);
    region = { left: Math.round(Math.min(Math.max(meta.width * fx - w / 2, 0), meta.width - w)), top: 0, width: w, height: meta.height };
  } else {
    const h = Math.round(meta.width / targetRatio);
    region = { left: 0, top: Math.round(Math.min(Math.max(meta.height * fy - h / 2, 0), meta.height - h)), width: meta.width, height: h };
  }
}

const outWidth = Math.min(width, region.width);
const outHeight = Math.round((region.height / region.width) * outWidth);

// 2. faint monochrome grain, identical recipe for every image
const grain = Buffer.alloc(outWidth * outHeight * 4);
let seed = 7;
for (let i = 0; i < grain.length; i += 4) {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  const v = seed / 4294967296 > 0.5 ? 255 : 0;
  grain[i] = v;
  grain[i + 1] = v;
  grain[i + 2] = v;
  grain[i + 3] = 7;
}

mkdirSync(dirname(join(root, 'public', target)), { recursive: true });

// 3. gentle shared grade: slightly lifted, very slightly warm, no sharpening
const info = await input
  .extract(region)
  .resize(outWidth, outHeight)
  .modulate({ brightness: 1.01, saturation: 0.97 })
  .linear([1.0, 0.995, 0.98], [2, 1, 0])
  .composite([{ input: grain, raw: { width: outWidth, height: outHeight, channels: 4 }, blend: 'soft-light' }])
  .webp({ quality: 80, effort: 6 })
  .toFile(join(root, 'public', target));

console.log(`${target}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
