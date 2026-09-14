import type { APIRoute } from 'astro';
import { SITE, MOCKUPS } from '../config';

/**
 * Prerendered to a static /sitemap.xml. Kept wired up so the mechanism is in
 * place for the real build; note that robots.txt disallows this preview and
 * doesn't advertise it, because a review site should not be crawled.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL(SITE.url);
  const paths = [...MOCKUPS.map((m) => m.path), '/privacy/'];
  const urls = paths
    .map((p) => `  <url><loc>${new URL(p, base).href}</loc></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
