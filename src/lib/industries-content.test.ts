import { expect, test } from 'bun:test'
import { SNAPSHOT } from './catalog-snapshot'
import { INDUSTRIES, inPreset, presetModules, readyModules } from './industries-content'
import { modulesOf } from './live-catalog'

const modules = modulesOf(SNAPSHOT)

test('every preset names modules the snapshot lists', () => {
  const ids = new Set(modules.map((m) => m.id))
  for (const i of INDUSTRIES) for (const id of i.preset) expect(ids.has(id)).toBe(true)
})

test('ready counts come from the module states', () => {
  expect(readyModules(INDUSTRIES[0], modules).map((m) => m.id)).toEqual(['pos', 'inventory'])
  expect(readyModules(INDUSTRIES.find((i) => i.name === 'Schools and training')!, modules)).toEqual([])
})

test('a preset follows the live status, not the snapshot', () => {
  const retail = INDUSTRIES[0]
  const base = readyModules(retail, modules).length
  const purchasing = retail.preset.find((id) => modules.find((m) => m.id === id)?.status === 'preview')
  expect(purchasing).toBeDefined()
  const live = modules.map((m) => (m.id === purchasing ? { ...m, status: 'available' as const } : m))
  expect(readyModules(retail, live).length).toBe(base + 1)
  expect(readyModules(retail, modules).length).toBe(base)
})

test('a module Cloud no longer lists is skipped, not a crash', () => {
  const retail = INDUSTRIES[0]
  expect(presetModules(retail, modules.filter((m) => m.id !== 'purchasing')).map((m) => m.id)).not.toContain('purchasing')
  expect(presetModules(retail, [])).toEqual([])
})

test('a business starts with its preset, in the order of the module list', () => {
  const retail = INDUSTRIES[0]
  expect(inPreset(retail, modules).map((m) => m.id)).toEqual(['pos', 'inventory', 'purchasing', 'accounting', 'reports'])
  expect(inPreset(undefined, modules)).toBe(modules)
})
