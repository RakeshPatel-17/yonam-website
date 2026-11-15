# YONAM Motion Spec (GSAP + anime.js)

Status: **approved direction** (PRD v3.1 section 17.5). Visual reference: `docs/design-proposal/mock-site.html` (CSS and vanilla JS prototype of every motion below).

The prototype uses plain CSS and JS. Production uses **GSAP** and **anime.js** for the parts where they are the right tool, as defined here. Do not add other animation libraries.

## 1. Principles

1. **Motion explains, it does not decorate.** Every animation either (a) shows a real sequence (process steps), (b) shows what a drawing means (coverage, drawing a plan), or (c) answers a user action (hover, tap, select).
2. **Nothing hides the first paint.** The H1 is the LCP element. It must be visible without waiting for any JavaScript. Its reveal is CSS only (keyframes). GSAP and anime.js start after first paint.
3. **Progressive enhancement.** With JS off, or `prefers-reduced-motion: reduce`, every element is already in its final visible state. No content is ever left at `opacity: 0` waiting for a script.
4. **Short and finite.** Nothing that is not user-triggered runs longer than about 5 seconds (WCAG 2.2.2). No infinite loops. Looping demo behaviour is forbidden in production.
5. **Cheap.** Animate `transform`, `opacity`, `clip-path` and SVG `stroke-dashoffset` only. No layout properties (`width`, `height`, `top`, `left`, `margin`). No `will-change` except on an element while it animates.
6. **CSS first for trivial states.** Plain hover, focus and colour transitions stay in CSS or Tailwind. Do not import a library for a 150 ms colour change.

## 2. Who owns what

| Library | Role | Use it for |
|---|---|---|
| **GSAP** (`gsap`, plugins `ScrollTrigger`, `SplitText`, `DrawSVGPlugin`, optional `Flip`) | **Page-level choreography and scroll** | Hero sequence after first paint, scroll-triggered reveals and staggers, process timeline fill, header shrink and read-progress bar, drawing SVG strokes on a timeline, section-title text splitting, switching the property drawing (out and in). |
| **anime.js v4** (`animejs`, modular ESM) | **Component-level SVG and micro-interactions** | Camera cone scanning (`stagger`), icon stroke redraw on hover (`svg.createDrawable`), support-badge check draw and halo, legend zone emphasis, small timelines inside one component. Scoped with `createScope` so each island cleans up. |
| **CSS / Tailwind** | Simple state transitions | Button sweep and arrow slide, link underline, card lift, focus rings, accordion and sheet motion that shadcn/Radix already provides, the H1 first-paint reveal. |

**Decision rule:** if it is tied to scroll position or coordinates a sequence across several elements, use GSAP. If it lives inside one component (usually one SVG) and reacts to hover, tap or mount, use anime.js. If it is a plain state change, use CSS. **Never animate the same property of the same element with two libraries.** One owner per element.

Do not use: ScrollSmoother, Lenis or any smooth-scroll hijack, parallax, cursor followers, marquees, number counters, particle effects, 3D tilt, page-transition libraries. Do not override Radix/shadcn component animations (Accordion, Sheet, Tabs, Carousel) with GSAP or anime.js.

## 3. Install and structure

- Packages: `gsap` (current release includes all plugins, free under the standard no-charge licence; check the licence text at install time), `@gsap/react` only if a React island needs `useGSAP` for cleanup, `animejs` (v4, ESM, named imports). Confirm exact versions and package names with `npm view` before installing. Do not use anime.js v3 patterns (`import anime from 'animejs'`).
- All animation code lives in plain TypeScript modules, not inside React components:

```text
src/scripts/motion/
  env.ts          reduced-motion check, lazy loader helpers
  gsap.ts         single place that imports gsap and registers plugins
  hero.ts         hero sequence (after first paint)
  reveal.ts       scroll reveals, stagger groups, dimension lines
  process.ts      process timeline fill
  header.ts       header shrink + read progress
  plan-draw.ts    GSAP: draw walls, swap drawings
  plan-scan.ts    anime.js: cone scanning, camera emphasis
  icons.ts        anime.js: icon redraw on hover, badge check
  index.ts        init(): picks what to load for the current page
```

