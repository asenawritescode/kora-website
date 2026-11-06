import { describe, expect, test } from 'bun:test'
import { buildSignInUrl, buildSignupUrl, DEFAULT_CLOUD_SIGNUP_URL, readSelection } from './cloud-signup'

const base = 'https://cloud.example.test/signup'

describe('readSelection', () => {
  test('reads template and optional modules', () => {
    expect(readSelection('?template=retail-pos&optional=barcode,reports')).toEqual({
      template: 'retail-pos',
      optional: 'barcode,reports',
    })
  })
  test('no selection', () => {
    expect(readSelection('')).toEqual({ template: undefined, optional: undefined })
  })
  test('drops values that are not plain slugs', () => {
    expect(readSelection('?template=a%20b%26x=1&optional=ok,%3Cscript%3E')).toEqual({
      template: undefined,
      optional: undefined,
    })
    expect(readSelection('?template=retail-pos&optional=ok,../x')).toEqual({
      template: 'retail-pos',
      optional: 'ok',
    })
  })
  test('optional without a template is ignored', () => {
    expect(readSelection('?optional=barcode').optional).toBeUndefined()
  })
})

describe('buildSignupUrl', () => {
  test('plain signup link without a selection', () => {
    expect(buildSignupUrl(base)).toBe(base)
  })
  test('carries the template', () => {
    expect(buildSignupUrl(base, { template: 'retail-pos' })).toBe(`${base}?template=retail-pos`)
  })
  test('carries optional modules after the template', () => {
    expect(buildSignupUrl(base, { template: 'retail-pos', optional: 'barcode,reports' })).toBe(
      `${base}?template=retail-pos&optional=barcode%2Creports`,
    )
  })
  test('keeps existing query parameters on the base', () => {
    expect(buildSignupUrl(`${base}?ref=site`, { template: 'retail-pos' })).toBe(`${base}?ref=site&template=retail-pos`)
  })
  test('production default points at the Cloud signup page', () => {
    expect(buildSignupUrl(DEFAULT_CLOUD_SIGNUP_URL, { template: 'retail-pos' })).toBe(
      'https://cloud.kora.mradiafrica.com/signup?template=retail-pos',
    )
  })
})

describe('buildSignInUrl', () => {
  test('uses the same Cloud origin', () => {
    expect(buildSignInUrl(base)).toBe('https://cloud.example.test/login')
  })
})
