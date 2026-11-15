import { LABELS, planMarkup, type PlanStyle, type PropertyType } from '../lib/plans';
import { animate, stagger, gsap, REDUCE, mqTablet, $, $$ } from './motion/env';

type Host = HTMLElement & { _tok?: number };
interface PlanOpts {
  quick?: boolean;
  delay?: number;
}

const hero = $('#heroPlan') as Host;
const iso = $('#isoPlan') as Host;
const blueprint = $('#bpPlan') as Host | null;
let current: PropertyType = 'building';
let isoRevealed = false;
const scans = new WeakMap<HTMLElement, { revert: () => unknown; completed?: boolean }>();
const MOTION = !REDUCE;

const prefixFor = (host: HTMLElement): string => (host === hero ? 'h' : host === blueprint ? 'b' : 'i');
const styleOf = (host: HTMLElement): PlanStyle => (host.dataset.style === 'iso' ? 'iso' : host.dataset.style === 'blue' ? 'blue' : 'flat');
const render = (host: HTMLElement, v: PropertyType): void => {
  host.innerHTML = planMarkup(styleOf(host), v, prefixFor(host));
};

/** GSAP: walls draw (DrawSVG); in plan view zones, vehicles and gate piers settle in; in isometric the masses rise and windows light up. */
export function drawPlan(host: HTMLElement, o: PlanOpts = {}): void {
  if (!MOTION) return;
  const pl = $('.plan', host);
  if (!pl) return;
  const strokes = $$('.bld,.wall,.cwall', pl);
  if (!strokes.length) return;
  gsap.killTweensOf(strokes);
  const d0 = o.delay ?? 0;
  if (pl.classList.contains('st-iso')) {
    gsap.fromTo($$('.face-l,.face-r,.roof', pl), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, delay: d0, stagger: { each: 0.012, from: 'start' }, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
    gsap.fromTo($$('.win', pl), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, delay: d0 + 1, stagger: { each: 0.035, from: 'random' }, ease: 'none', clearProps: 'opacity,visibility' });
    gsap.fromTo($$('.pier,.shut,.sign', pl), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: d0 + 1.2, stagger: 0.05, clearProps: 'opacity,visibility' });
  } else {
    gsap.fromTo($$('.area,.door,.shelf', pl), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay: d0 + 0.5, stagger: 0.06, clearProps: 'opacity,visibility' });
    gsap.fromTo($$('.tw,.car,.pier,.shut', pl), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.45, delay: d0 + 1.3, stagger: 0.035, ease: 'back.out(2)', clearProps: 'opacity,visibility' });
  }
  gsap.fromTo(strokes, { drawSVG: '0%' }, { drawSVG: '100%', duration: o.quick ? 0.9 : 1.8, delay: d0, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset' });
}

/** anime.js: cones sweep ±12° in plan view, breathe in isometric. loop:1 means one extra repeat (two plays). */
export function scan(host: HTMLElement, delayMs = 0): void {
  if (!MOTION) return;
  const p = $('.plan', host);
  const cones = p ? $$('.sw', p) : [];
  if (!p || !cones.length) return;
  scans.get(host)?.revert();
  const isoView = p.classList.contains('st-iso');
  const anim = isoView
    ? animate(cones, {
        scale: [{ to: 0.9, duration: 600 }, { to: 1, duration: 600 }],
        opacity: [{ to: 0.55, duration: 600 }, { to: 1, duration: 600 }],
        delay: stagger(200, { start: delayMs }),
        ease: 'inOutSine',
        loop: 1,
      })
    : animate(cones, {
        rotate: [{ to: -12, duration: 700 }, { to: 12, duration: 1400 }, { to: 0, duration: 700 }],
        delay: stagger(200, { start: delayMs }),
        ease: 'inOutSine',
        loop: 1,
      });
  scans.set(host, anim);
}
const scanBusy = (host: HTMLElement): boolean => {
  const a = scans.get(host);
  return !!a && !a.completed;
};

function setCaptions(first: boolean): void {
  const L = LABELS[current];
  const html = `<span>Example: <b>${L.cap}</b></span><span>Illustrative</span>`;
  const c1 = $('#pcap');
  const c2 = $('#pcap2');
  if (c1) c1.innerHTML = html;
  if (c2) c2.innerHTML = html;
  const b = $('#bf');
  if (!b || b.textContent === L.bf) return;
  if (!MOTION || first) {
    b.textContent = L.bf;
    return;
  }
  gsap.killTweensOf(b);
  gsap.to(b, {
    yPercent: -70, autoAlpha: 0, duration: 0.18, ease: 'power2.in',
    onComplete: () => {
      b.textContent = L.bf;
      gsap.fromTo(b, { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
    },
  });
}

function swap(host: Host, v: PropertyType): void {
  host._tok = (host._tok ?? 0) + 1;
  const tok = host._tok;
  scans.get(host)?.revert();
  const old = $('.plan', host);
  const show = (): void => {
    if (tok !== host._tok) return;
    render(host, v);
    const p = $('.plan', host);
    if (MOTION && p) {
      gsap.fromTo(p, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, clearProps: 'opacity,visibility' });
      drawPlan(host, { quick: true });
      scan(host, 700);
    }
  };
  if (!MOTION || !old) {
    show();
    return;
  }
  gsap.to(old, { autoAlpha: 0, duration: 0.15, overwrite: true, onComplete: show });
}

function setType(v: PropertyType): void {
  current = v;
  $$('.pk').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.v === v)));
  swap(hero, v);
  if (isoRevealed) swap(iso, v);
  else render(iso, v);
  if (blueprint) {
    render(blueprint, v);
    if (blueRevealed) drawBlueprint();
  }
  if (on3d) three?.setType(v);
  setCaptions(false);
}

