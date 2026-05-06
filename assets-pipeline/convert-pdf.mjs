#!/usr/bin/env node
/**
 * Convert a PDF file to one PNG per page.
 * Used once for Master Colors plan hali — keeps page count in sync with input
 * so re-runs are idempotent.
 *
 * Usage: node assets-pipeline/convert-pdf.mjs <input.pdf> <output-prefix>
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
import { pdf } from 'pdf-to-img';

const [, , inputArg, outputPrefixArg] = process.argv;
if (!inputArg || !outputPrefixArg) {
  console.error('Usage: node convert-pdf.mjs <input.pdf> <output-prefix>');
  console.error('Example: node convert-pdf.mjs in.pdf src/content/.../page');
  process.exit(1);
}

const input = resolve(process.cwd(), inputArg);
const outputPrefix = resolve(process.cwd(), outputPrefixArg);
await mkdir(dirname(outputPrefix), { recursive: true });

const document = await pdf(input, { scale: 2 });
let i = 0;
for await (const image of document) {
  i++;
  const out = `${outputPrefix}-${String(i).padStart(2, '0')}.png`;
  await writeFile(out, image);
  console.log(`  ${basename(out)} — ${(image.length / 1024).toFixed(0)} KB`);
}
console.log(`Done. ${i} page(s) extracted.`);
