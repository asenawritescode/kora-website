import { expect, test } from 'bun:test'
import { join } from 'node:path'
import { legacyNameLines } from './brand-rules'
import { BRAND, BRAND_BY_PUBLISHER, PUBLISHER } from '../src/lib/brand'

const root = join(import.meta.dir, '..')

test.each([
  ['<p>Kora is open source</p>', [1]],
  ['<p>Kora Cloud</p>', [1]],
  ["title: 'Kora — Pricing'", [1]],
  ['docker run smitdockerhub/kora', []],
  ['KORA_DB_TYPE=mysql', []],
  ['https://kora.mradiafrica.com', []],
  ['KoraClient', []],
  ['Kora-Signature: t=1', []],
  ['Zana by Senumi', []],
])('legacy name check: %s', (text, expected) => {
  expect(legacyNameLines(text)).toEqual(expected)
})

test('claims-ok on the same or previous line allows the legacy name', () => {
  expect(legacyNameLines('Kora // claims-ok: quoted partner name')).toEqual([])
  expect(legacyNameLines('// claims-ok: quoted partner name\nKora')).toEqual([])
  expect(legacyNameLines('// claims-ok: x\n\nKora')).toEqual([3])
})

test('brand constants', () => {
  expect(BRAND).toBe('Zana')
  expect(PUBLISHER).toBe('Senumi')
  expect(BRAND_BY_PUBLISHER).toBe('Zana by Senumi')
})

test('the claims script passes on the tree', () => {
  const ok = Bun.spawnSync(['bun', join(root, 'scripts/check-claims.ts')])
  expect(ok.exitCode).toBe(0)
})
