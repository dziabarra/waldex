#!/usr/bin/env node
/**
 * One-shot: split the Master Colors plan-hali PNG (2 scenes stacked vertically)
 * into two JPGs, save into the case study folder.
 */
import sharp from 'sharp';
import { resolve } from 'node:path';

const src = resolve('zdjecia/wymiarowanie-master-colors/page-01.png');
const outDir = resolve('src/content/realizacje/pl/master-colors-plastpol-2025');

const meta = await sharp(src).metadata();
console.log(`source: ${meta.width}×${meta.height}`);

// PDF page is portrait A4: 2 scenes stacked. Crop top half + bottom half.
// A small overlap zone in the middle has no content (gutter); crop with a small inset.
const halfH = Math.floor(meta.height / 2);

// Trim white margins around the actual rendered scenes
async function cropAndSave(top, height, name, captionLabel) {
  const out = `${outDir}\\${name}`;
  // Extract band first; trim margins in a second pipeline so failures isolate.
  const buf = await sharp(src)
    .extract({ left: 0, top, width: meta.width, height })
    .png()
    .toBuffer();
  await sharp(buf)
    .trim({ threshold: 10 })
    .jpeg({ quality: 88 })
    .toFile(out);
  const o = await sharp(out).metadata();
  console.log(`  ${name} — ${o.width}×${o.height} (${captionLabel})`);
}

await cropAndSave(0, halfH, '00a-plan-hali-modul-2760x4000.jpg', 'moduł 2,76×2,76×4 m, branding EAS');
await cropAndSave(halfH, meta.height - halfH, '00b-plan-hali-stoisko-80m2.jpg', 'stoisko 8×10 m, wieża MORETTO');
