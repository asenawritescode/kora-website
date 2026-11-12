// The committed copy of what Cloud publishes (modules and roadmap): the page
// content shown while Cloud answers and when it cannot be reached. It is
// generated, never edited by hand: `bun run sync:catalog` rewrites it from a
// running Cloud, and `bun run validate:catalog` fails the build when it differs.
// It holds Cloud's own wire shape, so the same strict parsers read it.
import raw from './catalog-snapshot.json'
import { parseCatalogModules, parseRoadmap } from './catalog-client'
import type { LiveCatalog } from './live-catalog'

export const SNAPSHOT: LiveCatalog = { modules: parseCatalogModules(raw.modules), roadmap: parseRoadmap(raw.roadmap) }

// The catalog in wire shape, trimmed to the fields the site reads, in a stable order.
export function wire(live: LiveCatalog) {
  const modules = [...live.modules].sort((a, b) => a.slug.localeCompare(b.slug)).map((m) => ({
    slug: m.slug, package_id: m.packageId, name: m.name, availability: m.availability,
  }))
  const roadmap = [...live.roadmap].sort((a, b) => a.sort - b.sort || a.slug.localeCompare(b.slug)).map((e) => ({
    slug: e.slug, kind: e.kind, name: e.name, summary: e.summary, ...(e.category ? { category: e.category } : {}),
    horizon: e.horizon, requires: e.requires, limitations: e.limitations, ...(e.releaseSlug ? { release_slug: e.releaseSlug } : {}), sort: e.sort,
  }))
  return { modules: { data: { items: modules } }, roadmap: { data: { items: roadmap } } }
}

export const serialize = (live: LiveCatalog) => `${JSON.stringify(wire(live), null, 2)}\n`
