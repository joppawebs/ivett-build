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
    // Every page here is prerendered, so images are resized and converted to
    // WebP by sharp at build time and served as plain static files. No image
    // work — and no image cost — at runtime.
    imageService: 'compile',
  }),
});
