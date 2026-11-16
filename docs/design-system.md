# YONAM Design System

Status: **approved** (PRD v3.1, client signed off the v3 prototype). Direction: **B, "Blueprint"**.
Companion docs: [`PRD.md`](PRD.md), [`motion-spec.md`](motion-spec.md). Visual source of truth: [`design-proposal/mock-site.html`](design-proposal/mock-site.html) (viewer: `final-mock.html`). Earlier explorations: `index.html` (three directions), `blueprint-explorations.html`.

Approved combination:

| Choice | Decision |
|---|---|
| Colour coding | **Zone Coded**: orange entrances, navy outdoor, cyan common areas, green recording |
| Hero illustration | **Plan view** (top-down, soft filled zones), one per property type |
| Planning-section illustration | **Isometric**, one per property type, follows the picker |
| Property types | Building, Housing society, Home, Shop or office. Each has its own plan and isometric drawing. |
| Type | **Archivo** (extra-wide headlines, buttons, drawing lettering) + **Manrope** (body) |
| Components | **shadcn/ui** via React islands in Astro |
| Motion | **GSAP + anime.js + CSS**, roles and catalogue in `motion-spec.md` |

## 1. Direction: Blueprint

Planning-led premium corporate. White and ice surfaces, navy type, calm blue actions, and plan illustrations that make "a dedicated plan for every property" visible. Trust comes from clarity: plain headings, a visible process, one obvious next step per screen. The site needs no photography to look finished, so it works on day one.

Rules that follow from the PRD:

- No fake installation photos, ever. Illustrations are drawings, always captioned "Illustrative · not to scale", never presented as a real YONAM plan.
- Dominant look is white, navy and blue. Orange and green stay under about 4% of any screen.
- No rainbow gradients, neon, heavy shadows or dark dashboard sections.
- No statistics, ratings, testimonials, certifications or support promises that are not confirmed.

## 2. Logo rules

Assets (copy unchanged from `docs/design-proposal/` into `src/assets/logo/`):

- `yonam-logo.jpg`: the supplied master (1254 x 1254, white background). Never edited.
- `yonam-logo.png`: transparent version, 1208 x 1095 (aspect about 1.10:1). White background and the faint grey drop shadow removed, empty margin trimmed, artwork and colours untouched. **This is the file the website uses.** Process the delivered image variants (AVIF/WebP, 2x) with `astro:assets`; do not edit the pixels.

