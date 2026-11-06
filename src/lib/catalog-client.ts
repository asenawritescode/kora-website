// Client for Kigae Cloud's public template catalog (GET /api/public/catalog/v1/templates).
// Renders only what the catalog returns; the CMS is not involved.

export type Availability = 'available' | 'preview'

export interface CatalogComponent {
  id?: string
  name: string
  summary: string
  selection: string
  availability: Availability
  requires: string[]
}

export interface CatalogTemplate {
  slug: string
  name: string
  summary: string
  category?: string
  availability: Availability
  components: CatalogComponent[]
}

export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>

export type CatalogErrorKind = 'network' | 'http' | 'invalid'

export class CatalogError extends Error {
  readonly kind: CatalogErrorKind
  readonly status?: number
  constructor(kind: CatalogErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'CatalogError'
    this.kind = kind
    this.status = status
  }
}

// An env var that is set (even to "") wins, so a dev server can use same-origin + proxy.
const configuredBase = import.meta.env.VITE_KORA_CLOUD_CATALOG_BASE_URL as string | undefined
export const catalogBaseURL = (configuredBase ?? 'https://cloud.kora.mradiafrica.com').replace(/\/$/, '')

type Json = Record<string, unknown>
const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v)
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

// Missing or unknown levels are shown as preview: availability is never claimed without an attestation.
function levelOf(v: unknown): Availability | 'hidden' {
  const level = text(v).toLowerCase()
  if (level === 'available') return 'available'
  if (level === 'hidden') return 'hidden'
  return 'preview'
}

function parseComponent(raw: unknown): CatalogComponent | null {
  if (!isObject(raw)) return null
  const name = text(raw.name)
  const level = levelOf(raw.availability)
  if (!name || level === 'hidden') return null
  return {
    id: text(raw.release_id) || undefined,
    name,
    summary: text(raw.summary),
    selection: text(raw.selection) || 'required',
    availability: level,
    requires: Array.isArray(raw.requires) ? raw.requires.map(text).filter(Boolean) : [],
  }
}

export function parseTemplates(payload: unknown): CatalogTemplate[] {
  const items = isObject(payload) && isObject(payload.data) ? payload.data.items : undefined
  if (!Array.isArray(items)) throw new CatalogError('invalid', 'catalog response has no data.items list')
  const templates: CatalogTemplate[] = []
  for (const raw of items) {
    if (!isObject(raw)) continue
    const slug = text(raw.slug)
    const name = text(raw.name)
    const level = levelOf(raw.availability)
    if (!slug || !name || level === 'hidden') continue
    templates.push({
      slug,
      name,
      summary: text(raw.summary),
      category: text(raw.category) || undefined,
      availability: level,
      components: Array.isArray(raw.components)
        ? raw.components.map(parseComponent).filter((c): c is CatalogComponent => c !== null)
        : [],
    })
  }
  return templates
}

export async function fetchTemplates(
  options: { baseURL?: string; signal?: AbortSignal; fetchImpl?: Fetcher } = {},
): Promise<CatalogTemplate[]> {
  const { baseURL = catalogBaseURL, signal, fetchImpl = fetch as Fetcher } = options
  let res: Response
  try {
    res = await fetchImpl(`${baseURL}/api/public/catalog/v1/templates`, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (err) {
    if (signal?.aborted) throw err
    throw new CatalogError('network', 'could not reach the template catalog')
  }
  if (!res.ok) throw new CatalogError('http', `catalog request failed: ${res.status}`, res.status)
  let payload: unknown
  try {
    payload = await res.json()
  } catch {
    // e.g. a host that answers 200 with its own index.html
    throw new CatalogError('invalid', 'catalog response is not JSON')
  }
  return parseTemplates(payload)
}
