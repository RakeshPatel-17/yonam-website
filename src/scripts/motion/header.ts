// GSAP ScrollTrigger: header shrink and read-progress line.
import { gsap, ScrollTrigger } from './gsap';
import { $ } from './env';

export function initHeader() {
  const header = $('.site-header');
  const prog = $('#prog');
  if (!header) return;

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      start: 24,
      end: 'max',
      onUpdate: (self) => header.classList.toggle('scrolled', self.scroll() > 24),
      onLeaveBack: () => header.classList.remove('scrolled'),
    });
    header.classList.toggle('scrolled', scrollY > 24);
    const bar = prog
      ? gsap.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })
      : null;
    return () => {
      st.kill();
      bar?.scrollTrigger?.kill();
      bar?.kill();
    };
  });
}
