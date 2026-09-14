# Setup — the deployment and form stack

This site is deployed to Cloudflare Workers as `ivett-build`, on
`ivett.joppawebs.co.uk`. This doc covers local development, the contact-form
stack and the per-site values. For what the site actually is, see
[README.md](README.md).

> **On this deployment the form secrets are deliberately unset.** The form runs
> end to end and then reports that email isn't configured — correct behaviour
> for a mockup. Everything below is what to do when it needs to send for real.

## Stack

| Concern        | Tool                                            |
| -------------- | ----------------------------------------------- |
| Framework      | [Astro 5](https://astro.build) (static output)  |
| Hosting        | Cloudflare Workers (static assets + 1 function) |
| Contact form   | `ContactForm.astro` → `/api/contact`            |
| Email delivery | [Postmark](https://postmarkapp.com) HTTP API    |
| Spam           | Honeypot + [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) |

## Local development

```bash
npm install
cp .env.example .dev.vars   # fill in your keys (see below)
npm run dev                 # http://localhost:4321
npm run build               # production build into dist/
npm run preview             # serve the built Worker locally via wrangler
```

> The form works in dev **without** real keys: it falls back to Cloudflare's
> Turnstile test keys (always pass). Email sending needs a real Postmark token —
> without one, the endpoint returns a graceful "not set up yet" message.

## The contact form (reusable across sites)

Three pieces make up the portable stack — copy these into any new Astro site:

1. `src/components/ContactForm.astro` — the form + client-side submit/validation
2. `src/pages/api/contact.ts` — validates, checks Turnstile, sends via Postmark
3. `.env.example` — the five variables below

### Environment variables

| Variable                    | Where      | What                                            |
| --------------------------- | ---------- | ----------------------------------------------- |
| `POSTMARK_SERVER_TOKEN`     | server     | Postmark **Server** API token                   |
| `CONTACT_TO_EMAIL`          | server     | inbox that receives enquiries                    |
| `CONTACT_FROM_EMAIL`        | server     | a **verified** Postmark sender signature/domain |
| `TURNSTILE_SECRET_KEY`      | server     | Turnstile secret key                            |
| `PUBLIC_TURNSTILE_SITE_KEY` | **build**  | Turnstile site key (baked into client JS)       |

`PUBLIC_` is build-time (compiled into the browser bundle). The other four are
runtime Worker secrets.

## Per-site checklist (the repeatable process)

1. **Postmark** — create/choose a Server, grab its **Server API token**, and
   verify a **Sender Signature** (or domain) for `CONTACT_FROM_EMAIL`.
2. **Turnstile** — add a widget in the Cloudflare dashboard for the site's
   domain; copy the **site key** and **secret key**.
3. **GitHub repo → Settings → Secrets and variables → Actions**, add:
   - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — required to deploy at all
   - `POSTMARK_SERVER_TOKEN`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
   - `TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY`

   The deploy workflow uploads only the secrets that are set, so the site
   deploys fine with just the first two.
4. **Push to `main`** — the [deploy workflow](.github/workflows/deploy.yml)
   builds the site, uploads the runtime secrets, and deploys the Worker.

That's it — same five env vars on every site, same form component, same Postmark
account. The web-design equivalent of "Fluent Forms + Postmark", in code.

## Per-site values

Site name, domain and the list of directions live in **`src/config.ts`**.
Ivett's own content — copy, performance figures, systems, projects, images —
lives in **`src/data/ivett.ts`**, shared by all three mockups.

The Worker name is set in `wrangler.jsonc`, which also binds
`ivett.joppawebs.co.uk` as a custom domain. That requires `joppawebs.co.uk` to
be a zone on the same Cloudflare account; if it isn't, remove the `routes` block
and attach the domain from the Cloudflare dashboard.
