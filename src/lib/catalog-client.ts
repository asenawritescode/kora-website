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

// Words for the template detail page. Cloud sends them as `detail_page`; these
// are only used when an older Cloud leaves a label out.
export interface DetailLabels {
  breadcrumb: string
  templatesLink: string
  primaryAction: string
  primaryReassurance: string
  preparationHeading: string
  outcomesHeading: string
  compositionHeading: string
  includedLabel: string
  partLabel: string
  partsLabel: string
  optionalHeading: string
  optionalContinueAction: string
  unavailableHeading: string
  unavailableDescription: string
}

export const DEFAULT_DETAIL_LABELS: DetailLabels = {
  breadcrumb: 'Breadcrumb',
  templatesLink: 'Templates',
  primaryAction: 'Use this template',
  primaryReassurance: 'Review the setup and change it before you begin.',
  preparationHeading: 'Before you start',
  outcomesHeading: 'What this helps you do',
  compositionHeading: 'In this template',
  includedLabel: 'Included',
  partLabel: 'part',
  partsLabel: 'parts',
  optionalHeading: 'Optional additions',
  optionalContinueAction: 'Continue with your choices',
  unavailableHeading: 'This template is no longer available',
  unavailableDescription: 'Browse current templates to find another option.',
}

export interface CatalogTemplateDetail extends CatalogTemplate {
  labels: DetailLabels
}

export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>

export type CatalogErrorKind = 'network' | 'http' | 'invalid' | 'not_found'

export class CatalogError extends Error {
  readonly kind: CatalogErrorKind
  readonly status?: number
  // Set on not_found: the words Cloud sent with the 404, for the unavailable page.
  readonly labels?: DetailLabels
  constructor(kind: CatalogErrorKind, message: string, status?: number, labels?: DetailLabels) {
    super(message)
    this.name = 'CatalogError'
    this.kind = kind
    this.status = status
    this.labels = labels
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

function parseLabels(raw: unknown): DetailLabels {
  const d = isObject(raw) ? raw : {}
  const pick = (key: string, fallback: string) => text(d[key]) || fallback
  const f = DEFAULT_DETAIL_LABELS
  return {
    breadcrumb: pick('breadcrumb_label', f.breadcrumb),
    templatesLink: pick('templates_link', f.templatesLink),
    primaryAction: pick('primary_action', f.primaryAction),
    primaryReassurance: pick('primary_reassurance', f.primaryReassurance),
    preparationHeading: pick('preparation_heading', f.preparationHeading),
    outcomesHeading: pick('outcomes_heading', f.outcomesHeading),
    compositionHeading: pick('composition_heading', f.compositionHeading),
    includedLabel: pick('included_label', f.includedLabel),
    partLabel: pick('part_label', f.partLabel),
    partsLabel: pick('parts_label', f.partsLabel),
    optionalHeading: pick('optional_label', f.optionalHeading),
    optionalContinueAction: pick('optional_continue_action', f.optionalContinueAction),
    unavailableHeading: pick('unavailable_heading', f.unavailableHeading),
    unavailableDescription: pick('unavailable_description', f.unavailableDescription),
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

// One template with the labels for its page. 404, and a template Cloud has
// hidden, both mean "no longer available" (not_found).
export async function fetchTemplate(
  slug: string,
  options: { baseURL?: string; signal?: AbortSignal; fetchImpl?: Fetcher } = {},
): Promise<CatalogTemplateDetail> {
  const { baseURL = catalogBaseURL, signal, fetchImpl = fetch as Fetcher } = options
  let res: Response
  try {
    res = await fetchImpl(`${baseURL}/api/public/catalog/v1/templates/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (err) {
    if (signal?.aborted) throw err
    throw new CatalogError('network', 'could not reach the template catalog')
  }
  let payload: unknown
  try {
    payload = await res.json()
  } catch {
    if (res.status === 404) throw new CatalogError('not_found', 'template not found', 404, DEFAULT_DETAIL_LABELS)
    throw new CatalogError(res.ok ? 'invalid' : 'http', res.ok ? 'catalog response is not JSON' : `catalog request failed: ${res.status}`, res.status)
  }
  const body = isObject(payload) ? payload : {}
  if (res.status === 404) throw new CatalogError('not_found', 'template not found', 404, parseLabels(body.detail_page))
  if (!res.ok) throw new CatalogError('http', `catalog request failed: ${res.status}`, res.status)
  const template = parseTemplate(body.data)
  if (!template) {
    const hidden = isObject(body.data) && levelOf(body.data.availability) === 'hidden'
    if (hidden) throw new CatalogError('not_found', 'template is not available', 404, parseLabels((body.data as Json).detail_page))
    throw new CatalogError('invalid', 'catalog response has no template')
  }
  return { ...template, labels: parseLabels((body.data as Json).detail_page) }
}
