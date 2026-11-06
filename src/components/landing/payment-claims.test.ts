import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const read = (p: string) => readFileSync(join(import.meta.dir, p), 'utf8')

test('home page says M-Pesa is recorded by hand, not connected, and names what is unsupported', () => {
  const home = read('HomePage/HomeBody.tsx')
  expect(home).toContain('M-Pesa payments can be recorded by hand against a till or paybill number')
  expect(home).toContain('is not connected to M-Pesa')
  expect(home).toContain('Card payments, receipt printers and eTIMS are not supported yet.')
})

test('Cloud page describes the real steps and none of the removed claims', () => {
  const cloud = read('CloudPage.tsx') + read('../../lib/signup-steps.ts')
  for (const step of ['Choose what your business needs', 'Create your account', 'Confirm your email', 'Open your workspace']) expect(cloud).toContain(step)
})
