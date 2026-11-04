import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { runInNewContext } from 'node:vm';
import { resolveSiteUrl } from '../site.config.mjs';

// Check the actual deployment artifact, including Pages paths and static content.
const siteUrl = resolveSiteUrl();
const html = await readFile('dist/index.html', 'utf8');
assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'Expected one static H1.');
for (const content of ['Kha Tran', 'Trần Đình Kha', 'id="reality"', 'id="next"', 'Problem', 'Solution', 'Outcome']) {
  assert.ok(html.includes(content), `Missing static content: ${content}`);
}
assert.ok(!html.includes('<div id="root"></div>'), 'The portfolio must work without JavaScript.');
assert.ok(html.indexOf('id="reality"') < html.indexOf('id="system"'), 'Projects must precede the optional 3D experience.');

// Preserve the user's six-project selection even when the CV data grows.
const expectedProjectIds = [
  'theme-park-iot',
  'marina-bay-sands',
  'techcombank-portal',
  'nashtech-virtual-vietnam',
  'open-university-uk',
  'socotec-platform',
];
const projectArticles = [...html.matchAll(/<article\b[^>]*\bdata-cv-project="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
const renderedProjectIds = projectArticles.map(([, id]) => id);
assert.equal(renderedProjectIds.length, expectedProjectIds.length, 'Expected exactly six prerendered CV project articles.');
assert.equal(new Set(renderedProjectIds).size, renderedProjectIds.length, 'CV projects must not appear more than once.');
assert.deepEqual([...renderedProjectIds].sort(), [...expectedProjectIds].sort(), 'The project catalogue must preserve the selected projects and exclude ONESS, Shopify and Aoste.');
const projectChoices = [...html.matchAll(/<input\b[^>]*>/g)].map(([input]) => input)
  .filter(input => input.includes('type="radio"') && input.includes('name="reality-project"'));
assert.equal(projectChoices.length, expectedProjectIds.length, 'Every project must belong to the same six-choice radio showcase.');
const projectResponsibilities = new Map();
for (const [index, projectId] of expectedProjectIds.entries()) {
  const article = projectArticles.find(([, id]) => id === projectId)?.[0];
  assert.ok(article?.includes(`id="reality-project-${projectId}"`), `Missing showcase panel for ${projectId}.`);
  const choices = projectChoices.filter(input => input.includes(`aria-controls="reality-project-${projectId}"`));
  assert.equal(choices.length, 1, `${projectId} must have exactly one radio control targeting its panel.`);
  assert.ok(choices[0].includes(`id="reality-choice-${index}"`), `${projectId} has the wrong showcase selector target.`);
  const illustrations = [...article.matchAll(/<div\b[^>]*\bclass="([^"]*)"[^>]*>/g)]
    .filter(([, classes]) => classes.split(/\s+/).includes('reality-sculpture'));
  assert.equal(illustrations.length, 1, `${projectId} must include its own project illustration.`);
  assert.ok(illustrations[0][1].split(/\s+/).includes(`reality-sculpture-${index}`), `${projectId} has the wrong illustration edition.`);
  const details = [...article.matchAll(/<details\b[^>]*\bclass="([^"]*)"[^>]*>([\s\S]*?)<\/details>/g)]
    .filter(([, classes]) => classes.split(/\s+/).includes('reality-project-responsibilities'));
  assert.equal(details.length, 1, `${projectId} responsibilities must be available in native details without JavaScript.`);
  projectResponsibilities.set(projectId, details[0][2]);
}
assert.ok(!/\bid="more-projects"/.test(html), 'Projects must not be split into a separate archive section.');
assert.ok(!/\bclass="[^"]*\b(?:reality-project-archive|reality-archive-card)\b/.test(html), 'Separate project archive cards must not remain alongside the unified showcase.');
for (const [projectId, responsibilities] of [
  ['open-university-uk', ['Drupal', 'Moodle', 'WCAG']],
  ['socotec-platform', ['Fliplet', 'Umbraco']],
]) {
  const detail = projectResponsibilities.get(projectId);
  for (const responsibility of responsibilities) {
    assert.ok(detail.includes(responsibility), `${projectId} details are missing the CV responsibility: ${responsibility}`);
  }
}
console.log('Unified six-project showcase, radio targets, illustrations and CV responsibilities verified in static HTML.');

assert.ok(html.includes('data-exploring="false"'), 'The generated page must start with 3D disabled.');
assert.ok(!html.includes('<canvas'), 'WebGL must not mount in the initial HTML.');
assert.ok(!html.includes('__SITE_URL__'), 'Unresolved metadata placeholder.');
assert.ok(html.includes('src="/assets/'), 'The entry script must load from the domain root.');
assert.ok(!html.includes('/khatran.github.io/'), 'The main page must not retain the old project prefix.');
assert.ok(html.includes(`rel="canonical" href="${siteUrl}"`));
assert.ok(html.includes(`property="og:image" content="${siteUrl}og-preview.png"`));
const cvLinks = [...html.matchAll(/<a\b[^>]*href="[^\"]*Kha_Tran_Software_Engineer_CV\.pdf"[^>]*>/g)];
assert.ok(cvLinks.length >= 3, 'Expected CV links in navigation, hero and contact.');
for (const [link] of cvLinks) {
  assert.ok(link.includes('target="_blank"') && link.includes('rel="noopener noreferrer"') && !link.includes('download='), 'CV links must open safely without forcing a download.');
}
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(schema.url, siteUrl, 'JSON-LD must use the public canonical URL.');
assert.equal(schema.image, `${siteUrl}avatar.png`);
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const robots = await readFile('dist/robots.txt', 'utf8');
assert.ok(sitemap.includes(`<loc>${siteUrl}</loc>`));
assert.ok(robots.includes(`Sitemap: ${siteUrl}sitemap.xml`));
const redirect = await readFile('dist/khatran.github.io/index.html', 'utf8');
assert.ok(redirect.includes(`rel="canonical" href="${siteUrl}"`));
assert.ok(redirect.includes('destination.search = window.location.search') && redirect.includes('destination.hash = window.location.hash'), 'Legacy links must retain query strings and chapter fragments.');
const redirectScript = redirect.match(/<script>([\s\S]*?)<\/script>/)[1];
for (const oldAddress of [
  'https://khatran1012.github.io/khatran.github.io/?case=theme-park-iot#reality',
  'http://127.0.0.1:4173/khatran.github.io/index.html?utm_source=cv#system',
]) {
  const old = new URL(oldAddress);
  let destination;
  runInNewContext(redirectScript, { URL, window: { location: {
    href: old.href, search: old.search, hash: old.hash,
    replace: value => { destination = value; },
  } } });
  assert.equal(destination, `${old.origin}/${old.search}${old.hash}`, 'Old links must reach the new root on the same host.');
}
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const value = match[1];
  if (/^(?:https?:|mailto:|tel:|data:)/.test(value)) continue;
  const url = new URL(value, siteUrl);
  const base = new URL(siteUrl).pathname;
  assert.ok(url.pathname.startsWith(base), `Asset escapes Pages base: ${value}`);
  await access(`dist/${decodeURIComponent(url.pathname.slice(base.length))}`);
}
const assets = await readdir('dist/assets');
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const entry = Object.keys(manifest).find(key => manifest[key].isEntry && manifest[key].src === 'index.html');
assert.ok(entry, 'Vite did not produce an entry manifest.');
const initial = new Set();
function visit(key) {
  if (initial.has(key)) return;
  initial.add(key);
  for (const dependency of manifest[key].imports || []) visit(dependency);
}
visit(entry);
let initialGzip = 0;
for (const key of initial) {
  const chunk = manifest[key];
  assert.ok(!/DepthJourneyScene|GooeyImageTransition|three|ScrollTrigger/i.test(`${key} ${chunk.file}`), `Optional graphics leaked into the initial bundle: ${chunk.file}`);
  initialGzip += gzipSync(await readFile(`dist/${chunk.file}`)).length;
}
assert.ok(initialGzip <= 160 * 1024, `Initial JavaScript exceeds the 160 KiB gzip budget: ${initialGzip} bytes`);
console.log(`Initial JavaScript: ${(initialGzip / 1024).toFixed(1)} KiB gzip; graphics remain in dynamic chunks.`);
const css = (await Promise.all(assets.filter(file => file.endsWith('.css')).map(file => readFile(`dist/assets/${file}`, 'utf8')))).join('\n');
assert.ok(css.includes('plus-jakarta-sans-vietnamese.woff2'), 'Vietnamese font is missing.');
assert.ok(css.includes('unicode-range:'), 'Font subsets need explicit coverage.');
await access('dist/fonts/plus-jakarta-sans-vietnamese.woff2');
for (const subset of ['latin', 'vietnamese']) {
  const font = await readFile(`dist/fonts/plus-jakarta-sans-${subset}.woff2`);
  assert.equal(font.toString('ascii', 0, 4), 'wOF2', `Invalid ${subset} font file.`);
}
await access('dist/Kha_Tran_Software_Engineer_CV.pdf');
await access('dist/og-preview.png');
assert.equal(resolveSiteUrl({ GITHUB_REPOSITORY: 'khatran1012/khatran1012.github.io' }), 'https://khatran1012.github.io/');
assert.equal(resolveSiteUrl({}), 'https://khatran1012.github.io/');
assert.equal(resolveSiteUrl({ GITHUB_REPOSITORY: 'khatran1012/khatran.github.io' }), 'https://khatran1012.github.io/');
assert.equal(resolveSiteUrl({ VITE_SITE_URL: 'https://portfolio.example.com' }), 'https://portfolio.example.com/');
assert.throws(() => resolveSiteUrl({ VITE_SITE_URL: 'https://portfolio.example.com/project/' }), /domain root/);
console.log('Static HTML, root asset paths, metadata, local links and Vietnamese fonts verified.');
