import { ScrollTrigger } from './motion/env';
import { initSmoother, initAnchors } from './motion/smooth';
import { initHeader, initSheet, initDisclosure } from './ui';
import { initPlans } from './plan-ui';
import { initHero } from './motion/hero';
import { initScrollMotion, initMicro } from './motion/scroll';

/* Order matters: the smoother must exist before any ScrollTrigger is created. */
initSmoother();
initAnchors();
initHeader();
initSheet();
initDisclosure();
initPlans();
initHero();
initScrollMotion();
initMicro();
window.addEventListener('load', () => ScrollTrigger.refresh());
