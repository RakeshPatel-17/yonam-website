// anime.js v4: camera cone scanning (component-level SVG motion).
import { animate, createScope, stagger } from 'animejs';
import { reducedMotion } from './env';

const scopes = new WeakMap<Element, ReturnType<typeof createScope>>();

export function stopScan(plan: Element | null | undefined) {
  if (!plan) return;
  scopes.get(plan)?.revert();
  scopes.delete(plan);
}

/** Plan view: cones rotate about each camera. Isometric: cones breathe. Two cycles, then rest. */
export function scanPlan(plan: Element | null | undefined) {
  if (!plan || reducedMotion()) return;
  stopScan(plan);
  const cones = Array.from(plan.querySelectorAll<SVGGElement>('.sw'));
  if (!cones.length) return;
  const iso = plan.classList.contains('st-iso') || plan.classList.contains('mini');
  const scope = createScope({ root: plan as HTMLElement }).add(() => {
    animate(
      cones,
      iso
        ? { scale: [1, 0.9, 1], opacity: [1, 0.55, 1], duration: 2400, delay: stagger(200), ease: 'inOutSine', loop: 2 }
        : { rotate: [0, -5, 5, 0], duration: 2400, delay: stagger(200), ease: 'inOutSine', loop: 2 },
    );
  });
  scopes.set(plan, scope);
}
