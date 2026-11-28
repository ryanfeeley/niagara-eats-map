import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

// Changing the URL when an asset changes prevents a cached script from running
// against newer markup. GitHub Pages caches these files for ten minutes.
const pageUrl = new URL('../index.html', import.meta.url);
const original = readFileSync(pageUrl, 'utf8');
let updated = original;
for (const asset of ['app.js', 'styles.css']) {
  const hash = createHash('sha256').update(readFileSync(new URL(`../${asset}`, import.meta.url))).digest('hex').slice(0, 12);
  const pattern = new RegExp(`(["'])\\./${asset.replace('.', '\\.')}([?][^"']*)?\\1`, 'g');
  if (!pattern.test(updated)) throw new Error(`Missing asset reference: ${asset}`);
  updated = updated.replace(pattern, `"./${asset}?v=${hash}"`);
}
if (process.argv.includes('--check')) {
  if (updated !== original) throw new Error('Asset versions are stale. Run node scripts/version-assets.mjs before publishing.');
  console.log('Asset versions match the current script and stylesheet.');
} else {
  writeFileSync(pageUrl, updated);
  console.log('Updated script and stylesheet versions.');
}
