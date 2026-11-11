import { describe, expect, test } from 'bun:test'
import type { CatalogTemplate } from '@/lib/catalog-client'
import type { LiveCatalog } from '@/lib/live-catalog'
import { SNAPSHOT } from '@/lib/catalog-snapshot'
import { buildLanes, modulesOf } from '@/lib/live-catalog'
import { LOADING, viewOf } from '@/lib/use-catalog'

const templates: CatalogTemplate[] = [{ slug: 'retail-shop', name: 'Retail shop', summary: '', availability: 'available', components: [] }]
const live: LiveCatalog = {
  modules: [{ slug: 'erp-sell', packageId: 'erp-sell', name: 'Selling', availability: 'available' }],
  roadmap: [{ slug: 'pos', kind: 'module', name: 'Sales and point of sale', summary: '', horizon: 'building', requires: [], limitations: [], releaseSlug: 'erp-sell', sort: 1 }],
}

describe('viewOf', () => {
  test('before anything answers, the committed list shows and nothing is claimed live', () => {
    const v = viewOf(LOADING)
    expect(v.state.status).toBe('loading')
    expect(v.source).toBe('loading')
    expect(v.modules).toEqual(modulesOf(SNAPSHOT))
    expect(v.lanes).toEqual(buildLanes(SNAPSHOT))
    expect(v.catalog).toEqual(SNAPSHOT.modules)
  })

  test('templates answered, live list failed: the picker works, the pages say fallback', () => {
    const v = viewOf({ templates, live: 'failed' })
    expect(v.state).toEqual({ status: 'ready', templates })
    expect(v.source).toBe('fallback')
    expect(v.modules).toEqual(modulesOf(SNAPSHOT))
  })

  test('live list answered, templates failed: pages are live, the picker shows its error', () => {
    const v = viewOf({ templates: 'failed', live })
    expect(v.state.status).toBe('error')
    expect(v.source).toBe('live')
    expect(v.modules.find((m) => m.id === 'pos')?.status).toBe('available')
  })

  test('Cloud down: both fall back together', () => {
    const v = viewOf({ templates: 'failed', live: 'failed' })
    expect(v.state.status).toBe('error')
    expect(v.source).toBe('fallback')
  })

  test('everything answered', () => {
    const v = viewOf({ templates, live })
    expect(v.state.status).toBe('ready')
    expect(v.source).toBe('live')
  })
})
