/**
 * Generates src/data/games/index.json — an array of all game objects.
 *
 * Run this before `ng build`. Adding a new game is as simple as dropping a
 * JSON file into src/data/games/; no other files need to be touched.
 *
 * Usage: node scripts/generate-index.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gamesDir = resolve(__dirname, '../src/data/games');
const outputFile = join(gamesDir, 'index.json');

const games = readdirSync(gamesDir)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort()
  .map(f => JSON.parse(readFileSync(join(gamesDir, f), 'utf8')));

writeFileSync(outputFile, JSON.stringify(games, null, 2) + '\n');

console.log(`Generated ${outputFile} with ${games.length} games.`);
