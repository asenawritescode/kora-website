import { describe, expect, test } from 'bun:test'
import type { CatalogComponent, CatalogTemplate } from './catalog-client'
import { INDUSTRIES } from './industries-content'
import { templateGaps } from './industry-templates'

const part = (name: string, selection: string, availability: CatalogComponent['availability'] = 'available'): CatalogComponent =>
  ({ id: `${name}-1.0.0`, name, summary: '', selection, availability })
const template = (slug: string, components: CatalogComponent[]): CatalogTemplate => ({ slug, name: slug, summary: '', availability: 'available', components })

test('every business kind has a template of its own', () => {
  const slugs = INDUSTRIES.map((i) => i.template)
  expect(slugs.every(Boolean)).toBe(true)
  expect(new Set(slugs).size).toBe(INDUSTRIES.length)
})

describe('what stops a business kind being set up', () => {
  const one = [{ name: 'Shops', icon: 'shop', preset: [], template: 'shop-erp' }]
  test('a template with every needed part available is fine', () => {
    expect(templateGaps(one, [template('shop-erp', [part('Sell', 'required'), part('Stock', 'default'), part('Books', 'optional', 'preview')])])).toEqual([])
  })
  test('a business kind with no template is named', () => {
    expect(templateGaps([{ ...one[0], template: undefined }], [])).toEqual(['Shops: names no template'])
  })
  test('a template Cloud does not list is named', () => {
    expect(templateGaps(one, [])).toEqual(['Shops: Cloud lists no template "shop-erp"'])
  })
  test('a required or default part that is only a preview blocks it, an optional one does not', () => {
    const gaps = templateGaps(one, [template('shop-erp', [part('Sell', 'required', 'preview'), part('Stock', 'default', 'preview'), part('Books', 'optional', 'preview')])])
    expect(gaps).toHaveLength(2)
    expect(gaps[0]).toContain('part "Sell"')
  })
})
