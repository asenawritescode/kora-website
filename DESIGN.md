---
name: Zana Public Website
description: A selling and stock app for Kenyan shops. Pick the modules you need; they work together.
colors:
  paper: "#ffffff"
  surface: "#fafaf7"
  surface-2: "#f4f4ef"
  ink: "#0f0f12"
  ink-2: "#3a3a42"
  ink-3: "#51515a"
  action: "#0f0f12"
  accent: "#6495ed"
  on-accent: "#0f0f12"
  line: "#e4e4de"
  line-control: "#84848c"
  band: "#0f0f12"
  on-band: "#f4f4f0"
typography:
  display:
    fontFamily: "Space Grotesk Variable, Inter Variable, sans-serif"
    fontSize: "clamp(2.25rem, 6.4cqw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.03em"
  heading:
    fontFamily: "Space Grotesk Variable, Inter Variable, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.paper}"
    typography: "15px / 600 Inter Variable"
    rounded: "10px"
    padding: "0 18px"
    height: "48px"
---

# Design System: Zana Public Website

Source of truth: the "Zana design" page of the ERP landing page canvas
(Components and Dark mode artboards). Where this file and the canvas differ,
the canvas wins.

## Overview

A selling and stock app for Kenyan shops, on phone or computer. The site is
plain and fast: white paper, near-black ink, black actions, and one block
colour, cornflower, for highlights and the focus halo. Headings are Space
Grotesk, bold and tight; reading text is Inter. Corners are rounded: 10 px on controls, 16 px on cards.
There is a dark theme for every surface.

## Colours

All colours live in `src/styles/tokens.css` and nowhere else. Components use
the generated utilities (`bg-paper`, `text-ink-2`, `bg-action`, `bg-band` ...).
The build runs `validate:contrast`, which checks every pair listed in that
file in the light theme and with the dark overrides applied.

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#ffffff` | `#18181d` | Cards and the page ground |
| `surface` | `#fafaf7` | `#0f0f12` | Quiet ground behind cards |
| `surface-2` | `#f4f4ef` | `#141418` | Panels that set a section apart |
| `ink` | `#0f0f12` | `#f4f4f0` | Text, headings |
| `ink-2` | `#3a3a42` | `#cfcfc8` | Secondary text |
| `ink-3` | `#51515a` | `#a4a49d` | Muted text, labels |
| `action` | `#0f0f12` | `#f4f4f0` | Main button, selected state |
| `accent` | `#6495ed` | `#6495ed` | Block colour: highlights, focus halo, badges (ink text on it) |
| `ok-*`, `amber-*`, `slate-*` | tints | tints | Available, Preview, Roadmap badges |
| `red`, `red-*` | `#b42318` | `#ff8b7e` | Errors and destructive actions only |
| `line`, `line-control` | `#e4e4de`, `#84848c` | `#2c2c33`, `#7a7a84` | Dividers; control borders (3:1) |
| `band`, `on-band*` | `#0f0f12` | `#18181d` | Footer and app bar |

Cornflower on white is 2.8:1, so it is never text or a thin line on paper.
Text on a coloured surface uses that surface's text token (`paper` on
`action`, `on-accent` on `accent`, `on-band` on `band`), never grey.

**Dark theme.** Set `data-theme="dark"` on `<html>`. It is not yet followed
from the system setting; that switches on once every page uses the tokens
only (pages still using `text-white`, `bg-white` and `text-black` do not
flip).

**Legacy names.** `surface-container`, `on-surface-variant`, `muted`,
`outline-variant` and the `night*` tokens are aliases of the names above and
are removed as the pages that use them move over. `accent` used to mean the
action colour; that is now `action`.

## Typography

- **Headings (h1, h2, `font-display`):** Space Grotesk Variable, 700, tracking
  -0.03em. h3 and below are Inter.
- **Body and controls:** Inter Variable with tabular numerals, 16 to 18 px,
  line height 1.5.
