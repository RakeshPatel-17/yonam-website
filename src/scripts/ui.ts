// Non-motion interactions: mobile sheet, shared property picker, zone isolation, accordions, carousel dots.
import { captionHtml, type PropertyType } from '../lib/plans';
import { state } from './state';
import { $, $$ } from './motion/env';

const desktop = () => matchMedia('(min-width: 980px)');

function initSheet() {
  const sheet = $('#sheet'), ov = $('#ov'), btn = $('#menuBtn');
  if (!sheet || !ov || !btn) return;
  const focusables = () => $$<HTMLElement>('a[href], button', sheet);
  const open = () => {
    sheet.classList.add('open'); ov.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
    (focusables()[0] ?? sheet).focus();
  };
  const close = () => {
    sheet.classList.remove('open'); ov.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus();
  };
  btn.addEventListener('click', open);
  $('#closeBtn')?.addEventListener('click', close);
  ov.addEventListener('click', close);
  sheet.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) close(); });
  document.addEventListener('keydown', (e) => {
    if (!sheet.classList.contains('open')) return;
    if (e.key === 'Escape') return close();
    if (e.key !== 'Tab') return;
    const f = focusables(); // focus trap
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/** Zone isolation: legend buttons and factor chips. Works on hover, focus and tap. */
function setFocus(plan: Element | null, k: string | null, btn: Element | null) {
  if (!plan) return;
  $$('.lg', plan).forEach((x) => x.setAttribute('aria-pressed', String(btn === x)));
  const el = plan as HTMLElement;
  if (k && k !== 'all') el.dataset.focus = k; else delete el.dataset.focus;
}
function initZones() {
  const lg = (e: Event) => (e.target as Element).closest?.('.lg') as HTMLElement | null;
  const on = (e: Event) => { const b = lg(e); if (b) setFocus(b.closest('.plan'), b.dataset.k ?? null, b); };
  const off = (e: Event) => { const b = lg(e); if (b) setFocus(b.closest('.plan'), null, null); };
  document.addEventListener('mouseover', on);
  document.addEventListener('mouseout', off);
  document.addEventListener('focusin', on);
  document.addEventListener('focusout', off);
  document.addEventListener('click', on);
  $('#factors')?.addEventListener('click', (e) => {
    const b = (e.target as Element).closest('button');
    if (!b) return;
    const was = b.getAttribute('aria-pressed') === 'true';
    $$('#factors button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    const plan = $('#isoPlan .plan');
    if (was) setFocus(plan, null, null);
    else { b.setAttribute('aria-pressed', 'true'); setFocus(plan, (b as HTMLElement).dataset.k ?? null, null); }
  });
}

/** Both pickers (hero and planning section) share one state. */
function initPicker() {
  const hero = $('#heroPlan'), iso = $('#isoPlan');
  if (!hero || !iso) return;
  const tabs = $$<HTMLButtonElement>('.pk');
  const select = async (v: PropertyType, focus = false) => {
    if (v === state.type) return;
    state.type = v;
    tabs.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.v === v)));
    $$('[data-caption]').forEach((c) => (c.innerHTML = captionHtml(v)));
    if (focus) tabs.find((b) => b.dataset.v === v && b.closest('.planbox')?.contains(document.activeElement))?.focus();
    const { swapPlan } = await import('./motion/plan-draw');
    if (state.type !== v) return; // a newer choice already won
    swapPlan(hero, 'flat', v, { draw: true });
    swapPlan(iso, 'iso', v, { draw: state.isoRevealed });
  };
  tabs.forEach((b) => b.addEventListener('click', () => select(b.dataset.v as PropertyType)));
  // Arrow-key navigation within each tablist.
  $$('.pick').forEach((list) => list.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(k)) return;
    const items = $$<HTMLButtonElement>('.pk', list);
    let i = items.findIndex((x) => x === document.activeElement);
    if (k === 'ArrowRight') i = (i + 1) % items.length;
    else if (k === 'ArrowLeft') i = (i - 1 + items.length) % items.length;
    else i = k === 'Home' ? 0 : items.length - 1;
    e.preventDefault();
    items[i].focus();
    select(items[i].dataset.v as PropertyType, true);
  }));
}

/** Process: tap to expand on mobile, always open on desktop. */
function initSteps() {
  const mq = desktop();
  const steps = $$('#steps li');
  const sync = () => steps.forEach((li) => {
    const b = $('.st', li) as HTMLButtonElement;
    b.tabIndex = mq.matches ? -1 : 0;
    if (mq.matches) { li.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
  });
  steps.forEach((li) => $('.st', li)?.addEventListener('click', () => {
    if (mq.matches) return;
    const wasOpen = li.classList.contains('open');
    steps.forEach((x) => { x.classList.remove('open'); $('.st', x)?.setAttribute('aria-expanded', 'false'); });
    if (!wasOpen) { li.classList.add('open'); $('.st', li)?.setAttribute('aria-expanded', 'true'); }
  }));
  mq.addEventListener('change', sync);
  sync();
}

function initAbout() {
  const more = $('#more') as HTMLDetailsElement | null;
  if (!more) return;
  const mq = desktop();
  const sync = () => { if (mq.matches) { more.open = true; more.classList.add('static'); } else more.classList.remove('static'); };
  mq.addEventListener('change', sync);
  sync();
}

function initFaq() {
  const items = $$<HTMLDetailsElement>('#acc details');
  items.forEach((d) => d.addEventListener('toggle', () => { if (d.open) items.forEach((o) => { if (o !== d) o.open = false; }); }));
}

function initCarousel() {
  const sn = $('#snap1'), dots = $$('#dots1 i');
  if (!sn) return;
  sn.addEventListener('scroll', () => {
    const i = Math.round(sn.scrollLeft / (sn.scrollWidth / sn.children.length));
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
  }, { passive: true });
}

export function initUI() {
  initSheet(); initZones(); initPicker(); initSteps(); initAbout(); initFaq(); initCarousel();
}