- React islands call the exported functions through refs or custom events. They do not contain tweens.
- Load strategy: `index.ts` runs on `requestIdleCallback` (fallback `setTimeout`) after first paint. Below-the-fold modules are loaded with dynamic `import()` when their section is near the viewport (`IntersectionObserver`, `rootMargin: "200px"`). GSAP core is shared by all modules through `gsap.ts`.
- Budget: motion JavaScript on the homepage under **60 KB gzip total**, not render-blocking, zero impact on LCP and CLS. If a module breaks the budget, cut the motion, not the budget.

## 4. Reduced motion and cleanup (mandatory pattern)

```ts
// gsap.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
export { gsap, ScrollTrigger, SplitText };

// any GSAP module
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // build timelines and ScrollTriggers here
  return () => { /* optional cleanup; matchMedia reverts automatically */ };
});
// reduced motion: nothing runs, elements stay in their final state

// anime.js module
import { createScope, animate, stagger } from "animejs";
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) {
  const scope = createScope({ root: el }).add(() => {
    animate(".cone", { rotate: [0, -5, 5, 0], duration: 2400, delay: stagger(200), ease: "inOutSine" });
  });
  // call scope.revert() when the island unmounts or the drawing is replaced
}
```

Verify API names against the installed versions. After fonts load, call `ScrollTrigger.refresh()` once. Never leave a ScrollTrigger alive after its element is removed (`kill()` or `revert()`).

## 5. Motion catalogue

| # | Where | Library | Trigger | Spec | Reduced motion |
|---|---|---|---|---|---|
| 1 | Hero H1 | **CSS** | Page load | Words rise out of a mask, 65 ms stagger, 0.85 s, `cubic-bezier(.2,.7,.2,1)`. CSS keyframes only. LCP-safe. | Final state |
| 2 | Hero lead, CTAs, location line | **GSAP** timeline | After first paint | Fade up 14 px, 0.8 s, sequenced after the H1. Elements are visible in HTML; GSAP uses `from()` only after paint, with a 1.5 s failsafe that forces visible. | Final state |
| 3 | Hero plan card | **GSAP** | After first paint | `clip-path` wipe top to bottom, 1 s. | Final state |
| 4 | Plan walls | **GSAP DrawSVG** | After the wipe; and on every property switch | Walls draw 1.8 s first time, 0.9 s on switch. | Final state |
| 5 | Camera cone scan | **anime.js** | After walls finish; hover on the plan replays | Cones rotate 0, -5, +5, 0 degrees about each camera, 2.4 s, 2 cycles, stagger 200 ms, `inOutSine`. Isometric view: scale 1 to 0.9 and back with opacity 1 to 0.55 instead of rotation. | Final state |
| 6 | Property switch (Building, Housing society, Home, Shop or office) | **GSAP** | Tab click | Old drawing fades out 0.15 s, new drawing swaps in and draws (item 4). Both pickers (hero and planning section) stay in sync. Caption updates. | Instant swap |
| 7 | Legend and factor chips | **anime.js** (emphasis) + CSS | Hover, focus, tap | Selected zone stays at full opacity, others fade to 12% over 250 ms. Chips toggle the same state. Always works on tap, never hover-only. | Instant |
| 8 | Section dimension line | **GSAP ScrollTrigger** | Section enters (20%) | Line scales in from left, 1 s, end tick fades in. Once. | Final state |
| 9 | Stagger groups (segment tiles, why list, fact strip) | **GSAP ScrollTrigger** batch | Group enters | Fade and rise 16 px, 80 ms stagger, 0.7 s. Once. Not applied to every section. | Final state |
| 10 | Section titles (H2) | **GSAP SplitText** | Enters | Optional: line mask reveal, 0.7 s. Use only on two or three signature headings, not all. | Final state |
| 11 | Process timeline | **GSAP ScrollTrigger** | Section 35% visible | Connector fills 3.4 s; steps light in order 0.6 s apart; step 6 ends green. Once. Mobile accordion behaviour is shadcn Accordion, untouched. | Final state |
| 12 | Isometric planning drawing | **GSAP** DrawSVG + **anime.js** breathe | Enters | Walls draw once; cones breathe (scale 1 to 0.9, 2 cycles). | Final state |
| 13 | Service and segment icons | **anime.js** `svg.createDrawable` | Hover, focus | Stroke redraws in 0.9 s, once per hover. | None |
| 14 | Support badge | **anime.js** timeline | Enters | Check draws 1.4 s, halo ring expands twice. | Final state |
| 15 | Final CTA background plan | **GSAP DrawSVG** | Enters | Outline draws, stagger 140 ms, low-contrast white 22%. | Final state |
| 16 | Header | **GSAP ScrollTrigger** | Scroll | Header min-height and logo width shrink at 24 px scrolled. Read-progress line (3 px, cyan to royal) scales with scroll progress. Transform and width of the logo only. | No progress animation, static header |
| 17 | Buttons | **CSS** | Hover, press | Fill sweeps in from left 0.4 s, arrow slides 5 px, press scales to 0.98. Hero primary button pings once after load. | No sweep, no ping |

