// The website finishes onboarding itself: it creates the account and workspace,
// follows the setup until it is ready, verifies the emailed link and opens the
// workspace. It talks to Cloud's own signup and identity API and to the
// workspace's handoff route; Cloud's portal is only for people who come back.
//
// The password is sent once, straight to Cloud, and is never kept here.
import { catalogBaseURL, type Fetcher } from '@/lib/catalog-client'

// Where the workspace app (Studio) lives. Without it the site cannot open a
// workspace, so the picker keeps sending people to Cloud's portal instead.
export const appBaseURL = () => (((import.meta.env?.VITE_KORA_APP_BASE_URL as string | undefined) ?? '').trim()).replace(/\/$/, '')
export const onboardingEnabled = () => appBaseURL() !== ''

export type Owner = { name: string; business: string; email: string; password: string }
export type Selection = { template_release_id: string; optional_release_ids: string[] }

export type SignupResult =
  // Cloud is still preparing the workspace; ask again with the same key.
  | { kind: 'working' }
  // The workspace is ready and the verification email has gone out.
  | { kind: 'check_email' }
  // Cloud understood the request and said no, in words fit to show.
  | { kind: 'refused'; message: string }
  | { kind: 'exists' }
  // The same key was used for different details.
  | { kind: 'details_changed' }
  // The chosen business type or modules cannot be set up (any more).
  | { kind: 'selection'; code: string }
  | { kind: 'failed'; reason: 'rate_limited' | 'unreachable' | 'server' }

type Json = Record<string, unknown>
const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v)
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

// A permanent refusal about the choice: going back to the picker is the only fix.
const SELECTION_REFUSALS = new Set(['selection_changed', 'selection_unavailable', 'selection_not_composable', 'invalid_template_selection', 'template_release_required', 'optional_release_not_declared'])
const CODE_SHAPE = /^[a-z]+(?:_[a-z]+)+$/

// Cloud's own words for a refusal, except its internal wording for "could not start".
function refusalText(body: Json): string {
  const message = text(body.message) || text(body.error)
  if (!message || CODE_SHAPE.test(message) || /provisioning could not start/i.test(message)) return 'We could not start your workspace just now. Try again in a few minutes.'
  return message
}

export async function postSignup(
  owner: Owner,
  selection: Selection,
  idempotencyKey: string,
  options: { baseURL?: string; signal?: AbortSignal; fetchImpl?: Fetcher } = {},
): Promise<SignupResult> {
  const { baseURL = catalogBaseURL, signal, fetchImpl = fetch as Fetcher } = options
  let res: Response
  try {
    res = await fetchImpl(`${baseURL}/api/cloud/signup`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({ full_name: owner.name.trim(), email: owner.email.trim(), password: owner.password, organization_name: owner.business.trim(), template_selection: selection }),
      signal,
    })
  } catch (err) {
    if (signal?.aborted) throw err
    return { kind: 'failed', reason: 'unreachable' }
  }
  const parsed: unknown = await res.json().catch(() => null)
  const body = isObject(parsed) ? parsed : {}
  const code = text(body.code) || (CODE_SHAPE.test(text(body.error)) ? text(body.error) : '')
  if (res.status === 429) return { kind: 'failed', reason: 'rate_limited' }
  if (res.status >= 500) return { kind: 'failed', reason: 'server' }
  if (res.ok) {
    // Only Cloud's explicit words count: a page that merely answers 200 is not a workspace.
    const status = text(body.status)
    if (status === 'provisioning' || status === 'verification_pending') return { kind: 'working' }
    return status === 'verification_required' ? { kind: 'check_email' } : { kind: 'failed', reason: 'unreachable' }
  }
  if (res.status === 409) {
    if (code === 'idempotency_key_reused') return { kind: 'details_changed' }
    if (SELECTION_REFUSALS.has(code)) return { kind: 'selection', code }
    return { kind: 'exists' }
  }
  if (SELECTION_REFUSALS.has(code)) return { kind: 'selection', code }
  if (code === 'signup_rate_limited') return { kind: 'failed', reason: 'rate_limited' }
  return { kind: 'refused', message: refusalText(body) }
}

