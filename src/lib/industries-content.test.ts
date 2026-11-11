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

test('a preset follows the live status, not the committed one', async () => {
  const { MODULES } = await import('./modules-content')
  const { INDUSTRIES, readyModules } = await import('./industries-content')
  const retail = INDUSTRIES[0]
  const base = readyModules(retail).length
  const purchasing = retail.preset.find((id) => MODULES.find((m) => m.id === id)?.status === 'preview')
  expect(purchasing).toBeDefined()
  const live = MODULES.map((m) => (m.id === purchasing ? { ...m, status: 'available' as const } : m))
  expect(readyModules(retail, live).length).toBe(base + 1)
  expect(readyModules(retail).length).toBe(base)
})
