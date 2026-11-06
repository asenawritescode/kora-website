import { expect, test } from 'bun:test'
import { findHexProblems, hexLines } from './check-tokens'

test('src has no hex colours outside tokens.css', () => {
  expect(findHexProblems()).toEqual([])
})

test.each([
  ['<p className="text-[#5d5f5f]">', [1]],
  ["color: '#fff'", [1]],
  ['bg-[#FF6B35]/10', [1]],
  ['border-[#0a0a0a80]', [1]],
  ['text-muted bg-accent', []],
  ['<a href="#main">', []],
  ['<Link to="/docs#api">', []],
  ['issue #12 is open', []],
])('hex detection: %s', (text, expected) => {
  expect(hexLines(text)).toEqual(expected)
})

test('tokens-ok on the same or previous line allows a hex with a reason', () => {
  expect(hexLines('#fff // tokens-ok: third-party embed requires hex')).toEqual([])
  expect(hexLines('// tokens-ok: embed\n#fff')).toEqual([])
  expect(hexLines('// tokens-ok: embed\n\n#fff')).toEqual([3])
})
