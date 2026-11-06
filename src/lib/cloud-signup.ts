// Links from the website to Kigae Cloud's own signup and sign-in pages.
// The website never collects identity or provisions anything itself; it only
// carries the visitor's selection (template, optional modules) in the URL.

export const DEFAULT_CLOUD_SIGNUP_URL = 'https://cloud.kora.mradiafrica.com/signup'

// Template slugs and release ids ("pos-1.0.8") read from a link.
const ID = /^[a-z0-9][a-z0-9._-]{0,127}$/i

export type CloudSelection = {
  // A template slug or release id.
  template?: string
  // Release ids of the optional modules the person chose.
  optional?: string[]
}

export function cloudSignupBase(): string {
  const configured = (import.meta.env?.VITE_KORA_CLOUD_SIGNUP_URL as string | undefined)?.trim()
  return configured || DEFAULT_CLOUD_SIGNUP_URL
}

// Reads `template` and `optional` (comma-separated release ids) from a query
// string. Values that are not plain ids are dropped, so nothing arbitrary is
// forwarded to Cloud.
export function readSelection(search: string): { template?: string; optional: string[] } {
  const params = new URLSearchParams(search)
  const template = (params.get('template') ?? '').trim()
  if (!ID.test(template)) return { template: undefined, optional: [] }
  const optional = params
    .getAll('optional')
    .flatMap((v) => v.split(','))
    .map((id) => id.trim())
    .filter((id) => ID.test(id))
  return { template, optional }
}

// The link Cloud documents (kora-cloud docs/signup-link-format.md):
//   <signup url>?template=<slug or release id>&optional=<release ids, comma separated>
// Nothing chosen adds no parameters. Optional ids mean nothing without a
// template, so they are not carried alone. Commas stay literal; everything else
// is percent-encoded. An id containing a comma cannot be told apart from two
// ids, so it is left out.
export function buildSignupUrl(signupUrl: string, selection: CloudSelection = {}): string {
  const url = new URL(signupUrl)
  const template = selection.template?.trim()
  const optional = [...new Set((template ? (selection.optional ?? []) : []).map((id) => id.trim()).filter((id) => id && !id.includes(',')))]
  url.searchParams.delete('template')
  url.searchParams.delete('optional')
  const parts = [url.searchParams.toString()]
  if (template) parts.push(`template=${encodeURIComponent(template)}`)
  if (optional.length) parts.push(`optional=${optional.map(encodeURIComponent).join(',')}`)
  url.search = parts.filter(Boolean).join('&')
  return url.toString()
}

// Sign-in lives next to signup on the same Cloud origin.
export function buildSignInUrl(signupUrl: string): string {
  return new URL('/login', signupUrl).toString()
}
