// GSAP ScrollTrigger: process timeline fill. Mobile accordion behaviour is plain DOM/CSS (see ui.ts).
import { gsap } from './gsap';
import { $, $$ } from './env';

export function initProcess() {
  const tl = $('#tl');
  const fill = $('#tl .track i');
  if (!tl || !fill) return;

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const horizontal = matchMedia('(min-width: 980px)').matches;
    const badges = $$('#steps li b');
    const t = gsap.timeline({ scrollTrigger: { trigger: tl, start: 'top 65%', once: true } });
    t.fromTo(fill, horizontal ? { scaleX: 0 } : { scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 3.4, ease: 'none' }, 0)
      .from(badges, {
        scale: 0.8, backgroundColor: 'rgba(255,255,255,.35)', borderColor: 'rgba(255,255,255,.3)', color: 'rgba(11,31,92,.6)',
        duration: 0.45, ease: 'power2.out', stagger: 0.6, transition: 'none',
        clearProps: 'transform,backgroundColor,borderColor,color,transition',
      }, 0);
    return () => t.kill();
  });
}
