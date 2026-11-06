---
name: Kigae Public Website
description: Shop software from Nairobi. Pick the modules you need; they work together.
colors:
  paper: "#f7f3ec"
  sand: "#ede6da"
  white: "#ffffff"
  ink: "#16130f"
  ink-soft: "#3f3a33"
  muted: "#5c554c"
  rule: "#d9d0c2"
  ochre: "#c84018"
  ochre-strong: "#a3360f"
  ochre-tint: "#fef3ed"
  night: "#12161b"
  night-raised: "#1c2128"
  night-ink: "#f4efe6"
  night-muted: "#b4ada3"
  ochre-on-night: "#f08a5d"
  gold: "#e3a13a"
typography:
  display:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(44px, 6vw, 88px)"
    fontWeight: 780
    fontStretch: "112%"
    lineHeight: 0.96
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(32px, 4vw, 56px)"
    fontWeight: 740
    fontStretch: "112%"
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(20px, 2vw, 26px)"
    fontWeight: 680
    lineHeight: 1.15
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Mono Variable, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.08em"
rounded:
  none: "0"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  section: "clamp(48px, 6vw, 88px)"
components:
  button-primary:
    backgroundColor: "{colors.ochre}"
    textColor: "{colors.white}"
    typography: "15px / 600 Geist Variable"
    padding: "0 22px"
    height: "48px"
  button-on-night:
    backgroundColor: "{colors.ochre-on-night}"
    textColor: "{colors.night}"
    typography: "15px / 600 Geist Variable"
    padding: "0 22px"
    height: "48px"
  text-action:
    textColor: "{colors.ink}"
    typography: "15px / 600 Geist Variable, underlined"
  module-row:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "18px 20px"
  navigation-main:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "14px / 550 Geist Variable"
    height: "72px"
---

# Design System: Kigae Public Website

## Overview

**Creative North Star: "From Nairobi to the world."**

Kigae is shop software built in Nairobi. The site sells one idea, the same one
Odoo, Zoho One and ERPNext sell: pick the modules your business needs, and they
work together in one workspace. It sells it the way a Nairobi business would:
plainly, with the real product on screen, and without numbers it cannot back.

The look is bold and warm by day, deep by night. Warm paper and near-black ink
carry the reading. Red ochre marks every action. A night band holds a one-line
drawing of the Nairobi skyline in savanna gold, with the owner's line "From
Nairobi to the world". Headings are a semi-expanded heavy grotesque (Archivo);
reading text is Geist. Edges are square. Structure comes from rules, rows and
type size, not from cards and shadows.

**Key characteristics**
- A business task first, in plain words; the real product next to it.
- One action colour (red ochre) and one highlight (savanna gold, night only).
- Square, ruled rows and shelves. No card grids of icon + title + line.
- Every claim on the page is something the product does today.

## Colours

All colours live in `src/styles/tokens.css` and nowhere else. Components use
the generated utilities (`bg-paper`, `text-accent`, `bg-night` ...). The build
runs `validate:contrast`, which checks every pair listed in that file.

| Name | Token | Hex | Use |
|---|---|---|---|
| Morning paper | `paper` | `#f7f3ec` | Page background |
| Sand | `surface-container` | `#ede6da` | Panels that set a section apart |
| White | `white` | `#ffffff` | Module rows, product frames |
| Ink | `ink` | `#16130f` | Text, headings, dark buttons |
| Ink soft | `on-surface-variant` | `#3f3a33` | Lead paragraphs |
| Muted | `muted` | `#5c554c` | Secondary text and notes |
| Rule | `outline-variant` | `#d9d0c2` | Dividers only, never text |
| Red ochre | `accent` | `#c84018` | Primary buttons, links, selected state, focus ring |
| Ochre strong | `accent-strong` | `#a3360f` | Primary hover; ochre text on the tint |
| Ochre tint | `accent-tint` | `#fef3ed` | Selected module row |
| Night ink | `night` | `#12161b` | Skyline band, footer |
| Night raised | `night-raised` | `#1c2128` | Panels inside night sections |
| Night text | `night-ink` | `#f4efe6` | Text on night |
| Night muted | `night-muted` | `#b4ada3` | Secondary text on night |
| Ochre on night | `accent-on-night` | `#f08a5d` | Links and the button on night |
| Savanna gold | `gold` | `#e3a13a` | Skyline line, text selection, small highlights on night |

Contrast (WCAG 2.x, from `bun run validate:contrast`):

| Pair | Ratio | Pair | Ratio |
|---|---|---|---|
| ink on paper | 16.74 | night-ink on night | 15.86 |
| ink-soft on paper | 10.18 | night-muted on night | 8.17 |
| muted on paper | 6.64 | night-muted on night-raised | 7.28 |
| muted on sand | 5.92 | ochre-on-night on night | 7.35 |
| muted on ochre tint | 6.74 | night on ochre-on-night (button) | 7.35 |
| ochre on paper | 4.52 | gold on night | 8.15 |
| ochre on white | 5.00 | ink on gold | 8.31 |
| white on ochre (button) | 5.00 | ochre ring on night | 3.63 (non-text, min 3) |
| white on ochre strong | 6.79 | ochre strong on ochre tint | 6.23 |

**Why these colours.** PRODUCT.md keeps Kigae's orange and black, so red
ochre `#c84018` (the existing DESIGN.md accent, AA with white) and ink stay.
Red ochre is also the colour of murram roads, so it reads as local without a
flag. The new part is the night: a deep blue-black taken from a Nairobi
evening, with the skyline in savanna gold. Warm paper replaces the cold
white.

