import { gsap, ScrollTrigger, SplitText, animate, stagger, svg, REDUCE, mqTablet, $, $$ } from './env';
import { planHosts, revealBlueprint, revealIso, setFocus } from '../plan-ui';

const once = (trigger: Element | string, start = 'top 88%') => ({ trigger, start, once: true });
const CLEAR = 'transform,opacity,visibility';

/** Section-level choreography: ScrollTrigger on top of ScrollSmoother. One owner per element; hover transforms are preserved with clearProps. */
export function initScrollMotion(): void {
  if (REDUCE) return;

  /* header read-progress */
  const prog = $('#prog');
  if (prog) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => gsap.set(prog, { scaleX: s.progress }) });

  /* dimension lines and kickers */
  $$('.sec-head .dim i').forEach((i) => gsap.fromTo(i, { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: once(i.parentElement as Element, 'top 90%') }));
  $$('.kick').forEach((k) => gsap.from(k, { x: -16, autoAlpha: 0, duration: 0.6, ease: 'power3.out', clearProps: CLEAR, scrollTrigger: once(k, 'top 92%') }));

  /* stagger groups */
  $$('.stg').forEach((g) => gsap.from(g.children, { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.08, ease: 'power3.out', clearProps: CLEAR, scrollTrigger: once(g) }));
  gsap.from('.brandcard', { autoAlpha: 0, y: 26, duration: 0.8, ease: 'power3.out', clearProps: CLEAR, scrollTrigger: once('.brandcard') });

  /* isometric planning drawing builds when it arrives */
  const isoBox = planHosts.iso.parentElement;
  if (isoBox) ScrollTrigger.create({ trigger: isoBox, start: 'top 80%', once: true, onEnter: revealIso });

  /* blueprint in the process band draws on when it arrives */
  if ($('#bpPlan')) ScrollTrigger.create({ trigger: '#bpPlan', start: 'top 85%', once: true, onEnter: revealBlueprint });

  /* services featured card: plan draws, cones scan */
  gsap.fromTo('.mini .s', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, stagger: 0.2, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset', scrollTrigger: once('.mini', 'top 85%') });
  ScrollTrigger.create({
    trigger: '.mini', start: 'top 85%', once: true,
    onEnter: () => animate($$('.mini .sw'), { rotate: [{ to: -10, duration: 700 }, { to: 10, duration: 1400 }, { to: 0, duration: 700 }], delay: stagger(300, { start: 1200 }), ease: 'inOutSine', loop: 1 }),
  });

  /* process illustrations draw as they arrive */
  $$('.pa').forEach((p) => gsap.fromTo($$('.ln', p), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, stagger: 0.08, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset', scrollTrigger: once(p) }));

  processTimeline();
  planningStory();
  ctaLiveView();
  headings();
}

/** Process: the connector fill is scrubbed to the scroll; each step circle lights and pulses when reached. */
function processTimeline(): void {
  const tl = $('#tl');
  const track = tl && $('.track i', tl);
  if (!tl || !track) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width:980px)', () => {
    gsap.fromTo(track, { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 74%', end: 'bottom 52%', scrub: 0.5 } });
  });
  mm.add('(max-width:979px)', () => {
    gsap.fromTo(track, { scaleY: 0, transformOrigin: '50% 0' }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 74%', end: 'bottom 60%', scrub: 0.5 } });
  });
  $$('li b', tl).forEach((b) => {
    const st = once(b, 'top 78%');
    gsap.fromTo(b, { scale: 0.8, backgroundColor: 'rgba(255,255,255,.35)' }, { scale: 1, backgroundColor: '#ffffff', duration: 0.4, ease: 'power2.out', clearProps: 'backgroundColor,scale', scrollTrigger: st });
    gsap.fromTo(b, { boxShadow: '0 0 0 0 rgba(127,208,255,.7)' }, { boxShadow: '0 0 0 14px rgba(127,208,255,0)', duration: 0.9, delay: 0.15, clearProps: 'boxShadow', scrollTrigger: st });
  });
}

/** Planning: pinned scrollytelling on desktop. Scrolling walks through what we consider and lights the matching zone on the drawing. */
function planningStory(): void {
  const mm = gsap.matchMedia();
  mm.add('(min-width:980px)', () => {
    const sec = $('#planning .plan-sec');
    const chips = $$<HTMLButtonElement>('#factors button');
    if (!sec || chips.length < 6) return;
    const steps: [string, number][] = [['ent', 1], ['com', 2], ['park', 3], ['rec', 5], ['all', 0]];
    let last = -1;
    const reset = (): void => {
      chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
      setFocus($('.plan', planHosts.iso), null, null);
    };
    ScrollTrigger.create({
      trigger: sec, start: 'top 96px', end: '+=1000', pin: true, anticipatePin: 1,
      onUpdate: (self) => {
        const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        if (i === last) return;
        last = i;
        reset();
        chips[steps[i][1]].setAttribute('aria-pressed', 'true');
        setFocus($('.plan', planHosts.iso), steps[i][0], null);
      },
      onLeaveBack: () => {
        last = -1;
        reset();
      },
    });
  });
}

/** Final CTA live-view panel: tiles rise in, drawings draw, scan lines sweep a few times (finite). */
function ctaLiveView(): void {
  const st = once('#contact', 'top 78%');
  gsap.from('.live', { autoAlpha: 0, y: 30, duration: 0.8, ease: 'power3.out', clearProps: CLEAR, scrollTrigger: st });
  gsap.from('.vt', { autoAlpha: 0, scale: 0.94, duration: 0.6, stagger: 0.14, delay: 0.25, ease: 'power3.out', clearProps: CLEAR, scrollTrigger: st });
  gsap.fromTo('.vt .ln', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, stagger: 0.04, delay: 0.6, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset', scrollTrigger: st });
  $$('.vt .sl').forEach((sl, i) => gsap.fromTo(sl, { top: '6%' }, { top: '94%', duration: 2.2, repeat: 3, yoyo: true, ease: 'sine.inOut', delay: 1 + i * 0.4, scrollTrigger: st }));
  gsap.from('#h-cta ~ p, #h-cta ~ .btn', { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.12, delay: 0.5, ease: 'power3.out', clearProps: CLEAR, scrollTrigger: st });
}

/** Section headings reveal line by line (tablet and up). */
function headings(): void {
  if (!mqTablet.matches) return;
  const run = (): void => {
    $$('main h2').forEach((el) => {
      const sp = SplitText.create(el, { type: 'lines', mask: 'lines' });
      gsap.from(sp.lines, { yPercent: 110, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: once(el) });
    });
    ScrollTrigger.refresh();
  };
  (document.fonts?.ready ?? Promise.resolve()).then(run);
}

/** Header entrance, pointer spotlight on cards (hover devices), and icon redraw on hover and focus (anime.js). */
export function initMicro(): void {
  if (REDUCE) return;
  gsap.from('.site-header .logo,.nav>ul>li,.hph,.hcta', { y: -12, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', clearProps: CLEAR, delay: 0.1 });
  if (window.matchMedia('(hover:hover)').matches) {
    $$('.tile,.card').forEach((el) =>
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      }),
    );
  }
  $$('.tile,.card,.sv').forEach((el) => {
    const icon = $('.ico svg', el);
    if (!icon) return;
    const parts = icon.querySelectorAll<SVGGeometryElement>('path,rect,circle');
    /* the drawable wrapper is created on demand: wrapping at load leaves icons hidden at rest */
    const run = (): unknown => animate(svg.createDrawable(parts), { draw: ['0 0', '0 1'], duration: 900, ease: 'outQuad' });
    el.addEventListener('mouseenter', run);
    el.addEventListener('focusin', run);
  });
}
