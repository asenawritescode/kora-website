// Single source for per-route head tags. The client (Seo.tsx) and the build
// (scripts/seo-head.ts, which writes dist/<route>/index.html) both read this, so
// crawlers that do not run JavaScript see the same title and description.
import { BRAND, PUBLISHER } from './brand'

export type JsonLd = Record<string, unknown>

export type RouteSeo = {
  path: string
  title: string
  description: string
  noindex?: boolean
  // Listed in sitemap.xml. A route stays out until it has real content to index.
  sitemap?: boolean
  jsonLd?: JsonLd | JsonLd[]
}

export const DEFAULT_SITE_URL = 'https://kora.mradiafrica.com'
export const OG_IMAGE_PATH = '/og-image.png'
export const OG_IMAGE_ALT = `${BRAND}: sales and stock for small shops`

export const siteUrlFrom = (value?: string) => value?.replace(/\/$/, '') || DEFAULT_SITE_URL

const homeDescription = `Record cash sales, keep stock counts that update with each sale and close the till each day. Works in the browser. ${BRAND} by ${PUBLISHER}.`

export const ROUTE_SEO: RouteSeo[] = [
  {
    path: '/',
    title: `${BRAND} — sales and stock for small shops`,
    description: homeDescription,
    sitemap: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: BRAND,
      description: homeDescription,
    },
  },
  {
    path: '/pricing',
    title: `Pricing — ${BRAND}`,
    description: `${BRAND} is free during the pilot. Pricing will be announced before the pilot ends.`,
    sitemap: true,
  },
  {
    path: '/modules',
    title: `Modules — ${BRAND}`,
    description: `Every ${BRAND} module, with what works today, what is in preview and what is planned.`,
    sitemap: true,
  },
  {
    path: '/industries',
    title: `Industries — ${BRAND}`,
    description: `Start from your kind of business: preset ${BRAND} modules, your own words and your day, step by step.`,
    sitemap: true,
  },
  {
    path: '/industries/retail',
    title: `${BRAND} for retail and general shops`,
    description: `For dukas, minimarts and general shops: sell, track stock and see today’s sales with ${BRAND}.`,
    sitemap: true,
  },
  {
    path: '/how-ai',
    title: `How AI works with your tools — ${BRAND}`,
    description: `People use ${BRAND} through screens. AI agents will follow the same rules: a role, approval for risky actions and one activity log.`,
    sitemap: true,
  },
  {
    path: '/start',
    title: `Set up your shop — ${BRAND}`,
    description: `Choose the kind of business you run and the modules you need. ${BRAND} is free during the pilot.`,
  },
  {
    path: '/contact',
    title: `Contact us — ${BRAND}`,
    description: `Questions about ${BRAND}, the pilot or a problem in your workspace. Based in Nairobi, Kenya.`,
    sitemap: true,
  },
  {
    path: '/about',
    title: `About — ${BRAND}`,
    description: `${BRAND} means “tools” in Swahili. Business tools for small businesses, made in Nairobi.`,
    sitemap: true,
  },
  {
    // Outlines only until the lawyers' text exists: kept out of search results.
    path: '/privacy',
    title: `Privacy (draft) — ${BRAND}`,
    description: `What ${BRAND}'s privacy policy will cover. Draft.`,
    noindex: true,
  },
  {
    path: '/terms',
    title: `Terms of use (draft) — ${BRAND}`,
    description: `What ${BRAND}'s terms of use will cover. Draft.`,
    noindex: true,
  },
  {
    path: '/roadmap',
    title: `Roadmap — ${BRAND}`,
    description: `What works in ${BRAND} today, what is being built and what is planned, in order. No dates promised.`,
    sitemap: true,
  },
  {
    path: '/onboard',
    title: `Set up your shop on ${BRAND} Cloud`,
    description: `Create a ${BRAND} Cloud account to set up your shop. ${BRAND} records sales and stock.`,
    sitemap: true,
  },
]

export const NOT_FOUND_SEO: RouteSeo = {
  path: '/404',
  title: `Page not found — ${BRAND}`,
  description: 'This page does not exist.',
  noindex: true,
}

export function seoFor(path: string): RouteSeo {
  const found = ROUTE_SEO.find((r) => r.path === path)
  if (!found) throw new Error(`No SEO entry for ${path}`)
  return found
}
