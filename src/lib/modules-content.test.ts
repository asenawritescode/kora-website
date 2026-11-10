import { expect, test } from 'bun:test'
import { LANES, MODULES, countByStatus } from './modules-content'

test('there are 14 modules, each in exactly one state', () => {
  expect(MODULES).toHaveLength(14)
  expect(new Set(MODULES.map((m) => m.id)).size).toBe(14)
  expect(countByStatus('available') + countByStatus('preview') + countByStatus('roadmap')).toBe(14)
})

test('the roadmap lanes list every module once, and the features beside them', () => {
  const names = LANES.flatMap((l) => l.items.filter((i) => !i.feature).map((i) => i.name))
  expect([...names].sort()).toEqual(MODULES.map((m) => m.name).sort())
})

test('only Available modules can be chosen, and none promise a date', () => {
  expect(MODULES.filter((m) => m.status === 'available').map((m) => m.id)).toEqual(['pos', 'inventory'])
  expect(JSON.stringify(MODULES) + JSON.stringify(LANES)).not.toMatch(/\b(Q[1-4]|20\d\d|soon)\b/i)
})
