---
name: Kigae Public Website
description: A modular workbench for finding business tools and shaping a workspace.
colors:
  primary: "#C84018"
  ink: "#171716"
  paper: "#f8f7f4"
  white: "#fff"
  muted: "#62615e"
  rule: "#dedbd5"
  dark-surface: "#1b1b19"
  warm-surface: "#ebe8e1"
typography:
  display:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "clamp(54px, 6.5vw, 86px)"
    fontWeight: 690
    lineHeight: 0.99
    letterSpacing: "-0.075em"
  headline:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "clamp(36px, 4.5vw, 57px)"
    fontWeight: 640
    lineHeight: 1.08
    letterSpacing: "-0.06em"
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Geist Mono Variable, monospace"
    fontSize: "10px"
    fontWeight: 400
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

## Colors

The palette is built around Kigae orange, near-black ink, warm off-white paper, and quiet warm-gray rules.

### Primary
- **Kigae Orange**: The recognizable brand accent for primary actions, active states, links, progress, and selected illustration details.

### Neutral
- **Workbench Ink**: Main text and the dark panels that anchor the modular illustration and featured template shelf.
- **Warm Paper**: The page canvas and mobile navigation background.
- **White**: Content surfaces, template cards, and inverse text on orange or ink.
- **Quiet Gray**: Supporting copy and secondary metadata.
- **Warm Rule**: Fine dividers and grid lines across sections and lists.
- **Deep Work Surface**: A slightly lifted dark tone for featured content sections.
- **Warm Panel**: Catalog and detail hero panels that set apart template discovery content.

## Typography

**Display Font:** Geist Variable (sans-serif fallback)
**Body Font:** Geist Variable (sans-serif fallback)
**Label/Mono Font:** Geist Mono Variable (monospace fallback)

**Character:** Geist's compact shapes and negative tracking make large headlines direct and distinctive. The mono face is reserved for small indices and technical metadata, keeping the main reading voice clear.

### Hierarchy
- **Display** (690, clamp 54–86px, 0.99 line-height): The home and catalog hero statement.
- **Headline** (640, clamp 36–57px, 1.08 line-height): Section headings and workbench explanations.
- **Title** (600–650, commonly 17–28px, close tracking): Card titles, panel headings, and component names.
- **Body** (400, commonly 13–16px, 1.6–1.8 line-height): Descriptions and explanatory copy; long-form article body is constrained to 680px.
- **Label** (400, 9–11px, 0.04–0.13em tracking, often uppercase): Counts, progress, categories, and small navigation metadata.

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
