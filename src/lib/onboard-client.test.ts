import { describe, expect, test } from 'bun:test'
import type { Fetcher } from './catalog-client'
import { followSignup, postSignup, redeemHandoff, tokenFromHash, validateOwner, verifyEmail, workspaceUrl, type Owner, type SignupResult } from './onboard-client'

const owner: Owner = { name: ' Amina ', business: ' Amina Duka ', email: ' amina@example.com ', password: 'correct-horse-battery-9' }
const selection = { template_release_id: 'retail-erp-1.0.0', optional_release_ids: ['erp-books-1.0.0'] }
const reply = (status: number, body: unknown): Fetcher => async () => new Response(typeof body === 'string' ? body : JSON.stringify(body), { status })

// Bodies are what a seeded Cloud answered.
const provisioning = { hostname: 'amina-duka-d071eb93b345fc52', organization_id: 'org_1', site_id: 'site-1', stage: 'preparing_workspace', status: 'provisioning', tenant_id: 'site-1' }
const checkEmail = { hostname: 'amina-duka-d071eb93b345fc52', organization_id: 'org_1', site_id: 'site-1', stage: 'check_email', status: 'verification_required', tenant_id: 'site-1' }

describe('postSignup', () => {
  const post = (fetchImpl: Fetcher) => postSignup(owner, selection, 'key-1', { baseURL: 'http://cloud', fetchImpl })

  test('sends the details trimmed, the selection and the idempotency key', async () => {
    let seen: { url: string; init?: RequestInit } | undefined
    await post(async (url, init) => { seen = { url, init }; return new Response(JSON.stringify(checkEmail), { status: 201 }) })
    expect(seen?.url).toBe('http://cloud/api/cloud/signup')
    expect((seen?.init?.headers as Record<string, string>)['Idempotency-Key']).toBe('key-1')
    expect(JSON.parse(String(seen?.init?.body))).toEqual({
      full_name: 'Amina', email: 'amina@example.com', password: 'correct-horse-battery-9', organization_name: 'Amina Duka', template_selection: selection,
    })
  })

  const cases: [string, number, unknown, SignupResult][] = [
    ['still preparing', 202, provisioning, { kind: 'working' }],
    ['ready, check email', 201, checkEmail, { kind: 'check_email' }],
    ['an account already exists for this email', 409, { error: 'an account already exists for this email' }, { kind: 'exists' }],
    ['the same key with other details', 409, { error: 'idempotency_key_reused', message: 'This setup request changed.' }, { kind: 'details_changed' }],
    ['the template is gone', 409, { error: 'selection_changed', message: 'This template release is no longer available.' }, { kind: 'selection', code: 'selection_changed' }],
    ['too many setups from here', 429, { error: 'signup_rate_limited' }, { kind: 'failed', reason: 'rate_limited' }],
    ['a server error', 503, { status: 'verification_pending', retryable: true }, { kind: 'failed', reason: 'server' }],
    ['Cloud cannot start it', 400, { error: 'workspace provisioning could not start', retryable: false }, { kind: 'refused', message: 'We could not start your workspace just now. Try again in a few minutes.' }],
    ['setup failed after its retry', 422, { error: 'provisioning_failed', message: 'We could not finish setting up your workspace. Contact support and we will complete it for you.' }, { kind: 'refused', message: 'We could not finish setting up your workspace. Contact support and we will complete it for you.' }],
    ['Cloud says a field is wrong', 400, { error: 'full_name, email, password, organization_name, and idempotency key are required' }, { kind: 'refused', message: 'full_name, email, password, organization_name, and idempotency key are required' }],
  ]
  test.each(cases)('%s', async (_, status, body, want) => {
    expect(await post(reply(status, body))).toEqual(want)
  })

  test('an unreachable Cloud and a page that is not JSON are failures, never a success', async () => {
    expect(await post(async () => { throw new TypeError('offline') })).toEqual({ kind: 'failed', reason: 'unreachable' })
    expect(await post(reply(200, '<html>'))).toEqual({ kind: 'failed', reason: 'unreachable' })
    expect(await post(reply(200, { data: {} }))).toEqual({ kind: 'failed', reason: 'unreachable' })
  })

  test('an aborted request is rethrown', async () => {
    const abort = new AbortController()
    abort.abort()
    await expect(postSignup(owner, selection, 'k', { baseURL: 'http://x', signal: abort.signal, fetchImpl: async () => { throw new DOMException('aborted', 'AbortError') } })).rejects.toThrow()
  })
})

describe('followSignup', () => {
  const run = (results: SignupResult[], maxMs = 60_000) => {
    let clock = 0
    let i = 0
    let working = 0
    const out = followSignup(async () => results[Math.min(i++, results.length - 1)], { sleep: async (ms) => { clock += ms }, now: () => clock, maxMs, onWorking: () => { working++ } })
    return out.then((result) => ({ result, calls: i, working }))
  }

  test('asks again until the workspace is ready, saying once that it is working', async () => {
    const r = await run([{ kind: 'working' }, { kind: 'working' }, { kind: 'working' }, { kind: 'check_email' }])
    expect(r).toEqual({ result: { kind: 'check_email' }, calls: 4, working: 1 })
  })

  test('a failure before the workspace exists goes back to the form', async () => {
    expect((await run([{ kind: 'failed', reason: 'unreachable' }])).result).toEqual({ kind: 'failed', reason: 'unreachable' })
  })

  test('a failure to ask after the workspace exists is waited out', async () => {
    const r = await run([{ kind: 'working' }, { kind: 'failed', reason: 'server' }, { kind: 'failed', reason: 'rate_limited' }, { kind: 'check_email' }])
    expect(r.result).toEqual({ kind: 'check_email' })
    expect(r.calls).toBe(4)
  })

  test('a refusal ends it, whenever it comes', async () => {
    expect((await run([{ kind: 'working' }, { kind: 'selection', code: 'selection_changed' }])).result).toEqual({ kind: 'selection', code: 'selection_changed' })
  })

  test('a failed setup ends it while following', async () => {
    const refused: SignupResult = { kind: 'refused', message: 'We could not finish setting up your workspace.' }
    const r = await run([{ kind: 'working' }, { kind: 'working' }, refused])
    expect(r).toEqual({ result: refused, calls: 3, working: 1 })
  })

  test('gives up after the time allowed', async () => {
    expect((await run([{ kind: 'working' }], 10_000)).result).toEqual({ kind: 'timeout' })
  })
})

