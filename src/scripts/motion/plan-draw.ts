// GSAP: draw walls, swap drawings. anime.js scanning is triggered from here once walls finish.
import { gsap } from './gsap';
import { reducedMotion } from './env';
import { renderPlan, type PropertyType } from '../../lib/plans';
import { scanPlan, stopScan } from './plan-scan';

type Job = { kill: () => void };
const jobs = new WeakMap<Element, Job>();

const walls = (plan: Element) => Array.from(plan.querySelectorAll('.wall, .bld'));

function cancel(host: Element) {
  jobs.get(host)?.kill();
  jobs.delete(host);
  stopScan(host.firstElementChild);
}

/** Draw the walls of a plan, then scan the cameras. */
export function drawPlan(host: HTMLElement, opts: { quick: boolean; scan?: boolean; delay?: number }): Job | null {
  const plan = host.firstElementChild;
  if (!plan || reducedMotion()) return null;
  const tween = gsap.fromTo(
    walls(plan),
    { drawSVG: '0%' },
    {
      drawSVG: '100%',
      duration: opts.quick ? 0.9 : 1.8,
      delay: opts.delay ?? 0,
      ease: 'power1.out',
      clearProps: 'strokeDasharray,strokeDashoffset',
      onComplete: () => opts.scan !== false && scanPlan(plan),
    },
  );
  const job = { kill: () => tween.kill() };
  jobs.set(host, job);
  return job;
}

/** Property switch: old drawing fades out, new one swaps in and draws. Rapid clicks never stack. */
export function swapPlan(host: HTMLElement, style: 'flat' | 'iso', v: PropertyType, opts: { draw: boolean }) {
  cancel(host);
  const swap = () => {
    host.innerHTML = renderPlan(style, v);
  };
  if (reducedMotion() || !host.firstElementChild) {
    swap();
    return;
  }
  const old = host.firstElementChild;
  let inner: Job | null = null;
  const fade = gsap.to(old, {
    opacity: 0,
    duration: 0.15,
    onComplete: () => {
      swap();
      if (opts.draw) inner = drawPlan(host, { quick: true });
      jobs.set(host, { kill: () => inner?.kill() });
    },
  });
  jobs.set(host, { kill: () => (fade.kill(), inner?.kill()) });
}

/** Hide walls ahead of a scroll-triggered first draw (below the fold only). */
export function primePlan(host: HTMLElement) {
  const plan = host.firstElementChild;
  if (plan && !reducedMotion()) gsap.set(walls(plan), { drawSVG: '0%' });
}
