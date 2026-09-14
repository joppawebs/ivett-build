/**
 * Per-site configuration.
 *
 * This deployment is a **client review site**: three homepage directions for
 * Ivett Design and Build, hosted on a Joppa Webs subdomain so the client can
 * compare them. It is deliberately noindex / robots-disallowed (see
 * src/pages/robots.txt.ts and the <meta name="robots"> in Layout.astro) —
 * it must never compete with ivettbuild.com in search.
 *
 * The three mockups:
 *   /           Mockup 1 — "Evolution"   (white, Public Sans)
 *   /mockup-2/  Mockup 2 — "Bold orange" (near-black, Bricolage Grotesque)
 *   /mockup-3/  Mockup 3 — "Slate"       (slate blue, Bricolage + JetBrains Mono)
 */
export const SITE = {
  /** Used in <title>s, the enquiry email subject and the review chrome. */
  name: 'Ivett Design and Build',
  /** Production origin, no trailing slash. */
  url: 'https://ivett.joppawebs.co.uk',
  title: 'Ivett Design and Build — homepage directions',
  description:
    'Three homepage directions for Ivett Design and Build, prepared by Joppa Webs. A private review site — not the live ivettbuild.com.',
  ogImage: '/og-image.png',
  locale: 'en-GB',
} as const;

/** Who built this, shown in the review chrome. */
export const AGENCY = {
  name: 'Joppa Webs',
  url: 'https://joppawebs.co.uk',
  email: 'info@joppawebs.co.uk',
} as const;

export const CONTACT = {
  /** Ivett's public address — shown inside the mockups. */
  email: 'info@ivettbuild.com',
  phone: '01252 967328',
} as const;

export const SOCIAL = {
  linkedin: '',
  instagram: 'https://www.instagram.com/ivettbuild',
  x: '',
} as const;

/** The three directions, in order. Drives the review switcher and the sitemap. */
export const MOCKUPS = [
  {
    n: 1,
    path: '/',
    name: 'Evolution',
    blurb:
      'Closest to the current site: white header, orange logo block and buttons, same section order.',
  },
  {
    n: 2,
    path: '/mockup-2/',
    name: 'Bold orange',
    blurb:
      'Same palette, more confident: near-black ground, solid orange proof and contact blocks, large display type.',
  },
  {
    n: 3,
    path: '/mockup-3/',
    name: 'Slate',
    blurb:
      'Off-piste: slate blue with orange as the only accent, and an interactive build-up panel using Ivett’s own section drawings.',
  },
] as const;
