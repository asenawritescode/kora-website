---
name: Kigae Public Website
description: A modular workbench for finding business tools and shaping a workspace.
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
  mark: "1px"
  circle: "50%"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "13px / 650 Geist Variable"
    padding: "0 19px"
    height: "47px"
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "13px / 650 Geist Variable"
    padding: "0 18px"
    height: "48px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "#53524e"
    typography: "11px Geist Variable"
    rounded: "0"
    padding: "0 14px"
    height: "44px"
  template-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "Geist Variable"
    rounded: "0"
    padding: "22px"
  input-search:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "12px Geist Variable"
    padding: "0 11px"
    height: "44px"
  input-workflow:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "13px / 1.5 Geist Variable"
    rounded: "0"
    padding: "12px 13px"
    height: "63px"
  navigation-main:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "13px / 550 Geist Variable"
    padding: "0 24px"
    height: "76px"
---

# Design System: Kigae Public Website

## Overview

**Creative North Star: “Modular workbench”**

Kigae's public site keeps its orange and black identity while helping small business owners understand the software and get started. The home page says what the software helps with (tracking sales and stock), then points visitors to templates they can inspect before setup. Cloud and self-hosted choices remain available for visitors who need them.

The visual language pairs confident, tightly tracked sans-serif headlines with practical rows, shelves, and grids. Warm paper surfaces keep reading areas calm; dark sections give template collections contrast. Orange marks the brand, selected actions, and active progress. Most interface edges stay square and borders organize content instead of ornamental card shadows. The home hero stays focused on its message and next step without an abstract software diagram.

**Key Characteristics:**
- Plain descriptions of everyday business tasks lead the public journey.
- Templates show what the software can help a business do before signup.
- Orange signals Kigae and meaningful actions against warm paper and ink.
- Square, ruled structures give the site a practical workbench feel.

**Not-canonized defect:** Eyebrow/kicker metadata labels remain in some home, catalog, and detail content; they are page-level drift, not a system rule.

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
  `font-display`), weights 680 to 780. Archivo is a grotesque with a wide
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

## Layout

The desktop system uses centered content frames around 1160–1240px wide, with generous side padding and clear section breaks. The home page gives its headline, explanation, and template action room to breathe. Template discovery uses a three-column ruled grid at wide widths; it steps to two columns below 900px and one column on narrow screens. Marketing feature grids and step lists likewise collapse to a single column on mobile. Navigation becomes a compact expandable menu below 680px. The spacing rhythm repeatedly uses 8px, 16px, 24px, and 40px steps, with larger section spacing where content needs a pause.

## Elevation & Depth

Depth is mostly structural: warm and dark tonal surfaces, thin rules, and deliberate spacing distinguish regions. The catalog's template cards use an inset orange top edge on hover; the navigation popover has a diffuse shadow to separate it from the page. Skeleton loading uses a restrained opacity pulse, with animation disabled for reduced-motion preferences.

### Shadow Vocabulary
- **Navigation popover** (`0 15px 38px rgb(23 23 22 / .12)`): separates the open Explore menu from the sticky header and page.
- **Template hover edge** (`inset 0 3px 0` in Kigae Orange): state cue on a template card, not a resting card shadow.

## Shapes

The interface is predominantly square-cornered: cards, panels, controls, and buttons rely on their edges and rules for structure. The four-piece Kigae mark has a minimal 1px corner; onboarding progress nodes alone use circular geometry. Do not infer a rounded-card system from legacy rich-text content styles.

## Components

### Buttons
- **Character:** Confident, compact actions with clear color contrast and a small directional icon where present.
- **Shape:** Square corners (0px); the brand mark's own tiles use a subtle 1px corner.
- **Primary:** Orange fill, white text, 13px semibold label, 47px minimum height, and 19px horizontal padding.
- **Hover / Focus:** Primary buttons shift to a slightly brighter orange and rise 1px on hover; keyboard focus uses the shared 3px orange outline with 3px offset.
- **Secondary / light:** White fill and ink text; on hover, the surface gains a faint warm tint.
- **Text action:** Underlined or clean text links use ink by default and turn orange on hover.

### Chips
- **Style:** Filter chips are transparent with a fine warm-gray border and square corners.
- **State:** The selected chip switches to ink fill with white text; hover darkens the border and text.

### Cards / Containers
- **Corner Style:** Square, with no card radius.
- **Background:** White for template cards and composition panels; warm paper or warm panel for guide and hero surfaces; ink for featured work areas.
- **Shadow Strategy:** Flat at rest. The template card hover adds an inset orange top rule.
- **Border:** Fine warm-gray grid lines divide cards into a connected shelf.
- **Internal Padding:** 22px for template cards; detail composition panel uses 24–27px.

### Inputs / Fields
- **Style:** Search is a transparent, bottom-ruled field; the business-needs text area is white with a fine gray border and square corners.
- **Focus:** Search underline turns orange. The business-needs field shifts its border orange and adds a 1px orange inner ring.
- **Disabled:** The business-needs field takes a muted warm-gray background; disabled submit action lowers opacity.

### Navigation
- **Style:** Sticky warm-paper header with a fine lower rule and 76px desktop height. Brand lockup pairs a geometric four-tile mark with a bold Kigae wordmark.
- **Typography:** Compact 13px medium links; primary paths are visible while Docs, Cloud, and Open source sit under Explore.
- **States:** Current and hovered links use ink. The primary template action is orange.
- **Mobile:** At 680px and below, links collapse behind a 42px menu control; the expanded links become a ruled vertical list.

### Template Discovery Card
Template cards are flat white blocks in a ruled catalog grid. A small category, orange mark, tight title, short description, and included-items list show what the template is for. Hover adds a thin inset orange top edge and a faint warm surface shift.

## Do's and Don'ts

### Do:
- **Do** keep Kigae orange as the focused accent against ink and warm paper.
- **Do** explain a business task before presenting technical details.
- **Do** use rules, shelves, rows, and grids to show how tools or choices relate.
- **Do** preserve visible template contents and a clear review-before-activation step.
- **Do** keep surfaces square-cornered and mostly flat, using depth for actual overlays and interaction states.

### Don't:
- **Don't** imply a workspace or template is live before customer review and approval.
- **Don't** turn soft card shadows or rounded-card geometry into default surface styling.
- **Don't** use mono metadata as the main reading voice; reserve it for compact labels and indices.
