# Development prompt

Paste everything below the line into a new Claude Code session opened in this repository.

---

You are the lead engineer building the **YONAM CCTV SURVEILLANCE** website (Nadiad, Gujarat, India) in this repository. Planning, design and prototyping are finished and approved. Your job is to implement them faithfully, one reviewed stage at a time.

## 1. Read these first, in this order

1. `AGENTS.md` (how to run the dev server)
2. `docs/PRD.md` (PRD v3.1, the requirements)
3. `docs/design-system.md` (tokens, type, components, rules)
4. `docs/motion-spec.md` (GSAP, anime.js and CSS roles, catalogue, limits)
5. `docs/design-proposal/mock-site.html` (the approved visual and interaction prototype; open it through `docs/design-proposal/final-mock.html` for desktop and phone windows)

Precedence if they disagree: my latest instruction in chat, then PRD, then design system, then motion spec, then prototype. Note every conflict you find and tell me; do not silently choose.

## 2. Product in one paragraph

Static, fast, SEO-friendly marketing site that generates genuine CCTV inquiries from builders, housing societies, homeowners and businesses. Its identity is **Blueprint**: plan illustrations that make "a dedicated plan for every property" visible. The hero has a property picker (Building, Housing society, Home, Shop or office); each choice swaps in its own plan drawing, and the planning section follows with an isometric drawing for the same property type.

## 3. Stack (approved, nothing else without asking)

Astro 7 (existing) · Tailwind CSS v4 (existing) · TypeScript · **React islands via `@astrojs/react`, for interactive UI only** · **shadcn/ui** (Radix) · **GSAP** (ScrollTrigger, SplitText, DrawSVG) · **anime.js v4** · GitHub · Cloudflare Pages.

- Static content stays in plain `.astro` files. Hydrate islands with `client:visible` or `client:idle`, never `client:load` without a stated reason.
- Install shadcn using its Astro guide for Tailwind v4. **First verify it works with the installed Astro, Tailwind and React versions and tell me about any conflict.** Map our tokens to shadcn variable names (see design system §3).
- Confirm package names and versions with `npm view` before installing GSAP, `@gsap/react` (only if needed), `animejs` (v4, named ESM imports, not the v3 default export) and the font packages. Check licences.
- Use shadcn for: Button, Tabs, Accordion, Sheet, Carousel, NavigationMenu, Card, Badge, Separator, and for forms Form, Input, Textarea, Select, Label, RadioGroup, Checkbox, Progress (react-hook-form + zod).
- **Animation roles (motion-spec §2):** GSAP for page-level and scroll choreography; anime.js for component-level SVG and micro-interactions; CSS for simple states and the H1 first-paint reveal. One owner per element. Use the libraries where they genuinely fit the catalogue in motion-spec §5; do not invent extra animations. All motion code lives in `src/scripts/motion/*.ts`, not inside React components.

## 3a. Non-negotiables

- **Never invent business information.** Phone, WhatsApp, email, address, domain, support scope, response times, warranties, brands, certifications, testimonials, ratings, statistics, project counts, company history, years of experience: all pending. Use visible "to be confirmed" placeholders in development only, and keep them in one data file (`src/data/company.ts`) so they are easy to replace. Never publish a number, claim or testimonial I have not given you.
- **Logo:** use the supplied artwork only. Copy `docs/design-proposal/yonam-logo.jpg` (master, never edited) and `yonam-logo.png` (transparent, **use this on the site**, light surfaces only) into `src/assets/logo/` unchanged. Never redraw, recolour, crop or recreate it from text. Optimise delivery with `astro:assets`, do not edit pixels.
- **Forms never show fake success.** No backend exists in Phase 1. Until a real submission destination is configured, show verified contact alternatives instead of "sent".
- **No fake photos** of YONAM installations. Illustrations carry the visuals, always captioned "Illustrative · not to scale".
- **No location pages or keywords for cities other than Nadiad.**
- **Do not deploy to production** and do not merge to `main` without my approval.
- Copy comes from the PRD and the prototype. Mobile "short" variants in the prototype are my drafts: use them, mark them in the data files as `draft`, and list them in your report.

## 4. Rules that make or break the quality

- **Mobile first.** A long paragraph must never be the first thing a phone user sees. Follow the prototype's mobile patterns: one-line hero summary, one full-width primary button plus a text link, property picker above the plan, swipe cards (Carousel) for services, tap-to-expand steps (Accordion), "See how we work" collapse, sticky Call / WhatsApp / Enquire bar (Call and WhatsApp inactive until real numbers exist), menu as a Sheet.
- **One standard button size** (52 px; the only other size is the 44 px compact header button). Animated per design system §7.
- **Typography:** Archivo (headlines, buttons, drawing lettering) plus Manrope (body), self-hosted, no layout shift. No tracked all-caps eyebrow above headings; sections open with the drawn dimension line.
- **Colour roles:** each colour has one job (design system §3). Royal means "clickable" only. Orange, cyan and green never carry text on white (use the darker text variants).
- **No dead space:** section padding 56 px mobile and 84 px desktop.
- **Footer is light** with the transparent logo directly on it, no plate.
- **LCP:** the H1 is the LCP element and must paint without waiting for any JavaScript. Its reveal is CSS only.
- **Motion:** after first paint only, finite (about 5 s), reduced motion shows final states, budget under 60 KB gzip for motion on the homepage, no layout shift.
- **Accessibility (WCAG 2.2 AA):** visible focus, 44 px targets, keyboard-operable Sheet / Tabs / Accordion / legend, zones named in text, `aria-label` on every drawing, `prefers-reduced-motion` honoured.

## 5. The illustration system

