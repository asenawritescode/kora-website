import { expect, test } from 'bun:test'
import type { CatalogModule, RoadmapEntry } from '@/lib/catalog-client'
import { catalogDrift } from '@/lib/catalog-drift'
import type { LiveCatalog } from '@/lib/live-catalog'

const mod = (slug: string, availability: CatalogModule['availability'] = 'available'): CatalogModule => ({ slug, packageId: slug, name: slug, availability })
const entry = (slug: string, releaseSlug?: string, summary = ''): RoadmapEntry =>
  ({ slug, name: slug, summary, kind: 'module', horizon: 'next', requires: [], limitations: [], releaseSlug, sort: 0 })
const catalog = (): LiveCatalog => ({ modules: [mod('erp-sell')], roadmap: [entry('pos', 'erp-sell'), entry('accounting')] })

test('no drift when the snapshot says what Cloud says', () => {
  expect(catalogDrift(catalog(), catalog())).toEqual([])
})

test('reports a module whose attestation moved in Cloud', () => {
  const live = catalog()
  live.modules = [mod('erp-sell', 'preview')]
  expect(catalogDrift(catalog(), live)).toEqual(['module erp-sell: the snapshot differs from Cloud'])
})

test('reports words changed on a roadmap item', () => {
  const live = catalog()
  live.roadmap[1] = entry('accounting', undefined, 'New wording')
  expect(catalogDrift(catalog(), live)).toEqual(['roadmap accounting: the snapshot differs from Cloud'])
})

test('reports an item or module on one side only', () => {
  const live = catalog()
  live.roadmap = [entry('pos', 'erp-sell'), entry('payroll')]
  live.modules = [mod('erp-sell'), mod('erp-buy')]
  expect(catalogDrift(catalog(), live).sort()).toEqual([
    'module erp-buy: in Cloud but not in the snapshot',
    'roadmap accounting: in the snapshot but not in Cloud',
    'roadmap payroll: in Cloud but not in the snapshot',
  ])
})

test('order alone is not drift', () => {
  const live = catalog()
  live.roadmap.reverse()
  expect(catalogDrift(catalog(), live)).toEqual([])
})