Everything not listed above is not animated.

## 6. Hard limits

- At most **one scroll-triggered effect per section**, plus its stagger.
- No animation starts before first paint. No script blocks rendering.
- No layout shift: drawings and containers have fixed aspect ratios before animation.
- Mobile: drop item 10 (SplitText), drop hover-only effects (items 13, plan hover replay), keep taps. Shorten durations by about 20%.
- `ScrollTrigger` uses `once: true` or `toggleActions: "play none none none"`. No scrub-driven effects except the read-progress line.
- Keyboard and touch parity: every effect triggered by hover also triggers on focus or tap, or is purely decorative.

## 7. Testing checklist (every stage that touches motion)

1. Reload with throttled CPU (4x). The H1 and CTAs are readable immediately, nothing flickers or jumps.
2. Turn on reduced motion in the OS: page shows final states, no tween runs (check the console for GSAP or anime.js activity).
3. Lighthouse mobile: LCP 2.5 s or less, CLS 0.1 or less, INP 200 ms or less. Motion bundle within budget (`astro build` size report).
4. Resize and orientation change: ScrollTrigger positions refresh, no stuck states.
5. Rapid clicking on the property picker: no stacked timelines, no leftover SVG (previous timeline killed, previous scope reverted).
6. Navigate away and back (and, if view transitions are ever added, `astro:before-swap`): no duplicate listeners or triggers.
7. Screenshots at 390, 768, 1280 and 1440 widths with the animation at rest.

## 8. Lessons from the GSAP + anime.js prototype

Reference: `docs/design-proposal/mock-site-gsap.html` (same design as `mock-site.html`, with every motion in section 5 driven by the real libraries; open it through `final-mock.html`). Verified in a browser with GSAP 3.13.0 (ScrollTrigger, DrawSVG, SplitText) and anime.js 4.5.0.

