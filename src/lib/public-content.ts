import { fetchTemplates, type CatalogTemplate } from '@/lib/catalog-client'

let catalogCache: Promise<CatalogTemplate[]> | null = null

// Templates come from the Cloud catalog and feed the module picker. A failed
// load is not cached, so a retry refetches.
export function getCatalogTemplates(): Promise<CatalogTemplate[]> {
  catalogCache ??= fetchTemplates()
  catalogCache.catch(() => { catalogCache = null })
  return catalogCache
}
