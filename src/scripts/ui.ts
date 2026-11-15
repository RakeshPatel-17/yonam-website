import { $, $$, mqDesktop } from './motion/env';
import { pauseSmoother } from './motion/smooth';

/** Header shrinks after a short scroll. */
export function initHeader(): void {
  const hd = $('.site-header');
  if (!hd) return;
  const update = (): void => {
    hd.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/** Mobile menu sheet: focus moves in and back, Escape closes, smoothing pauses while open. */
export function initSheet(): void {
  const sheet = $('#sheet');
  const overlay = $('#ov');
  const menuBtn = $('#menuBtn');
  const closeBtn = $('#closeBtn');
  if (!sheet || !overlay || !menuBtn || !closeBtn) return;
  const open = (): void => {
    sheet.classList.add('open');
    overlay.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    pauseSmoother(true);
    sheet.focus();
  };
  const close = (): void => {
    sheet.classList.remove('open');
    overlay.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    pauseSmoother(false);
    menuBtn.focus();
  };
  menuBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  sheet.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheet.classList.contains('open')) close();
  });
}

/** Process steps: tap to expand on small screens, always open on desktop. FAQ: one open at a time. Services: carousel dots. */
export function initDisclosure(): void {
  const steps = $$('#steps li');
  const sync = (): void =>
    steps.forEach((li) => {
      const b = $('.st', li) as HTMLButtonElement;
      b.tabIndex = mqDesktop.matches ? -1 : 0;
      if (mqDesktop.matches) {
        li.classList.add('open');
        b.setAttribute('aria-expanded', 'true');
      }
    });
  steps.forEach((li) =>
    $('.st', li)?.addEventListener('click', () => {
      if (mqDesktop.matches) return;
      const wasOpen = li.classList.contains('open');
      steps.forEach((x) => {
        x.classList.remove('open');
        $('.st', x)?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        li.classList.add('open');
        $('.st', li)?.setAttribute('aria-expanded', 'true');
      }
    }),
  );
  mqDesktop.addEventListener('change', sync);
  sync();

  const items = $$<HTMLDetailsElement>('#acc details');
  items.forEach((d) =>
    d.addEventListener('toggle', () => {
      if (d.open) items.forEach((o) => o !== d && (o.open = false));
    }),
  );

  const snap = $('#snap1');
  const dots = $$('#dots1 i');
  snap?.addEventListener(
    'scroll',
    () => {
      const i = Math.round(snap.scrollLeft / (snap.scrollWidth / snap.children.length));
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
    },
    { passive: true },
  );
}
