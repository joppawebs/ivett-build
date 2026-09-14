# Astro + Cloudflare starter — setup

A custom Astro site deployed to Cloudflare Workers. This doc covers local
development, the contact-form stack, and what to configure per project so the
same process works on every site you build. For the quick "new project"
overview, see [README.md](README.md).

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
   - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - `POSTMARK_SERVER_TOKEN`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
   - `TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY`
4. **Push to `main`** — the [deploy workflow](.github/workflows/deploy.yml)
   builds the site, uploads the runtime secrets, and deploys the Worker.

That's it — same five env vars on every site, same form component, same Postmark
account. The web-design equivalent of "Fluent Forms + Postmark", in code.

## Per-site values

Everything else that changes per project (site name, domain, contact details,
nav, social links) lives in **`src/config.ts`**. Edit that one file, swap the
images in `/public`, and you're most of the way there.
