// GSAP ScrollTrigger: dimension lines, stagger groups, drawn checks, final CTA drawing, isometric first draw.
import { gsap } from './gsap';
import { $, $$ } from './env';
import { drawPlan, primePlan } from './plan-draw';
import { scanPlan } from './plan-scan';
import { setIsoRevealed } from '../state';

export function initReveal() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const small = matchMedia('(max-width: 639px)').matches;
    const k = small ? 0.8 : 1; // shorter durations on phones

    // 8: section dimension line scales in from the left, end tick fades in. Once.
    $$('.sec-head .dim').forEach((dim) => {
      const line = dim.querySelector('i');
      dim.classList.add('pre');
      gsap.fromTo(line, { scaleX: 0 }, {
        scaleX: 1, duration: 1 * k, ease: 'power3.out',
        scrollTrigger: { trigger: dim, start: 'top 85%', once: true, onEnter: () => dim.classList.add('in') },
      });
    });

    // 9: stagger groups (segment tiles, why list, fact strip, about points). Once.
    $$('[data-stagger]').forEach((group) => {
      gsap.from(Array.from(group.children), {
        opacity: 0, y: 16, duration: 0.7 * k, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      });
    });

    // Fact strip checks draw as the strip enters.
    const checks = $$('.facts .d');
    if (checks.length) {
      gsap.fromTo(checks, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: 0.6, stagger: 0.14, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset',
        scrollTrigger: { trigger: '.facts', start: 'top 92%', once: true },
      });
    }

    // Services featured card: small line drawing draws, then cones scan (anime.js).
    const mini = $('#miniPlan');
    if (mini) {
      gsap.fromTo($$('.d', mini), { drawSVG: '0%' }, {
        drawSVG: '100%', duration: 1.2 * k, stagger: 0.2, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset',
        scrollTrigger: { trigger: mini, start: 'top 85%', once: true, onEnter: () => setTimeout(() => scanPlan(mini), 900) },
      });
    }

    // 12: isometric planning drawing, walls draw once, cones breathe.
    const isoHost = $('#isoPlan');
    if (isoHost) {
      primePlan(isoHost);
      gsap.timeline({
        scrollTrigger: {
          trigger: '#isoBox', start: 'top 75%', once: true,
          onEnter: () => {
            setIsoRevealed(true);
            drawPlan(isoHost, { quick: false });
          },
        },
      });
    }

    // 15: final CTA background drawing, stagger 140 ms.
    const cta = $$('.cta .bgdraw .d');
    if (cta.length) {
      gsap.fromTo(cta, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: 1.4 * k, stagger: 0.14, ease: 'power2.out',
        scrollTrigger: { trigger: '.cta', start: 'top 80%', once: true },
      });
    }
  });
}
