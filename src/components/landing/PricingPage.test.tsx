import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = readFileSync(join(import.meta.dir, 'PricingPage.tsx'), 'utf8')

test('states the pilot terms: free now, prices announced before the pilot ends', () => {
  expect(source).toContain('Free during the pilot')
  expect(source).toContain('You’ll see prices before the pilot ends')
  expect(source).toContain('Nothing is charged unless you agree.')
})

test('has no USD amount, tier, per-seat number, "from" price or support claim', () => {
  expect(source).not.toMatch(/\$\s?\d|USD|per seat|per user|\bfrom\b\s+(KES|\$)|Starter|Managed Cloud|(email|priority|operational|premium) support|testimonial/i)
  expect(source).not.toMatch(/BadgeCheck|lucide/)
})

test('links to signup', () => {
  expect(source).toContain('<SignupLink')
})

test('does not link to legal pages that do not exist (#15)', () => {
  expect(source).not.toMatch(/\/terms|\/privacy|\/help/)
})
