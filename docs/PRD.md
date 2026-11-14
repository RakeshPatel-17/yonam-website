# YONAM CCTV SURVEILLANCE: Product Requirements Document (PRD)

**Version:** 3.1 (consolidated from v3.0 as supplied, plus approved changes below)
**Project:** Official business website
**Business location:** Nadiad, Gujarat, India
**Business category:** CCTV surveillance solutions and implementation
**Hosting:** Cloudflare Pages · **Source control:** GitHub
**Approach:** Design-first, incremental implementation

Companion documents: [`design-system.md`](design-system.md) (visual rules, tokens, components), [`motion-spec.md`](motion-spec.md) (GSAP and anime.js usage), [`DEVELOPMENT-PROMPT.md`](DEVELOPMENT-PROMPT.md) (how to build), and the approved visual prototype [`design-proposal/mock-site.html`](design-proposal/mock-site.html).

**Precedence when documents disagree:** the user's latest instruction in chat, then this PRD, then `design-system.md`, then `motion-spec.md`, then the prototype.

---

## 0. Changes in v3.1 (approved by the client)

| # | Change | Replaces in v3.0 |
|---|---|---|
| 1 | **Design direction: "Blueprint"** (planning-led premium corporate). Zone Coded colour coding, plan-view hero, isometric planning section, four property types each with its own drawings. | §7.1 open direction |
| 2 | **Typography: two families with a clear purpose.** Archivo (extra-wide, heavy) for headlines to echo the wordmark and for drawing lettering, Manrope for reading text. | §7.2 "one primary family" |
| 3 | **Logo background removal approved.** A transparent PNG (`yonam-logo.png`) has been made from the supplied JPEG: white background and the faint grey drop shadow removed, empty margin trimmed, artwork and colours untouched, the original JPEG kept. | §6.1 "never modify" (for background removal only) |
| 4 | **Footer is light** (ice background) because the logo wordmark is navy and the transparent logo must sit on a light surface. | §9.12 |
| 5 | **UI components: shadcn/ui via React islands in Astro.** React is approved for interactive parts only. Static content stays in plain Astro. | §17.1 "no React" |
| 6 | **Animation libraries: GSAP and anime.js approved**, with strict roles (see §17.5 and `motion-spec.md`). | §7.4 "no heavy animation libraries" |
| 7 | **One standard button size** (52 px) site-wide, animated; one compact variant (44 px) for the header only. | n/a |
| 8 | **Mobile content pattern:** short copy first, swipe cards, tap-to-expand steps, property picker above the plan, sticky action bar. | §7.5 |
| 9 | Hero property picker (Building, Housing society, Home, Shop or office) swaps the drawing, and the planning section follows the selection. | n/a |

Everything not changed here keeps its v3.0 meaning.

---

## 1. Executive summary

**YONAM CCTV SURVEILLANCE** is a CCTV surveillance solutions company based in Nadiad, Gujarat, India. It prepares a dedicated CCTV implementation plan for each customer's property.

Business approach: (1) understand customer requirements, (2) assess the property and surveillance needs, (3) prepare a dedicated implementation plan, (4) install the required CCTV infrastructure, (5) configure and set up the system, (6) provide long-term support.

**Objective:** a professional website that communicates this complete approach and positions YONAM as a reliable surveillance implementation partner, not a seller of cameras.

**Primary business objective:** generate genuine inquiries from builders and property developers, housing societies and apartment complexes, residential building owners, individual homeowners, commercial property owners, and shops, offices and warehouses. Make it easy to understand services, explore relevant solutions and request a consultation or site assessment.

**Positioning (proposed, final copy approved by the business):** *YONAM: Complete CCTV Surveillance Solutions, From Planning to Long-Term Support.*

**Core differentiator:** YONAM does not use a one-size-fits-all approach. Every property differs, so YONAM prepares a dedicated plan. Customers do not need to know camera quantities, placement or infrastructure before contacting the company; YONAM assesses and recommends.

## 2. Business profile

| Attribute | Information |
|---|---|
| Company name | YONAM CCTV SURVEILLANCE |
| Base location | Nadiad, Gujarat, India |
| Primary service | Dedicated CCTV implementation planning |
| Other services | CCTV installation, system configuration and setup, long-term support |
| Primary audience | Builders, developers, housing societies |
| Secondary audience | Residential and commercial customers |