// Cloud answers "still preparing" straight away; asking again with the same key
// returns the same workspace until it is ready. Before the workspace is known to
// exist a failure goes back to the form; once it is, a failure to ask is waited out.
export async function followSignup(
  attempt: () => Promise<SignupResult>,
  options: { sleep: (ms: number) => Promise<void>; now: () => number; intervalMs?: number; maxMs?: number; onWorking?: () => void },
): Promise<SignupResult | { kind: 'timeout' }> {
  const { sleep, now, intervalMs = 3000, maxMs = 5 * 60 * 1000, onWorking } = options
  const deadline = now() + maxMs
  let following = false
  for (;;) {
    const result = await attempt()
    if (result.kind === 'working') {
      if (!following) { following = true; onWorking?.() }
    } else if (!(result.kind === 'failed' && following)) {
      return result
    }
    if (now() >= deadline) return { kind: 'timeout' }
    await sleep(intervalMs)
  }
}

// Mail clients that make the link clickable can take punctuation after it. A token is
// hex, so nothing else counts; anything that is not hex is not a token.
export function tokenFromHash(hash: string): string | null {
  const raw = new URLSearchParams(hash.replace(/^#/, '')).get('token')
  const token = (raw ?? '').trim().replace(/[\s.,;:!?)\]}>"']+$/, '')
  return /^[a-f0-9]{16,128}$/i.test(token) ? token : null
}

export type VerifyResult =
  | { kind: 'ready'; tenant: string; code: string }
  // The link is wrong, used or out of date.
  | { kind: 'expired' }
  | { kind: 'failed' }

export async function verifyEmail(token: string, options: { baseURL?: string; fetchImpl?: Fetcher } = {}): Promise<VerifyResult> {
  const { baseURL = catalogBaseURL, fetchImpl = fetch as Fetcher } = options
  let res: Response
  try {
    res = await fetchImpl(`${baseURL}/api/cloud/auth/email/verify`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      credentials: 'include',
    })
  } catch {
    return { kind: 'failed' }
  }
  if (res.status === 401) return { kind: 'expired' }
  const body: unknown = await res.json().catch(() => null)
  const tenant = isObject(body) ? text(body.tenant_id) || text(body.hostname) : ''
  const code = isObject(body) ? text(body.handoff_code) : ''
  return res.ok && tenant && code ? { kind: 'ready', tenant, code } : { kind: 'failed' }
}

// The workspace trades the one-time code for its own session, then the person goes in.
export async function redeemHandoff(appBase: string, tenant: string, code: string, fetchImpl: Fetcher = fetch as Fetcher): Promise<boolean> {
  try {
    const res = await fetchImpl(`${appBase}/s/${encodeURIComponent(tenant)}/api/auth/cloud/handoff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
      credentials: 'include',
    })
    return res.ok
  } catch {
    return false
  }
}

export const workspaceUrl = (appBase: string, tenant: string) => `${appBase}/s/${encodeURIComponent(tenant)}/workspace`

export type OwnerErrors = Partial<Record<'name' | 'business' | 'email' | 'password', string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Cloud answers any bad field with one sentence naming all of them, so each field is
// checked here against Cloud's own rules: a name and a business, an email, and a
// password of 8 or more characters that fits the 72 bytes its hashing allows.
export function validateOwner(owner: Owner): OwnerErrors {
  const errors: OwnerErrors = {}
  if (!owner.name.trim()) errors.name = 'Enter your name.'
  if (!owner.business.trim()) errors.business = 'Enter the name of your business.'
  const email = owner.email.trim()
  if (!email) errors.email = 'Enter your email address.'
  else if (!EMAIL.test(email)) errors.email = 'Use the form name@example.com.'
  if (owner.password.length < 8) errors.password = 'Use at least 8 characters.'
  else if (new TextEncoder().encode(owner.password).length > 72) errors.password = 'Use 72 characters or fewer.'
  return errors
}
