// Links from the website to Kigae Cloud's own signup and sign-in pages.
// The website never collects identity or provisions anything itself; it only
// carries the visitor's selection (template, optional modules) in the URL.

export const DEFAULT_CLOUD_SIGNUP_URL = 'https://cloud.kora.mradiafrica.com/signup'

const SLUG = /^[a-z0-9][a-z0-9_-]{0,63}$/i

export type CloudSelection = {
  template?: string
  optional?: string
}

export function cloudSignupBase(): string {
  const configured = (import.meta.env?.VITE_KORA_CLOUD_SIGNUP_URL as string | undefined)?.trim()
  return configured || DEFAULT_CLOUD_SIGNUP_URL
}

// Reads `template` and `optional` (comma-separated module ids) from a query
// string. Values that are not plain slugs are dropped, so nothing arbitrary is
// forwarded to Cloud.
export function readSelection(search: string): CloudSelection {
  const params = new URLSearchParams(search)
  const template = (params.get('template') ?? '').trim()
  const optional = (params.get('optional') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => SLUG.test(id))
  return {
    template: SLUG.test(template) ? template : undefined,
    // Optional modules only make sense on top of a template.
    optional: template && SLUG.test(template) && optional.length ? optional.join(',') : undefined,
  }
}

export function buildSignupUrl(signupUrl: string, selection: CloudSelection = {}): string {
  const url = new URL(signupUrl)
  if (selection.template) url.searchParams.set('template', selection.template)
  if (selection.template && selection.optional) url.searchParams.set('optional', selection.optional)
  return url.toString()
}

// Sign-in lives next to signup on the same Cloud origin.
export function buildSignInUrl(signupUrl: string): string {
  return new URL('/login', signupUrl).toString()
}
