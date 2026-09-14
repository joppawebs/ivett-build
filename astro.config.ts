// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { SITE } from './src/config';

// Pages are pre-rendered to static HTML (fast, cheap on Cloudflare's edge).
// Only routes that opt out with `export const prerender = false`
// (e.g. the contact form endpoint) run on-demand as a Cloudflare Worker.
export default defineConfig({
  site: SITE.url,
  output: 'static',
  adapter: cloudflare({
    platformProxy: { enabled: true },
    // Images are served via plain <img>; we never run them through Astro's
    // <Image>, so skip image processing (no sharp warning).
    imageService: 'passthrough',
  }),
});
