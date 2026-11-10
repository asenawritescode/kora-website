// Fails the build when an internal link, sitemap entry or redirect points at a
// page that does not exist. Source of truth for routes is src/router.tsx.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { COMPANY_LINKS, CTA_LINK, PRIMARY_LINKS } from '../src/lib/site-links'

const defaultRoot = join(import.meta.dir, '..')

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (/\.tsx?$/.test(name)) yield p
  }
}

export function routePatterns(root = defaultRoot): RegExp[] {
  const router = readFileSync(join(root, 'src/router.tsx'), 'utf8')
  const paths = [...router.matchAll(/^\s*path: '(\/[^']*)'/gm)].map((m) => m[1])
  return paths.map((p) => new RegExp(`^${p.replace(/\$[A-Za-z]+/g, '[^/]+')}$`))
}

const pathOf = (href: string) => href.replace(/[?#].*$/, '').replace(/(.)\/$/, '$1')

export function findLinkProblems(root = defaultRoot): string[] {
  const routes = routePatterns(root)
  const exists = (href: string) => routes.some((r) => r.test(pathOf(href)))
  const problems: string[] = []

  for (const link of [...PRIMARY_LINKS, ...COMPANY_LINKS, CTA_LINK]) {
    if (!exists(link.href)) problems.push(`nav/footer link "${link.label}" -> ${link.href} matches no route`)
  }

  for (const file of walk(join(root, 'src'))) {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      for (const m of line.matchAll(/\b(?:to|href)=["'{`]+(\/[^"'}`\s]*)/g)) {
        if (!exists(m[1])) problems.push(`${relative(root, file)}:${i + 1}: link ${m[1]} matches no route`)
      }
    })
  }

  const redirects: Record<string, string> = JSON.parse(readFileSync(join(root, 'redirects.json'), 'utf8'))
  const nginx = readFileSync(join(root, 'nginx.conf'), 'utf8')
  for (const [from, to] of Object.entries(redirects)) {
    if (!exists(to)) problems.push(`redirect ${from} -> ${to}: target matches no route`)
    if (exists(from)) problems.push(`redirect ${from} is also a real route`)
    if (!nginx.includes(`location = ${from} { return 301 ${to}; }`)) problems.push(`nginx.conf has no "return 301 ${to}" for ${from}`)
  }

  const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')
  for (const m of sitemap.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)) {
    if (!exists(m[1])) problems.push(`sitemap.xml lists ${m[1]}, which matches no route`)
  }

  return problems
}

if (import.meta.main) {
  const problems = findLinkProblems()
  if (problems.length) {
    console.error(`Dead internal links (${problems.length}):\n${problems.map((p) => `  ${p}`).join('\n')}`)
    process.exit(1)
  }
  console.log('validate:links ok')
}
