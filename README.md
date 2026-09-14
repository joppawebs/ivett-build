# astro-cloudflare-starter

A barebones [Astro](https://astro.build) starter deployed to **Cloudflare
Workers**, with the reusable engine already wired up:

- ⚡ Static-first Astro + Cloudflare adapter (one Worker function for the form)
- 📨 Contact form: honeypot + [Turnstile](https://developers.cloudflare.com/turnstile/) + [Postmark](https://postmarkapp.com)
- 🎬 Lightweight motion toolkit (GSAP + a WebGL hero), reduced-motion & no-JS safe
- 🔎 SEO scaffolding: canonical/OG/Twitter meta, JSON-LD, dynamic `sitemap.xml` + `robots.txt`
- 🔒 Security headers (`public/_headers`) and immutable asset caching
- 🚀 GitHub Actions → Cloudflare deploy (uploads runtime secrets on each deploy)
- 🔤 Self-hosted, metric-matched fonts (no layout shift)

It ships intentionally **bare**: a Header, a Hero, a Contact section and a
Footer — all driven from one config file. Add (or prompt an AI to add) the
sections each client needs.

## Starting a new project from this template

This template is built to run **fully inside a Docker dev container on a native
Docker volume** (ext4/overlay), not on a bind-mounted host folder. On Windows the
host folder is a slow 9p filesystem that breaks Astro's HMR / file-watching — the
container-volume workflow avoids it entirely.

> **Clone into a volume, not a plain clone.** A plain `git clone` on the host
> puts the code on the slow filesystem. Use the command below instead.

1. **"Use this template" → Create a new repository** (private) on GitHub.
2. In VS Code, run **`Dev Containers: Clone Repository in Container Volume…`**
   (Command Palette, `F1`) and pick your new repo. VS Code creates a named Docker
   volume, clones into `/workspaces/<repo-name>`, and builds the container from
   [.devcontainer/Dockerfile](.devcontainer/Dockerfile). It manages the mount
   itself — there is deliberately **no `workspaceMount` bind** in
   [devcontainer.json](.devcontainer/devcontainer.json).
3. **Make the per-project edits** (all clearly marked in-file):
   | File | Edit | Required? |
   | --- | --- | --- |
   | [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json) | `workspaceFolder` → `/workspaces/<your-repo-name>` (the only per-clone container edit) | **Yes** |
   | [package.json](package.json) | `"name"` → your project name | recommended |
   | [.devcontainer/init-firewall.sh](.devcontainer/init-firewall.sh) | delete the **OPTIONAL** Cloudflare lines if you don't deploy to Cloudflare; add any API hosts your project calls | optional |
   | [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json) | delete the **OPTIONAL** `CLOUDFLARE_API_TOKEN` env line if unused | optional |
4. **Rebuild if you edited devcontainer files**: `Dev Containers: Rebuild Container`.
5. **Install and run:**
   ```bash
   npm install
   cp .env.example .dev.vars   # add keys later; the form works without them in dev
   npm run dev                 # astro dev --host → forwarded to http://localhost:4321
   ```
6. **Verify you're on the fast path:**
   ```bash
   df -T /workspaces/<your-repo-name>
   ```
   The `Type` column must read **`ext4`** (or `overlay`), **not `9p`**. Then edit a
   file and confirm the browser hot-reloads on save — if HMR works, file-watching
   is healthy.

### Reopening the project later

The code lives in the Docker volume, not a host folder, so reopen it via:
- **`Dev Containers: Open Recent…`**, or
- the **Remote Explorer** sidebar → **Dev Volumes** → your volume → open.

## Create a new site

1. Complete the container-volume setup above, then:
   ```bash
   npm install
   cp .env.example .dev.vars   # add keys later; the form works without them in dev
   npm run dev                 # http://localhost:4321
   ```
2. **Edit `src/config.ts`** — site name, domain, contact details, nav, social.
3. **Swap the images** in `/public` (replace `og-image.png`; add your own).
4. **Build out the page** — add sections to `src/pages/index.astro` (or ask
   Claude to generate them for the client).
5. **Set up services + deploy** — follow [SETUP.md](SETUP.md): create a
   Cloudflare Worker project + Turnstile widget + Postmark sender, add the 7
   GitHub Actions secrets, update `wrangler.jsonc` `name`, then push to `main`.

## Project layout

```
src/
  config.ts            ← per-site settings (edit this first)
  layouts/Layout.astro ← <head>, SEO meta, JSON-LD slot, font preloads
  components/          ← Header, Hero, Contact, ContactForm, Footer, HeroCanvas
  pages/
    index.astro        ← the (lean) homepage
    privacy.astro      ← privacy scaffold (replace the placeholder copy)
    404 / success      ← styled error + form thank-you pages
    api/contact.ts     ← the contact-form Worker endpoint
    sitemap.xml.ts      ← dynamic sitemap
    robots.txt.ts      ← dynamic robots
  scripts/motion.ts    ← the motion toolkit
  styles/global.css    ← design tokens + base styles
public/                ← fonts, _headers, .assetsignore, og-image.png
```

## Motion toolkit

Opt any element in with a data attribute (all off under `prefers-reduced-motion`):

| Attribute | Effect |
| --- | --- |
| `data-reveal` | fade + slide up when scrolled into view |
| `data-count="100"` (`data-decimals="1"`) | count up to the number |
| `data-magnetic` | subtle magnetic pull toward the cursor |
| `data-parallax="-12"` | scroll-scrub parallax (value = % travel) |
| `data-card-cursor="View project"` | a label that follows the cursor over the element |

The hero copy animates in automatically, and a scroll-progress bar is added on
load. The WebGL hero gradient runs on desktop only and pauses off-screen.

## Commands

```bash
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # build + serve via wrangler (closest to production)
```

## Notes

- Fonts (Bricolage Grotesque, Figtree, IBM Plex Mono, Instrument Serif) are
  open-source (OFL) and self-hosted in `/public/fonts`.
- The deploy targets Cloudflare **Workers** (static assets + the form function),
  not Pages. See `wrangler.jsonc` and `.github/workflows/deploy.yml`.
