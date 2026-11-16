// Entry point. UI interactions start immediately; all motion starts after first paint and never blocks it.
import { initUI } from '../ui';
import { onIdle, reducedMotion } from './env';

initUI();

if (!reducedMotion()) {
  // Hero and header first, then everything below the fold. Modules are separate chunks sharing one GSAP core.
  requestAnimationFrame(() => requestAnimationFrame(async () => {
    const [{ initHero }, { initHeader }] = await Promise.all([import('./hero'), import('./header')]);
    initHero();
    initHeader();
    onIdle(async () => {
      const [{ initReveal }, { initProcess }, { initIcons }, { ScrollTrigger }] = await Promise.all([
        import('./reveal'), import('./process'), import('./icons'), import('./gsap'),
      ]);
      initReveal();
      initProcess();
      initIcons();
      // Fonts change layout slightly: recompute trigger positions once they are ready.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });
  }));
}
