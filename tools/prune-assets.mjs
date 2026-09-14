/**
 * Post-build: drop image files in dist/ that nothing references.
 *
 * With `imageService: 'compile'` the Cloudflare adapter emits each imported
 * source image into dist/_astro/ as well as the resized WebP variants that the
 * pages actually use. Every route here is prerendered, so those originals are
 * never requested — they're just ~16 MB of deploy. This removes any image that
 * no built HTML, CSS or JS points at, and leaves everything else alone.
 *
 * Run by `npm run build`. It prints what it removed so a surprise is visible.
 */
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const DIST = 'dist';
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const TEXT_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt']);

/** Every file under `dir`, recursively, as paths relative to the process cwd. */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}

const files = await walk(DIST);

// Collect the text of everything a browser could be served. The generated
// Worker is skipped deliberately: its manifest lists every asset Astro knows
// about, used or not, so counting it would mean pruning nothing. The Worker
// serves no images itself — the only on-demand route is the form endpoint —
// and public/.assetsignore keeps _worker.js out of the uploaded assets anyway.
const referenced = new Set();
for (const file of files) {
  if (relative(DIST, file).startsWith('_worker.js')) continue;
  if (!TEXT_EXT.has(extname(file))) continue;
  const text = await readFile(file, 'utf8');
  for (const match of text.matchAll(/[\w@./-]+\.(?:jpg|jpeg|png|webp|avif|gif)/gi)) {
    // Store by basename: the same file is referenced by several path shapes
    // (/_astro/x.hash.webp, ./x.hash.webp) and the name alone is unambiguous
    // because Astro's asset names are content-hashed.
    referenced.add(match[0].split('/').pop());
  }
}

let removed = 0;
let bytes = 0;
for (const file of files) {
  if (!IMAGE_EXT.has(extname(file))) continue;
  // Only ever touch generated assets; files copied from public/ are the
  // author's and may be referenced from outside the build (og:image, favicons).
  if (!relative(DIST, file).startsWith('_astro')) continue;
  if (referenced.has(file.split('/').pop())) continue;
  bytes += (await stat(file)).size;
  await unlink(file);
  removed += 1;
}

if (removed > 0) {
  console.log(
    `prune-assets: removed ${removed} unreferenced image${removed === 1 ? '' : 's'} ` +
      `(${(bytes / 1024 / 1024).toFixed(1)} MB)`
  );
} else {
  console.log('prune-assets: nothing to remove');
}
