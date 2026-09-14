import type { APIRoute } from 'astro';

/**
 * This is a private client review site carrying the client's own content.
 * Letting it be crawled would put a duplicate of ivettbuild.com's copy on a
 * different domain, competing with the pages that carry their rankings — so
 * everything is disallowed here, and every page also sends `noindex` (see
 * src/layouts/Layout.astro). The real site would ship the usual Allow + sitemap.
 */
export const GET: APIRoute = () => {
  const body = `User-agent: *\nDisallow: /\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
