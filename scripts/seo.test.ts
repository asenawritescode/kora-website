import { expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { findSeoProblems, readHead } from './check-seo'
import { pages, renderHead, withHead, SEO_END, SEO_START } from './seo-head'
import { routePatterns } from './check-links'
import { NOT_FOUND_SEO, ROUTE_SEO } from '../src/lib/seo-routes'

const root = join(import.meta.dir, '..')
const SITE = 'https://example.test'
const shell = `<!doctype html><html><head><meta charset="utf-8" />\n${SEO_START}\n${SEO_END}\n</head><body></body></html>`

function buildDist(tweak: (file: string, html: string) => string = (_f, h) => h) {
  const dist = mkdtempSync(join(tmpdir(), 'seo-'))
  for (const page of pages(SITE)) {
    mkdirSync(dirname(join(dist, page.file)), { recursive: true })
    writeFileSync(join(dist, page.file), tweak(page.file, page.html(shell)))
  }
  writeFileSync(join(dist, 'og-image.png'), '')
  return dist
}

test('every route has its own title and description, free of the old pitch', () => {
  for (const key of ['title', 'description'] as const) {
    const values = ROUTE_SEO.map((r) => r[key])
    expect(new Set(values).size).toBe(values.length)
  }
  for (const r of ROUTE_SEO) {
    expect(`${r.title} ${r.description}`).not.toMatch(/\bKora\b|YAML|Go backend/)
    expect(r.title.length).toBeLessThanOrEqual(70)
  }
})

test('SEO routes are real routes, and the sitemap lists exactly the indexable ones', () => {
  const routes = routePatterns()
  for (const r of ROUTE_SEO) expect(routes.some((re) => re.test(r.path))).toBe(true)
  const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')
  const listed = [...sitemap.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]).sort()
  expect(listed).toEqual(ROUTE_SEO.filter((r) => r.sitemap).map((r) => r.path).sort())
})

test('robots.txt allows crawling and points at the sitemap', () => {
  const robots = readFileSync(join(root, 'public/robots.txt'), 'utf8')
  expect(robots).toMatch(/^Allow: \/$/m)
  expect(robots).not.toMatch(/^Disallow: \/\s*$/m)
  expect(robots).toMatch(/^Sitemap: https?:\/\/\S+\/sitemap\.xml$/m)
})

test('og-image.png is 1200x630 and under 100 KB', () => {
  const png = readFileSync(join(root, 'public/og-image.png'))
  expect(png.subarray(1, 4).toString()).toBe('PNG')
  expect(png.readUInt32BE(16)).toBe(1200)
  expect(png.readUInt32BE(20)).toBe(630)
  expect(png.length).toBeLessThan(100_000)
})

test('renderHead writes title, canonical, Open Graph and Twitter tags with an absolute image', () => {
  const head = readHead(`<head>${renderHead({ path: '/pricing', title: 'A & "B"', description: 'x < y' }, SITE)}</head>`)
  expect(head.title).toBe('A & "B"')
  expect(head.description).toBe('x < y')
  expect(head.canonical).toBe(`${SITE}/pricing`)
  expect(head.ogUrl).toBe(`${SITE}/pricing`)
  expect(head.ogImage).toBe(`${SITE}/og-image.png`)
  expect(head.twitterImage).toBe(`${SITE}/og-image.png`)
})

test('JSON-LD cannot close its script tag', () => {
  const html = renderHead({ path: '/', title: 't', description: 'd', jsonLd: { name: '</script><b>' } }, SITE)
  expect(html).not.toContain('</script><b>')
  expect(readHead(`<head>${html}</head>`).jsonLd.map((j) => JSON.parse(j).name)).toEqual(['</script><b>'])
})

test('withHead replaces only what is between the markers and refuses a page without them', () => {
  expect(withHead(shell, '<title>x</title>')).toContain('<title>x</title>')
  expect(() => withHead('<head></head>', 'x')).toThrow('markers')
})

test('no structured data claims prices, ratings or reviews', () => {
  const json = JSON.stringify(ROUTE_SEO.map((r) => r.jsonLd ?? null))
  expect(json).not.toMatch(/offers|price|aggregateRating|review/i)
})

test('the 404 head is noindex and has no canonical', () => {
  const h = readHead(`<head>${renderHead(NOT_FOUND_SEO, SITE)}</head>`)
  expect(h.robots).toContain('noindex')
  expect(h.canonical).toBeUndefined()
})

test('a correct build passes validate:seo', () => {
  expect(findSeoProblems(buildDist(), SITE)).toEqual([])
})

test('validate:seo reports a duplicate title, a missing page and an indexable 404', () => {
  const pricing = ROUTE_SEO.find((r) => r.path === '/pricing')!
  const home = ROUTE_SEO[0]
  const dupe = buildDist((file, html) => (file === 'pricing/index.html' ? html.replaceAll(pricing.title, home.title) : html))
  expect(findSeoProblems(dupe, SITE).join('\n')).toContain('share the same title')

  const indexable404 = buildDist((file, html) => (file === '404.html' ? html.replace('noindex,nofollow', 'index,follow') : html))
  expect(findSeoProblems(indexable404, SITE).join('\n')).toContain('404.html must be noindex')

  const empty = mkdtempSync(join(tmpdir(), 'seo-empty-'))
  expect(findSeoProblems(empty, SITE).join('\n')).toContain('pricing/index.html was not built')
})
