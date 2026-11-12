import { describe, expect, test } from 'bun:test'
import fixture from './__fixtures__/catalog-templates.json'
import { CatalogError, fetchTemplates, parseTemplates, type Fetcher } from './catalog-client'

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init })

describe('parseTemplates', () => {
  const templates = parseTemplates(fixture)

  test('keeps only listable templates, in catalog order', () => {
    expect(templates.map((t) => t.slug)).toEqual(['retail-pos', 'stock-count', 'legacy'])
  })

  test('maps name, summary, category and components', () => {
    const retail = templates[0]
    expect(retail.name).toBe('Retail POS')
    expect(retail.summary).toBe('Sell at the counter and keep stock counts right.')
    expect(retail.category).toBeUndefined()
    expect(retail.components.map((c) => [c.name, c.selection])).toEqual([
      ['Point of Sale', 'required'],
      ['Inventory', 'required'],
      ['Reports', 'optional'],
    ])
    expect(retail.releaseId).toBe('retail-pos-1.0.3')
    expect(templates[1].category).toBe('Retail')
  })

  test('labels availability; absent or unknown is preview, never available', () => {
    expect(templates.map((t) => t.availability)).toEqual(['preview', 'available', 'preview'])
    expect(templates[0].components.map((c) => c.availability)).toEqual(['preview', 'available', 'preview'])
  })

  test('an empty catalog parses to an empty list', () => {
    expect(parseTemplates({ data: { items: [] } })).toEqual([])
  })

  test.each([[null], [[]], [{}], [{ data: {} }], [{ data: { items: 'x' } }]])('rejects malformed payload %#', (payload) => {
    expect(() => parseTemplates(payload)).toThrow(CatalogError)
  })
})

describe('fetchTemplates', () => {
  const kindOf = async (fetchImpl: Fetcher) => {
    try {
      await fetchTemplates({ baseURL: 'http://cloud.test', fetchImpl })
    } catch (err) {
      return err instanceof CatalogError ? [err.kind, err.status] : ['other']
    }
    return ['ok']
  }

  test('requests the public catalog path and parses the result', async () => {
    let url = ''
    const fetchImpl = (async (input: string) => {
      url = String(input)
      return jsonResponse(fixture)
    }) as Fetcher
    const result = await fetchTemplates({ baseURL: 'http://cloud.test', fetchImpl })
    expect(url).toBe('http://cloud.test/api/public/catalog/v1/templates')
    expect(result).toHaveLength(3)
  })

  test('maps network failure to network', async () => {
    expect(await kindOf((async () => { throw new TypeError('Failed to fetch') }) as Fetcher)).toEqual(['network', undefined])
  })

  test('maps a non-2xx answer to http with the status', async () => {
    expect(await kindOf((async () => jsonResponse({ error: 'catalog_unavailable' }, { status: 503 })) as Fetcher)).toEqual(['http', 503])
  })

  test('maps a 200 HTML page (host serving its own index.html) to invalid', async () => {
    const html = (async () => new Response('<!doctype html><html></html>', { status: 200, headers: { 'Content-Type': 'text/html' } })) as Fetcher
    expect(await kindOf(html)).toEqual(['invalid', undefined])
  })
})
