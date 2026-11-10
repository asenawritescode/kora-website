// Fails the build when a built page's head is wrong or not unique. It reads the
// HTML files in dist/, i.e. what nginx serves before any JavaScript runs.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pages } from './seo-head'
import { NOT_FOUND_SEO, OG_IMAGE_PATH, ROUTE_SEO, siteUrlFrom } from '../src/lib/seo-routes'

const defaultDist = join(import.meta.dir, '..', 'dist')
const unescape = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&')

export function readHead(html: string) {
  const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'))
  const meta = (attr: string, key: string) => {
    const m = head.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))
    return m ? unescape(m[1]) : undefined
  }
  return {
    title: unescape(head.match(/<title>([^<]*)<\/title>/)?.[1].trim() ?? '') || undefined,
    description: meta('name', 'description'),
    robots: meta('name', 'robots'),
    canonical: head.match(/<link rel="canonical" href="([^"]*)"/)?.[1],
    ogUrl: meta('property', 'og:url'),
    ogImage: meta('property', 'og:image'),
    twitterImage: meta('name', 'twitter:image'),
    jsonLd: [...head.matchAll(/<script type="application\/ld\+json"[^>]*>([^<]*)<\/script>/g)].map((m) => m[1]),
  }
}

export function findSeoProblems(dist = defaultDist, siteUrl = siteUrlFrom(process.env.VITE_KORA_SITE_URL)): string[] {
  const problems: string[] = []
  const titles = new Map<string, string>()
  const descriptions = new Map<string, string>()
  const unique = (seen: Map<string, string>, what: string, value: string, file: string) => {
    const other = seen.get(value)
    if (other) problems.push(`${file} and ${other} share the same ${what}: "${value}"`)
    else seen.set(value, file)
  }

  for (const page of pages(siteUrl)) {
    const path = join(dist, page.file)
    if (!existsSync(path)) {
      problems.push(`${page.file} was not built`)
      continue
    }
    const h = readHead(readFileSync(path, 'utf8'))
    const route = ROUTE_SEO.find((r) => (r.path === '/' ? 'index.html' : `${r.path.slice(1)}/index.html`) === page.file)
    if (!h.title) problems.push(`${page.file}: no <title>`)
    if (!h.description) problems.push(`${page.file}: no meta description`)
    if (h.title && h.title.length > 70) problems.push(`${page.file}: title is ${h.title.length} characters (max 70)`)
    if (h.description && h.description.length > 200) problems.push(`${page.file}: description is ${h.description.length} characters (max 200)`)
    if (h.ogImage !== `${siteUrl}${OG_IMAGE_PATH}` || h.twitterImage !== h.ogImage) problems.push(`${page.file}: og:image/twitter:image must be ${siteUrl}${OG_IMAGE_PATH}`)
    if (/\bKora\b/.test(`${h.title} ${h.description}`)) problems.push(`${page.file}: head still says "Kora"`)
    for (const json of h.jsonLd) {
      try { JSON.parse(json) } catch { problems.push(`${page.file}: invalid JSON-LD`) }
    }
    if (page.file === '404.html') {
      if (!h.robots?.includes('noindex')) problems.push('404.html must be noindex')
      if (h.canonical) problems.push('404.html must not have a canonical URL')
    } else if (page.file !== '200.html') {
      const wantsNoindex = route?.noindex === true
      if (!!h.robots?.includes('noindex') !== wantsNoindex) problems.push(`${page.file} ${wantsNoindex ? 'must be' : 'is'} noindex`)
      if (route && !wantsNoindex) {
        const url = `${siteUrl}${route.path === '/' ? '' : route.path}`
        if (h.canonical !== url || h.ogUrl !== url) problems.push(`${page.file}: canonical and og:url must be ${url}`)
      }
      if (h.title) unique(titles, 'title', h.title, page.file)
      if (h.description) unique(descriptions, 'description', h.description, page.file)
    }
  }
  if (!existsSync(join(dist, 'og-image.png'))) problems.push('og-image.png is missing from dist')
  if (NOT_FOUND_SEO.noindex !== true) problems.push('the 404 page must be noindex')
  return problems
}

if (import.meta.main) {
  const problems = findSeoProblems()
  if (problems.length) {
    console.error(`SEO problems (${problems.length}):\n${problems.map((p) => `  ${p}`).join('\n')}`)
    process.exit(1)
  }
  console.log('validate:seo ok')
}
