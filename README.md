# ivett-build

Three homepage directions for **Ivett Design and Build**, built as real pages so
the client can judge them at full speed rather than from a flat image.

Live at **https://ivett.joppawebs.co.uk** — a private review site, not
ivettbuild.com. Every page sends `noindex, nofollow` and `robots.txt` disallows
everything (see [Indexing](#indexing) below — this matters).

| Route | Direction | Look |
| --- | --- | --- |
| `/` | **1 — Evolution** | Closest to the current site: white header, the orange logo block, orange buttons, same section order. Public Sans. |
| `/mockup-2/` | **2 — Bold orange** | Same palette, more confident: near-black ground, a solid orange band for the figures, large display type. Bricolage Grotesque. |
| `/mockup-3/` | **3 — Slate** | Furthest out: slate blue with orange as the only accent, and an interactive build-up panel driven by Ivett's own section drawings. Bricolage Grotesque + JetBrains Mono. |

A small fixed bar at the bottom of each page moves between the three. It's
system-font and monochrome so it never reads as part of a design, and it can be
dismissed (the choice sticks for the tab).

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static build into dist/
npm run preview  # build + serve the Worker locally via wrangler
```

## How it's put together

```
src/
  config.ts              site + the three directions (drives the switcher and sitemap)
  data/ivett.ts          all Ivett content — copy, figures, systems, projects, images
  layouts/Layout.astro   <head>, SEO, per-page font preloads, the noindex tag
  components/
    SiteHeader.astro     one header, three skins; behaviour from scripts/nav.ts
    SiteFooter.astro     one footer, three skins
    HeroVideo.astro      poster-first hero video, deferred past load
    ContactForm.astro    the enquiry form (Turnstile + Postmark)
    MockupSwitcher.astro the review bar
  pages/
    index.astro          direction 1  ┐ each page holds its own markup and
    mockup-2.astro       direction 2  │ styles, so one can be changed without
    mockup-3.astro       direction 3  ┘ touching the other two
    404 / success / privacy           review chrome, not any one design
    api/contact.ts       the form endpoint (the only non-static route)
  scripts/nav.ts         dropdowns + mobile menu, data-attribute driven
  styles/global.css      fonts, reset, review chrome, form states
tools/prune-assets.mjs   post-build: drops images nothing references
design-brief/            the original .dc.html mockups and source material (not deployed)
```

The three pages share their content but not their CSS. `data/ivett.ts` holds the
copy and figures once; each page file holds its own layout and look. That's
deliberate — the point of the exercise is to change one direction without
disturbing the others.

## Notes on the build

- **No third-party requests except Turnstile.** Fonts are self-hosted and
  subset, with metric-matched fallbacks (computed with `@capsizecss/metrics`) so
  nothing shifts when they swap in.
- **Images** are resized and converted to WebP by sharp at build time, with
  `srcset`/`sizes` per use. `tools/prune-assets.mjs` then deletes the source
  originals Astro emits but never links to — about 16 MB a build.
- **The hero video** shows an optimised poster frame immediately and only
  fetches the 8 MB file after `load`. Under `prefers-reduced-motion` it isn't
  fetched at all, and the poster stands in.
- **JavaScript is ~2–5 KB a page**, all first-party: nav, the scan slideshow on
  direction 1, the build-up panel on direction 3, the review bar.
- Everything works with JS off — submenus stay closed, the default build-up
  layer is the one on show, and every link is a real anchor.

## The enquiry form

The real stack — honeypot + Cloudflare Turnstile + Postmark, `ContactForm.astro`
→ `src/pages/api/contact.ts`. All three directions style the same component.

**No secrets are set on this deployment, on purpose.** A submission validates,
passes Turnstile's test key and reaches the endpoint, which then replies that
email isn't configured. That's the intended state for a mockup: it proves the
path without sending anything. To make it send for real, set the five variables
in [SETUP.md](SETUP.md).

## Indexing

This site carries the client's own copy on a different domain. If it were
crawlable it would compete with the pages at ivettbuild.com that hold their
rankings. So:

- every page sends `<meta name="robots" content="noindex, nofollow">`
  (src/layouts/Layout.astro)
- `robots.txt` is `Disallow: /` (src/pages/robots.txt.ts)

Both need reversing when this becomes a real site. `sitemap.xml` is still
generated and still correct — it just isn't advertised.

## Deploying

Pushing to `main` builds and deploys the Worker
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)). `wrangler.jsonc`
binds `ivett.joppawebs.co.uk` as a custom domain, which needs `joppawebs.co.uk`
to be a zone on the same Cloudflare account — if it isn't, delete the `routes`
block and attach the domain from the dashboard instead.

Required GitHub Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
The five contact-form secrets are optional and currently unset (see above).

## What's still open

Carried over from the design brief, and flagged in grey inside the mockups:

- **Construction & project management** has no real copy — the live site
  duplicates the 3D-modelling text there.
- The Charters Yard client quote, the project count since 2018, the Loughborough
  report and the floor span/load table are all still to come from the client.
