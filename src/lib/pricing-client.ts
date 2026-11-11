// Pricing comes from Cloud's public plans endpoint. Anything but a clear,
// well-formed "priced" answer is the pilot: the page never shows a price it
// could not read, and an unreachable Cloud shows the pilot terms already published.
import { catalogBaseURL } from '@/lib/catalog-client'

export type PublicPlan = { code: string; name: string; currency: string; amountMinor: number }
export type Pricing = { mode: 'pilot' } | { mode: 'priced'; notice: string; plans: PublicPlan[] }

const PILOT: Pricing = { mode: 'pilot' }
const obj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

export function parsePricing(payload: unknown): Pricing {
  const data = obj(payload) ? payload.data : undefined
  if (!obj(data) || data.mode !== 'priced' || !Array.isArray(data.items)) return PILOT
  const plans = data.items.flatMap((raw): PublicPlan[] => {
    if (!obj(raw)) return []
    const { code, name, currency, amount_minor: amount } = raw
    const ok = typeof code === 'string' && code && typeof name === 'string' && name && typeof currency === 'string' && /^[A-Z]{3}$/.test(currency)
    return ok && typeof amount === 'number' && Number.isInteger(amount) && amount >= 0 ? [{ code, name, currency, amountMinor: amount }] : []
  })
  // priced with nothing to show is not a price list
  return plans.length ? { mode: 'priced', notice: typeof data.notice === 'string' ? data.notice.trim() : '', plans } : PILOT
}

export async function fetchPricing(fetchImpl: typeof fetch = fetch, baseURL = catalogBaseURL): Promise<Pricing> {
  try {
    const res = await fetchImpl(`${baseURL}/api/public/plans/v1`, { headers: { Accept: 'application/json' }, cache: 'no-cache' })
    return res.ok ? parsePricing(await res.json()) : PILOT
  } catch {
    return PILOT
  }
}

// 500000 minor units of KES -> "KES 5,000 a month". Amounts are minor units (cents).
export function formatMonthly(plan: PublicPlan): string {
  const major = plan.amountMinor / 100
  const digits = Number.isInteger(major) ? 0 : 2
  const amount = new Intl.NumberFormat('en-KE', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(major)
  return plan.amountMinor === 0 ? 'Free' : `${plan.currency} ${amount} a month`
}