- **Code:** Geist Mono, code panels only.
- Latin and latin-ext subsets only.

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display (the h1) | clamp(2.25rem, 6.4cqw, 4.75rem) | 700 | 1.03 | -0.03em |
| Heading 36 | 2.25rem | 700 | 1.1 | -0.02em |
| Heading 26 | 1.625rem | 700 | 1.15 | -0.02em |
| Body 18 | 1.125rem | 400 | 1.55 | 0 |
| Body 16 | 1rem | 400 | 1.5 | 0 |
| Label 13 | 0.8125rem | 600 | 1.3 | 0 |

## Motion

- Press scales to 0.97 over 160 ms and hover dims to 0.94 brightness, with
  `cubic-bezier(0.23, 1, 0.32, 1)`; content enters with a 500 ms fade and
  8 px rise.
- `prefers-reduced-motion: reduce`: transitions are cut to 0.01 ms (global
  rule in `index.css`).

## Imagery

- Real product screens with sample data only, as WebP in `public/screens/`
  (laptop 2200x1200, phone 780x1480, each under 90 KB), shown in a laptop
  frame whose lid opens as it scrolls into view, and in a phone frame below
  640 px (`ProductScreens.tsx`). Four tabs, a slow autoplay with a pause
  button, no motion under `prefers-reduced-motion`.
- Screens show no personal data. Retake them when the product changes, and do
  not show screens that are not built.
- No stock photography, no illustrated people, no emoji.
- The one drawing is the Nairobi skyline, the horizon of the Home closing band
  (`NairobiSkyline.tsx`): a single ink line on the cornflower band, decorative
  (`aria-hidden`), static, cropped from the sides on a phone. Its stroke width
  steps with the band height so it stays about 1.2 px on screen.

## Layout and spacing

- Content frame 1200 px, side gutter 24 px (16 px at 390). Every section
  shares the same left and right edges.
- Spacing steps: 4, 8, 16, 24, 40, 64 px. Section padding
  `clamp(48px, 6vw, 88px)`.
- A section has one heading, then its content. No section repeats the rhythm
  of the one before it: a row list, then a product frame, then a three-step
  strip, then a night band.
- Grids: 12 columns at 1440, collapse to one column under 768. No horizontal
  scroll at any width.

## Shape and depth

- Corners (as drawn in the canvas): buttons and inputs 10 px (`rounded-md`),
  cards, panels and the dark CTA bands 16 px (`rounded-xl`), badges and pills
  fully round (`rounded-full`).
- Depth is tone and line: paper on surface, a 1 px `line` border. The only
  resting shadows are the ones in the canvas: the How AI example card and the
  phone frame.
- Focus: a 2 px `ink` outline, 2 px offset, plus a 6 px `accent` (cornflower)
  halo, on every interactive element, in both themes.
- Press: scale 0.97 over 160 ms. Hover: brightness 0.94.

## Components

### Buttons
- **Primary:** `action` fill (ink in light, light in dark), `paper` 15 px
  semibold label, 48 px tall, 10 px corners. One per view.
- **Secondary:** `paper` fill, 1 px `line-control` border, `ink` label.
- **Accent:** `accent` (cornflower) fill, `on-accent` label.
- **Destructive:** `red` fill, `paper` label.
- **Disabled:** `line` fill, `ink-3` label. **Loading:** the label, a spinner
  and `aria-busy="true"`.

### Header
- Two rows on `paper`, 1 px `line` rule below, sticky at the top of the page (about 100 px on a phone, 113 px on desktop; anchors and the legal contents column clear it). Row one: the Zana
  mark and lowercase wordmark (Space Grotesk 700), "Sign in" (Cloud sign-in)
  and one primary "Set up my shop". Row two: the page links, 48 px targets,
  the current page bold with a 3 px `action` underline, scrolling sideways on
  a phone. No menu button.

### Footer
- `band` surface. Mark and wordmark, "From Nairobi to the world", one line
  saying what Zana is, two link columns, then "English now, Kiswahili next"
  and the copyright line. Links in `on-band-2`, underlined on hover.

