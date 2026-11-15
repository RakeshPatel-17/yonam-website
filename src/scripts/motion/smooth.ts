import { ScrollSmoother, REDUCE, $ } from './env';

let smoother: ScrollSmoother | null = null;

/** GSAP ScrollSmoother: native scrollbar, smoothed content. Touch devices keep native scrolling. Must run before any ScrollTrigger. */
export function initSmoother(): ScrollSmoother | null {
  if (REDUCE) return null;
  smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.15, effects: true, smoothTouch: false });
  return smoother;
}

/** Pauses smoothing while the mobile menu is open. */
export function pauseSmoother(paused: boolean): void {
  smoother?.paused(paused);
}

/** In-page links scroll through the smoother (native hash jumps would fight it). */
export function initAnchors(): void {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href') ?? '';
    if (id.length < 2) return;
    const el = id === '#top' ? null : $(id);
    if (id !== '#top' && !el) return;
    e.preventDefault();
    history.replaceState(null, '', id);
    if (smoother) smoother.scrollTo(el ?? 0, true, el ? 'top 78px' : undefined);
    else if (el) el.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
    else window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' });
  });
}