Nadiad is the only confirmed base. **Service coverage elsewhere is not confirmed: do not create location pages or target keywords for other cities.**

## 3. Product vision

A premium, professional, modern, trustworthy and search-friendly website. A visitor quickly understands what YONAM does, which property types it serves, how its process works, how it plans a solution, what installation and setup involve, that long-term support is part of the offering, and how to request a consultation. The site must generate qualified inquiries, not merely display company information.

## 4. Target audience

- **Builders and developers (primary):** residential builders, developers, new construction, multi-storey residential and commercial projects. Needs: implementation planning, entrance and exit surveillance, parking, common areas, camera placement planning, infrastructure and cabling planning, installation coordination, configuration, long-term support. The site must make YONAM look capable of planning larger properties.
- **Housing societies and apartments:** new and existing societies, apartment complexes, management committees. Needs: main entrance, parking, common areas, building access points, upgrades of existing systems, infrastructure planning, long-term support.
- **Individual residential customers:** houses, flats, apartments, villas, bungalows, garages, workshops. Needs: home CCTV planning, indoor and outdoor surveillance, installation, configuration, recording setup, long-term support.
- **Commercial customers:** shops, offices, showrooms, warehouses, workshops, commercial buildings. Needs: entrance monitoring, indoor and outdoor surveillance, important-area coverage, recording infrastructure, installation and configuration, long-term support.

## 5. Business workflow (the site must communicate it)

1. **Customer inquiry:** website form, phone, WhatsApp (once the official number is provided).
2. **Requirement understanding:** property type, location, requirements, expected coverage, existing infrastructure.
3. **Property assessment:** entrances and exits, parking, common spaces, indoor and outdoor areas, layout, installation infrastructure.
4. **Dedicated implementation planning:** central to the positioning; strong visibility throughout the site.
5. **Installation** according to the approved plan.
6. **System setup and configuration**, configured and tested.
7. **Long-term support.** Exact scope, response times, packages and terms must be confirmed before publishing specific promises.

## 6. Brand identity and logo

### 6.1 Official logo

Use the exact supplied logo. Never redesign it, generate a replacement, recreate it from text and CSS, change its artwork or colours, distort its proportions, or crop important elements. Keep clear space.

**Approved assets (v3.1):**
- `yonam-logo.jpg`: original supplied file (1254 x 1254, white background). Keep unchanged, as the master.
- `yonam-logo.png`: transparent version (1208 x 1095). Background and drop shadow removed, margin trimmed. **Use this one on the website.** It is for light surfaces only because the wordmark is navy.
- Both are in `docs/design-proposal/`. Copy them to `src/assets/logo/` unchanged.
- Used in: header, footer, brand sections, mobile menu sheet. Favicon only from an original emblem asset (pending; do not crop the emblem out without approval).
- If the designer later supplies SVG or a horizontal lockup, replace the PNG.

### 6.2 Brand colours

Derived from the logo, adjusted for accessible text. Navy and blue dominate; orange and green are limited accents (under about 4% of any screen). Full tokens, contrast table and the **colour coding rules** (each colour has one job) are in `design-system.md` §3. Avoid rainbow gradients, neon, excessive shadows, unnecessary dark dashboard looks, random colour combinations.

### 6.3 Brand personality

Professionalism, reliability, technical capability, trust, clarity, customer commitment.

## 7. Website design philosophy

Look like it was designed by a professional UI/UX agency, never a generic AI template.

- **7.1 Direction: Blueprint.** Premium corporate and modern technology, trust-focused, planning-led. Plan illustrations make "a dedicated plan for every property" visible. Details in `design-system.md`.
- **7.2 Typography.** Two families, each with a purpose: **Archivo** (wide, heavy; headlines, buttons, drawing lettering in condensed capitals) and **Manrope** (body). Self-hosted variable fonts. Scale and rules in `design-system.md` §4. Avoid generic AI typographic tells: tracked all-caps eyebrow above every heading, single-word accent in headlines, numbered markers on non-sequences.
- **7.3 Layout.** Balanced whitespace (but no dead space: section padding 56 px mobile, 84 px desktop), consistent spacing, clear hierarchy, strong CTA placement. Avoid repeating identical card layouts.
- **7.4 Motion.** Purposeful and subtle, built with **GSAP and anime.js within the rules of `motion-spec.md`**, plus CSS for simple states. Respect `prefers-reduced-motion`. No heavy or decorative effects.
- **7.5 Responsive.** Mobile first, no horizontal overflow, accessible mobile navigation, proper image scaling, readable type, touch-friendly targets (44 px minimum), comfortable forms. **Mobile content pattern:** short copy first (a long paragraph must never be the first thing a phone user sees), swipeable cards instead of long stacked sections, tap-to-expand steps, sticky action bar. Works on small and large phones, tablets, laptops, desktops, large monitors.