**Decided against:** Kenya-flag green, red and black together on anything;
safari browns and khaki; animal prints and shield motifs; jacaranda violet.
The jacaranda is very Nairobi, but purple is the colour most often seen in
generic AI-made pages, and a second accent would compete with ochre for
"this is the action". Gradients of any kind are out.

**Rules.** One ochre action per view. Gold never carries body text on paper
(it fails there); on night it may set a short line or a highlight. Text on a
coloured surface uses that surface's text token, never grey.

## Typography

- **Display and headings:** Archivo Variable at `font-stretch: 112%` (class
  `font-display`; every `h1` and `h2` gets it from the base layer in
  `index.css`), weights 680 to 780. Archivo is a grotesque with a wide
  stance that holds up at 88 px and still reads at 20 px. Latin and latin-ext
  subsets only.
- **Body and controls:** Geist Variable, 16 px, line height 1.6, measure up to
  68 characters.
- **Labels:** Geist Mono 11 px, uppercase, 0.08em tracking, for states and
  indices inside components ("Preview", "On the roadmap"). Never as an eyebrow
  above a heading, never as the reading voice.

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display (one per page, the h1) | clamp(44px, 6vw, 88px) | 780 | 0.96 | -0.03em |
| Headline (h2) | clamp(32px, 4vw, 56px) | 740 | 1.02 | -0.025em |
| Title (h3, module names) | clamp(20px, 2vw, 26px) | 680 | 1.15 | -0.01em |
| Lead | 18-20px | 400 | 1.5 | 0 |
| Body | 16px | 400 | 1.6 | 0 |
| Small | 14px | 400 | 1.5 | 0 |
| Label | 11px mono | 500 | 1.2 | 0.08em |

At 390 px the h1 fits in four lines or fewer.

## Motion

- Hover and press: 150-200 ms, `cubic-bezier(0.22, 1, 0.36, 1)`. Primary
  buttons darken to ochre strong; links thicken their underline.
- One authored moment: the skyline draws itself once on first view (about
  1.8 s, buildings slightly staggered). Nothing else animates on scroll. No
  fade-ins, parallax or carousels.
- `prefers-reduced-motion: reduce`: the skyline is shown complete with no
  drawing, and every transition is cut to 0.01 ms (global rule in
  `index.css`).

## Imagery

- Real Kigae Studio captures only, taken from a real workspace and saved as
  WebP with explicit width and height, each under 120 KB. Today: the owner
  dashboard in the hero, and the Sell register on a tablet (1280x800, cropped
  to the register) and a phone (390x844 at 2x) in "What you get today". No
  device mock-ups, no drawn dashboards, no shadows; a 1 px rule is the frame.
- Captures show no personal data (real names, emails, tokens) and, where it
  shows, a plausible shop name. Retake them when the screen changes.
- Do not show screens that are not built.
- No stock photography, no illustrated people, no icons as decoration, no
  emoji.

## The Nairobi skyline

- An original line drawing (`src/components/landing/NairobiSkyline.tsx`),
  hand-built in SVG. Not traced from any photograph or artwork.
- One colour (`gold` on night; `ink` if it ever sits on paper), one stroke
  of about 1.2 px on screen at every width (the width steps with the band
  size in `index.css`), no fills except the band colour used to hide lines
  behind a building.
- Buildings shown, left to right: Britam Tower, Anniversary Towers, Teleposta
  Towers, Times Tower, the KICC tower with its crown and the conical
  amphitheatre roof beside it. Low unnamed rooftops fill the rest. One flat
  acacia at the right edge nods to Nairobi National Park. The sky stays empty:
  no sun, birds, clouds or stars.
- Sits as the horizon at the bottom of the first screen, full width at 1440,
  cropped from both sides around KICC at 390 (`preserveAspectRatio="xMidYMax
  slice"`).
- Appears once per page, with the line "From Nairobi to the world" in that
  exact wording, once. The drawing is decorative (`aria-hidden`); the line is
  real text.
- When a building is corrected, keep the silhouettes simple: the outline
  must read at 140 px tall.

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

- Radius 0 everywhere. Corners are square, including buttons, inputs and
  checkboxes.
- Depth is tone and rule: paper, sand, white, night. No resting shadows. A
  product capture sits in a 1 px rule frame with no shadow and no device
  chrome.
- Focus: 3 px ochre outline, 3 px offset, on every interactive element, on
  day and on night (3.63:1 against night).

## Components

### Buttons
- **Primary:** ochre fill, white 15 px semibold label, 48 px tall, square.
  Hover: ochre strong. One per view.
- **On night:** ochre-on-night fill, night text.
- **Text action:** ink, underlined, arrow optional. Turns ochre on hover.

### Navigation
- Paper header, 72 px, fine lower rule, fixed at the top. Wordmark in Archivo. Primary
  links visible; Cloud, Open source, Docs and Blog under Explore. One ochre
  action at the right. Below 1024 px the links fold behind a 44 px menu
  button into a ruled list.

### Footer
- Night surface. Large Archivo wordmark, one plain line, two link columns
  with small mono headings, then "Kigae by Senumi" from `src/lib/brand.ts`.
  Links in night-muted, night text and an underline on hover. No sponsor badges, no social icons
  without accounts behind them.

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
- **Preview** (the catalog has not marked it available): selectable, with a
  "Preview" label (mono 11 px, 1 px ink outline).
- **On the roadmap:** not a checkbox. Muted text on sand, label "On the
  roadmap", `aria-disabled`. Never a date, never "coming soon".
- **Selection summary:** beside the list (below it on phones), one line naming what is chosen,
  then the price line in Body: "Free during the pilot. Pricing will be
  announced before the pilot ends." Then the primary button, which carries
  `?template=` to Cloud signup.
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
