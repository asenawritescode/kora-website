// Turns a kind of business into ticks in the module picker. A preset names modules
// by the site's ids; Cloud's catalog names its parts its own way. They are joined
// by release, never by display name: a template part is a release ("erp-sell-1.0.6"),
// its package ("erp-sell") is a catalog module's slug, and the roadmap links that
// slug to the site's id.
import type { CatalogModule } from './catalog-client'
import { INDUSTRIES, industrySlug, type Industry } from './industries-content'
import type { ModuleInfo } from './live-catalog'
import { isSelectable, toggle, type PickerModule } from './module-picker'

// What the join needs: the catalog's module list and the site's modules, each
// carrying the slug Cloud links it to.
export type Directory = { catalog: CatalogModule[]; info: ModuleInfo[] }

export const industryFor = (slug: string | null | undefined): Industry | undefined => INDUSTRIES.find((i) => industrySlug(i) === slug)

// "erp-sell-1.0.6" is release 1.0.6 of package "erp-sell".
export const packageOf = (releaseId: string) => releaseId.replace(/-\d+\.\d+\.\d+(?:[-+].*)?$/, '')

// The catalog says when a package's slug differs from its id; otherwise the id is the slug.
export function slugOfRelease(releaseId: string, catalog: CatalogModule[]): string {
  const id = packageOf(releaseId)
  return catalog.find((c) => c.packageId === id)?.slug ?? id
}

export function infoFor(m: Pick<PickerModule, 'id'>, dir: Directory): ModuleInfo | undefined {
  if (!m.id) return undefined
  const slug = slugOfRelease(m.id, dir.catalog)
  return dir.info.find((i) => i.slug === slug)
}

// The parts a business is set up from: those of the template its industry names when
// the catalog lists it, otherwise every template's.
export function modulesFor(modules: PickerModule[], industry?: Industry): PickerModule[] {
  const own = industry?.template ? modules.filter((m) => m.template.slug === industry.template) : []
  return own.length ? own : modules
}

// Catalog keys to tick for a preset: the preset's modules the catalog lists and
// attests, all from one template.
export function presetKeys(modules: PickerModule[], industry: Industry, dir: Directory): string[] {
  const wanted = new Set(industry.preset)
  let keys: string[] = []
  for (const m of modulesFor(modules, industry)) {
    const info = infoFor(m, dir)
    if (info && wanted.has(info.id) && isSelectable(m)) keys = toggle(modules, keys, m.key)
  }
  return keys
}

// Preset modules with nothing the catalog can offer yet, for "not ready" lists.
export function notReady(modules: PickerModule[], dir: Directory, industry?: Industry): ModuleInfo[] {
  const offered = new Set(modulesFor(modules, industry).filter(isSelectable).flatMap((m) => infoFor(m, dir)?.id ?? []))
  const ids = industry ? industry.preset : dir.info.map((m) => m.id)
  return ids.filter((id) => !offered.has(id)).flatMap((id) => dir.info.find((m) => m.id === id) ?? [])
}
