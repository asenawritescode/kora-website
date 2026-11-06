import { describe, expect, test } from 'bun:test'
import fixture from './__fixtures__/catalog-templates.json'
import detail from './__fixtures__/catalog-template-detail.json'
import { CatalogError, DEFAULT_DETAIL_LABELS, fetchTemplate, fetchTemplates, parseTemplates, type Fetcher } from './catalog-client'

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
    expect(retail.components[2].requires).toEqual(['Point of Sale'])
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

describe('template detail', () => {
  const ok = (body: unknown, status = 200) => (async () => jsonResponse(body, { status })) as Fetcher
  const fetchIt = (fetchImpl: Fetcher, slug = 'retail-pos') => fetchTemplate(slug, { baseURL: 'http://cloud.test', fetchImpl })
  const failure = async (fetchImpl: Fetcher): Promise<CatalogError> => {
    try {
      await fetchIt(fetchImpl)
    } catch (err) {
      if (err instanceof CatalogError) return err
      throw err
    }
    throw new Error('expected a failure')
  }

  test('asks for the one template by slug, encoded', async () => {
    let url = ''
    await fetchIt((async (input: string) => { url = String(input); return jsonResponse(detail) }) as Fetcher, 'a b/c')
    expect(url).toBe('http://cloud.test/api/public/catalog/v1/templates/a%20b%2Fc')
  })

  test('maps the template, its parts and the Cloud labels', async () => {
    const t = await fetchIt(ok(detail))
    expect(t.name).toBe('Retail POS')
    expect(t.availability).toBe('available')
    expect(t.components.map((c) => [c.id, c.name, c.selection, c.availability, c.requires])).toEqual([
      ['pos-1.0.8', 'Point of Sale', 'optional', 'available', ['Inventory']],
      ['inventory-1.0.8', 'Inventory', 'optional', 'available', []],
    ])
    expect([t.labels.partLabel, t.labels.partsLabel]).toEqual(['part', 'parts'])
    expect(t.labels.primaryAction).toBe('Use this template')
    expect(t.labels.optionalHeading).toBe('Optional additions')
    expect(t.labels.compositionHeading).toBe('In this template')
    expect(t.labels.preparationHeading).toBe('Before you start')
    expect(t.labels.outcomesHeading).toBe('What this helps you do')
  })

  test('labels Cloud leaves out fall back to plain defaults', async () => {
    const { detail_page: _omit, ...bare } = detail.data as Record<string, unknown>
    const t = await fetchIt(ok({ data: bare }))
    expect(t.labels).toEqual(DEFAULT_DETAIL_LABELS)
  })

  test('a template that is not attested stays preview', async () => {
    const { availability: _omit, ...noLevel } = detail.data as Record<string, unknown>
    expect((await fetchIt(ok({ data: noLevel }))).availability).toBe('preview')
  })

  test('404 is not_found and carries the labels Cloud sent with it', async () => {
    const err = await failure(ok({ error: 'not_found', detail_page: detail.data.detail_page }, 404))
    expect([err.kind, err.status]).toEqual(['not_found', 404])
    expect(err.labels?.unavailableHeading).toBe('This template is no longer available')
  })

  test('a hidden template is treated as not found', async () => {
    expect((await failure(ok({ data: { ...detail.data, availability: 'hidden' } }))).kind).toBe('not_found')
  })

  test('other failures keep their kind', async () => {
    expect((await failure(ok({ error: 'x' }, 503))).kind).toBe('http')
    expect((await failure((async () => { throw new TypeError('x') }) as Fetcher)).kind).toBe('network')
    expect((await failure(ok({ data: 'x' }))).kind).toBe('invalid')
  })
})
