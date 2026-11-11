import { describe, expect, test } from 'bun:test'
import { INDUSTRIES, industrySlug } from './industries-content'
import { sendWaitlist, validateWaitlist, waitlistBody, waitlistSource } from './waitlist-lead'

const schools = INDUSTRIES.find((i) => i.name === 'Schools and training')!
const fields = { name: ' Amina ', email: ' amina@example.com ', note: '  We have 3 campuses.  ' }

describe('the waitlist lead', () => {
  test('says which business is waiting, in words the team can read', () => {
    expect(waitlistBody(schools, fields)).toEqual({
      name: 'Amina', email: 'amina@example.com', message: 'Waitlist: Schools and training\n\nWe have 3 campuses.',
      source: 'waitlist:schools-and-training', website: '',
    })
  })

  test('a note is optional but the message is never empty, because Cloud requires one', () => {
    expect(waitlistBody(schools, { ...fields, note: '  ' }).message).toBe('Waitlist: Schools and training')
  })

  test('every industry fits the 40 characters Cloud allows for a source', () => {
    for (const i of INDUSTRIES) {
      expect(waitlistSource(i)).toBe(`waitlist:${industrySlug(i)}`)
      expect(waitlistSource(i).length).toBeLessThanOrEqual(40)
    }
  })

  test('the honeypot is passed through', () => {
    expect(waitlistBody(schools, fields, 'bot').website).toBe('bot')
  })
})

describe('validateWaitlist', () => {
  test('needs a name and a real-looking email, not a note', () => {
    expect(validateWaitlist({ name: '', email: 'nope', note: '' })).toEqual({ name: 'Enter your name.', email: 'Use the form name@example.com.' })
    expect(validateWaitlist({ name: 'A', email: 'a@b.co', note: '' })).toEqual({})
  })
})

test('sends to the lead endpoint with the idempotency key and the waitlist source', async () => {
  let seen: { url: string; init?: RequestInit } | undefined
  const doFetch = (async (url: string, init?: RequestInit) => { seen = { url, init }; return new Response(JSON.stringify({ data: { id: 'lead-1' } }), { status: 202 }) }) as typeof fetch
  expect(await sendWaitlist(schools, fields, 'key-1', '', doFetch)).toEqual({ kind: 'sent', id: 'lead-1' })
  expect(seen?.url).toEndWith('/api/public/leads/v1')
  expect((seen?.init?.headers as Record<string, string>)['Idempotency-Key']).toBe('key-1')
  expect(JSON.parse(String(seen?.init?.body)).source).toBe('waitlist:schools-and-training')
})