/** Blueprint (process band): outlines are drawn on with DrawSVG, then the hatched coverage fades in. */
let blueRevealed = false;
function drawBlueprint(): void {
  if (!MOTION || !blueprint) return;
  const pl = $('.plan', blueprint);
  if (!pl) return;
  const lines = $$('.ground,.face-l,.face-r,.roof,.wall,.area', pl);
  gsap.killTweensOf(lines);
  gsap.fromTo(lines, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.3, stagger: 0.012, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset' });
  gsap.fromTo($$('.sw,.door,.sign,.shut', pl), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay: 1.2, stagger: 0.1, clearProps: 'opacity,visibility' });
}
export function revealBlueprint(): void {
  blueRevealed = true;
  drawBlueprint();
}

/* Explore in 3D: Three.js is imported only when the button is pressed. */
type Mounted = { setType: (v: PropertyType) => void; resetView: () => void; destroy: () => void };
let three: Mounted | null = null;
let on3d = false;
async function toggle3d(btn: HTMLButtonElement, stage: HTMLElement): Promise<void> {
  const label = $('.t3label', btn);
  const note = $('#t3note');
  if (on3d) {
    three?.destroy();
    three = null;
    on3d = false;
    stage.hidden = true;
    iso.hidden = false;
    btn.setAttribute('aria-pressed', 'false');
    if (label) label.textContent = 'Explore in 3D';
    if (note) note.textContent = '';
    return;
  }
  btn.disabled = true;
  if (label) label.textContent = 'Loading 3D…';
  try {
    const mod = await import('./scene3d');
    stage.hidden = false;
    three = await mod.mount3D(stage, current, REDUCE);
    iso.hidden = true;
    on3d = true;
    btn.setAttribute('aria-pressed', 'true');
    if (label) label.textContent = 'Back to drawing';
    if (note) note.textContent = 'Drag to rotate. Zone highlights are on the drawing.';
  } catch {
    stage.hidden = true;
    if (label) label.textContent = 'Explore in 3D';
    if (note) note.textContent = '3D is not available on this device. The drawing shows the same plan.';
  } finally {
    btn.disabled = false;
  }
}

/** Called by the scroll layer when the isometric drawing first enters the viewport. */
export function revealIso(): void {
  isoRevealed = true;
  drawPlan(iso);
  scan(iso, 1100);
}

export function setFocus(plan: Element | null, key: string | null, btn: Element | null): void {
  if (!plan) return;
  $$('.lg', plan as HTMLElement).forEach((x) => x.setAttribute('aria-pressed', String(btn === x)));
  const el = plan as HTMLElement;
  if (key && key !== 'all') el.dataset.focus = key;
  else delete el.dataset.focus;
}

export const planHosts = { hero, iso };

export function initPlans(): void {
  const btn3d = $('#open3d') as HTMLButtonElement | null;
  const stage3d = $('#stage3d');
  if (btn3d && stage3d) btn3d.addEventListener('click', () => void toggle3d(btn3d, stage3d));
  $$('.pk').forEach((b) => b.addEventListener('click', () => setType(b.dataset.v as PropertyType)));
  hero.addEventListener('mouseenter', () => {
    if (mqTablet.matches && !scanBusy(hero)) scan(hero, 0);
  });

  /* zone focus from the legend: hover, focus, tap */
  const legendOf = (e: Event): HTMLElement | null => (e.target as Element).closest<HTMLElement>('.lg');
  const on = (e: Event): void => {
    const b = legendOf(e);
    if (b) setFocus(b.closest('.plan'), b.dataset.k ?? null, b);
  };
  const off = (e: Event): void => {
    const b = legendOf(e);
    if (b) setFocus(b.closest('.plan'), null, null);
  };
  document.addEventListener('mouseover', on);
  document.addEventListener('mouseout', off);
  document.addEventListener('focusin', on);
  document.addEventListener('focusout', off);
  document.addEventListener('click', on);

  /* factor chips drive the isometric drawing */
  $('#factors')?.addEventListener('click', (e) => {
    const b = (e.target as Element).closest('button');
    if (!b) return;
    const wasOn = b.getAttribute('aria-pressed') === 'true';
    $$('#factors button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    const p = $('.plan', iso);
    if (wasOn) setFocus(p, null, null);
    else {
      b.setAttribute('aria-pressed', 'true');
      setFocus(p, b.dataset.k ?? null, null);
    }
  });
}
