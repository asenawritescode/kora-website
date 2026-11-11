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

// A module the catalog lists, reduced to what the Modules and Roadmap pages read.
export interface CatalogModule {
  slug: string
  // The id releases are named after ("erp-sell" for release "erp-sell-1.0.6"); the
  // slug is what the roadmap links to. They are usually the same.
  packageId: string
  name: string
  availability: Availability
}

// One roadmap entry from Cloud. It never carries availability: that is the attested
// level of the catalog module named by releaseSlug.
export type RoadmapHorizon = 'building' | 'next' | 'later'
export interface RoadmapEntry {
  slug: string
  kind: 'module' | 'feature'
  name: string
  summary: string
  // The job the item does ("Sell", "Stock", "Money"); empty when Cloud sets none.
  category?: string
  horizon: RoadmapHorizon
  requires: string[]
  limitations: string[]
  releaseSlug?: string
  sort: number
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

function parseTemplate(raw: unknown): CatalogTemplate | null {
  if (!isObject(raw)) return null
  const slug = text(raw.slug)
  const name = text(raw.name)
  const level = levelOf(raw.availability)
  if (!slug || !name || level === 'hidden') return null
  return {
    slug,
    name,
    summary: text(raw.summary),
    category: text(raw.category) || undefined,
    availability: level,
    components: Array.isArray(raw.components)
      ? raw.components.map(parseComponent).filter((c): c is CatalogComponent => c !== null)
      : [],
  }
}

export function parseTemplates(payload: unknown): CatalogTemplate[] {
  const items = isObject(payload) && isObject(payload.data) ? payload.data.items : undefined
  if (!Array.isArray(items)) throw new CatalogError('invalid', 'catalog response has no data.items list')
  return items.map(parseTemplate).filter((t): t is CatalogTemplate => t !== null)
}

const strings = (v: unknown) => (Array.isArray(v) ? v.map(text).filter(Boolean) : [])
const HORIZONS: RoadmapHorizon[] = ['building', 'next', 'later']

function listItems(payload: unknown, what: string): unknown[] {
  const items = isObject(payload) && isObject(payload.data) ? payload.data.items : undefined
  if (!Array.isArray(items)) throw new CatalogError('invalid', `${what} response has no data.items list`)
  return items
}

export function parseCatalogModules(payload: unknown): CatalogModule[] {
  return listItems(payload, 'modules').flatMap((raw) => {
    if (!isObject(raw)) return []
    const level = levelOf(raw.availability)
    const slug = text(raw.slug)
    const name = text(raw.name)
    return slug && name && level !== 'hidden' ? [{ slug, packageId: text(raw.package_id) || slug, name, availability: level }] : []
  })
}

// An entry with an unknown horizon or kind is dropped, never guessed.
export function parseRoadmap(payload: unknown): RoadmapEntry[] {
  return listItems(payload, 'roadmap').flatMap((raw) => {
    if (!isObject(raw)) return []
    const slug = text(raw.slug)
    const name = text(raw.name)
    const horizon = HORIZONS.find((h) => h === text(raw.horizon))
    const kind = text(raw.kind) === 'feature' ? 'feature' : text(raw.kind) === 'module' ? 'module' : undefined
    if (!slug || !name || !horizon || !kind) return []
    return [{
      slug, kind, name, summary: text(raw.summary), category: text(raw.category) || undefined, horizon,
      requires: strings(raw.requires), limitations: strings(raw.limitations),
      releaseSlug: text(raw.release_slug) || undefined,
      sort: typeof raw.sort === 'number' ? raw.sort : 0,
    }]
  })
}

async function getJSON(path: string, options: { baseURL?: string; signal?: AbortSignal; fetchImpl?: Fetcher }): Promise<unknown> {
  const { baseURL = catalogBaseURL, signal, fetchImpl = fetch as Fetcher } = options
  let res: Response
  try {
    // no-cache: readiness is a claim, so a reload must not show a status Cloud has since changed.
    res = await fetchImpl(`${baseURL}/api/public/catalog/v1/${path}`, { headers: { Accept: 'application/json' }, signal, cache: 'no-cache' })
  } catch (err) {
    if (signal?.aborted) throw err
    throw new CatalogError('network', 'could not reach the catalog')
  }
  if (!res.ok) throw new CatalogError('http', `catalog request failed: ${res.status}`, res.status)
  try {
    return await res.json()
  } catch {
    throw new CatalogError('invalid', 'catalog response is not JSON')
  }
}

type FetchOptions = { baseURL?: string; signal?: AbortSignal; fetchImpl?: Fetcher }
export const fetchCatalogModules = async (options: FetchOptions = {}) => parseCatalogModules(await getJSON('modules', options))
export const fetchRoadmap = async (options: FetchOptions = {}) => parseRoadmap(await getJSON('roadmap', options))

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
