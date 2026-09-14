import type { APIRoute } from 'astro';
import { SITE } from '../config';

// Prerendered to a static /sitemap.xml at build time. Add new routes here as
// you build out the site.
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL(SITE.url);
  const paths = ['/', '/privacy/'];
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
