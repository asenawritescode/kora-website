import { fetchCatalogModules, fetchRoadmap, fetchTemplates, type CatalogTemplate } from '@/lib/catalog-client'
import type { LiveCatalog } from '@/lib/live-catalog'

let catalogCache: Promise<CatalogTemplate[]> | null = null

// Templates come from the Cloud catalog and feed the module picker. A failed
// load is not cached, so a retry refetches.
export function getCatalogTemplates(): Promise<CatalogTemplate[]> {
  catalogCache ??= fetchTemplates()
  catalogCache.catch(() => { catalogCache = null })
  return catalogCache
}

let liveCache: Promise<LiveCatalog> | null = null

// What the Modules and Roadmap pages read: the attested module list and the roadmap.
// Both must load; one without the other would mislabel a module. A failed load is
// not cached, so a retry refetches.
export function getLiveCatalog(): Promise<LiveCatalog> {
  liveCache ??= Promise.all([fetchCatalogModules(), fetchRoadmap()]).then(([modules, roadmap]) => ({ modules, roadmap }))
  liveCache.catch(() => { liveCache = null })
  return liveCache
}
