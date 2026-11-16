// GSAP: hero sequence. The H1 reveal is CSS only, so LCP never waits for this file.
import { gsap } from './gsap';
import { $, $$, canHover } from './env';
import { drawPlan } from './plan-draw';
import { scanPlan } from './plan-scan';

export function initHero() {
  const lead = $('[data-hero=lead]');
  const ctas = $('[data-hero=ctas]');
  const mob = $('[data-hero=mob]');
  const loc = $('[data-hero=loc]');
  const box = $('[data-hero=plan]');
  const host = $('#heroPlan');
  if (!box || !host) return;

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const text = [lead, ctas, mob, loc].filter(Boolean) as HTMLElement[];
    const shift = matchMedia('(max-width: 639px)').matches ? 0.8 : 1; // shorter on phones
    // Failsafe: whatever happens, content is forced visible after 1.5 s past the sequence.
    const failsafe = setTimeout(() => gsap.set(text, { opacity: 1, y: 0, clearProps: 'transform' }), 3500);

    const tl = gsap.timeline({ delay: 0.5 * shift, onComplete: () => clearTimeout(failsafe) });
    tl.from(text, { opacity: 0, y: 14, duration: 0.8 * shift, ease: 'power3.out', stagger: 0.18 * shift }, 0)
      .from(box, { clipPath: 'inset(0 0 100% 0 round 18px)', duration: 1 * shift, ease: 'power3.out', clearProps: 'clipPath' }, 0.1)
      .add(() => drawPlan(host, { quick: false }), '>-0.05');

    // Hover on the plan replays the scan (desktop only; hover-only effects are dropped on touch).
    const onEnter = () => scanPlan(host.firstElementChild);
    if (canHover()) box.addEventListener('mouseenter', onEnter);

    return () => {
      clearTimeout(failsafe);
      box.removeEventListener('mouseenter', onEnter);
    };
  });
  return $$('[data-hero]');
}
