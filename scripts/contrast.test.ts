import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { checkPairs, contrastRatio, parseColors, parseDarkColors, parsePairs } from './contrast'

const tokens = readFileSync(join(import.meta.dir, '../src/styles/tokens.css'), 'utf8')

test('contrast ratio matches the WCAG reference values', () => {
  expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
  expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5)
  expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2)
  expect(contrastRatio('#fff', '#000')).toBeCloseTo(21, 5)
})

test('the old orange failed AA with white text, the accent passes', () => {
  expect(contrastRatio('#ffffff', '#ff6b35')).toBeLessThan(3)
  expect(contrastRatio('#ffffff', '#c84018')).toBeGreaterThanOrEqual(4.5)
})

test('every pair declared in tokens.css passes and uses known tokens', () => {
  const colors = parseColors(tokens)
  const pairs = parsePairs(tokens)
  expect(pairs.length).toBeGreaterThan(10)
  for (const p of pairs) {
    expect(colors[p.fg]).toBeDefined()
    expect(colors[p.bg]).toBeDefined()
  }
  expect(checkPairs(tokens).filter((r) => !r.ok)).toEqual([])
})

test('a failing pair and an unknown token are reported', () => {
  const css = `--color-a: #ffffff; --color-b: #eeeeee; --color-c: #000000;
    pair: a on b
    pair: c on a min 7
    pair: c on nope`
  const results = checkPairs(css)
  expect(results.map((r) => r.ok)).toEqual([false, true, false])
  expect(results[2].error).toContain('unknown token')
})

test('the dark block overrides the light colours, and its pairs are checked too', () => {
  const css = `--color-fg: #000000; --color-bg: #ffffff;
    :root[data-theme="dark"] { --color-bg: #111111; }
    pair: fg on bg`
  expect(parseColors(css).bg).toBe('#ffffff')
  expect(parseDarkColors(css).bg).toBe('#111111')
  const results = checkPairs(css)
  expect(results.map((r) => [r.mode, r.ok])).toEqual([['light', true], ['dark', false]])
})

test('the real tokens are checked in both themes', () => {
  expect(new Set(checkPairs(tokens).map((r) => r.mode))).toEqual(new Set(['light', 'dark']))
})

test('min overrides the default 4.5', () => {
  expect(parsePairs('pair: a on b min 3')).toEqual([{ fg: 'a', bg: 'b', min: 3 }])
  expect(parsePairs('pair: a on b')[0].min).toBe(4.5)
})

test('the CLI passes on the real tokens', () => {
  expect(Bun.spawnSync(['bun', join(import.meta.dir, 'contrast.ts')]).exitCode).toBe(0)
})