## 8. Information architecture

```text
Home
About Us
Solutions
  Building CCTV Solutions
  Housing Society CCTV Solutions
  Residential CCTV Solutions
  Commercial CCTV Solutions
Services
  CCTV Implementation Planning
  CCTV Installation
  CCTV System Setup
  Long-Term Support
Projects (genuine projects only; omitted until they exist)
FAQs
Contact Us
Privacy Policy
```

Base the final structure on available content. **Do not create empty pages to inflate page count.**

## 9. Homepage requirements

The homepage communicates the business model and guides visitors to an inquiry. The approved visual and interaction reference is `design-proposal/mock-site.html`.

- **9.1 Header:** original logo; Home, About Us, Solutions, Services, Projects (if available), Contact Us; primary CTA. Desktop: horizontal nav with dropdowns, 92 px tall, shrinks on scroll. Mobile: compact header, menu opens as a **Sheet**, easy-to-find contact option, sticky Call / WhatsApp / Enquire bar (Call and WhatsApp inactive until real numbers exist).
- **9.2 Hero:** headline **"Complete CCTV Surveillance Solutions, Planned Around Your Needs."** Supporting copy: *"From dedicated implementation planning and professional installation to system setup and long-term support, YONAM helps deliver CCTV surveillance solutions according to your property's requirements."* Primary CTA **Discuss Your Project**; secondary **Request a Site Assessment**. Show the Nadiad location. Visual: the **property picker + plan illustration** (Building, Housing society, Home, Shop or office, each with its own drawing). No fake photographs of YONAM installations. On mobile the hero shows a one-line summary, one full-width primary button and the secondary action as a text link.
- **9.3 Customer segmentation:** four categories (Building Projects, Housing Societies, Residential Properties, Commercial Properties) with CTAs Explore Building / Society / Residential / Commercial Solutions, each leading to relevant content.
- **9.4 About YONAM:** introduce the company; emphasise dedicated planning, property-specific requirements, installation, configuration, long-term support. CTA About YONAM.
- **9.5 Services:** the four confirmed services, each with title, short explanation, visual, Learn More where a page exists. Layout: one featured card (planning) plus smaller cards; swipe carousel on mobile.
- **9.6 Dedicated implementation planning (signature section):** *"Every property has different surveillance requirements. YONAM develops a dedicated CCTV implementation plan based on your property, coverage requirements and expectations."* Considers property layout, entrances and exits, common areas, parking, indoor and outdoor areas, infrastructure and installation requirements. Shows the **isometric drawing for the selected property type**, with factor chips that highlight zones.
- **9.7 Implementation process:** visual timeline: 1 Understand Your Requirements, 2 Assess Your Property, 3 Prepare a Dedicated Plan, 4 Install the CCTV System, 5 Configure and Test, 6 Provide Long-Term Support. Horizontal on desktop, tap-to-expand list on mobile.
- **9.8 Why choose YONAM:** actual strengths only: dedicated implementation planning, property-specific solutions, installation and system setup, support beyond installation, solutions for different property types. **Never invent certifications, awards, experience or statistics.**
- **9.9 Project showcase:** when genuine photographs exist: property type, description, installation photos, scope, services. No customer details or property photos without permission. **Omit until material exists.**
- **9.10 FAQs:** (1) How do I determine the CCTV requirements for my property? (2) Does YONAM prepare a dedicated implementation plan? (3) Do you provide installation and system setup? (4) Do you work with builders and housing societies? (5) Can you install CCTV in existing buildings? (6) What factors affect installation costs? (7) Do you provide long-term support? (8) Can an existing CCTV system be upgraded? (9) How can I request a site assessment? **Answers must be verified against actual business practice; unverified answers are marked Draft and are not published.**
- **9.11 Final CTA:** **"Let's Plan the Right CCTV Solution for Your Property."** *"Tell us about your property and requirements. YONAM can help you understand the next steps towards a dedicated surveillance implementation plan."* CTA **Get in Touch**.
- **9.12 Footer (light):** original logo (transparent PNG, no plate), company description, navigation, services, solutions, Nadiad Gujarat India, verified contact information only, WhatsApp and social links if available, Privacy Policy, copyright.

