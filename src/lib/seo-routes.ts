// Single source for per-route head tags. The client (Seo.tsx) and the build
// (scripts/seo-head.ts, which writes dist/<route>/index.html) both read this, so
// crawlers that do not run JavaScript see the same title and description.
import { BRAND, ENGINE_BRAND, PUBLISHER } from './brand'

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
    path: '/cloud',
    title: `${BRAND} Cloud — a hosted workspace for your shop`,
    description: `${BRAND} Cloud hosts your shop workspace, so you can record cash sales and stock counts in the browser without running a server. ${BRAND} by ${PUBLISHER}.`,
    sitemap: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${BRAND} Cloud`,
      serviceType: 'Hosted shop workspace',
      provider: { '@type': 'Organization', name: PUBLISHER },
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
    path: '/roadmap',
    title: `Roadmap — ${BRAND}`,
    description: `What works in ${BRAND} today, what is being built and what is planned, in order. No dates promised.`,
    sitemap: true,
  },
  {
    path: '/open-source',
    title: `${ENGINE_BRAND} Engine — open source and self-hosted`,
    description: `${ENGINE_BRAND} Engine is the open-source (AGPL-3.0) engine behind ${BRAND}. Run it on your own server with MySQL or LibSQL, or read the code.`,
    sitemap: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `${ENGINE_BRAND} Engine`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Linux, macOS, Windows',
      license: 'https://www.gnu.org/licenses/agpl-3.0.html',
      codeRepository: 'https://github.com/asenawritescode/kora',
    },
  },
  {
    path: '/onboard',
    title: `Set up your shop on ${BRAND} Cloud`,
    description: `Create a ${BRAND} Cloud account to set up your shop. ${BRAND} records sales and stock.`,
    sitemap: true,
  },
  {
    path: '/examples',
    title: `${BRAND} templates — starting points for your shop`,
    description: 'Starting points for your shop. Each one lists what it includes before you sign up.',
    sitemap: true,
  },
  {
    path: '/docs',
    title: `${ENGINE_BRAND} docs — API, deployment and self-hosting`,
    description: `Technical documentation for running, extending and self-hosting ${ENGINE_BRAND} Engine.`,
    sitemap: true,
  },
  {
    // Posts load from the CMS; until they do, the index has nothing to list, so it is not in the sitemap.
    path: '/blog',
    title: `${ENGINE_BRAND} blog — guides and technical notes`,
    description: `Guides and technical notes from the ${ENGINE_BRAND} team.`,
    sitemap: false,
  },
]

export const NOT_FOUND_SEO: RouteSeo = {
  path: '/404',
  title: `Page not found — ${BRAND}`,
  description: 'This page does not exist.',
  noindex: true,
}

// Served for /blog/<slug>: the post title is only known after the CMS responds,
// so the shell carries the site default and no canonical URL.
export const SHELL_SEO: RouteSeo = {
  path: '/',
  title: ROUTE_SEO[0].title,
  description: ROUTE_SEO[0].description,
}

export function seoFor(path: string): RouteSeo {
  const found = ROUTE_SEO.find((r) => r.path === path)
  if (!found) throw new Error(`No SEO entry for ${path}`)
  return found
}
