// Writes a real <head> into the built HTML so crawlers and link previews that do
// not run JavaScript get the right title, description, canonical and share image.
// dist/index.html is the home page; every other route gets dist/<route>/index.html,
// 404.html is the noindex page nginx serves with status 404.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { BRAND } from '../src/lib/brand'
import { NOT_FOUND_SEO, OG_IMAGE_ALT, OG_IMAGE_PATH, ROUTE_SEO, siteUrlFrom, type RouteSeo } from '../src/lib/seo-routes'

export const SEO_START = '<!--seo:start-->'
export const SEO_END = '<!--seo:end-->'

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function renderHead(route: RouteSeo, siteUrl: string, opts: { canonical?: boolean } = {}): string {
  const canonical = opts.canonical ?? true
  const url = `${siteUrl}${route.path === '/' ? '' : route.path}`
  const image = `${siteUrl}${OG_IMAGE_PATH}`
  const robots = route.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
  const meta = (attr: 'name' | 'property', key: string, content: string) => `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`
  const lines = [
    `<title>${escapeText(route.title)}</title>`,
    meta('name', 'description', route.description),
    meta('name', 'robots', robots),
    ...(canonical && !route.noindex ? [`<link rel="canonical" href="${escapeAttr(url)}" />`] : []),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', BRAND),
    meta('property', 'og:title', route.title),
    meta('property', 'og:description', route.description),
    ...(canonical && !route.noindex ? [meta('property', 'og:url', url)] : []),
    meta('property', 'og:image', image),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', OG_IMAGE_ALT),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', route.title),
    meta('name', 'twitter:description', route.description),
    meta('name', 'twitter:image', image),
    meta('name', 'twitter:image:alt', OG_IMAGE_ALT),
  ]
  if (route.jsonLd) {
    // "<" is escaped so structured data can never close the script element.
    const json = JSON.stringify(route.jsonLd).replace(/</g, '\\u003c')
    lines.push(`<script type="application/ld+json" data-seo-id="primary">${json}</script>`)
  }
  return lines.map((l) => `    ${l}`).join('\n')
}

export function withHead(html: string, head: string): string {
  const start = html.indexOf(SEO_START)
  const end = html.indexOf(SEO_END)
  if (start < 0 || end < start) throw new Error(`index.html needs ${SEO_START} ... ${SEO_END} markers inside <head>`)
  return `${html.slice(0, start + SEO_START.length)}\n${head}\n    ${html.slice(end)}`
}

// Output file for each page, relative to dist/.
export function pages(siteUrl: string): { file: string; html: (shell: string) => string }[] {
  const make = (route: RouteSeo, canonical = true) => (shell: string) => withHead(shell, renderHead(route, siteUrl, { canonical }))
  return [
    ...ROUTE_SEO.map((route) => ({ file: route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`, html: make(route) })),
    { file: '404.html', html: make(NOT_FOUND_SEO) },
  ]
}

export function seoHead(): Plugin {
  let siteUrl = siteUrlFrom()
  let root = process.cwd()
  return {
    name: 'seo-head',
    configResolved(config) {
      root = config.root
      siteUrl = siteUrlFrom(loadEnv(config.mode, config.root, 'VITE_').VITE_KORA_SITE_URL)
    },
    // Dev server and the build's index.html both start from the home head.
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => withHead(html, renderHead(ROUTE_SEO[0], siteUrl)),
    },
    // index.html is emitted by Vite's own HTML plugin after generateBundle, so the
    // per-route files are written once the bundle is on disk.
    writeBundle(options) {
      const dist = options.dir ?? resolve(root, 'dist')
      const source = readFileSync(join(dist, 'index.html'), 'utf8')
      for (const page of pages(siteUrl)) {
        mkdirSync(dirname(join(dist, page.file)), { recursive: true })
        writeFileSync(join(dist, page.file), page.html(source))
      }
    },
  }
}