- **anime.js v4 `loop: N` means N extra repeats**, not N plays. `loop: 1` gives two plays; `loop: 2` gave three plays (9.6 s) and broke the 5-second rule. Use `loop: 1` for "2 cycles". Check `animation.iterationCount` and `duration` in testing.
- **`from()` tweens leave inline transforms.** On elements that also have CSS hover transforms (tiles, cards), always pass `clearProps: "transform,opacity,visibility"`, otherwise the inline `transform` overrides the hover lift.
- **DrawSVG and `pathLength`:** do not put a `pathLength` attribute on elements GSAP DrawSVG animates. Keep it only where anime.js `svg.createDrawable()` is used (it sets it itself).
- **Hidden-until-animated content:** use a head class (`anim-pending`) that is only added when reduced motion is off and has a 2.5 s failsafe timer, then let GSAP `set()` the start state before removing the class. This avoids a flash and guarantees content is never left hidden if a script fails.
- **Lag smoothing:** GSAP's default lag smoothing slows animations to slow motion when a tab is throttled (the preview pane did this). The prototype turns it off for demo accuracy. **Production keeps the default.**
- **One owner per element:** the prototype uses GSAP for the plan walls and anime.js for the cones on the same SVG, which is fine because they touch different elements and properties (stroke dash versus transform).
- **Name clashes:** the plan builders used a variable called `G` for the ground polygon. Do not use short global names like `G`, `A` or `ST` for library handles; import named exports in TypeScript modules.
- **Integrity:** if scripts are ever loaded from a CDN (the prototype does), pin the exact version and add `integrity` and `crossorigin`. The production build bundles them through npm instead.

### Round 2 review changes (applied in the prototype)

- **Camera sweep is ±12° (±10° on the services card).** ±5° read as a twitch, not a scan.
- **Hover replay only when idle.** Calling `revert()` mid-sweep snaps cones back to 0°. Check `animation.completed` before replaying on `mouseenter`.
- **Coverage shape is a wedge with a radial fade**, not a flat triangle: apex at the camera, a gentle arc at the far edge, `radialGradient` from about 62% to 10% opacity using the zone colour. Wedge length is trimmed 6% so rotation stays inside walls.
- **Cameras are a camera glyph on a royal disc**, not a plain dot. Flat view scale 1.2, isometric 0.95.
- **Buttons:** fill sweep 0.26 s, colour 0.18 s, arrow 0.22 s (was 0.4 s). Weight 650.
- **Type:** Archivo headings 700 (was 800), H1 stretch 100–102% so the hero H1 sits on 4 lines at 1280 px.
- **Orange is used twice, sparingly:** the hero eyebrow dot and the end tick of each section dimension line, plus entrance zones. Never for buttons or text.
- **More GSAP (round 3):** header entrance stagger; SplitText line mask on every `h2` (tablet and up); numbered kickers slide in; hero parallax (grid drift and plan card -30 px, scrubbed, tablet and up); process circle pulse in sequence; a "Planned for ..." line under the H1 that swaps (slide out, slide in) when the property picker changes; vehicles roll into the plan after the walls draw (`.mv`, offsets in `data-dx` and `data-dy`); pointer-follow spotlight on tiles and cards (hover devices only).
- **CSS only, finite:** camera signal ring (2 pulses) and green recording dot (4 blinks) on every camera.
- **Round 4 (Indian context, no moving vehicles):** drawings now show Indian property features: compound wall and gate piers, two-wheeler parking rows, auto-rickshaw on the society road, overhead water tank and lift core on roofs, windows on every storey, shop shutter and sign board, gated bungalow with porch. Vehicles are static. Isometric heights raised (building 46, society blocks 50, home 38, shop 36) and `OY` moved to 62 to fit.
- **Projection animation (GSAP):** isometric masses rise out of the ground plane with a short stagger, then windows switch on in random order, then gate piers, shutters and sign board fade in. Plan view: zones fade in, then two-wheelers and piers pop in with `back.out`. Both run after the DrawSVG wall draw starts.
- **Final CTA live-view panel:** four camera tiles (line drawings, labelled illustrative) rise in, lines draw with DrawSVG, scan lines sweep with `repeat: 3` (finite), green REC dots blink 6 times (CSS).
- **Whitespace:** section padding 46 px mobile and 66 px desktop, section head gap 26 px, grid gaps tightened.
- **Hero is calmer:** the in-drawing "Illustrative" plaque is removed (the caption row already says it) and the bottom location line moved into the eyebrow. On phones the property picker now starts inside the first screen.
