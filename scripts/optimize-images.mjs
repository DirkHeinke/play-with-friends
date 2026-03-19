/**
 * Resizes and converts game images to WebP for deployment.
 *
 * Source:  public/images/originals/<slug>.<ext>  (committed to repo)
 * Output:  public/images/<slug>.webp             (gitignored, generated at build time)
 *
 * Usage:   node scripts/optimize-images.mjs
 *
 * Options (env vars):
 *   WIDTH   Target width in pixels (default: 800)
 *   QUALITY WebP quality 1–100  (default: 82)
 */

import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ORIGINALS_DIR = join(ROOT, 'public', 'images', 'originals');
const OUTPUT_DIR = join(ROOT, 'public', 'images');
const WIDTH = parseInt(process.env.WIDTH ?? '800', 10);
const QUALITY = parseInt(process.env.QUALITY ?? '82', 10);

mkdirSync(OUTPUT_DIR, { recursive: true });

const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.tiff']);

async function main() {
  let files;
  try {
    files = readdirSync(ORIGINALS_DIR).filter(f => SUPPORTED_EXTS.has(extname(f).toLowerCase()));
  } catch {
    console.error(`Originals directory not found: ${ORIGINALS_DIR}`);
    console.error('Run "node scripts/download-images.mjs" first.');
    process.exit(1);
  }

  if (files.length === 0) {
    console.warn('No image files found in originals directory.');
    return;
  }

  console.log(`Optimizing ${files.length} images → ${WIDTH}px WebP (quality ${QUALITY})...\n`);

  let ok = 0;
  let failed = 0;

  await Promise.all(
    files.map(async (file) => {
      const slug = basename(file, extname(file));
      const inputPath = join(ORIGINALS_DIR, file);
      const outputPath = join(OUTPUT_DIR, `${slug}.webp`);

      try {
        const info = await sharp(inputPath)
          .resize({ width: WIDTH, withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(outputPath);

        const kbIn = Math.round((await import('fs')).statSync(inputPath).size / 1024);
        const kbOut = Math.round(info.size / 1024);
        const pct = Math.round((1 - kbOut / kbIn) * 100);
        console.log(`  ✓ ${slug}.webp  ${kbIn}kB → ${kbOut}kB (${pct > 0 ? '-' : '+'}${Math.abs(pct)}%)`);
        ok++;
      } catch (err) {
        console.error(`  ✗ ${slug}: ${err.message}`);
        failed++;
      }
    })
  );

  console.log(`\nDone. Optimized: ${ok}, Failed: ${failed}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
