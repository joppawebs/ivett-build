/**
 * Per-site configuration — the single source of truth for a new project.
 *
 * Spinning up a new client site: edit the values below, swap the images in
 * /public, set the deploy secrets (see README + SETUP.md), and push.
 *
 * Everything user-facing (SEO, header, footer, contact, structured data, the
 * sitemap and robots.txt) is driven from here.
 */
export const SITE = {
  /** Brand / business name, used in the logo, titles and structured data. */
  name: 'Starter Site',
  /** Production origin, no trailing slash. Used for canonical URLs + sitemap. */
  url: 'https://example.com',
  /** Default <title> and the og:title fallback. */
  title: 'Starter Site — a fast custom website',
  /** Default meta description / og:description. */
  description:
    'A fast, custom-built website starter. Replace this description in src/config.ts.',
  /** Social share image in /public (1200×630 recommended). */
  ogImage: '/og-image.png',
  /** <html lang>. */
  locale: 'en-GB',
} as const;

export const CONTACT = {
  /** Public contact email shown in the footer and error fallbacks. */
  email: 'hello@example.com',
  /** Public phone number (shown in the footer). Leave '' to hide. */
  phone: '',
} as const;

/** Social links — leave a value '' to omit it. */
export const SOCIAL = {
  linkedin: '',
  instagram: '',
  x: '',
} as const;

/** Primary header nav. Use root-relative or hash links. */
export const NAV: { label: string; href: string }[] = [
  { label: 'Services', href: '/#services' },
  { label: 'Contact', href: '/#contact' },
];

/** The main call-to-action shown in the header. */
export const CTA = {
  label: 'Get in touch',
  href: '/#contact',
} as const;