### Module picker (`/start`)
- Its own page, not part of the site chrome: logo and "Step 1 of 3", the
  content, and a sticky bar with the count and "Continue to create account".
- Screen one asks what kind of business (five radio rows; "Another kind"
  opens a list of the other starting points or "I'll choose modules myself").
  Screen two lists the modules Cloud's catalog offers as checkbox rows, ticked
  from the chosen preset. A module another one needs is ticked, locked and
  says why ("Included: ... needs ... because ..."). Modules not ready yet sit
  in a "N more in this setup aren't ready yet" disclosure with their state.
- The choice is held in `src/lib/signup-choice.ts` and carried to Cloud
  signup as `?template=<slug>&optional=<release ids>`. Every "Set up my shop"
  button opens this page; industry cards open it with `?for=<industry>`.
- Loading shows quiet skeleton rows, an error says "The modules didn't load"
  with Try again and keeps the choice, and ticking nothing shows an alert.

## Do and don't

**Do**
- Name the buyer and the task in the h1. Put the real product next to it.
- Say "not supported yet" where a buyer would expect a feature (M-Pesa, card,
  receipt printer, eTIMS).
- Keep the roadmap visibly separate from what can be installed today.

**Don't**
- Invent customers, logos, quotes, counts or prices.
- Use eyebrows above headings, pill labels, icon chips or three-up icon cards.
- Use gradients, glass, blobs, glows or drop shadows on resting surfaces.
- Repeat "From Nairobi to the world" as filler.

## Checks and accepted deviations

Run before shipping a change: `bun test`, `bun run build` (claims, links, contrast
in both themes, tokens, SEO). Two outside checkers were also run on every page at
phone and desktop widths: Hallmark's `sloplint --render` and the taste-skill
`consistency.mjs`. What they still report is listed here, each with the reason it
stays. Nothing below is an open bug; changing any of it means changing the canvas
first.

**Comes from the canvas design**
- The Home hero holds the laptop and its tabs, so it is taller than the first
  screen (about 1255 px; Hallmark 44c, 44d, taste hero-screen). The headline, the
  sentence and both actions are inside the first screen at 1280 x 800.
- Several screens carry more than 80 words (Hallmark 58, taste copy-length): Home
  sections, About, Roadmap. They are the canvas copy.
- Thin sections, section heads smaller than the hero head, a hero that stops
  short (Hallmark 77, 78, 79) on Home, How AI, About and Contact; About and
  Contact are two-section pages (77).
- About's "Why Zana" band is full-bleed cornflower (Hallmark 23, about 36% of the
  first screen), with ink text at 6.4:1 on it (AA; the taste checker asks 7:1).
- A highlighted word in the Home headline, a centred hero stack (judged 6b,
  38iii), and "Free during the pilot" repeated across pages (69).
- The hero of About, Privacy and How AI has no button, and the Roadmap's action is
  its closing band (taste cta, fold-action).
- The taste checker's own page skeleton rules (one section per screen, its page
  structure, container-edges, section-height, one-section, one-heading,
  no-visual, card-visual, button-styles, same-action) describe a different kind
  of page than this one. The design uses a primary, a secondary and an accent
  button on purpose.
- Section gaps are 56 to 72 px (Hallmark 59 asks 120); the Retail page shows it.

**Decided here**
- The header page-links row scrolls sideways on a phone, so its tabs sit past
  the content edge by design (taste nav). It fades at the edge and brings the
  current page into view.
- The footer is about 590 px tall on a phone: five 44 px link rows set its
  height. Shrinking them or collapsing navigation would cost touch targets, so
  neither is done.
- Body text is held at 7:1 on the tinted surfaces (checked in both themes); ink
  on cornflower stays at 6.4:1.

**False positive**
- Hallmark 72 ("text crowds the edge of its box") on the Pricing and How AI FAQ
  rows measures the answer text inside the closed rows, which is hidden.
