import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = readFileSync(join(import.meta.dir, 'PricingPage.tsx'), 'utf8')

test('states the pilot terms exactly as decided', () => {
  expect(source).toContain('Free during the pilot. Pricing will be announced before the pilot ends.')
})

test('has no USD amount, tier, per-seat number, "from" price or support claim', () => {
  expect(source).not.toMatch(/\$\s?\d|USD|per seat|per user|\bfrom\b\s+(KES|\$)|Starter|Managed Cloud|(email|priority|operational|premium) support|testimonial/i)
  expect(source).not.toMatch(/BadgeCheck|lucide/)
})

test('lists what is not supported yet and links to signup and the self-hosting docs', () => {
  for (const item of ['M-Pesa', 'Receipt printers', 'eTIMS']) expect(source).toContain(item)
  expect(source).toContain('to="/onboard"')
  expect(source).toContain('Set up your shop')
  expect(source).toContain('to="/docs"')
})

test('does not link to legal pages that do not exist (#15)', () => {
  expect(source).not.toMatch(/\/terms|\/privacy|\/help/)
})
