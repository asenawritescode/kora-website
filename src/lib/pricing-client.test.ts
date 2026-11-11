import { expect, test } from 'bun:test'
import { fetchPricing, formatMonthly, parsePricing } from '@/lib/pricing-client'

const priced = { data: { mode: 'priced', notice: ' From 1 March. ', items: [{ code: 'growth', name: 'Growth', currency: 'KES', amount_minor: 500000, period: 'month' }] } }

test('a priced answer lists its plans and notice', () => {
  expect(parsePricing(priced)).toEqual({ mode: 'priced', notice: 'From 1 March.', plans: [{ code: 'growth', name: 'Growth', currency: 'KES', amountMinor: 500000 }] })
})

test.each([
  ['pilot', { data: { mode: 'pilot', items: [] } }],
  ['unknown mode', { data: { mode: 'free', items: [] } }],
  ['priced with no plans', { data: { mode: 'priced', items: [] } }],
  ['priced with only malformed plans', { data: { mode: 'priced', items: [{ code: 'x', name: 'X', currency: 'kes', amount_minor: 1 }, { code: 'y', name: 'Y', currency: 'KES', amount_minor: -5 }, { code: 'z', name: 'Z', currency: 'KES', amount_minor: 1.5 }] } }],
  ['no data', {}],
  ['not an object', 'x'],
])('%s is the pilot', (_n, payload) => {
  expect(parsePricing(payload)).toEqual({ mode: 'pilot' })
})

test('a malformed plan is dropped but the good ones stay', () => {
  const mixed = { data: { mode: 'priced', items: [{ code: 'bad' }, ...priced.data.items] } }
  expect((parsePricing(mixed) as { plans: unknown[] }).plans).toHaveLength(1)
})

test('formats minor units and a zero price', () => {
  expect(formatMonthly({ code: 'a', name: 'A', currency: 'KES', amountMinor: 500000 })).toBe('KES 5,000 a month')
  expect(formatMonthly({ code: 'a', name: 'A', currency: 'KES', amountMinor: 49950 })).toBe('KES 499.50 a month')
  expect(formatMonthly({ code: 'a', name: 'A', currency: 'KES', amountMinor: 0 })).toBe('Free')
})

test('an unreachable or failing Cloud is the pilot, never an error', async () => {
  const down = (async () => { throw new TypeError('x') }) as unknown as typeof fetch
  const broken = (async () => new Response('no', { status: 500 })) as unknown as typeof fetch
  const live = (async () => new Response(JSON.stringify(priced), { status: 200 })) as unknown as typeof fetch
  expect(await fetchPricing(down)).toEqual({ mode: 'pilot' })
  expect(await fetchPricing(broken)).toEqual({ mode: 'pilot' })
  expect((await fetchPricing(live)).mode).toBe('priced')
})
