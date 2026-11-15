import { gsap, REDUCE, $, $$ } from './env';
import { drawPlan, scan, planHosts } from '../plan-ui';

/** Hero entrance: plan card wipes in, walls draw (GSAP), copy rises, then cones scan (anime.js). H1 first paint stays CSS-only for LCP. */
export function initHero(): void {
  const root = document.documentElement;
  if (REDUCE) {
    root.classList.remove('anim-pending');
    return;
  }
  const rise = $$('.hero .rise');
  const box = $('.hero .planbox');
  gsap.set(rise, { autoAlpha: 0, y: 14 });
  gsap.set(box, { clipPath: 'inset(0% 0% 100% 0% round 18px)' });
  drawPlan(planHosts.hero, { delay: 0.95 });
  root.classList.remove('anim-pending');
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .to(box, { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1, clearProps: 'clipPath' }, 0.35)
    .to(rise, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15, clearProps: 'transform,opacity,visibility' }, 0.85)
    .add(() => scan(planHosts.hero, 0), 2.4);
}
