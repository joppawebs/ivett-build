// Generic, attribute-driven motion toolkit (GSAP + ScrollTrigger).
//
// All entrance animations use gsap.from()/gsap.set(), so the *natural* DOM
// state is the finished, fully-visible state — the page is complete with no JS,
// and we bail out entirely under prefers-reduced-motion without hiding anything.
//
// Opt elements in with data attributes:
//   data-reveal                fade + slide up when scrolled into view
//   data-count="100"           count up to the number (data-decimals="1" for 5.0)
//   data-magnetic              subtle magnetic pull toward the cursor (fine pointer)
//   data-parallax="-12"        scroll-scrub parallax, value = yPercent travel
//   data-card-cursor="View"    a label that follows the cursor while hovering it
// Plus an automatic hero entrance and a scroll-progress bar.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = () => window.matchMedia('(pointer: fine)').matches;

/** Hero copy eases in on first paint. The h1 is left out — it's the LCP. */
function heroEntrance() {
  const targets = gsap.utils.toArray<HTMLElement>(
    '.hero .eyebrow, .hero .lead, .hero-ctas'
  );
  if (!targets.length) return;
  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } }).from(targets, {
    y: 28,
    opacity: 0,
    stagger: 0.09,
  });
}

/** Batched scroll reveal for any [data-reveal] element. */
function reveals() {
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (!els.length) return;
  gsap.set(els, { opacity: 0, y: 28 });
  ScrollTrigger.batch(els, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });
}

/** Count [data-count] numbers up when they scroll into view. */
function counters() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const to = parseFloat(el.dataset.count ?? '0');
    const decimals = parseInt(el.dataset.decimals ?? '0', 10);
    const obj = { v: 0 };
    el.textContent = (0).toFixed(decimals);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: to,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = obj.v.toFixed(decimals)),
        }),
    });
  });
}

/** Subtle magnetic pull on [data-magnetic] elements (fine pointer only). */
function magnetic() {
  if (!isFinePointer()) return;
  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.35;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * strength,
        y: (e.clientY - (r.top + r.height / 2)) * strength,
        duration: 0.4,
        ease: 'power3.out',
      });
    });
    el.addEventListener('pointerleave', () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    );
  });
}

/** Scroll-scrub parallax for any [data-parallax] element (value = yPercent). */
function parallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || '-12');
    gsap.to(el, {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/** A label pill that follows the cursor while hovering [data-card-cursor]. */
function cardCursor() {
  if (!isFinePointer()) return;
  const cards = gsap.utils.toArray<HTMLElement>('[data-card-cursor]');
  if (!cards.length) return;

  const label = document.createElement('div');
  label.className = 'card-cursor';
  document.body.appendChild(label);
  const xTo = gsap.quickTo(label, 'left', { duration: 0.25, ease: 'power3' });
  const yTo = gsap.quickTo(label, 'top', { duration: 0.25, ease: 'power3' });

  cards.forEach((card) => {
    const text = card.dataset.cardCursor || 'View';
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    card.addEventListener('pointerenter', (e) => {
      label.innerHTML = text.replace(/\s+/g, '<br>');
      move(e as PointerEvent);
      label.classList.add('is-visible');
    });
    card.addEventListener('pointermove', (e) => move(e as PointerEvent));
    card.addEventListener('pointerleave', () => label.classList.remove('is-visible'));
  });
}

/** Thin gradient bar that fills as you scroll the page. */
function scrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}

export function initMotion() {
  if (prefersReducedMotion()) return; // natural DOM state is already complete
  heroEntrance();
  reveals();
  counters();
  magnetic();
  parallax();
  cardCursor();
  scrollProgress();
}
