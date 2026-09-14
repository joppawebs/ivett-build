import type { APIRoute } from 'astro';
import { SITE, CONTACT } from '../../config';

// Runs on-demand as a Cloudflare Worker (not pre-rendered).
export const prerender = false;

/**
 * Reusable enquiry endpoint: validates input, checks a honeypot + Cloudflare
 * Turnstile, then sends the enquiry through Postmark's HTTP API.
 *
 * Portable across sites - the only things that change per project are the
 * environment variables:
 *   POSTMARK_SERVER_TOKEN   Postmark server API token
 *   CONTACT_TO_EMAIL        where enquiries are delivered
 *   CONTACT_FROM_EMAIL      a verified Postmark sender signature
 *   TURNSTILE_SECRET_KEY    Cloudflare Turnstile secret (server side)
 *   PUBLIC_TURNSTILE_SITE_KEY  (browser side, used by ContactForm.astro)
 */

// Cloudflare's documented "always passes" Turnstile test secret, used only as a
// dev fallback so the form works before real keys are configured.
const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';

interface Env {
  POSTMARK_SERVER_TOKEN?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

function getEnv(locals: App.Locals): Env {
  const runtimeEnv = (locals as { runtime?: { env?: Env } }).runtime?.env;
  // Fall back to import.meta.env for `astro dev` without the Cloudflare proxy.
  return { ...(import.meta.env as unknown as Env), ...runtimeEnv };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface TurnstileResult {
  success: boolean;
  codes: string[];
}

async function verifyTurnstile(token: string, secret: string, ip?: string): Promise<TurnstileResult> {
  if (!token) return { success: false, codes: ['missing-input-response'] };
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
    return { success: data.success === true, codes: data['error-codes'] ?? [] };
  } catch {
    return { success: false, codes: ['siteverify-request-failed'] };
  }
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const env = getEnv(locals);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, message: 'Invalid form submission.' }, 400);
  }

  const get = (key: string) => (form.get(key) ?? '').toString().trim();

  // Honeypot - a filled "company" field means a bot. Pretend success so the
  // bot doesn't learn it was caught; don't send anything.
  if (get('company')) {
    return json({ ok: true, message: 'Thanks - your message has been sent.' });
  }

  const name = get('name');
  const email = get('email');
  const need = get('need');
  const website = get('website');
  const message = get('message');

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Please enter your name.';
  if (!email) errors.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  if (message.length > 5000) errors.message = 'That message is a little long - please trim it.';

  if (Object.keys(errors).length > 0) {
    return json({ ok: false, errors, message: 'Please check the highlighted fields.' }, 422);
  }

  // Spam check.
  const turnstileSecret = env.TURNSTILE_SECRET_KEY ?? TURNSTILE_TEST_SECRET;
  const turnstileToken = get('cf-turnstile-response');
  const turnstile = await verifyTurnstile(turnstileToken, turnstileSecret, clientAddress);
  if (!turnstile.success) {
    // Surfaces in the Worker logs (observability is enabled in wrangler.jsonc).
    // Common codes: invalid-input-secret (wrong/mismatched secret),
    // invalid-input-response (bad/test token vs real secret),
    // timeout-or-duplicate (token expired or already used).
    console.error('Turnstile rejected:', turnstile.codes.join(', ') || 'no-codes');
    // An expired/reused token is the common, recoverable case - tell the user
    // to refresh rather than implying they did something wrong.
    const expired = turnstile.codes.includes('timeout-or-duplicate');
    return json(
      {
        ok: false,
        message: expired
          ? 'Your verification expired. Please refresh the page and send again.'
          : "Couldn't verify you're human. Please refresh the page and try again.",
      },
      400
    );
  }

  // Config required to actually send.
  const token = env.POSTMARK_SERVER_TOKEN;
  const to = env.CONTACT_TO_EMAIL;
  const from = env.CONTACT_FROM_EMAIL;
  if (!token || !to || !from) {
    console.error('Contact form misconfigured: missing Postmark env vars.');
    return json(
      { ok: false, message: `The form isn’t fully set up yet. Please email ${CONTACT.email}.` },
      500
    );
  }

  // `need` and `website` are optional: the forms on this site don't ask for
  // them, but the endpoint stays compatible with forms that do.
  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Email', email],
    ...(need ? ([['Need', need]] as Array<[string, string]>) : []),
    ...(website ? ([['Current website', website]] as Array<[string, string]>) : []),
    ['Message', message || '-'],
  ];

  const htmlBody = `
    <h2 style="font-family:Arial,sans-serif">New enquiry from ${SITE.name}</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#555"><strong>${label}</strong></td><td style="padding:6px 0">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`
        )
        .join('')}
    </table>`;

  const textBody = rows.map(([label, value]) => `${label}: ${value}`).join('\n');

  const postmarkRes = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': token,
    },
    body: JSON.stringify({
      From: from,
      To: to,
      ReplyTo: `${name} <${email}>`,
      Subject: `New enquiry - ${name}`,
      HtmlBody: htmlBody,
      TextBody: textBody,
      MessageStream: 'outbound',
    }),
  });

  if (!postmarkRes.ok) {
    const detail = await postmarkRes.text().catch(() => '');
    console.error('Postmark send failed:', postmarkRes.status, detail);
    return json(
      { ok: false, message: `We couldn’t send your message just now. Please email ${CONTACT.email}.` },
      502
    );
  }

  return json({
    ok: true,
    message: "Thanks - your message is on its way. We'll reply within one working day.",
  });
};
