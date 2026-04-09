import { spawnSync } from 'node:child_process';
import { watch } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gamesDir = resolve(__dirname, '../src/data/games');
const generateScript = resolve(__dirname, './generate-index.mjs');

/** @type {NodeJS.Timeout | null} */
let timer = null;
let isGenerating = false;
let hasQueuedRun = false;

/** @param {string} reason */
function runGenerateIndex(reason) {
  if (isGenerating) {
    hasQueuedRun = true;
    return;
  }

  isGenerating = true;
  console.log(`[games-index] Regenerating index (${reason})...`);

  const result = spawnSync(process.execPath, [generateScript], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.error(`[games-index] Failed to regenerate index (exit ${result.status ?? 'unknown'}).`);
  }

  isGenerating = false;

  if (hasQueuedRun) {
    hasQueuedRun = false;
    runGenerateIndex('queued change');
  }
}

/** @param {string} reason */
function scheduleGenerate(reason) {
  if (timer !== null) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    timer = null;
    runGenerateIndex(reason);
  }, 150);
}

/** @param {string} filename */
function shouldHandleFile(filename) {
  return filename.endsWith('.json') && filename !== 'index.json';
}

runGenerateIndex('startup');
console.log(`[games-index] Watching ${gamesDir} for game JSON changes...`);

watch(gamesDir, (eventType, rawFilename) => {
  if (typeof rawFilename !== 'string') {
    return;
  }

  if (!shouldHandleFile(rawFilename)) {
    return;
  }

  scheduleGenerate(`${eventType}: ${rawFilename}`);
});
