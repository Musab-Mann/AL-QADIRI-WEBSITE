// Renders a few soft smoke wisps once (SVG turbulence rasterized by sharp) so the hero can animate
// them with transform/opacity only. No runtime filters, canvas or WebGL.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images', 'hero');
mkdirSync(outDir, { recursive: true });

const wisps = [
  { seed: 3, freq: '0.010 0.024', scale: 150, rx: 95, ry: 330, blur: 16 },
  { seed: 11, freq: '0.013 0.030', scale: 190, rx: 80, ry: 360, blur: 20 },
  { seed: 27, freq: '0.008 0.020', scale: 130, rx: 120, ry: 300, blur: 24 },
];

for (const [index, w] of wisps.entries()) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="1024" viewBox="0 0 512 1024">
    <defs>
      <filter id="f" x="-60%" y="-30%" width="220%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="${w.freq}" numOctaves="4" seed="${w.seed}" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="${w.scale}" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="${w.blur}"/>
      </filter>
      <radialGradient id="g" cx="50%" cy="62%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
        <stop offset="55%" stop-color="#f4efe8" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <g filter="url(#f)">
      <ellipse cx="256" cy="600" rx="${w.rx}" ry="${w.ry}" fill="url(#g)"/>
    </g>
  </svg>`;
  const file = join(outDir, `smoke-${index + 1}.webp`);
  const info = await sharp(Buffer.from(svg)).webp({ quality: 78, alphaQuality: 80, effort: 6 }).toFile(file);
  console.log(`smoke-${index + 1}.webp: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
}
