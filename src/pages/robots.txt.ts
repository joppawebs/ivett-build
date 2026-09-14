import type { APIRoute } from 'astro';
import { SITE } from '../config';

// Prerendered to a static /robots.txt — the sitemap URL stays in sync with
// the site origin automatically.
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE.url)).href.replace(/\/$/, '');
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
