import { describe, expect, test } from 'bun:test'
import fixture from './__fixtures__/public-site-v1.json'
import { fetchRoadmap, parseCatalogModules, parseRoadmap, CatalogError, type Fetcher } from './catalog-client'
import { buildLanes, modulesOf, statusOf, type LiveCatalog } from './live-catalog'
import type { Status } from '@/components/landing/ui'

// public-site-v1.json holds real payloads from a seeded Cloud: releases erp-sell and
// erp-stock attested available, erp-buy published but preview, and the roadmap items.
const live: LiveCatalog = { modules: parseCatalogModules(fixture.modules), roadmap: parseRoadmap(fixture.roadmap) }

describe('parsers', () => {
  test('read the Cloud fixture', () => {
    expect(live.modules.map((m) => [m.slug, m.availability]).sort()).toEqual([['erp-buy', 'preview'], ['erp-sell', 'available'], ['erp-stock', 'available']])
    expect(live.roadmap).toHaveLength(17)
    expect(live.roadmap.find((e) => e.slug === 'purchasing')).toMatchObject({ releaseSlug: 'erp-buy', horizon: 'building', requires: ['inventory'], limitations: ['Purchase orders and supplier bills.'] })
    expect(live.roadmap.find((e) => e.slug === 'accounting')?.releaseSlug).toBeUndefined()
  })

  test.each([
    ['not an object', null],
    ['no data', {}],
    ['items not a list', { data: { items: {} } }],
  ])('reject a payload that is %s', (_, payload) => {
    expect(() => parseCatalogModules(payload)).toThrow(CatalogError)
    expect(() => parseRoadmap(payload)).toThrow(CatalogError)
  })

  test('never trust a missing or unknown availability', () => {
    const modules = parseCatalogModules({ data: { items: [{ slug: 'a', name: 'A' }, { slug: 'b', name: 'B', availability: 'ga' }, { slug: 'c', name: 'C', availability: 'hidden' }] } })
    expect(modules.map((m) => [m.slug, m.availability])).toEqual([['a', 'preview'], ['b', 'preview']])
  })

  test('drop roadmap entries with an unknown kind or horizon instead of guessing', () => {
    const base = { slug: 'x', name: 'X', kind: 'module', horizon: 'next' }
    const items = [base, { ...base, slug: 'y', horizon: 'soon' }, { ...base, slug: 'z', kind: 'app' }, { ...base, slug: '', name: 'No slug' }]
    expect(parseRoadmap({ data: { items } }).map((e) => e.slug)).toEqual(['x'])
  })

  test('fetchRoadmap reports an unreachable catalog and a failing one', async () => {
    const down: Fetcher = async () => { throw new TypeError('offline') }
    const broken: Fetcher = async () => new Response('', { status: 503 })
    await expect(fetchRoadmap({ baseURL: 'http://x', fetchImpl: down })).rejects.toMatchObject({ kind: 'network' })
    await expect(fetchRoadmap({ baseURL: 'http://x', fetchImpl: broken })).rejects.toMatchObject({ kind: 'http', status: 503 })
  })
})

describe('statusOf', () => {
  const entry = (releaseSlug?: string) => ({ slug: 's', kind: 'module' as const, name: 'S', summary: '', horizon: 'next' as const, requires: [], limitations: [], releaseSlug, sort: 0 })
  const cases: [string, string | undefined, Status][] = [
    ['linked and attested available', 'erp-sell', 'available'],
    ['linked and preview', 'erp-buy', 'preview'],
    ['linked to a module the catalog does not list', 'erp-gone', 'roadmap'],
    ['not linked', undefined, 'roadmap'],
  ]
  test.each(cases)('%s', (_, slug, want) => {
    expect(statusOf(entry(slug), live.modules)).toBe(want)
  })
})

describe('modulesOf', () => {
  const modules = modulesOf(live)
  const byId = (id: string) => modules.find((m) => m.id === id)!

  test('lists the roadmap\'s modules, not its features, in Cloud\'s order', () => {
    expect(modules).toHaveLength(14)
    expect(modules.slice(0, 4).map((m) => m.id)).toEqual(['pos', 'inventory', 'purchasing', 'accounting'])
    expect(modules.some((m) => m.id === 'card-payments')).toBe(false)
  })

  test('takes readiness from Cloud', () => {
    expect(byId('pos').status).toBe('available')
    expect(byId('inventory').status).toBe('available')
    expect(byId('purchasing').status).toBe('preview')
    expect(byId('accounting').status).toBe('roadmap')
  })

  test('a change in Cloud changes the page: Purchasing attested available', () => {
    const attested: LiveCatalog = { ...live, modules: live.modules.map((m) => (m.slug === 'erp-buy' ? { ...m, availability: 'available' as const } : m)) }
    expect(modulesOf(attested).find((m) => m.id === 'purchasing')?.status).toBe('available')
  })

  test('turns requires and limitations into the needs and missing lines', () => {
    expect(byId('purchasing').needs).toBe('Inventory and stock')
    expect(byId('purchasing').missing).toBe('Purchase orders and supplier bills.')
    expect(byId('inventory').missing).toBeUndefined()
  })

  test('a released module that needs nothing says so; a planned one has not decided', () => {
    expect(byId('inventory').needs).toBe('Nothing else')
    expect(byId('accounting').needs).toBe('To be confirmed')
  })

  test('carries the release link and the job Cloud names', () => {
    const withJob: LiveCatalog = { ...live, roadmap: live.roadmap.map((e) => (e.slug === 'pos' ? { ...e, category: 'Sell' } : e)) }
    expect(modulesOf(withJob).find((m) => m.id === 'pos')).toMatchObject({ slug: 'erp-sell', category: 'Sell' })
    expect(byId('accounting').slug).toBeUndefined()
  })

  test('an empty roadmap lists nothing rather than guessing', () => {
    expect(modulesOf({ ...live, roadmap: [] })).toEqual([])
  })
})

describe('buildLanes', () => {
  const lanes = buildLanes(live)
  const names = (title: string) => lanes.find((l) => l.title === title)!.items.map((i) => i.name)

  test('puts what is attested available in Now and the rest by horizon', () => {
    expect(names('Now')).toEqual(['Sales and point of sale', 'Inventory and stock'])
    expect(names('Building')).toEqual(['Purchasing and suppliers'])
    expect(names('Planned next')).toEqual(['Accounting and tax', 'Reports and owner dashboards', 'Card payments', 'Receipt printers', 'KRA eTIMS tax receipts'])
    expect(names('Planned later')).toHaveLength(9)
  })

  test('marks features and states what is missing', () => {
    expect(lanes.find((l) => l.title === 'Planned next')!.items.filter((i) => i.feature).map((i) => i.name)).toEqual(['Card payments', 'Receipt printers', 'KRA eTIMS tax receipts'])
    expect(lanes.find((l) => l.title === 'Building')!.items[0].missing).toBe('purchase orders and supplier bills.')
  })

  test('moves an item out of Building when its release is attested available', () => {
    const attested: LiveCatalog = { ...live, modules: live.modules.map((m) => (m.slug === 'erp-buy' ? { ...m, availability: 'available' as const } : m)) }
    const next = buildLanes(attested)
    expect(next.find((l) => l.title === 'Now')!.items.map((i) => i.name)).toContain('Purchasing and suppliers')
    expect(next.find((l) => l.title === 'Building')!.items).toEqual([])
  })
})
