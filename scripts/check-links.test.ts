import { expect, test } from 'bun:test'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { findLinkProblems, routePatterns } from './check-links'

test('the real site has no dead internal links, sitemap entries or redirects', () => {
  expect(findLinkProblems()).toEqual([])
})

test('removed pages are not routes', () => {
  const routes = routePatterns()
  for (const gone of ['/benefits', '/ai-builder', '/cloud', '/open-source', '/docs', '/blog', '/blog/some-post', '/examples', '/templates/retail-pos']) expect(routes.some((r) => r.test(gone))).toBe(false)
})

test('reports a dead link, a stale sitemap entry and a missing nginx redirect', () => {
  const root = mkdtempSync(join(tmpdir(), 'links-'))
  mkdirSync(join(root, 'src/lib'), { recursive: true })
  mkdirSync(join(root, 'public'))
  writeFileSync(join(root, 'src/router.tsx'), "createRoute({\n  path: '/',\n})\ncreateRoute({\n  path: '/pricing',\n})\n")
  writeFileSync(join(root, 'src/page.tsx'), '<Link to="/pricing" /><Link to="/gone" />\n')
  writeFileSync(join(root, 'redirects.json'), '{"/old":"/"}')
  writeFileSync(join(root, 'nginx.conf'), 'server {}')
  writeFileSync(join(root, 'public/sitemap.xml'), '<loc>https://x.test/pricing</loc><loc>https://x.test/stale</loc>')
  const problems = findLinkProblems(root).join('\n')
  expect(problems).toContain('/gone')
  expect(problems).toContain('/stale')
  expect(problems).toContain('"return 301 /" for /old')
  expect(problems).not.toContain('link /pricing')
})
