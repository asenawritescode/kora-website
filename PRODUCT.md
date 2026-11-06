# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Small business owners are the primary public-site audience. They arrive wanting
to find a useful starting template for work their business needs to manage.
Validate the specific business types, buying roles, and local operating
constraints with customers before making stronger segment claims.

## Product Purpose

Kigae by Senumi helps small businesses choose connected tools for their work
and add modules as they grow. Kigae Cloud supports hosted workspaces and
onboarding. The product is powered by the open-source Kigae Engine and remains
self-hostable. A generated first version is reviewed by the customer before it
is activated.

## Positioning

Kigae connects a customer's description of their work to a configurable
workspace, with review and control before activation. Kigae Cloud, the
open-source Kigae Engine, and reusable published templates are part of the
product.

## Operating Context

Visitors may arrive with a business goal, a chosen template, a specific
capability, or a request for help. The website currently supports dynamic
template discovery and detail, then carries a selected template release into
workspace setup. Setup can include a business description, email, workspace
name, and review steps. It must preserve user choices through loading, network
failure, and retry.

## Capabilities and Constraints

- Public pages include product, template catalog and detail, onboarding,
  pricing, documentation, blog, Cloud, open-source, and capability pages.
- Published template metadata comes from Kigae Cloud. Editorial and blog content
  may use the CMS.
- Template composition and release identifiers are versioned. The website
  presents public metadata; Cloud owns publication and authoritative selection
  validation.
- Do not imply that a template or workspace is live before the customer
  approves its configuration.
- Prices, testimonials, customer counts, integrations, implementation times,
  performance measures, and customer outcomes require verified evidence.
- Mobile, keyboard, assistive technology, reduced motion, and slow-network
  behavior are product requirements for this public journey.
- The website codebase is an existing React, TypeScript, Vite, and Tailwind
  application.

## Brand Commitments

Keep the existing orange and black colors for Kigae. The site layout and visual
system may be replaced while retaining those recognizable colors.
Use Kigae as the customer-facing and open-source project name; identify the
sponsor as Senumi. Use Kigae Engine when prose needs to distinguish the
self-hosted runtime from Kigae Cloud. Preserve legacy Kora spellings in
technical examples when they are required for compatibility. See the shared
[brand architecture](../kora/docs/brand-architecture.md).

## Evidence on Hand

- Product behavior and copy in this repository.
- Kigae website review guidance and the product website and onboarding research
  library in `/home/asena/projects/kora/docs/design/`.
- The live local Kigae Cloud public catalog and the published Small Business
  Sales & Stock template.
- The website review guide contains three transcript summaries and a 20-video
  YC design reference set. The guide states that the remaining videos are
  references, not transcribed research.
- No customer interviews, validated conversion data, approved testimonials, or
  verified website performance claims are available in this project context.

## Product Principles

- Explain the business outcome before internal product structure.
- Let visitors choose a business-goal, template, or help path.
- Show what a template includes and what setup needs before asking for signup.
- Preserve selected releases and safe user input through setup and recovery.
- Make customer review and activation control explicit.
