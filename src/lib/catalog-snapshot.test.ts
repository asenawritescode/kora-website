import { describe, expect, test } from 'bun:test'
import raw from './catalog-snapshot.json'
import { SNAPSHOT, serialize } from './catalog-snapshot'
import { buildLanes, modulesOf, statusOf } from './live-catalog'

describe('the committed snapshot', () => {
  test('is exactly what the sync script would write, so nobody edits it by hand', () => {
    expect(JSON.stringify(raw)).toBe(JSON.stringify(JSON.parse(serialize(SNAPSHOT))))
  })

  test('lists unique modules and every roadmap item has a slug and a name', () => {
    const modules = modulesOf(SNAPSHOT)
    expect(modules.length).toBeGreaterThan(0)
    expect(new Set(modules.map((m) => m.id)).size).toBe(modules.length)
    for (const e of SNAPSHOT.roadmap) expect(e.name).not.toBe('')
  })

  test('only a module Cloud lists and attests is available', () => {
    for (const e of SNAPSHOT.roadmap) {
      const status = statusOf(e, SNAPSHOT.modules)
      if (status !== 'roadmap') expect(SNAPSHOT.modules.some((m) => m.slug === e.releaseSlug)).toBe(true)
    }
  })

  test('promises no dates', () => {
    expect(JSON.stringify(modulesOf(SNAPSHOT)) + JSON.stringify(buildLanes(SNAPSHOT))).not.toMatch(/\b(Q[1-4]|20\d\d|soon)\b/i)
  })

  test('every module sits in a lane', () => {
    const inLanes = buildLanes(SNAPSHOT).flatMap((l) => l.items.filter((i) => !i.feature).map((i) => i.name))
    expect([...inLanes].sort()).toEqual(modulesOf(SNAPSHOT).map((m) => m.name).sort())
  })
})
