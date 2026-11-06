import { describe, expect, test } from 'bun:test'
import fixture from './__fixtures__/catalog-templates.json'
import { parseTemplates } from './catalog-client'
import { inclusionNote, modulesFrom, resolve, roadmapFor, toggle } from './module-picker'

const modules = modulesFrom(parseTemplates(fixture))
const key = (name: string) => modules.find((m) => m.name === name)!.key

describe('module picker', () => {
  test('lists every catalog component with its template', () => {
    expect(modules.map((m) => [m.name, m.template.slug])).toEqual([
      ['Point of Sale', 'retail-pos'],
      ['Inventory', 'retail-pos'],
      ['Reports', 'retail-pos'],
    ])
    expect(modules[0].id).toBe('pos-1.0.3')
  })

  test('nothing chosen: no template, nothing included', () => {
    const r = resolve(modules, [])
    expect(r.template).toBeUndefined()
    expect(r.included.size).toBe(0)
  })

  test('choosing Point of Sale includes Inventory and says why', () => {
    const r = resolve(modules, [key('Point of Sale')])
    expect(r.template?.slug).toBe('retail-pos')
    const inc = r.included.get(key('Inventory'))!
    expect(inclusionNote(inc, 'Inventory')).toBe('Included: Point of Sale needs Inventory, because each sale takes the items off the stock count.')
    expect(r.included.has(key('Reports'))).toBe(false)
  })

  test('choosing Inventory alone still sets up the template parts, with the template as the reason', () => {
    const r = resolve(modules, [key('Inventory')])
    expect(inclusionNote(r.included.get(key('Point of Sale'))!, 'Point of Sale')).toBe('Included: the Retail POS template sets up Point of Sale with your choice.')
  })

  test('a catalog requires list wins and is followed', () => {
    const r = resolve(modules, [key('Reports')])
    expect(r.included.get(key('Point of Sale'))).toEqual({ by: 'Reports', why: undefined })
    expect(r.optional).toEqual(['reports-1.0.0'])
  })

  test('toggle adds and removes', () => {
    const a = toggle(modules, [], key('Inventory'))
    expect(a).toEqual([key('Inventory')])
    expect(toggle(modules, a, key('Inventory'))).toEqual([])
  })

  test('roadmap names never include a published module', () => {
    expect(roadmapFor(modules)).toEqual(['Sales', 'Purchasing', 'Accounting', 'People', 'Projects'])
    expect(roadmapFor([{ ...modules[0], name: 'Accounting' }])).not.toContain('Accounting')
  })
})

test('a catalog requires list keeps the checked reason when it matches', () => {
  const withRequires = modules.map((m) => (m.name === 'Point of Sale' ? { ...m, requires: ['Inventory'] } : m))
  const r = resolve(withRequires, [key('Point of Sale')])
  expect(r.included.get(key('Inventory'))).toEqual({ by: 'Point of Sale', why: 'each sale takes the items off the stock count' })
})
