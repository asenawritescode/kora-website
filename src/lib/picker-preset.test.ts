import { describe, expect, test } from 'bun:test'
import type { CatalogComponent, CatalogModule, CatalogTemplate } from './catalog-client'
import { INDUSTRIES } from './industries-content'
import { SNAPSHOT } from './catalog-snapshot'
import { modulesOf } from './live-catalog'
import { modulesFrom } from './module-picker'
import { industryFor, infoFor, modulesFor, notReady, packageOf, presetKeys, slugOfRelease, type Directory } from './picker-preset'

// Names as the real local Cloud publishes them: none of them is a name the site uses.
const part = (id: string, name: string, selection: string, availability: CatalogComponent['availability'] = 'available'): CatalogComponent =>
  ({ id, name, summary: '', selection, availability })
const template: CatalogTemplate = {
  slug: 'retail-erp', name: 'Retail with back office', summary: '', availability: 'available',
  components: [
    part('erp-sell-1.0.6', 'Selling and cash', 'required'),
    part('erp-stock-1.0.6', 'Stock', 'default'),
    part('erp-buy-1.0.6', 'Buying', 'optional', 'preview'),
    part('erp-books-1.0.6', 'Books', 'optional'),
  ],
}
const catalog: CatalogModule[] = ['erp-sell', 'erp-stock', 'erp-buy', 'erp-books'].map((slug) => ({ slug, packageId: slug, name: slug, availability: 'available' }))
// The snapshot's roadmap: Cloud links the first three, accounting has no release yet.
const dir: Directory = { catalog, info: modulesOf({ modules: catalog, roadmap: SNAPSHOT.roadmap }) }
const modules = modulesFrom([template])
const retail = INDUSTRIES[0]

test('an industry is found by the slug in its link', () => {
  expect(industryFor('retail-and-general-shops')?.name).toBe('Retail and general shops')
  expect(industryFor('nope')).toBeUndefined()
})

describe('joining a template part to a site module', () => {
  test('a release id names its package', () => {
    expect(packageOf('erp-sell-1.0.6')).toBe('erp-sell')
    expect(packageOf('retail-erp-2.10.0-rc1')).toBe('retail-erp')
    expect(packageOf('erp-sell-pro-1.0.0')).toBe('erp-sell-pro')
    expect(packageOf('no-version')).toBe('no-version')
  })

  test('the catalog decides when a package and its slug differ', () => {
    expect(slugOfRelease('shop-sell-1.0.0', [{ slug: 'till', packageId: 'shop-sell', name: 'Till', availability: 'available' }])).toBe('till')
    expect(slugOfRelease('shop-sell-1.0.0', [])).toBe('shop-sell')
  })

  test('a part is the site module Cloud links its release to, whatever the names say', () => {
    expect(infoFor(modules[0], dir)?.id).toBe('pos')
    expect(infoFor(modules[1], dir)?.id).toBe('inventory')
  })

  test("a part with the site's name but another release is not that module", () => {
    const impostor = modulesFrom([{ ...template, components: [part('other-1.0.0', 'Inventory and stock', 'optional')] }])
    expect(infoFor(impostor[0], dir)).toBeUndefined()
  })

  test('where Cloud says a module has no release, nothing joins to it', () => {
    expect(dir.info.find((m) => m.id === 'accounting')?.slug).toBeUndefined()
    expect(infoFor(modules[3], dir)).toBeUndefined()
  })
})

test('a preset ticks the parts of its modules that Cloud attests', () => {
  expect(presetKeys(modules, retail, dir)).toEqual(['retail-erp:Selling and cash', 'retail-erp:Stock'])
})

test('a preset with no module in the catalog ticks nothing', () => {
  expect(presetKeys(modules, INDUSTRIES.find((i) => i.name === 'Schools and training')!, dir)).toEqual([])
})

test('without Cloud\'s module list a part still joins by its package id', () => {
  expect(presetKeys(modules, retail, { catalog: [], info: dir.info })).toEqual(['retail-erp:Selling and cash', 'retail-erp:Stock'])
})

test('not-ready lists what the catalog cannot offer yet', () => {
  expect(notReady(modules, dir, retail).map((m) => m.id)).toEqual(['purchasing', 'accounting', 'reports'])
})

describe('an industry that names its template', () => {
  // The real catalog has two retail templates; their parts must not be mixed.
  const shop: CatalogTemplate = {
    slug: 'shop', name: 'Shop', summary: '', availability: 'available',
    components: [part('shop-sell-1.0.0', 'Selling at the counter', 'required'), part('shop-stock-1.0.0', 'Products and stock', 'default')],
  }
  const both = modulesFrom([shop, template])
  const named = { ...retail, template: 'retail-erp' }
  // Cloud also links the shop template's release slugs to the same site modules.
  const twoDir: Directory = { catalog, info: dir.info.map((m) => (m.id === 'pos' ? { ...m, slug: 'erp-sell' } : m)) }

  test('its parts come from that template only', () => {
    expect(modulesFor(both, named).every((m) => m.template.slug === 'retail-erp')).toBe(true)
    expect(presetKeys(both, named, twoDir)).toEqual(['retail-erp:Selling and cash', 'retail-erp:Stock'])
  })

  test('without a template of its own it uses every template', () => {
    const untemplated = { ...INDUSTRIES.find((i) => i.name === 'Wholesale and distribution')!, template: undefined }
    expect(untemplated.template).toBeUndefined()
    expect(modulesFor(both, untemplated)).toBe(both)
    expect(modulesFor(both, undefined)).toBe(both)
  })

  test('a template the catalog does not list falls back to every template', () => {
    expect(modulesFor(both, { ...retail, template: 'gone' })).toBe(both)
  })
})
