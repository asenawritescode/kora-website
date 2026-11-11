import { expect, test } from 'bun:test'
import { leadBody, sendLead } from '@/lib/contact-lead'
import type { ContactFields } from '@/lib/contact'

const fields: ContactFields = { name: ' Amina ', email: 'amina@example.com ', phone: '0712 000 000', topic: 'Pricing and the pilot', message: ' Two shops? ' }
const reply = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  (async () => new Response(JSON.stringify(body), { status, headers })) as unknown as typeof fetch

test('the lead keeps the topic and phone in the message and tags its source', () => {
  const body = leadBody(fields, '')
  expect(body.name).toBe('Amina')
  expect(body.email).toBe('amina@example.com')
  expect(body.source).toBe('contact')
  expect(body.message).toContain('Topic: Pricing and the pilot')
  expect(body.message).toContain('Phone: 0712 000 000')
  expect(body.message.endsWith('Two shops?')).toBe(true)
})

test('posts with the idempotency key and reports the stored lead', async () => {
  let seen: { url: string; init: RequestInit } | undefined
  const doFetch = (async (url: string, init: RequestInit) => {
    seen = { url, init }
    return new Response(JSON.stringify({ data: { id: 'lead-1' } }), { status: 202 })
  }) as unknown as typeof fetch
  expect(await sendLead(fields, 'key-9', '', doFetch)).toEqual({ kind: 'sent', id: 'lead-1' })
  expect(seen!.url).toEndWith('/api/public/leads/v1')
  expect((seen!.init.headers as Record<string, string>)['Idempotency-Key']).toBe('key-9')
})

test.each([
  ['field errors become form errors', 422, { fields: { email: 'Enter a valid email address.', extra: 'x' } }, { kind: 'invalid', errors: { email: 'Enter a valid email address.' } }],
  ['a 422 with nothing usable is a failure', 422, { error: 'validation_failed' }, { kind: 'failed', reason: 'unreachable' }],
  ['rate limiting is named', 429, { error: 'rate_limited' }, { kind: 'failed', reason: 'rate_limited' }],
  ['a missing endpoint is a failure', 404, 'nope', { kind: 'failed', reason: 'unreachable' }],
  ['a 202 without an id is a failure, not a success', 202, { data: {} }, { kind: 'failed', reason: 'unreachable' }],
])('%s', async (_name, status, body, want) => {
  expect(await sendLead(fields, 'k', '', reply(status, body))).toEqual(want as never)
})

test('a network error is a failure', async () => {
  const down = (async () => { throw new TypeError('network') }) as unknown as typeof fetch
  expect(await sendLead(fields, 'k', '', down)).toEqual({ kind: 'failed', reason: 'unreachable' })
})