## 10. Dedicated pages

- **10.1 About Us:** introduction, what YONAM does, business approach, dedicated planning, installation and setup, long-term support, CTA. **Do not invent history, founding year, team size or experience.**
- **10.2 Building CCTV Solutions** (builders, developers, residential and commercial building projects): requirement understanding, property assessment, dedicated planning, coverage considerations, installation, configuration, long-term support. CTA **Discuss Your Building Project**.
- **10.3 Housing Society CCTV Solutions:** main entrances, parking, common spaces, access points, existing-system improvements. CTA **Request a Society Assessment**.
- **10.4 Residential CCTV Solutions:** consultation, planning, installation and support in simple language. CTA **Request a Site Visit**.
- **10.5 Commercial CCTV Solutions:** how planning depends on layout and business requirements. CTA **Discuss Your Requirements**.
- **10.6 Services:** implementation planning, installation, system setup and configuration, long-term support. Only describe technical capabilities YONAM confirms.
- **10.7 Contact Us:** company name, Nadiad Gujarat India, verified phone, WhatsApp, business email, inquiry forms, map if a verified address exists.

## 11. Lead generation

Lead generation is the primary conversion objective. Separate journeys:

- **11.1 Project inquiry** (builders, developers, societies, large projects): contact person, phone, email (optional), project / society name, project type, property location, construction status, number of floors (optional), approximate property size (optional), requirements / message. CTA **Discuss Your Project**.
- **11.2 Individual inquiry** (homeowners, flat, shop and office owners): name, phone, email (optional), property type, property location, existing CCTV system (Yes / No / Not Sure), requirements / message. CTA **Request a Site Visit**. **Camera quantity is never mandatory.**
- **11.3 Guided CCTV requirement assessment (high priority):** step 1 property type (Residential Building, Housing Society, Individual House, Flat, Shop, Office, Warehouse, Other); step 2 property status (New Construction, Under Construction, Completed Property, Existing CCTV Upgrade); step 3 areas needing surveillance (Entrance, Exit, Parking, Common Areas, Corridors, Indoor Areas, Outdoor Areas, Not Sure); step 4 property location; step 5 contact (name, phone, email optional); step 6 submission to request a discussion or site assessment. **A requirement-gathering tool, not a camera calculator or quotation engine: promise no camera counts, coverage or pricing.**
- **11.4 WhatsApp:** add after the official number is provided (header, contact page, inquiry section, mobile bar) with an appropriate prefilled message. **Never invent a number.**
- **11.5 Callback request (optional):** name, phone, preferred contact time. Show success only when a real submission destination exists.

Forms use shadcn components (Form, Input, Select, Label, RadioGroup, Checkbox, Textarea, Progress) with react-hook-form and zod validation inside React islands. **Forms must not show fake submission success.** Until a real destination is configured, show verified contact alternatives instead.

## 12. Trust-building

Use genuine information: original branding, clear location, transparent process, dedicated planning approach, clear service explanations, genuine project photos, real testimonials when available, verified contact details, long-term support commitment, clear inquiry process. **Never invent testimonials, ratings, customer names, project counts, certifications, awards, guarantees or years of experience.**

## 13. Long-term support positioning

Long-term support is confirmed and must be an important part of the value proposition. Allowed wording: *"YONAM's commitment continues beyond installation, with long-term support for the implemented CCTV surveillance solution."* Before publishing details, confirm: what is included, remote / on-site / both, routine maintenance, repairs, whether visits are chargeable, annual maintenance contracts, response times. **Do not advertise 24/7 support, free maintenance or guaranteed response times without confirmation.**

## 14. SEO