describe('tokenFromHash', () => {
  const token = 'a'.repeat(64)
  test.each([
    ['plain', `#token=${token}`, token],
    ['punctuation a mail client added', `#token=${token}.`, token],
    ['a closing bracket and a quote', `#token=${token})"`, token],
    ['uppercase hex', `#token=${token.toUpperCase()}`, token.toUpperCase()],
    ['no token', '#other=1', null],
    ['empty', '', null],
    ['not hex', '#token=zzzzzzzzzzzzzzzzzzzzzzzz', null],
    ['too short to be one', '#token=abcd', null],
  ])('%s', (_, hash, want) => {
    expect(tokenFromHash(hash)).toBe(want)
  })
})

describe('verifyEmail', () => {
  const verified = { handoff_code: 'c0de'.repeat(16), hostname: 'amina-duka-d071', organization_id: 'org_1', tenant_id: 'site-1', user: { id: 'usr_1', email: 'a@example.com', full_name: 'Amina', email_verified: true } }
  const verify = (fetchImpl: Fetcher) => verifyEmail('ab'.repeat(32), { baseURL: 'http://cloud', fetchImpl })

  test('a verified account comes back with the workspace and a one-time code', async () => {
    expect(await verify(reply(200, verified))).toEqual({ kind: 'ready', tenant: 'site-1', code: 'c0de'.repeat(16) })
  })

  test('sends the token and asks for the session cookie', async () => {
    let init: RequestInit | undefined
    await verify(async (_, i) => { init = i; return new Response(JSON.stringify(verified)) })
    expect(JSON.parse(String(init?.body))).toEqual({ token: 'ab'.repeat(32) })
    expect(init?.credentials).toBe('include')
  })

  test('the hostname stands in when an older Cloud sends no tenant id', async () => {
    const { tenant_id: _, ...older } = verified
    expect((await verify(reply(200, older)))).toMatchObject({ kind: 'ready', tenant: 'amina-duka-d071' })
  })

  test('an old or used link is expired; anything else that goes wrong is a failure', async () => {
    expect(await verify(reply(401, { error: 'verification link is invalid or expired' }))).toEqual({ kind: 'expired' })
    expect(await verify(reply(503, { error: 'could not look up the workspace', retryable: true }))).toEqual({ kind: 'failed' })
    expect(await verify(reply(200, { user: {} }))).toEqual({ kind: 'failed' })
    expect(await verify(async () => { throw new TypeError('offline') })).toEqual({ kind: 'failed' })
  })
})

describe('opening the workspace', () => {
  test('trades the code at the workspace for its own session', async () => {
    let seen: { url: string; init?: RequestInit } | undefined
    const ok = await redeemHandoff('http://app', 'site-1', 'code-1', async (url, init) => { seen = { url, init }; return new Response('{}') })
    expect(ok).toBe(true)
    expect(seen?.url).toBe('http://app/s/site-1/api/auth/cloud/handoff')
    expect(JSON.parse(String(seen?.init?.body))).toEqual({ code: 'code-1' })
    expect(seen?.init?.credentials).toBe('include')
  })

  test('a refused code or an unreachable workspace is false', async () => {
    expect(await redeemHandoff('http://app', 't', 'c', reply(401, {}))).toBe(false)
    expect(await redeemHandoff('http://app', 't', 'c', async () => { throw new TypeError('offline') })).toBe(false)
  })

  test('the workspace address is keyed by the tenant', () => {
    expect(workspaceUrl('http://app', 'site-1')).toBe('http://app/s/site-1/workspace')
    expect(workspaceUrl('http://app', 'a b')).toBe('http://app/s/a%20b/workspace')
  })
})

describe('validateOwner', () => {
  const ok = { name: 'A', business: 'B', email: 'a@b.co', password: '12345678' }
  test('accepts what Cloud accepts', () => {
    expect(validateOwner(ok)).toEqual({})
  })
  test.each([
    ['no name', { name: ' ' }, 'name'],
    ['no business', { business: '' }, 'business'],
    ['no email', { email: '' }, 'email'],
    ['not an email', { email: 'nope' }, 'email'],
    ['7 characters', { password: '1234567' }, 'password'],
    ['more than 72 bytes', { password: 'é'.repeat(37) }, 'password'],
  ])('%s', (_, change, field) => {
    expect(Object.keys(validateOwner({ ...ok, ...change }))).toEqual([field])
  })
  test('72 bytes is allowed', () => {
    expect(validateOwner({ ...ok, password: 'é'.repeat(36) })).toEqual({})
  })
})
