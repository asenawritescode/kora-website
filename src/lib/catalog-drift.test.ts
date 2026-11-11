import { expect, test } from 'bun:test'
import { catalogDrift } from '@/lib/catalog-drift'
import type { LiveCatalog } from '@/lib/live-catalog'
import type { ModuleInfo } from '@/lib/modules-content'

const mod = (id: string, status: ModuleInfo['status']) => ({ id, name: id, status, desc: '', needs: '' }) as unknown as ModuleInfo
const entry = (slug: string, releaseSlug?: string, kind: 'module' | 'feature' = 'module') =>
  ({ slug, name: slug, summary: '', kind, horizon: 'next', requires: [], limitations: [], releaseSlug, sort: 0 }) as never
const live = (roadmap: unknown[], modules: { slug: string; availability: 'available' | 'preview' }[] = []): LiveCatalog =>
  ({ roadmap, modules: modules.map((m) => ({ ...m, name: m.slug })) }) as never

test('no drift when the committed list says what Cloud attests', () => {
  const l = live([entry('pos', 'erp-sell'), entry('accounting')], [{ slug: 'erp-sell', availability: 'available' }])
  expect(catalogDrift([mod('pos', 'available'), mod('accounting', 'roadmap')], l)).toEqual([])
})

test('reports a status that moved in Cloud', () => {
  const l = live([entry('purchasing', 'erp-buy')], [{ slug: 'erp-buy', availability: 'available' }])
  expect(catalogDrift([mod('purchasing', 'preview')], l)).toEqual(['purchasing: committed preview, Cloud available'])
})

test('reports a module missing on either side, but not a feature the page does not list', () => {
  const l = live([entry('pos'), entry('card-payments', undefined, 'feature'), entry('payroll')])
  expect(catalogDrift([mod('pos', 'roadmap'), mod('stock', 'roadmap')], l).sort()).toEqual([
    "payroll: in Cloud's roadmap but not in the committed list",
    "stock: in the committed list but not in Cloud's roadmap",
  ])
})
