#!/usr/bin/env node
/**
 * Convert HEIC source files to web-friendly formats.
 * Uses `heic-convert` (pure JS) — works on Windows where libheif is unavailable.
 *
 * Usage:
 *   node assets-pipeline/convert-heic.mjs                   # converts all *.heic in `zdjecia/`
 *   node assets-pipeline/convert-heic.mjs <input> <outDir>  # explicit
 *
 * Output: <outDir>/<basename>.webp (q=82) + <outDir>/<basename>.jpg (q=90, master).
 * Idempotent — skips files whose .webp output already exists.
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const INPUT_DIR = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : join(ROOT, 'zdjecia');
const OUTPUT_DIR = process.argv[3]
  ? resolve(process.cwd(), process.argv[3])
  : join(ROOT, 'src', 'assets', 'images', '_unsorted');

async function findHeicFiles(dir) {
  const found = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await findHeicFiles(full)));
    } else if (/\.heic$/i.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

async function convertOne(input, outDir) {
  const base = basename(input, extname(input));
  const webpOut = join(outDir, `${base}.webp`);
  const jpgOut = join(outDir, `${base}.jpg`);

  if (existsSync(webpOut) && existsSync(jpgOut)) {
    console.log(`  skip   ${base} (already converted)`);
    return { skipped: true };
  }

  const buf = await readFile(input);

  // HEIC → JPG via pure-JS decoder (slow but Windows-friendly)
  const jpgBuffer = await heicConvert({
    buffer: buf,
    format: 'JPEG',
    quality: 0.92,
  });

  // JPG (master)
  await writeFile(jpgOut, jpgBuffer);

  // JPG → WEBP via sharp (fast, good compression)
  await sharp(jpgBuffer).webp({ quality: 82, effort: 5 }).toFile(webpOut);

  const stats = await stat(webpOut);
  console.log(
    `  ok     ${base} → .jpg + .webp (${(stats.size / 1024).toFixed(0)} KB)`,
  );
  return { skipped: false };
}

async function main() {
  console.log(`HEIC → WEBP/JPG conversion`);
  console.log(`  source: ${INPUT_DIR}`);
  console.log(`  target: ${OUTPUT_DIR}`);

  const files = await findHeicFiles(INPUT_DIR);
  if (files.length === 0) {
    console.log('No .heic files found. Nothing to do.');
    return;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  let converted = 0;
  let skipped = 0;
  for (const file of files) {
    try {
      const result = await convertOne(file, OUTPUT_DIR);
      if (result.skipped) skipped++;
      else converted++;
    } catch (err) {
      console.error(`  FAIL   ${basename(file)}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  console.log(`\nDone. converted=${converted}, skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
