// The Contact form posts to Cloud's public lead endpoint. A retry of the same
// submission carries the same Idempotency-Key, so Cloud returns the lead it
// already stored instead of creating a second one.
import { catalogBaseURL } from '@/lib/catalog-client'
import type { ContactErrors, ContactFields } from '@/lib/contact'

export type LeadResult =
  | { kind: 'sent'; id: string }
  | { kind: 'invalid'; errors: ContactErrors }
  | { kind: 'failed'; reason: 'rate_limited' | 'unreachable' }

const FIELDS = ['name', 'email', 'message'] as const

export function leadBody(f: ContactFields, honeypot: string) {
  const head = [`Topic: ${f.topic}`]
  if (f.phone.trim()) head.push(`Phone: ${f.phone.trim()}`)
  const message = `${head.join('\n')}\n\n${f.message.trim()}`
  return { name: f.name.trim(), email: f.email.trim(), message, source: 'contact', website: honeypot }
}

export const sendLead = (f: ContactFields, idempotencyKey: string, honeypot = '', doFetch: typeof fetch = fetch) =>
  postLead(leadBody(f, honeypot), idempotencyKey, doFetch)

// What every form that leaves a lead sends: one POST to Cloud, safe to repeat with the same key.
export async function postLead(
  body: { name: string; email: string; message: string; source: string; website: string },
  idempotencyKey: string,
  doFetch: typeof fetch = fetch,
): Promise<LeadResult> {
  let res: Response
  try {
    res = await doFetch(`${catalogBaseURL}/api/public/leads/v1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(body),
    })
  } catch {
    return { kind: 'failed', reason: 'unreachable' }
  }
  if (res.status === 429) return { kind: 'failed', reason: 'rate_limited' }
  const payload: unknown = await res.json().catch(() => null)
  if (res.status === 202) {
    const id = (payload as { data?: { id?: unknown } } | null)?.data?.id
    return typeof id === 'string' && id ? { kind: 'sent', id } : { kind: 'failed', reason: 'unreachable' }
  }
  if (res.status === 422) {
    const fields = (payload as { fields?: Record<string, unknown> } | null)?.fields ?? {}
    const errors: ContactErrors = {}
    for (const key of FIELDS) if (typeof fields[key] === 'string') errors[key] = fields[key] as string
    return Object.keys(errors).length ? { kind: 'invalid', errors } : { kind: 'failed', reason: 'unreachable' }
  }
  return { kind: 'failed', reason: 'unreachable' }
}
