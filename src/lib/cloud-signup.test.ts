import { describe, expect, test } from 'bun:test'
import { buildSignInUrl, buildSignupUrl, DEFAULT_CLOUD_SIGNUP_URL, readSelection } from './cloud-signup'

const base = 'https://cloud.example.test/signup'

describe('buildSignupUrl', () => {
  // The format is documented in kora-cloud docs/signup-link-format.md:
  //   <signup url>?template=<slug or release id>&optional=<release ids, comma separated>
  const cases: { name: string; base?: string; selection?: Parameters<typeof buildSignupUrl>[1]; want: string }[] = [
    { name: 'no selection gives the plain signup link', want: base },
    { name: 'an empty selection adds no parameters', selection: { optional: [] }, want: base },
    { name: 'template only', selection: { template: 'retail-pos', optional: [] }, want: `${base}?template=retail-pos` },
    {
      name: 'template and optional release ids, commas left as commas',
      selection: { template: 'retail-pos', optional: ['pos-1.0.8', 'inventory-1.0.8'] },
      want: `${base}?template=retail-pos&optional=pos-1.0.8,inventory-1.0.8`,
    },
    { name: 'a single optional id', selection: { template: 'retail-pos', optional: ['loyalty-1.0.0'] }, want: `${base}?template=retail-pos&optional=loyalty-1.0.0` },
    { name: 'optional ids without a template are not carried', selection: { optional: ['pos-1.0.8'] }, want: base },
    { name: 'blank template is no template', selection: { template: '  ', optional: ['pos-1.0.8'] }, want: base },
    {
      name: 'duplicates and blanks are removed, order kept',
      selection: { template: 'retail-pos', optional: ['b-1', '', ' a-1 ', 'b-1'] },
      want: `${base}?template=retail-pos&optional=b-1,a-1`,
    },
    {
      name: 'an id that contains a comma cannot be carried and is left out',
      selection: { template: 'retail-pos', optional: ['a,b', 'c-1'] },
      want: `${base}?template=retail-pos&optional=c-1`,
    },
    {
      name: 'special characters are percent-encoded',
      selection: { template: 'a b&c=d#e', optional: ['x/y?z', 'ü-1', '100%'] },
      want: `${base}?template=a%20b%26c%3Dd%23e&optional=x%2Fy%3Fz,%C3%BC-1,100%25`,
    },
    {
      name: 'existing query parameters on the base are kept',
      base: `${base}?return_to=%2Fapp`,
      selection: { template: 'retail-pos', optional: ['pos-1.0.8'] },
      want: `${base}?return_to=%2Fapp&template=retail-pos&optional=pos-1.0.8`,
    },
    {
      name: 'template and optional already on the base are replaced, not doubled',
      base: `${base}?template=old&optional=old-1&ref=site`,
      selection: { template: 'retail-pos', optional: [] },
      want: `${base}?ref=site&template=retail-pos`,
    },
    {
      name: 'a base with no selection keeps its own parameters',
      base: `${base}?ref=site`,
      want: `${base}?ref=site`,
    },
  ]
  for (const c of cases) {
    test(c.name, () => {
      expect(buildSignupUrl(c.base ?? base, c.selection)).toBe(c.want)
    })
  }

  test('production default points at the Cloud signup page', () => {
    expect(buildSignupUrl(DEFAULT_CLOUD_SIGNUP_URL, { template: 'retail-pos', optional: [] })).toBe(
      'https://cloud.kora.mradiafrica.com/signup?template=retail-pos',
    )
  })
})

describe('readSelection', () => {
  const cases: { name: string; search: string; want: { template?: string; optional: string[] } }[] = [
    { name: 'nothing', search: '', want: { template: undefined, optional: [] } },
    {
      name: 'template and optional release ids with dots',
      search: '?template=retail-pos&optional=pos-1.0.8,inventory-1.0.8',
      want: { template: 'retail-pos', optional: ['pos-1.0.8', 'inventory-1.0.8'] },
    },
    { name: 'encoded commas', search: '?template=retail-pos&optional=a-1%2Cb-1', want: { template: 'retail-pos', optional: ['a-1', 'b-1'] } },
    { name: 'optional without a template is ignored', search: '?optional=barcode', want: { template: undefined, optional: [] } },
    {
      name: 'values that are not plain ids are dropped',
      search: '?template=a%20b%26x=1&optional=ok,%3Cscript%3E',
      want: { template: undefined, optional: [] },
    },
    { name: 'a bad optional id does not drop the good ones', search: '?template=retail-pos&optional=ok,../x', want: { template: 'retail-pos', optional: ['ok'] } },
  ]
  for (const c of cases) {
    test(c.name, () => {
      expect(readSelection(c.search)).toEqual(c.want)
    })
  }
})

describe('buildSignInUrl', () => {
  test('uses the same Cloud origin', () => {
    expect(buildSignInUrl(base)).toBe('https://cloud.example.test/login')
  })
})
