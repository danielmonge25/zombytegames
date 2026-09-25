/**
 * Build step 3/3: turns every route into a static HTML file.
 *   dist/index.html, dist/games/index.html, dist/games/bloodcast/index.html, …
 * plus dist/404.html and dist/sitemap.xml.
 * Static HTML = fast first paint, working direct links on GitHub Pages,
 * and real content for search engines and social previews.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('dist/index.html is missing the <!--app-head--> / <!--app-html--> placeholders');
}

const { render, prerenderPaths, SITE_URL } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

function writePage(url, file) {
  const { html, head } = render(url);
  const out = template
    .replace('<!--app-head-->', head)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-route="${url}">${html}</div>`);
  const target = path.join(dist, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, out);
}

const routes = prerenderPaths();
for (const url of routes) {
  const file = url === '/' ? 'index.html' : path.join(url.replace(/^\/|\/$/g, ''), 'index.html');
  writePage(url, file);
  console.log(`  prerendered ${url}`);
}
writePage('/404', '404.html');
console.log('  prerendered /404.html');

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((u) => `  <url>\n    <loc>${SITE_URL}${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
console.log(`  wrote sitemap.xml (${routes.length} URLs)`);

fs.rmSync(ssrDir, { recursive: true, force: true });
