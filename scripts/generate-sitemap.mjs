/**
 * Generates a sitemap.xml in the dist/playwithfriends/browser directory.
 * Run after `ng build`.
 */
import { readdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE_URL = 'https://playwithfriends.link';
const GAMES_DIR = join(ROOT, 'src', 'data', 'games');
const OUT_DIR = join(ROOT, 'dist', 'playwithfriends', 'browser');

const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/games', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
];

const files = await readdir(GAMES_DIR);
const slugs = files
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

const gameRoutes = slugs.map(slug => ({
  path: `/games/${slug}`,
  priority: '0.8',
  changefreq: 'monthly',
}));

const allRoutes = [...staticRoutes, ...gameRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

await writeFile(join(OUT_DIR, 'sitemap.xml'), xml, 'utf8');
console.log(`Sitemap written with ${allRoutes.length} URLs.`);