Port the SVG builders in `docs/design-proposal/mock-site.html` into typed modules under `src/lib/plans/`: eight drawings (four property types by two views: plan view and isometric), data-driven, same zone vocabulary (entrances orange, outdoor/parking navy, common areas cyan, recording room green), labels per type, title block, legend. Render the default Building view at build time; the `PropertyPicker` island swaps the rest. Both pickers (hero and planning section) share one state. Wall drawing uses GSAP DrawSVG; cone scanning uses anime.js; legend and factor-chip emphasis is zone isolation (others fade to 12%) and must work on tap and keyboard.

## 6. Stages (do them in order, one branch and one PR per stage)

For every stage: create a branch (`feat/sN-name`), implement, then **run `npm run check`, `npm run lint`, `npm run build`**, start the dev server with `astro dev --background` (see AGENTS.md), **review it in the browser at 390, 768, 1280 and 1440 px**, check the console, keyboard use and reduced motion, fix what you find, then commit (conventional commits) and open a PR. Report using section 8 and **stop and wait for my approval before the next stage.** A passing build does not mean a stage is done; the visual review does.

| Stage | Deliverable | Done when |
|---|---|---|
| **S0 Inspect** | Read-only report of repo, dependencies, versions, Astro/Tailwind/React/shadcn compatibility, assets, CI, headers. Also commit the existing `docs/` folder on branch `docs/design-and-prd`. | I have the report and the docs PR. |
| **S1 Foundation** | React integration, shadcn init and token mapping, Tailwind `@theme` tokens, self-hosted Archivo and Manrope, `MainLayout`, global styles, logo assets in `src/assets/logo/`, data files (`company`, `navigation`, `services`, `solutions`, `faqs`), SEO head component, analytics `track()` stub, favicon placeholder. | Blank page with correct fonts, tokens, layout, no console errors, build passes. |
| **S2 Header and navigation** | Sticky shrinking header with progress line, desktop NavigationMenu dropdowns, mobile Sheet, sticky mobile action bar, skip link. | Matches prototype at all four widths, keyboard and focus trap verified. |
| **S3 Illustration system** | `src/lib/plans/` builders, `PropertyPicker` island, legend, caption, shared state. | All eight drawings render correctly, picker works, tap and keyboard isolate zones. |
| **S4 Hero** | Hero with H1 (CSS reveal), copy, buttons, picker and plan card, plus hero motion (GSAP sequence, DrawSVG walls, anime.js cones, replay on hover). | LCP is the H1, no CLS, reduced motion verified, mobile pattern correct. |
| **S5 Segments, facts, about, services** | Fact strip, four segment tiles, About (mobile collapse), services bento with Carousel on mobile. | Matches prototype, hover and icon redraw work. |
| **S6 Planning, process, why, support** | Planning section with isometric drawing following the picker and factor chips, process timeline (desktop fill, mobile Accordion), why-choose list, support band. | Motion per catalogue, picker sync verified. |
| **S7 FAQ, final CTA, footer** | Accordion FAQ (nine questions, unverified answers marked draft and hidden in production build), final CTA band with drawn plan, light footer. | Homepage complete and matches prototype. |
| **S8 Motion QA** | Scroll reveals, dimension lines, header shrink, any catalogue item still missing. Audit against motion-spec §7. | Checklist in motion-spec §7 passes and is reported. |
| **S9 Inner pages** | About, Services, four Solutions pages, Privacy Policy, 404, from PRD §10 content only. Breadcrumbs. No empty pages. | Pages built from real PRD text, internal links work. |
| **S10 Contact, inquiry forms, guided assessment** | Contact page, Project and Individual inquiry forms, six-step guided assessment, callback optional. Validation, accessible errors, no fake success, verified-contact fallback panel, WhatsApp button inactive until number exists. | Forms validate, `track()` events fire, no success message without a destination. |
| **S11 SEO** | Per-page titles and descriptions, canonical (needs `site`, ask me for the domain, use a placeholder until then), Open Graph, `@astrojs/sitemap`, `robots.txt`, JSON-LD (Organization, LocalBusiness, Service, BreadcrumbList, WebSite) from verified data only. | Structured data validates, no invented fields. |
| **S12 Performance, accessibility, testing** | Lighthouse (mobile) for LCP, INP, CLS; axe or equivalent; broken-link check; image audit; bundle report; CSP review for `_headers` after islands. | Targets met or deviations explained, report attached. |
| **S13 Deploy prep** | Cloudflare Pages preview deployment configuration and README deployment notes. | Preview works. **Production only after my explicit approval.** |

## 7. Working rules

- **Ask before:** adding any dependency not listed in section 3, deviating from the prototype or design system, changing copy, adding an animation not in the catalogue, deploying, or merging.
- **Small, reviewable commits.** Conventional commit messages. Do not skip hooks or CI.
- **Do not edit** `docs/design-proposal/*` (reference material) or the logo masters.
- If something in the PRD, design system or prototype is wrong or impossible (for example a library incompatibility), stop and report it with options. Do not work around it silently.
- Keep content in `src/data/*` separate from presentation. Reusable components where useful, no needless abstraction.
- Update `docs/design-system.md` or `docs/motion-spec.md` in the same PR when the build forces a change, and say so.

## 8. Report format after each stage

1. What was built (files and components).
2. How it was verified: commands run with results, widths reviewed, console, keyboard, reduced motion, screenshots.
3. Deviations from the prototype or docs, and why.
4. Placeholders and draft copy introduced.
5. Open questions for me, one at a time and only if genuinely blocking.
6. The PR link and the stage you propose next.

## 9. Start now

Begin with **S0**: do not modify any code except committing `docs/`. Give me the inspection report, then wait.
