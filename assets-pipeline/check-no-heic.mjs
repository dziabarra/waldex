#!/usr/bin/env node
/**
 * Prebuild guard: fail the build if any .heic file slipped into src/.
 * Astro can't decode HEIC, so it must be preconverted via convert-heic.mjs.
 */
import { readdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '..', 'src');

async function findHeic(dir) {
  const found = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await findHeic(full)));
    } else if (/\.heic$/i.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

const offenders = await findHeic(SRC);
if (offenders.length > 0) {
  console.error('HEIC files in src/ are not allowed (Astro cannot decode them).');
  console.error('Run: npm run assets:heic');
  console.error('Offending files:');
  for (const f of offenders) console.error('  -', f);
  process.exit(1);
}
