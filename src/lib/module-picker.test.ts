import { describe, expect, test } from 'bun:test'
import fixture from './__fixtures__/catalog-templates.json'
import { parseTemplates, type CatalogTemplate } from './catalog-client'
import { choiceFrom, inclusionNote, isSelectable, modulesFrom, prune, templateOf, toggle } from './module-picker'

const template = (slug: string, availability: 'available' | 'preview', components: [string, string, string, string][], releaseId = `${slug}-1.0.0`): CatalogTemplate => ({
  slug, releaseId, name: slug, summary: '', availability,
  components: components.map(([id, name, selection, avail]) => ({ id, name, summary: '', selection, availability: avail as 'available' | 'preview' })),
})
const retail = template('retail', 'available', [
  ['sell-1', 'Selling', 'required', 'available'],
  ['stock-1', 'Stock', 'default', 'available'],
  ['books-1', 'Books', 'optional', 'available'],
  ['buy-1', 'Buying', 'optional', 'preview'],
])
const modules = modulesFrom([retail])
const key = (name: string) => modules.find((m) => m.name === name)!.key

describe('listing the parts', () => {
  test('every component comes with its template and its release id', () => {
    expect(modules.map((m) => [m.name, m.template.slug, m.id])).toEqual([
      ['Selling', 'retail', 'sell-1'], ['Stock', 'retail', 'stock-1'], ['Books', 'retail', 'books-1'], ['Buying', 'retail', 'buy-1'],
    ])
    expect(modules[0].template.releaseId).toBe('retail-1.0.0')
  })

  test('nothing under a template that is not attested can be chosen', () => {
    const preview = modulesFrom([template('later', 'preview', [['a-1', 'A', 'optional', 'available']])])
    expect(preview.map(isSelectable)).toEqual([false])
  })

  test('the fixture of an older Cloud, which says nothing about availability, offers nothing', () => {
    expect(modulesFrom(parseTemplates(fixture)).filter(isSelectable)).toEqual([])
  })
})

describe('ticking', () => {
  test('toggle adds and removes', () => {
    const on = toggle(modules, [], key('Books'))
    expect(on).toEqual([key('Books')])
    expect(toggle(modules, on, key('Books'))).toEqual([])
  })

  test('a part that is not ready changes nothing', () => {
    expect(toggle(modules, [], key('Buying'))).toEqual([])
  })

  test('a part from another template starts a new choice', () => {
    const both = modulesFrom([retail, template('farm', 'available', [['crop-1', 'Crops', 'optional', 'available']])])
    const k = (name: string) => both.find((m) => m.name === name)!.key
    expect(toggle(both, [k('Books')], k('Crops'))).toEqual([k('Crops')])
  })

  test('stale keys for parts that are gone or not ready are pruned', () => {
    expect(prune(modules, [key('Books'), key('Buying'), 'gone:Missing'])).toEqual([key('Books')])
  })

  test('the template of the ticked parts', () => {
    expect(templateOf(modules, [])).toBeUndefined()
    expect(templateOf(modules, [key('Books')])).toEqual({ slug: 'retail', name: 'retail', releaseId: 'retail-1.0.0' })
  })
})

describe('the choice carried to Cloud', () => {
  test('nothing chosen carries nothing', () => {
    expect(choiceFrom(modules, [])).toEqual({ template: undefined, optional: [], keys: [] })
  })

  test('only optional parts are carried as optional; what the template installs anyway is not', () => {
    expect(choiceFrom(modules, [key('Selling'), key('Books')])).toEqual({ template: 'retail', optional: ['books-1'], keys: [key('Selling'), key('Books')] })
    expect(choiceFrom(modules, [key('Stock')]).optional).toEqual([])
  })

  test('a part that is not ready is not carried', () => {
    expect(choiceFrom(modules, [key('Buying')])).toEqual({ template: undefined, optional: [], keys: [] })
  })

  test('a part without a release id cannot be carried', () => {
    const t = template('t', 'available', [['x-1', 'X', 'optional', 'available']])
    delete t.components[0].id
    const ms = modulesFrom([t])
    expect(choiceFrom(ms, [ms[0].key]).optional).toEqual([])
  })
})

describe('the line under an included part', () => {
  const part = (reason: string, explanation = '') => ({ releaseId: 'stock-1', name: 'Stock', reason, explanation })

  test('a part the visitor ticked needs no line', () => {
    expect(inclusionNote(part('selected'), 'Retail')).toBeUndefined()
  })

  test("Cloud's sentence is used when another part needs it", () => {
    expect(inclusionNote(part('dependency_of:books-1', 'Books needs Stock, so Stock is included.'), 'Retail')).toBe('Included: Books needs Stock, so Stock is included.')
  })

  test('otherwise the template is the reason', () => {
    expect(inclusionNote(part('included_by_default'), 'Retail shop')).toBe('Included: the Retail shop template sets up Stock with your choice.')
  })
})
