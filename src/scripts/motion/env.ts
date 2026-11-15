import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin);

/* Dev only: a throttled preview tab triggers GSAP lag smoothing (slow motion). Production keeps the default. */
if (import.meta.env.DEV) gsap.ticker.lagSmoothing(0);

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };
export { animate, stagger, svg } from 'animejs';

/** Reduced motion: no smoothing, no choreography. Content is already visible without script. */
export const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const mqDesktop = window.matchMedia('(min-width:980px)');
export const mqTablet = window.matchMedia('(min-width:768px)');

export const $ = <T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document): T | null => root.querySelector<T>(selector);
export const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] => Array.from(root.querySelectorAll<T>(selector));
