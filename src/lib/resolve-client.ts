// Asks Cloud what a choice of template and optional parts will install
// (POST /api/public/catalog/v1/selections/resolve). Cloud runs the same
// composition checks as signup, including what each part needs, so the site
// does not work that out itself. Anything unclear is a refusal or a failure,
// never a claim that the choice can be set up.
import { catalogBaseURL, type Fetcher } from '@/lib/catalog-client'

// Why a part is in the setup, as Cloud words it ("required_by_template",
// "included_by_default", "selected", "dependency_of:<release>").
export type IncludedPart = { releaseId: string; name: string; reason: string; explanation: string }

export type Resolution = { provisionable: boolean; included: IncludedPart[]; conflicts: string[] }

export type ResolveResult =
  | { kind: 'ok'; resolution: Resolution }
  // Cloud understood the choice and said no (a part is not ready, the template changed).
  | { kind: 'refused'; code: string }
  // Cloud could not answer: too many checks, or it could not be reached.
  | { kind: 'failed'; reason: 'rate_limited' | 'unreachable' }

type Json = Record<string, unknown>
const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v)
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

// Returns null for anything that is not a well-formed answer. Only an explicit
// `provisionable: true` counts as one; a part with no release id is dropped.
export function parseResolution(payload: unknown): Resolution | null {
  const data = isObject(payload) ? payload.data : undefined
  if (!isObject(data) || typeof data.provisionable !== 'boolean' || !Array.isArray(data.included)) return null
  const included = data.included.flatMap((raw): IncludedPart[] => {
    if (!isObject(raw) || !text(raw.release_id)) return []
    return [{ releaseId: text(raw.release_id), name: text(raw.name), reason: text(raw.reason), explanation: text(raw.explanation) }]
  })
  const conflicts = Array.isArray(data.conflicts) ? data.conflicts.flatMap((c) => (isObject(c) && text(c.reason) ? [text(c.reason)] : [])) : []
  return { provisionable: data.provisionable && conflicts.length === 0, included, conflicts }
}

export async function resolveSelection(
  templateReleaseId: string,
  optionalReleaseIds: string[],
  options: { baseURL?: string; signal?: AbortSignal; fetchImpl?: Fetcher } = {},
): Promise<ResolveResult> {
  const { baseURL = catalogBaseURL, signal, fetchImpl = fetch as Fetcher } = options
  let res: Response
  try {
    res = await fetchImpl(`${baseURL}/api/public/catalog/v1/selections/resolve`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_release_id: templateReleaseId, optional_release_ids: optionalReleaseIds }),
      signal,
    })
  } catch (err) {
    if (signal?.aborted) throw err
    return { kind: 'failed', reason: 'unreachable' }
  }
  if (res.status === 429) return { kind: 'failed', reason: 'rate_limited' }
  let body: unknown
  try {
    body = await res.json()
  } catch {
    return { kind: 'failed', reason: 'unreachable' }
  }
  if (res.status >= 400 && res.status < 500) return { kind: 'refused', code: (isObject(body) && text(body.error)) || 'refused' }
  const resolution = res.ok ? parseResolution(body) : null
  return resolution ? { kind: 'ok', resolution } : { kind: 'failed', reason: 'unreachable' }
}

// What to tell the visitor when Cloud refuses a choice.
export function refusalMessage(code: string): string {
  return code === 'selection_changed'
    ? 'This setup changed while you were choosing. Choose your modules again.'
    : 'That combination cannot be set up yet. Untick the last module you added.'
}
