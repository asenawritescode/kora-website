---
name: Zana Public Website
description: A selling and stock app for Kenyan shops. Pick the modules you need; they work together.
colors:
  paper: "#ffffff"
  surface: "#fafaf7"
  surface-2: "#f4f4ef"
  ink: "#0f0f12"
  ink-2: "#3a3a42"
  ink-3: "#5c5c66"
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
the canvas wins. The page-level sections below (module picker) still describe the previous Nairobi identity and are replaced
as each page moves to the canvas design.

## Overview

A selling and stock app for Kenyan shops, on phone or computer. The site is
plain and fast: white paper, near-black ink, black actions, and one block
colour, cornflower, for highlights and the focus halo. Headings are Space
Grotesk, bold and tight; reading text is Inter. Corners are rounded 8 to 12 px.
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
| `ink-3` | `#5c5c66` | `#a4a49d` | Muted text, labels |
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

- Corners: buttons and inputs 10 px, panels and cards 12 px, chips and badges
  8 px (`rounded-md`, `rounded-lg`, `rounded-sm`).
- Depth is tone and line: paper on surface, a 1 px `line` border. No resting
  shadows.
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
- Two rows on `paper`, 1 px `line` rule below, not fixed. Row one: the Zana
  mark and lowercase wordmark (Space Grotesk 700), "Sign in" (Cloud sign-in)
  and one primary "Set up my shop". Row two: the page links, 48 px targets,
  the current page bold with a 3 px `action` underline, scrolling sideways on
  a phone. No menu button.

### Footer
- `band` surface. Mark and wordmark, "From Nairobi to the world", one line
  saying what Zana is, two link columns, then "English now, Kiswahili next"
  and the copyright line. Links in `on-band-2`, underlined on hover.

### Module picker (home page; also the rules for Cloud signup, kora-cloud#39)

The picker explains how choosing works: pick a module, and what it needs comes
with it. It is a ruled list of rows, not a grid of cards.

- **Row:** white, 1 px rule between rows, 18-20 px padding. Left: a 22 px
  square checkbox. Then the module name (Title), one-line summary (Body,
  muted), and a state label on the right (Label).
- **Available, not chosen:** checkbox 1.5 px ink outline, empty.
- **Chosen:** row background ochre tint, checkbox filled ochre with a white
  tick, name in ink. The change is instant.
- **Included because another module needs it:** checkbox filled ink with a
  white tick and not clickable while the module that needs it is chosen.
  Under the summary, a dependency note in 14 px ink soft that names both
  modules and says why, for example "Included: Point of Sale needs
  Inventory, because each sale takes the items off the stock count." The
  dependency comes from the catalog's `requires`; the reason text is kept in
  `src/lib/module-picker.ts`.
- **Preview** (the catalog has not marked it available, or it needs a part
  that is not): not selectable. The checkbox is disabled (1.5 px muted
  outline on sand), the name is muted, and the row carries a "Preview" label
  (mono 11 px, 1 px ink outline) and a 14 px note saying why it cannot be
  chosen yet. Every part of a preview template is preview.
- **On the roadmap:** not a checkbox. Muted text on sand, label "On the
  roadmap", `aria-disabled`. Never a date, never "coming soon".
- **Selection summary:** beside the list (below it on phones), one line naming what is chosen,
  then the price line in Body: "Free during the pilot. Pricing will be
  announced before the pilot ends." Then the primary button, which carries
  the choice to Cloud signup as `?template=<slug>&optional=<release ids,
  comma separated>` (`src/lib/cloud-signup.ts`; format documented in
  kora-cloud `docs/signup-link-format.md`). The choice is held in one store
  (`src/lib/signup-choice.ts`), so every "Set up your shop" button on the site
  (header, hero, closing action, footer, Cloud, Pricing) carries the same
  link, and the template page edits the same choice. The optional ids are the
  optional parts ticked plus the optional parts they need; parts a template
  installs anyway are never listed. Nothing chosen: the plain signup link.
- **Focus:** the 3 px ochre ring sits on the whole row (`:focus-within`).
  Space toggles, Tab moves between rows.
- **States from the catalog:** loading (rows shown as quiet sand bars with
  "Loading modules" for screen readers), error ("We could not load the
  module list." with "Try again"), empty ("No modules are published yet.").
  Only modules in the Cloud catalog can be chosen.

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
