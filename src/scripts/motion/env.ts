export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const canHover = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
export const isDesktop = () => matchMedia('(min-width: 980px)').matches;

/** Run after first paint, when the browser is idle (setTimeout fallback). */
export function onIdle(fn: () => void, timeout = 1200) {
  const run = () => (typeof requestIdleCallback === 'function' ? requestIdleCallback(fn, { timeout }) : setTimeout(fn, 200));
  if (document.readyState === 'complete') run();
  else addEventListener('load', run, { once: true });
}

export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