| Rule | Value |
|---|---|
| Modify, recolour, redraw, recreate in text/CSS | Never |
| Distort | Never. Keep aspect ratio (`width` and `height` attributes set, `height: auto`). |
| Surface | **Light surfaces only** (white, ice). The wordmark is navy, so the logo disappears on dark surfaces. Do not add white plates; if a dark surface ever needs the logo, ask for a reversed asset. |
| Header size | Desktop 86 px wide (about 78 px tall), shrinking to 66 px on scroll. Mobile 54 px wide, 46 px when scrolled. |
| Footer size | 92 px wide, on the light footer. |
| Clear space | Half the emblem width on all sides. |
| Favicon | Only from an original emblem asset. Pending (current favicon is Astro's). Do not crop the emblem without approval. |
| Better files | If the designer supplies SVG or a horizontal lockup, replace the PNG and revisit header sizes. |

## 3. Colour

Derived from pixels of the logo, then adjusted so text passes WCAG 2.2 AA.

| Token | Hex | Use | Notes |
|---|---|---|---|
| `navy-950` | `#060F2E` | Footer background | White text 18.8 |
| `navy-900` | `#0B1F5C` | Headings, primary brand | Logo wordmark is about `#001C53`. On white 15.4 |
| `navy-700` | `#1243B0` | Button hover, links hover | On white 8.5 |
| `royal-600` | `#1650D0` | Buttons, links, focus ring | White text on it 6.8 |
| `cyan-500` | `#00ADFC` | Fills, lines, icons only | **Never text** (2.5 on white) |
| `cyan-700` | `#0369A1` | Cyan as text | 5.9 on white |
| `sky-100` | `#E3F2FD` | Selected chips, info tint | |
| `ice-50` | `#F3F7FE` | Alternate section background | |
| `orange-500` | `#FD7B01` | One signal per screen | **Never white text on it** (2.6). Use navy text (5.9). |
| `orange-600` | `#C2540A` | Orange as text | 4.6 on white |
| `green-500` | `#1CAD00` | Fills for support/"all clear" | **Never text** (3.0) |
| `green-700` | `#15803D` | Green as text | 5.0 on white |
| `ink` | `#0E1A33` | Primary body text | Slight blue bias |
| `slate-600` | `#475569` | Secondary text | 7.6 on white. Nothing lighter than `slate-500` (`#64748B`, 4.8) for text. |
| `line` | `#DDE4F0` | Borders, dividers | |
| `white` | `#FFFFFF` | Main background | |

### Colour roles (colour coding)

Each colour has one job, on the plan illustrations and in the page UI. Visitors learn the language without noticing.

| Colour | Meaning | On the plan | In the page UI | Never |
|---|---|---|---|---|
| Navy | Authority, structure | Walls, outdoor and parking zones | Headings, footer, process band | Buttons |
| Royal | "You can act here" | Camera positions only | Buttons, links, focus ring | Zones or decoration |
| Cyan | What the cameras cover | Coverage cones, common areas | Info notes, timeline connector | Text (use `cyan-700`) |
| Orange | Way in and out, one signal | Entrances and exits | One highlight per screen | White text on it |
| Green | Recording and support | Recording room | Long-term support block, process step 6 | A "success" message without a real submission |

Plan zone colours use a tinted fill (12 to 22% opacity) with the darker contrast-safe outline: orange `#C2540A`, cyan `#0369A1`, green `#15803D`, navy `#0B1F5C`. Every zone is also named in text and in a legend, so nothing depends on colour alone (WCAG 1.4.1).

Semantic use: success = `green-700`, warning = `orange-600`, error = `#B42318`. Validation messages always pair colour with text and an icon.

Tailwind 4 tokens (to go in `src/styles/global.css` at implementation):

```css
@theme {
  --color-navy-950: #060F2E;
  --color-navy-900: #0B1F5C;
  --color-navy-700: #1243B0;
  --color-royal-600: #1650D0;
  --color-cyan-500: #00ADFC;
  --color-cyan-700: #0369A1;
  --color-sky-100: #E3F2FD;
  --color-ice-50: #F3F7FE;
  --color-orange-500: #FD7B01;
  --color-orange-600: #C2540A;
  --color-green-500: #1CAD00;
  --color-green-700: #15803D;
  --color-ink: #0E1A33;
  --color-slate-600: #475569;
  --color-line: #DDE4F0;
  --font-sans: "Manrope", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-display: "Archivo", "Manrope", system-ui, sans-serif;
  --radius: 0.625rem;
}
```

Map these to shadcn variable names too (`--background` white, `--foreground` ink, `--primary` royal, `--primary-foreground` white, `--secondary`/`--muted` ice, `--muted-foreground` slate-600, `--accent` sky-100, `--border` line, `--ring` royal, `--radius` .625rem), so every shadcn component picks up the brand.

## 4. Typography

Two families, each with one job. Both self-hosted variable fonts (check `@fontsource-variable/archivo` exposes the width axis; if not, self-host the Google Fonts variable file with `wdth` and `wght`), `font-display: swap` with size-adjusted fallbacks to avoid layout shift.

| Family | Used for | Why |
|---|---|---|
| **Archivo** (variable, `wght` 500 to 900, `wdth` 62 to 125) | Headlines (H1 to H3), buttons, nav sheet, FAQ questions, step titles, drawing lettering | Extra-wide heavy cut echoes the wide YONAM wordmark. Width axis gives three voices from one file: expanded for headlines, normal for UI, condensed for drawing labels. |
| **Manrope** (variable, 400 to 800) | Body text, lead paragraphs, captions, form text | Highly readable at small sizes, calm next to Archivo. |

| Role | Family | Weight / width | Desktop | Mobile |
|---|---|---|---|---|
| H1 | Archivo | 800, width 112% (100% on mobile) | `clamp(32px, 4.9vw, 54px)` / 1.05 | 32 to 34 / 1.05 |
| H2 | Archivo | 800, width 108% (104% on mobile) | `clamp(26px, 3.3vw, 40px)` / 1.12 | 26 to 28 |
| H3 | Archivo | 700, width 100% | 18 to 21 / 1.25 | 18 |
| Button, step title, link | Archivo | 700, width 104% | 16 | 16 |
| Body, lead | Manrope | 500 | 17 / 1.6, lead 18 | 16 |
| Small, caption | Manrope | 500 to 600 | 14 | 14 |
| Drawing labels | Archivo | 700, width 75%, uppercase, +0.04em | 8.5 to 9.5 (SVG units) | same |

**No tracked all-caps label above headings, no single-word accent in a headline, no numbers unless the content is a real sequence.** Uppercase is used only for drawing lettering (engineering-plan convention) and short tags.

Line length 65 characters maximum. Headings use `text-wrap: balance`. Phone numbers and numerals use `font-variant-numeric: tabular-nums`.

Gujarati/Hindi glyphs are not covered by either family. Decision pending (English only at launch assumed). If added later, pair with Noto Sans Gujarati.

## 5. Spacing, containers, breakpoints

- Base unit 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Section vertical padding: **56px mobile, 84px desktop** (no dead space; this replaced an earlier 64/96). Heading to content gap 32px.
- Containers: content max `1240px`; prose max `720px`; forms max `640px`.
- Page gutters: 20px mobile, 28px at `md`, 36px at `lg` and up.
- Breakpoints (Tailwind defaults): `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Mobile first. Verified widths: 360, 390, 768, 1024, 1440, 1920.
- Radius: `--radius` .625rem (10px) for buttons, inputs and tabs; 16px segment tiles; 18px service cards and plan card; 999px chips and pills. Nothing else.
- Shadow: borders do most of the work. Hover lift uses `0 22px 36px -22px rgb(11 31 92 / .45)`; the plan card uses `0 24px 48px -28px rgb(11 31 92 / .35)`. No other shadows.

## 6. Navigation

**Desktop header:** sticky, 92px tall (frosted white, 94% opacity with blur), 1px `line` bottom border, shrinks to 72px on scroll (logo 86 to 66px). 3px read-progress line (cyan to royal) along its bottom edge. Logo left. Links: Home, About Us, Solutions (dropdown of four), Services (dropdown of four), Projects (only when it exists), Contact Us. Primary CTA right: **Discuss Your Project** (the compact 44px button). Nav links get a royal underline on hover. Use shadcn NavigationMenu.

**Mobile header:** 68px (58px scrolled). Logo left, menu button right (48px target). Menu opens as a shadcn **Sheet** from the right (88vw, max 380px) with overlay, focus trap, Escape and overlay-click close, 58px link rows, primary button and the phone placeholder at the bottom.

**Mobile sticky action bar:** Call, WhatsApp, Enquire. WhatsApp renders disabled (dashed) and is hidden from assistive tech until an official number exists. No invented numbers.

**Dropdowns:** open on click and keyboard (Enter/Space), also on hover at `lg`. `aria-expanded`, arrow-key support.

**Breadcrumbs** on all pages below the top level.

**Footer (light):** `ice-50` background, 1px `line` top border. Transparent logo directly on it (92px wide, no plate), company line, Nadiad Gujarat India, Solutions, Services, Contact (phone, WhatsApp, email shown only when verified; until then dashed "to be confirmed" boxes in development only), Privacy Policy, copyright. It is light because the navy wordmark needs a light surface.

## 7. Components

### Buttons (shadcn Button, customised)

**One standard size: 52px tall, min-width 240px, 28px horizontal padding, `--radius` corners, Archivo 700 16px.** On phones every button is full width. The only other size is the **44px compact button in the desktop header**. No other sizes anywhere.

| Variant (shadcn name) | Style |
|---|---|
| default (primary) | `primary` fill, white text. Hover: navy fill slides in from the left (0.4 s), text stays white. |
| outline (secondary) | White fill, 2px `navy-900` border and text. Hover: navy fill slides in, text turns white. |
| light (on dark bands) | White fill, navy text. Hover: sky fill slides in. |
| link | `royal-600`, Archivo 700, underline on hover. |

All buttons carry a built-in trailing arrow icon (mask-based, so it takes the text colour) that slides 5px on hover. Press scales to 0.98. The hero primary button pings once about 2.4 s after load. Orange is **not** a button colour by default. Hero buttons are equal width side by side on desktop.

Focus: 3px `ring` outline, 3px offset, always visible. Disabled: dashed border, `slate-500` text, `aria-disabled`. Reduced motion: no sweep, no ping, no arrow slide.

### Property picker (shadcn Tabs)
Four tabs: Building, Housing society, Home, Shop or office, each with a 22px line icon. Muted pill track, active tab is a white raised tab with a primary icon. 2x2 grid on phones, 4 across from 560px. **Two pickers exist (hero and planning section) and share one state.** Choosing a type swaps the plan view, the isometric view, the caption ("Example: Housing society") and both pickers. Selection is a React island; the first (Building) view is rendered statically.

### Segment tile (Card)
White, 1px `line` border, 16px radius, 18px padding mobile, 24px desktop. Icon chip, title (H3), audience line (desktop only), link row. Mobile: 2x2 grid showing icon, title and arrow only. Hover: lifts 4px, shadow, gradient bar draws along the bottom, icon redraws, arrow slides. Whole tile is one link.

### Services (bento, Card + Carousel)
Desktop: one **featured navy card** (Implementation Planning, with a small line drawing and cone scan), two smaller white cards beside it, and a wide green **Long-Term Support** card below. Mobile: horizontal swipe carousel (shadcn Carousel, 84% wide cards, dots, "Swipe to see all services").

### Fact strip
Navy band under the hero: four checks (dedicated implementation plan, professional installation, system setup and configuration, long-term support). Mobile: horizontal scroll-snap row. Only PRD-confirmed claims.

### Process timeline (6 steps)
On a `navy-900` band. Horizontal at 980px and up with a cyan-to-royal connector that fills; on mobile a vertical **accordion** (shadcn Accordion, first step open): number, title, chevron, description on tap. Steps are a true sequence, so numbered 1 to 6. Step 6 (Long-Term Support) ends in `green-500`.

### Long-term support block
Light green band, `green-700` check badge, wording from PRD section 13 only. **No** "24/7", "free maintenance" or response-time claims until confirmed.

### FAQ accordion (shadcn Accordion)
Single-open. 60px question rows in Archivo 700, `line` dividers, circular plus/minus that rotates. Only the nine PRD questions; unverified answers are tagged **Draft** and not published.

### About (mobile)
Short two-line intro; the five-point "how we work" list is collapsed behind a "See how we work" row on mobile and always open on desktop.

### Final CTA band
`navy-900` to `navy-700` solid gradient (two blues, no other hues). Heading, one line, one on-dark button.

## 8. Forms

- Labels above fields, always visible (no placeholder-as-label). 14px bold `ink`.
- Inputs 48px tall, 1.5px border `#C5D0E4`, 8px radius, 16px text (prevents iOS zoom). Focus: `royal-600` border plus outline ring.
- Optional fields say "optional" in the label. Camera quantity is never a field.
- Errors: message under the field in `#B42318`, icon, `aria-describedby`, summary at top on submit. Never colour alone.
- Phone: `type="tel"`, `inputmode="tel"`, Indian mobile validation (10 digits, optional +91).
- **No fake success.** Until a real submission destination exists, the form shows verified contact alternatives (call, WhatsApp, email) instead of a "sent" message.
- Two journeys (Project, Individual) use tabs on the contact page and separate entry CTAs elsewhere. Guided assessment is a 5-step flow with a progress bar, one question per screen, Back/Next, and is labelled as requirement-gathering only (no camera counts, coverage or pricing promised).
- Honeypot field plus server-side validation planned for Phase 2.

## 9. Imagery

- **Photography (when genuine):** real YONAM projects only, with customer permission. 16:10 or 4:3, 8px radius, no filters, no watermark overlays. AVIF/WebP through Astro `<Image>`, responsive `sizes`, lazy-loaded below the fold, hero image eager with explicit dimensions to prevent layout shift.
- **Until photos exist:** do not fill the gap with stock "CCTV technician" images. Illustration carries the visuals. Licensed images of buildings or properties are allowed only with your approval per image, and never with a claim they are YONAM installations.
- **Hero:** headline, supporting copy and CTAs left; **property picker and plan view illustration** right (on the `ice-50` blueprint grid background), with the zone legend and caption beneath. No placeholder grey boxes shipped.

### Plan illustrations

- Inline SVG, about 3 to 6 KB each, fixed aspect ratio (no layout shift), no raster images. Built by TypeScript builders in `src/lib/plans/` (port from `design-proposal/mock-site.html`); the default (Building) view is rendered at build time.
- **Eight drawings, all different:** four property types x two views.
  - **Plan view (hero), 360 x 226 viewBox:** Building (block, lobby, control room, corridor, parking); Housing society (compound wall, three blocks, internal road, clubhouse, gate house, visitor parking, main gate); Home (plot, house with living area, bedroom and utility, driveway with car, front door, gate); Shop or office (shelves, counter, sales floor, back office, loading bay, shop entrance).
  - **Isometric (planning section), 314 x 224 viewBox:** the same four property types in perspective, with coverage cones on the ground and zones tinted on roofs or ground.
- Zone vocabulary is the same in every drawing (entrances = orange, outdoor/parking = navy, common areas = cyan, recording room = green); only the labels change per type.
- Line blueprint style is available as a secondary treatment (dashed coverage, thin linework) if a lighter look is needed later.
- Drawing lettering uses Archivo condensed capitals; a title block ("Illustrative · not to scale") sits bottom right.
- Caption always visible: "Illustrative · not to scale". Camera counts and positions are examples, never an offer or quote.
- Each drawing has a descriptive `aria-label` and a legend. Legend items are real `<button>`s: hover, keyboard focus or tap isolates that zone (other zones fade to 12% opacity).
- Legend labels: Entrances and exits, Outdoor and parking, Common areas, Recording room.
- Hero grid background: 18px grid, royal at 7% opacity.
- **Icons:** one set, 1.75px stroke, `royal-600` or `navy-900`. No emoji.
- Every image has descriptive alt text. Decorative images use `alt=""`.

## 10. Page patterns

- Rhythm: alternate `white` and `ice-50` sections; one `navy-900` band per page (process timeline or final CTA), not both side by side.
- Avoid repeating the same four-card grid back to back. Segments = 4-up cards, services = 2-up with larger copy, process = timeline, why-choose = icon list, FAQs = accordion.
- Hero: H1, supporting paragraph (max 60ch; one-line version on phones), primary + secondary CTA (phones: primary button plus a text link), "Based in Nadiad, Gujarat, India" line, property picker and plan illustration. No eyebrow label.
- Each section opens with a drawn **dimension line** (royal, 1.5px, end ticks) above the heading instead of an eyebrow label.
- Dedicated implementation planning section (PRD 9.6) is the signature section: isometric illustration left, copy and six planning factors right, on `ice-50`.
- Every page ends with the final CTA band.

## 11. Motion

**The authoritative motion rules, library roles (GSAP, anime.js, CSS) and the full catalogue are in [`motion-spec.md`](motion-spec.md).** Summary:

- **GSAP:** hero sequence after first paint, ScrollTrigger reveals, process timeline fill, header shrink and progress line, DrawSVG wall drawing, property-switch transition.
- **anime.js v4:** cone scanning, icon redraw on hover, support-badge check, small SVG timelines.
- **CSS:** buttons, link underlines, card lifts, focus, H1 first-paint reveal (so LCP never waits for JS).
- Each non-interactive animation ends within about 5 seconds and then rests (WCAG 2.2.2). One owner library per element.
- Not used: camera pulse (reads as a "recording" indicator), parallax, smooth-scroll hijack, counters, cursor effects.
- `prefers-reduced-motion: reduce`: every illustration, the timeline and all reveals show their final state; no tween runs.

## 12. Accessibility baseline (WCAG 2.2 AA)

- All text pairs meet 4.5:1 (large text 3:1) using tokens above. Violating pairs listed in section 3 are forbidden.
- Visible focus on every interactive element. Skip-to-content link first in the tab order.
- Touch targets at least 44 x 44px (WCAG 2.2 target size, 24px minimum).
- One `<h1>` per page, no skipped heading levels. Landmarks: header, nav, main, footer.
- Forms: labels, `aria-describedby` for errors, `autocomplete` attributes.
- Respect `prefers-reduced-motion`. Layout works at 320px width and 200% zoom without horizontal scroll.

## 13. Open items

| Item | Needed from | Default if no answer |
|---|---|---|
| SVG / horizontal logo from the designer | Designer | Use the transparent PNG on light surfaces (approved) |
| Favicon from an original emblem asset | Designer | Keep a neutral placeholder favicon |
| Gujarati / Hindi at launch | You | English only |
| Genuine project photos, permissions | You | Illustration-led pages, omit Projects section |
| Phone, WhatsApp, email, address, domain | You | Visible "pending" placeholders in dev only; nothing invented in production |
| Support scope, AMC, remote monitoring | You | Generic commitment wording only |