- **14.1 Technical:** unique titles and meta descriptions, canonical URLs, Open Graph, XML sitemap, robots.txt, semantic HTML, correct heading hierarchy, descriptive URLs, internal linking, alt text, breadcrumbs where appropriate.
- **14.2 Local:** build around **Nadiad, Gujarat, India** (CCTV installation in Nadiad, CCTV camera installation in Nadiad, CCTV surveillance solutions in Nadiad, CCTV installation services in Nadiad, Building CCTV solutions in Nadiad). These are ideas, not verified search volumes. Do not target other cities until coverage is confirmed.
- **14.3 Structured data (JSON-LD):** Organization, LocalBusiness where appropriate, Service, BreadcrumbList, WebSite. Verified information only; no invented ratings or reviews.
- **14.4 Content:** useful, accurate articles later (residential building CCTV planning, new construction, housing society common areas, individual homes, recording and storage, commercial properties). No volume of shallow content.

## 15. Performance

Static rendering via Astro, minimal JavaScript, optimized images (AVIF/WebP, responsive sizes, lazy-load below the fold), efficient font loading (self-hosted variable fonts), no unnecessary third-party scripts or dependencies, no layout shift.

| Metric | Target |
|---|---|
| LCP | 2.5 s or less |
| INP | 200 ms or less |
| CLS | 0.1 or less |

Targets, not guarantees. **JavaScript budgets:** React islands hydrate only where interactive (`client:visible` or `client:idle`, never `client:load` without a reason). Motion scripts follow `motion-spec.md` (under 60 KB gzip on the homepage, loaded after first paint). The H1 is the LCP element and must never wait for JavaScript.

## 16. Accessibility

WCAG 2.2 AA where practical: semantic HTML, heading hierarchy, keyboard navigation, visible focus, accessible navigation and Sheet (focus trap, Escape), proper form labels, helpful validation messages, colour contrast, image alt text, **reduced-motion support for every animation**, zones named in text and legend (not colour alone), touch targets 44 px.

## 17. Technology and architecture

### 17.1 Approved stack

| Technology | Purpose |
|---|---|
| Astro | Static frontend (pages, layouts, content) |
| Tailwind CSS v4 | Styling, design tokens |
| TypeScript / JavaScript | Interactive features |
| **React (via `@astrojs/react`)** | **Islands for interactive UI only** (approved v3.1) |
| **shadcn/ui** (Radix primitives) | **Interactive components** (see 17.4) |
| **GSAP** (+ ScrollTrigger, SplitText, DrawSVG) | **Page-level and scroll motion** (see 17.5) |
| **anime.js v4** | **Component-level SVG motion and micro-interactions** (see 17.5) |
| HTML5 | Semantic markup |
| GitHub | Source control |
| Cloudflare Pages | Deployment |

Do not add Angular, Vue, Svelte, a CSS-in-JS library, a smooth-scroll library, another animation library, or any dependency not listed, without approval.

### 17.2 Project structure (adapt to the existing repo)

```text
src/
  assets/logo/              yonam-logo.jpg (master), yonam-logo.png (use on site)
  assets/images/
  components/               Astro components (static)
  components/ui/            shadcn components (React)
  components/islands/       React islands: PropertyPicker, MobileMenuSheet, ServicesCarousel, FaqAccordion, InquiryForms, GuidedAssessment
  layouts/MainLayout.astro
  pages/                    index, about, contact, privacy, services/, solutions/
  data/                     company, navigation, services, solutions, faqs (content kept separate from presentation)
  lib/plans/                TypeScript builders for the plan and isometric SVG drawings
  scripts/motion/           GSAP and anime.js modules (see motion-spec.md)
  styles/global.css         Tailwind v4 @theme tokens
public/                     robots.txt, favicon, _headers
docs/                       PRD, design system, motion spec, prototypes
```

### 17.3 Architecture principles

Keep content separate from presentation. Reusable components where useful, no needless abstraction. Prefer static rendering. Keep JavaScript minimal. Prepare for future API integration. No backend in Phase 1.

### 17.4 UI components (shadcn/ui)

