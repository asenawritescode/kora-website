import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const read = (p: string) => readFileSync(join(import.meta.dir, p), 'utf8')

test('home page says mobile money is recorded by hand and lists what is not available yet', () => {
  const home = read('HomePage/HomeBody.tsx')
  expect(home).toContain('M-Pesa and other mobile money, recorded by hand')
  for (const item of ['Card payments', 'Receipt printers', 'KRA eTIMS tax receipts']) expect(home).toContain(`['${item}', 'roadmap']`)
  expect(home).not.toMatch(/(connects?|integrat\w+) (with|to) M-Pesa/i)
})
