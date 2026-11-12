// Derives what the Modules, Roadmap and Industries pages draw from what Cloud
// publishes: the module list (attested availability) and the roadmap. The same
// functions run on live data and on the committed snapshot, so the fallback can
// never say something Cloud's data could not.
import type { CatalogModule, RoadmapEntry } from '@/lib/catalog-client'
import type { Status } from '@/components/landing/ui'

export type LiveCatalog = { modules: CatalogModule[]; roadmap: RoadmapEntry[] }

export type ModuleInfo = {
  id: string
  name: string
  status: Status
  desc: string
  needs: string
  missing?: string
  // The catalog slug of the module's release, where Cloud has linked one.
  slug?: string
  // The job it does, where Cloud says.
  category?: string
}

export type RoadmapItem = { name: string; desc: string; feature?: boolean; missing?: string }
export type Lane = { title: string; status: Status; sub: string; items: RoadmapItem[] }

// An entry is available or preview only when the catalog lists the module it links to
// and attests that level. A link to a module the catalog does not list, or no link,
// is planned: availability is never assumed.
export function statusOf(entry: RoadmapEntry, modules: CatalogModule[]): Status {
  const linked = entry.releaseSlug ? modules.find((m) => m.slug === entry.releaseSlug) : undefined
  return linked ? linked.availability : 'roadmap'
}

const lowerFirst = (text: string) => text.replace(/^./, (c) => c.toLowerCase())
const inOrder = (entries: RoadmapEntry[]) => [...entries].sort((a, b) => a.sort - b.sort || a.slug.localeCompare(b.slug))

// What a module needs, in words: the names of what its roadmap entry requires.
// A module with a release and nothing required needs nothing; a planned one
// has not decided its parts yet.
function needsOf(entry: RoadmapEntry, names: Map<string, string>): string {
  if (entry.requires.length) return entry.requires.map((slug) => names.get(slug) ?? slug).join(', ')
  return entry.releaseSlug ? 'Nothing else' : 'To be confirmed'
}

export function modulesOf(live: LiveCatalog): ModuleInfo[] {
  const names = new Map(live.roadmap.map((e) => [e.slug, e.name]))
  return inOrder(live.roadmap).filter((e) => e.kind === 'module').map((e) => ({
    id: e.slug,
    name: e.name,
    status: statusOf(e, live.modules),
    desc: e.summary,
    needs: needsOf(e, names),
    missing: e.limitations.length ? e.limitations.join(' ') : undefined,
    slug: e.releaseSlug,
    category: e.category,
  }))
}

const LANE_COPY: Record<'building' | 'next' | 'later', { title: string; sub: string; status: Status }> = {
  building: { title: 'Building', sub: 'Visible, not selectable yet', status: 'preview' },
  next: { title: 'Planned next', sub: 'No dates promised', status: 'roadmap' },
  later: { title: 'Planned later', sub: 'No dates promised', status: 'roadmap' },
}

// Lanes follow readiness first: what is Available is "Now" whatever its horizon, then
// each remaining entry sits in the lane Cloud's horizon names.
export function buildLanes(live: LiveCatalog): Lane[] {
  const sorted = inOrder(live.roadmap)
  const item = (e: RoadmapEntry): RoadmapItem => ({
    name: e.name, desc: e.summary, feature: e.kind === 'feature' || undefined,
    missing: e.limitations.length ? lowerFirst(e.limitations.join(' ')) : undefined,
  })
  const now = sorted.filter((e) => statusOf(e, live.modules) === 'available')
  const rest = sorted.filter((e) => statusOf(e, live.modules) !== 'available')
  const lane = (horizon: 'building' | 'next' | 'later') => ({ ...LANE_COPY[horizon], items: rest.filter((e) => e.horizon === horizon).map(item) })
  return [
    { title: 'Now', status: 'available', sub: 'Works today', items: now.map(item) },
    lane('building'), lane('next'), lane('later'),
  ]
}

export type JobGroup = { job?: string; modules: ModuleInfo[] }

// Modules grouped by the job they do, in the order Cloud lists them. A short list is
// not grouped (a heading over every module is noise), and nor is one where Cloud
// names no jobs. A module with no job goes last, under "Other".
export function groupByJob(modules: ModuleInfo[], minimum = 6): JobGroup[] {
  if (modules.length < minimum || !modules.some((m) => m.category)) return [{ modules }]
  const groups = new Map<string, ModuleInfo[]>()
  for (const m of modules) groups.set(m.category ?? 'Other', [...(groups.get(m.category ?? 'Other') ?? []), m])
  const other = groups.get('Other')
  groups.delete('Other')
  return [...groups, ...(other ? [['Other', other] as const] : [])].map(([job, list]) => ({ job, modules: list }))
}
