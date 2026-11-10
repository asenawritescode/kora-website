import { expect, test } from 'bun:test'
import { INDUSTRIES } from './industries-content'
import type { PickerModule } from './module-picker'
import { industryFor, notReady, presetKeys } from './picker-preset'

const t = { slug: 'retail-pos', name: 'Retail POS' }
const mod = (name: string, availability: PickerModule['availability'] = 'available', requires: string[] = []): PickerModule => ({
  key: `retail-pos:${name}`, name, summary: '', availability, selection: 'optional', requires, template: t,
})
const catalog = [mod('Point of Sale', 'available', ['Inventory']), mod('Inventory'), mod('Reports', 'preview', ['Point of Sale'])]

test('an industry is found by the slug in its link', () => {
  expect(industryFor('retail-and-general-shops')?.name).toBe('Retail and general shops')
  expect(industryFor('nope')).toBeUndefined()
})

test('a preset ticks the modules the catalog offers, by catalog name', () => {
  expect(presetKeys(catalog, INDUSTRIES[0])).toEqual(['retail-pos:Point of Sale', 'retail-pos:Inventory'])
})

test('a preset with no module in the catalog ticks nothing', () => {
  expect(presetKeys(catalog, INDUSTRIES.find((i) => i.name === 'Schools and training')!)).toEqual([])
})

test('not-ready lists what the catalog cannot offer yet', () => {
  expect(notReady(catalog, INDUSTRIES[0]).map((m) => m.id)).toEqual(['purchasing', 'accounting', 'reports'])
})
