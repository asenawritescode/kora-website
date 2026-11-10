import { expect, test } from 'bun:test'
import { INDUSTRIES, readyModules } from './industries-content'
import { MODULES } from './modules-content'

test('every preset names real modules', () => {
  const ids = new Set(MODULES.map((m) => m.id))
  for (const i of INDUSTRIES) for (const id of i.preset) expect(ids.has(id)).toBe(true)
})

test('ready counts come from the module states', () => {
  expect(readyModules(INDUSTRIES[0]).map((m) => m.id)).toEqual(['pos', 'inventory'])
  expect(readyModules(INDUSTRIES.find((i) => i.name === 'Schools and training')!)).toEqual([])
})
