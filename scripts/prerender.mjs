import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { resolveSiteUrl } from '../site.config.mjs';

const siteUrl = resolveSiteUrl();
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx');
  const template = await readFile('dist/index.html', 'utf8');
  const outlet = '<div id="root"></div>';
  if (!template.includes(outlet)) throw new Error('Static rendering outlet was not found.');
  const markup = render();
  if (!markup.includes('<h1') || !markup.includes('id="reality"')) {
    throw new Error('Static rendering did not produce the portfolio content.');
  }
  await writeFile('dist/index.html', template.replace(outlet, () => `<div id="root">${markup}</div>`));
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);
  const redirectPath = 'dist/khatran.github.io/index.html';
  const redirect = await readFile(redirectPath, 'utf8');
  await writeFile(redirectPath, redirect.replaceAll('https://khatran1012.github.io/', siteUrl));
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}</loc></url></urlset>\n`);
  console.log(`Prerendered portfolio: ${markup.length.toLocaleString()} characters at ${siteUrl}`);
} finally {
  await server.close();
}
