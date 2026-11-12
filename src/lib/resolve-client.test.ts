import { describe, expect, test } from 'bun:test'
import type { Fetcher } from './catalog-client'
import fixture from './__fixtures__/selection-resolve.json'
import { parseResolution, refusalMessage, resolveSelection } from './resolve-client'

// selection-resolve.json holds real answers from a seeded Cloud: the retail template alone,
// with the optional Books (which needs Stock), with a part that is only a preview, and
// for a template release that no longer exists.
const answer = (name: keyof typeof fixture): Fetcher => async () => new Response(JSON.stringify(fixture[name].body), { status: fixture[name].status })

describe('parseResolution', () => {
  test('reads what Cloud installs for the template alone', () => {
    const r = parseResolution(fixture.template_only.body)!
    expect(r.provisionable).toBe(true)
    expect(r.included.map((p) => [p.name, p.reason])).toEqual([['Selling and cash', 'required_by_template'], ['Stock', 'included_by_default']])
  })

  test("keeps Cloud's own sentence for a part another part needs", () => {
    const r = parseResolution(fixture.with_books.body)!
    expect(r.included.map((p) => [p.name, p.reason])).toEqual([['Selling and cash', 'required_by_template'], ['Stock', 'included_by_default'], ['Books', 'selected']])
    expect(r.included[1].explanation).toBe('Books needs Stock, so Stock is included.')
  })

  test.each([
    ['not an object', null],
    ['no data', {}],
    ['provisionable missing', { data: { included: [] } }],
    ['provisionable not a boolean', { data: { provisionable: 'yes', included: [] } }],
    ['included not a list', { data: { provisionable: true, included: {} } }],
  ])('anything unclear is not an answer: %s', (_, payload) => {
    expect(parseResolution(payload)).toBeNull()
  })

  test('a declared conflict means it cannot be set up, whatever else is said', () => {
    const r = parseResolution({ data: { provisionable: true, included: [], conflicts: [{ release_id: 'a', reason: 'A cannot be set up together with B.' }] } })!
    expect(r.provisionable).toBe(false)
    expect(r.conflicts).toEqual(['A cannot be set up together with B.'])
  })

  test('a part with no release id is dropped, never guessed', () => {
    const r = parseResolution({ data: { provisionable: true, included: [{ name: 'No id' }, { release_id: 'x-1', name: 'X', reason: 'selected' }] } })!
    expect(r.included.map((p) => p.releaseId)).toEqual(['x-1'])
  })
})

describe('resolveSelection', () => {
  const ask = (fetchImpl: Fetcher) => resolveSelection('retail-shop-1.0.0', ['erp-books-1.0.0'], { baseURL: 'http://x', fetchImpl })

  test('sends the template release and the optional release ids', async () => {
    let seen: { url: string; init?: RequestInit } | undefined
    await ask(async (url, init) => { seen = { url, init }; return new Response(JSON.stringify(fixture.with_books.body)) })
    expect(seen?.url).toBe('http://x/api/public/catalog/v1/selections/resolve')
    expect(seen?.init?.method).toBe('POST')
    expect(JSON.parse(String(seen?.init?.body))).toEqual({ template_release_id: 'retail-shop-1.0.0', optional_release_ids: ['erp-books-1.0.0'] })
  })

  test('an answer is ok', async () => {
    expect((await ask(answer('with_books'))).kind).toBe('ok')
  })

  test('Cloud saying no is a refusal with its code', async () => {
    expect(await ask(answer('preview_part'))).toEqual({ kind: 'refused', code: 'selection_unavailable' })
    expect(await ask(answer('changed'))).toEqual({ kind: 'refused', code: 'selection_changed' })
  })

  test('too many checks, an unreachable Cloud, a server error and nonsense are failures, never an ok', async () => {
    expect(await ask(async () => new Response('{}', { status: 429 }))).toEqual({ kind: 'failed', reason: 'rate_limited' })
    expect(await ask(async () => { throw new TypeError('offline') })).toEqual({ kind: 'failed', reason: 'unreachable' })
    expect(await ask(async () => new Response('{}', { status: 503 }))).toEqual({ kind: 'failed', reason: 'unreachable' })
    expect(await ask(async () => new Response('<html>', { status: 200 }))).toEqual({ kind: 'failed', reason: 'unreachable' })
    expect(await ask(async () => new Response('{"data":{}}', { status: 200 }))).toEqual({ kind: 'failed', reason: 'unreachable' })
  })

  test('an aborted check is rethrown, not reported as a failure', async () => {
    const abort = new AbortController()
    abort.abort()
    const gone: Fetcher = async () => { throw new DOMException('aborted', 'AbortError') }
    await expect(resolveSelection('t-1', [], { baseURL: 'http://x', fetchImpl: gone, signal: abort.signal })).rejects.toThrow()
  })
})

test('the refusal message names what to do', () => {
  expect(refusalMessage('selection_changed')).toContain('Choose your modules again')
  expect(refusalMessage('selection_unavailable')).toContain('Untick')
})
