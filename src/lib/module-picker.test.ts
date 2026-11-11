import { describe, expect, test } from 'bun:test'
import fixture from './__fixtures__/catalog-templates.json'
import { parseTemplates } from './catalog-client'
import { choiceFrom, inclusionNote, modulesFrom, prune, resolve, selectability, toggle } from './module-picker'
import type { CatalogTemplate } from './catalog-client'

// The fixture is a preview catalog (as an older Cloud returns it). Dependency
// logic is tested on an attested copy; preview behaviour has its own tests below.
const attested = structuredClone(fixture) as any
attested.data.items[0].availability = 'available'
for (const c of attested.data.items[0].components) c.availability = 'available'
const modules = modulesFrom(parseTemplates(attested))
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

  test('choosing Point of Sale includes what the catalog says it requires', () => {
    const withRequires = modules.map((m) => (m.name === 'Point of Sale' ? { ...m, requires: ['Inventory'] } : m))
    const r = resolve(withRequires, [withRequires.find((m) => m.name === 'Point of Sale')!.key])
    expect(r.template?.slug).toBe('retail-pos')
    expect(inclusionNote(r.included.get(key('Inventory'))!, 'Inventory')).toBe('Included: Point of Sale needs Inventory.')
    expect(r.included.has(key('Reports'))).toBe(false)
  })

  test('a catalog that lists no requires adds no need of its own', () => {
    const r = resolve(modules, [key('Point of Sale')])
    const inc = r.included.get(key('Inventory'))
    expect(inc && 'by' in inc).toBe(false)
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
})

// A catalog shaped like the local Cloud's: every part optional.
function template(slug: string, availability: 'available' | 'preview', components: [string, string, string, string, string[]?][]): CatalogTemplate {
  return {
    slug,
    name: slug,
    summary: '',
    availability,
    components: components.map(([id, name, selection, avail, requires]) => ({
      id,
      name,
      summary: '',
      selection,
      availability: avail as 'available' | 'preview',
      requires: requires ?? [],
    })),
  }
}
const retail = template('retail-pos', 'available', [
  ['pos-1.0.8', 'Point of Sale', 'optional', 'available', ['Inventory']],
  ['inventory-1.0.8', 'Inventory', 'optional', 'available'],
])
const local = modulesFrom([retail])
const k = (ms: ReturnType<typeof modulesFrom>, name: string) => ms.find((m) => m.name === name)!.key

describe('the choice carried to Cloud', () => {
  test('nothing chosen carries nothing', () => {
    expect(choiceFrom(local, [])).toEqual({ template: undefined, optional: [], keys: [] })
  })

  test('ticking Point of Sale includes Inventory, and both optional ids are carried in catalog order', () => {
    const c = choiceFrom(local, [k(local, 'Point of Sale')])
    expect(c.template).toBe('retail-pos')
    expect(c.optional).toEqual(['pos-1.0.8', 'inventory-1.0.8'])
    expect(c.keys).toEqual([k(local, 'Point of Sale')])
  })

  test('ticking Inventory alone carries only Inventory', () => {
    expect(choiceFrom(local, [k(local, 'Inventory')]).optional).toEqual(['inventory-1.0.8'])
  })

  test('parts the template installs anyway are never carried as optional', () => {
    const ms = modulesFrom([
      template('t', 'available', [
        ['core-1', 'Core', 'required', 'available'],
        ['extra-1', 'Extra', 'default', 'available'],
        ['more-1', 'More', 'optional', 'available', ['Core']],
      ]),
    ])
    const c = choiceFrom(ms, [k(ms, 'More')])
    expect(c.optional).toEqual(['more-1'])
    const r = resolve(ms, [k(ms, 'More')])
    expect(r.included.get(k(ms, 'Core'))).toBeDefined()
    expect(r.included.get(k(ms, 'Extra'))).toEqual({ template: 't' })
  })

  test('a chain of needs is followed to its end', () => {
    const ms = modulesFrom([
      template('t', 'available', [
        ['a-1', 'A', 'optional', 'available', ['B']],
        ['b-1', 'B', 'optional', 'available', ['C']],
        ['c-1', 'C', 'optional', 'available'],
        ['d-1', 'D', 'optional', 'available'],
      ]),
    ])
    expect(choiceFrom(ms, [k(ms, 'A')]).optional).toEqual(['a-1', 'b-1', 'c-1'])
  })

  test('needs that loop back do not hang', () => {
    const ms = modulesFrom([
      template('t', 'available', [
        ['a-1', 'A', 'optional', 'available', ['B']],
        ['b-1', 'B', 'optional', 'available', ['A']],
      ]),
    ])
    expect(choiceFrom(ms, [k(ms, 'A')]).optional).toEqual(['a-1', 'b-1'])
  })

  test('a part without a release id cannot be carried', () => {
    const t = template('t', 'available', [['x-1', 'X', 'optional', 'available']])
    delete t.components[0].id
    const ms = modulesFrom([t])
    expect(choiceFrom(ms, [k(ms, 'X')]).optional).toEqual([])
  })
})

describe('preview parts cannot be chosen', () => {
  const mixed = modulesFrom([
    template('t', 'available', [
      ['pos-1', 'Point of Sale', 'optional', 'available', ['Inventory']],
      ['inv-1', 'Inventory', 'optional', 'preview'],
      ['rep-1', 'Reports', 'optional', 'preview'],
      ['cus-1', 'Customers', 'optional', 'available'],
    ]),
  ])

  test('a preview part is not selectable and toggling it changes nothing', () => {
    expect(selectability(mixed, mixed.find((m) => m.name === 'Reports')!)).toEqual({ ok: false, reason: 'preview' })
    expect(toggle(mixed, [], k(mixed, 'Reports'))).toEqual([])
  })

  test('an available part that needs a preview part is not selectable either', () => {
    expect(selectability(mixed, mixed.find((m) => m.name === 'Point of Sale')!)).toEqual({ ok: false, reason: 'needs-preview', by: 'Inventory' })
    expect(toggle(mixed, [], k(mixed, 'Point of Sale'))).toEqual([])
  })

  test('an available part with available needs is selectable', () => {
    expect(selectability(mixed, mixed.find((m) => m.name === 'Customers')!)).toEqual({ ok: true })
    expect(toggle(mixed, [], k(mixed, 'Customers'))).toEqual([k(mixed, 'Customers')])
  })

  test('stale keys for unselectable parts are ignored and pruned', () => {
    const stale = [k(mixed, 'Customers'), k(mixed, 'Reports'), 'gone:Missing']
    expect(prune(mixed, stale)).toEqual([k(mixed, 'Customers')])
    expect(choiceFrom(mixed, stale).optional).toEqual(['cus-1'])
  })

  test('every part of a preview template is preview', () => {
    const ms = modulesFrom([template('t', 'preview', [['a-1', 'A', 'optional', 'available']])])
    expect(ms[0].availability).toBe('preview')
    expect(toggle(ms, [], ms[0].key)).toEqual([])
  })

  test('two templates: a choice from the other template starts over', () => {
    const ms = modulesFrom([
      template('one', 'available', [['a-1', 'A', 'optional', 'available']]),
      template('two', 'available', [['b-1', 'B', 'optional', 'available']]),
    ])
    expect(toggle(ms, [k(ms, 'A')], k(ms, 'B'))).toEqual([k(ms, 'B')])
    expect(prune(ms, [k(ms, 'A'), k(ms, 'B')])).toEqual([k(ms, 'A')])
  })
})
