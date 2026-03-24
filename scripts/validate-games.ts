/**
 * Validates every game JSON file in src/data/games/ against the Zod schema
 * defined in src/app/models/game.schema.ts.
 *
 * Run before building to catch schema errors introduced by new game files:
 *   npm run validate
 *
 * Exits with code 1 and prints all errors if any file is invalid.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameSchema } from '../src/app/models/game.schema';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gamesDir = resolve(__dirname, '../src/data/games');

const files = readdirSync(gamesDir)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort();

if (files.length === 0) {
  console.error('No game JSON files found in src/data/games/');
  process.exit(1);
}

let totalErrors = 0;

for (const file of files) {
  const filePath = join(gamesDir, file);
  const expectedSlug = file.replace(/\.json$/, '');

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`✗ ${file}: invalid JSON — ${(err as Error).message}`);
    totalErrors++;
    continue;
  }

  const result = GameSchema.safeParse(raw);

  if (!result.success) {
    console.error(`✗ ${file}:`);
    for (const issue of result.error.issues) {
      const path = issue.path.length > 0 ? issue.path.join('.') + ': ' : '';
      console.error(`    ${path}${issue.message}`);
    }
    totalErrors += result.error.issues.length;
    continue;
  }

  // Check slug matches filename (not expressible as a pure Zod constraint)
  if (result.data.slug !== expectedSlug) {
    console.error(`✗ ${file}:`);
    console.error(`    slug: "${result.data.slug}" does not match filename "${expectedSlug}.json"`);
    totalErrors++;
  }
}

if (totalErrors > 0) {
  console.error(`\nValidation failed: ${totalErrors} error(s) across ${files.length} game(s).`);
  process.exit(1);
}

console.log(`✓ All ${files.length} game(s) passed validation.`);