- Install following shadcn's Astro guide with Tailwind v4. Verify compatibility with the installed Astro and Tailwind versions first and report any conflict instead of working around it silently.
- Map the design tokens to shadcn variable names (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--ring`, `--radius`) so the brand palette drives every component.
- Use shadcn for interactive parts: **Button** (customised to the one standard size), **Tabs** (property picker), **Accordion** (FAQs, mobile process steps), **Sheet** (mobile menu), **Carousel** (mobile service cards, uses Embla), **NavigationMenu** (desktop dropdowns), **Card**, **Badge**, **Separator**, **Form / Input / Textarea / Select / Label / RadioGroup / Checkbox / Progress** (inquiry forms and guided assessment). **Sonner** or **Alert** only for real states, never fake success.
- Static content (headings, paragraphs, lists, footer, simple cards) stays in plain Astro with Tailwind. Do not wrap static content in React.
- Do not override Radix or shadcn animations with GSAP or anime.js.

### 17.5 Motion (GSAP and anime.js)

The full spec is [`motion-spec.md`](motion-spec.md). Summary of the rules every contributor and AI agent must follow:

- **GSAP** for page-level choreography and scroll (hero sequence after first paint, ScrollTrigger reveals, process timeline, header shrink and progress, DrawSVG wall drawing, property-switch transitions). **anime.js** for component-level SVG and micro-interactions (cone scanning, icon redraw, badge check). **CSS** for simple states and the H1 first-paint reveal. One owner per element; never two libraries on the same property of the same element.
- Use them **where they genuinely fit** the catalogue in `motion-spec.md` §5. If an animation is not in the catalogue, do not add it without approval.
- Progressive enhancement: with JS off or reduced motion, everything is already visible in its final state. The H1 never waits for JS.
- Finite: nothing non-interactive runs longer than about 5 seconds. Only animate `transform`, `opacity`, `clip-path`, SVG stroke offset.
- Lazy and budgeted: loaded after first paint, dynamic imports below the fold, under 60 KB gzip on the homepage.
- Forbidden: smooth-scroll hijack, parallax, cursor followers, marquees, number counters, particle or 3D effects, page-transition libraries.

## 18. Phases

**Phase 1: professional static website.** Brand implementation, professional UI/UX, responsive homepage, About, Services, Building / Housing society / Residential / Commercial solutions pages, Contact, Privacy Policy, guided requirement assessment UI, inquiry form UI, WhatsApp integration after number confirmation, SEO, performance, accessibility, Cloudflare Pages deployment. Forms must not show fake success; offer verified contact alternatives until a destination is configured.

**Phase 2 (future):** backend and lead management (store, view, categorise, track, assign, follow up), notifications (email, WhatsApp Business if approved, internal), admin dashboard (inquiries, projects, services, FAQs, testimonials, content), business operations (site-visit scheduling, quotations, project tracking, follow-up, maintenance and support history).

## 19. Analytics and conversion tracking

Prepare events without collecting unnecessary personal data: project inquiry CTA clicked, individual inquiry CTA clicked, WhatsApp clicked, phone clicked, inquiry form started, inquiry form completed, contact page visited, guided assessment completed. Implement as a small provider-agnostic dispatcher (`data-track` attributes and a `track()` function) that does nothing until an approved analytics solution is chosen.

## 20. Security and privacy

HTTPS. No secrets in frontend code; no API keys in public environment variables. Collect only necessary information. Validate all input (backend validation in Phase 2). Protect customer information. No customer property photographs without permission. Suitable privacy policy. Keep the existing `public/_headers` security headers; extend (CSP) only after checking the Google/Fonts and script needs, and re-verify after adding islands.

## 21. Development workflow

1. **Stage 1, inspect the repository** (read-only): structure, package.json, Astro and Tailwind configuration, dependencies, git status, branch, assets, logo, Cloudflare configuration, documentation. Provide a report.
2. **Stage 2, business discovery:** use confirmed information. Maintain three lists: Confirmed, Pending, Requires clarification. Ask one question at a time, only for genuinely missing information.
3. **Stage 3, brand and design exploration:** *done.* Direction approved (Blueprint).
4. **Stage 4, design system:** *done as `design-system.md`, to be kept in sync as the build proceeds.*
5. **Stage 5, incremental implementation**, never in one large operation: foundation; global styles and tokens; main layout; header and navigation; hero and illustration system; customer segmentation and fact strip; about; services; implementation planning section; process timeline; trust sections and why-choose; FAQs; footer; About page; solution pages; Services page; Contact page; inquiry forms and guided assessment; Privacy page; motion layer; SEO.
6. **Stage 6, visual review after each major implementation:** run the local server, review desktop, tablet and mobile, spacing, typography, image rendering, alignment, navigation, interactions; fix issues. **A successful build does not mean a page is complete.**
7. **Stage 7, testing:** production build, browser console, broken links, navigation, forms, responsive layouts, metadata, structured data, sitemap, robots.txt, performance, accessibility, reduced motion.
8. **Stage 8, deployment:** commit approved changes, push to GitHub, Cloudflare preview deployment, review, **obtain approval, then production. Never deploy to production without approval.**

## 22. Feature priorities

| Feature | Priority | Phase |
|---|---|---|
| Original YONAM branding | Critical | 1 |
| Premium homepage | Critical | 1 |
| Mobile responsiveness | Critical | 1 |
| Dedicated implementation positioning | Critical | 1 |
| Builder / project inquiry journey | Critical | 1 |
| Individual inquiry journey | Critical | 1 |
| Nadiad local SEO | High | 1 |
| Services and solutions pages | High | 1 |
| Long-term support section | High | 1 |
| Contact and WhatsApp integration | High | 1 |
| Guided CCTV assessment | High | 1 |
| Technical SEO | High | 1 |
| Performance optimisation | High | 1 |
| Property-type illustrations and motion (Blueprint) | High | 1 |
| Genuine project gallery | Medium | 1, when available |
| Project planning checklist | Medium | 1 |
| Analytics | Medium | 1 |
| Admin dashboard, lead management, database, quotations, site-visit scheduling, support portal | Future | 2 |

## 23. Pending business information

Do not invent missing information. Use visible "to be confirmed" placeholders in development only; nothing invented in production.

| Information | Status |
|---|---|
| Company name | YONAM CCTV SURVEILLANCE |
| Original logo | Provided (JPEG); transparent PNG derived and approved |
| Base location | Nadiad, Gujarat, India |
| Dedicated implementation planning, installation, system setup, long-term support | Confirmed |
| Additional service areas | Pending |
| Business address | Pending |
| Contact number | Pending |
| WhatsApp number | Pending |
| Business email | Pending |
| Domain name | Pending |
| CCTV brands supported | Pending |
| Equipment supply model | Pending |
| Warranty terms | Pending |
| Exact long-term support scope | Pending |
| AMC availability | Pending |
| Remote monitoring | Pending |
| Genuine project photographs | Pending |
| Company history | Pending |
| Certifications | Pending |
| SVG / horizontal logo from designer | Pending (optional) |
| Gujarati / Hindi at launch | Pending (English only assumed) |
| FAQ answers verified by YONAM | Pending |

## 24. Definition of done (Phase 1)

- **Brand:** original logo used correctly (transparent PNG on light surfaces), consistent colours, professional identity.
- **Design:** professionally designed, polished desktop and mobile, consistent type and spacing, relevant optimised images, no generic AI-template look, matches the approved prototype or documents deviations.
- **Business:** services understood; dedicated planning clearly explained; installation and setup communicated; long-term support visible; builders and societies have a dedicated journey; individuals have a simple journey.
- **Functionality:** navigation works, forms validate, contact links work, no fake submission success, property picker and drawings work.
- **Motion:** only catalogue animations, GSAP and anime.js used per `motion-spec.md`, reduced motion verified, no LCP or CLS regression.
- **SEO:** metadata, canonical URLs, sitemap, robots.txt, accurate structured data, local SEO reflects verified information.
- **Performance:** production build succeeds, images optimised, JavaScript minimal and within budget, Core Web Vitals tested, accessibility reviewed.
- **Deployment:** GitHub updated, Cloudflare preview works, production deployment approved.

## 25. Final product vision

YONAM becomes a recognisable, credible digital brand for CCTV surveillance. The site communicates that YONAM provides more than installation: it understands the property, prepares a dedicated implementation plan, installs and configures the system, and supports the customer over the long term. Professional, trustworthy, modern, polished, easy to understand, mobile-friendly, fast, SEO-friendly, and designed to generate genuine business inquiries.
