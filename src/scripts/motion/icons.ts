// anime.js v4: icon stroke redraw on hover/focus, support-badge check and halo.
import { animate, svg } from 'animejs';
import { $, $$, canHover, reducedMotion } from './env';

function redraw(paths: SVGGeometryElement[]) {
  animate(svg.createDrawable(paths), { draw: ['0 0', '0 1'], duration: 900, ease: 'outQuad' });
}

export function initIcons() {
  if (reducedMotion()) return;

  // 13: service and segment icons redraw once per hover or focus (hover-capable devices only).
  if (canHover()) {
    const hosts = $$('.tile, .card, .wl');
    hosts.forEach((host) => {
      const icon = host.querySelector('[data-icon] svg');
      if (!icon) return;
      let running = false;
      const run = () => {
        if (running) return;
        running = true;
        redraw(Array.from(icon.querySelectorAll<SVGGeometryElement>('path, rect, circle')));
        setTimeout(() => (running = false), 950);
      };
      host.addEventListener('mouseenter', run);
      host.addEventListener('focusin', run);
    });
  }

  // 14: support badge, check draws 1.4 s, halo ring expands twice.
  const badge = $('.support .badge2');
  const check = badge?.querySelector<SVGGeometryElement>('path');
  const halo = badge?.querySelector<HTMLElement>('.halo');
  if (badge && check && halo) {
    const drawable = svg.createDrawable(check);
    // Pre-hide the check so it draws in when the badge enters.
    animate(drawable, { draw: '0 0', duration: 1 });
    new IntersectionObserver((entries, obs) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      obs.disconnect();
      animate(drawable, { draw: ['0 0', '0 1'], duration: 1400, ease: 'inOutQuad' });
      animate(halo, { scale: [1, 1.9], opacity: [0.6, 0], duration: 1600, delay: 1200, loop: 2, ease: 'outQuad' });
    }, { threshold: 0.4 }).observe(badge);
  }
}
