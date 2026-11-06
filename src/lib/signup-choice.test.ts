import { describe, expect, test } from 'bun:test'
import { EMPTY_CHOICE, parseStoredChoice, signupHrefFor } from './signup-choice'

const good = { template: 'retail-pos', optional: ['pos-1.0.8', 'inventory-1.0.8'], keys: ['retail-pos:Point of Sale'] }

describe('parseStoredChoice', () => {
  const cases: { name: string; raw: string | null; want: unknown }[] = [
    { name: 'nothing stored', raw: null, want: EMPTY_CHOICE },
    { name: 'not JSON', raw: '{oops', want: EMPTY_CHOICE },
    { name: 'wrong shape', raw: '[1,2]', want: EMPTY_CHOICE },
    { name: 'a stored choice comes back', raw: JSON.stringify(good), want: good },
    { name: 'a template that is not a plain id is dropped with its parts', raw: JSON.stringify({ ...good, template: 'a b&c' }), want: EMPTY_CHOICE },
    { name: 'ids that are not plain are dropped', raw: JSON.stringify({ ...good, optional: ['ok-1', '<x>', 7] }), want: { ...good, optional: ['ok-1'] } },
    { name: 'keys that are not strings are dropped', raw: JSON.stringify({ ...good, keys: ['a:B', 4, null] }), want: { ...good, keys: ['a:B'] } },
  ]
  for (const c of cases) test(c.name, () => expect(parseStoredChoice(c.raw)).toEqual(c.want as never))
})

describe('signupHrefFor', () => {
  const base = 'https://cloud.example.test/signup'
  test('no choice is the plain signup link', () => expect(signupHrefFor(base, EMPTY_CHOICE)).toBe(base))
  test('a choice carries template and optional ids', () =>
    expect(signupHrefFor(base, good)).toBe(`${base}?template=retail-pos&optional=pos-1.0.8,inventory-1.0.8`))
})
