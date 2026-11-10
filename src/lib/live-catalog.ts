// Merges what Cloud publishes (attested availability and the roadmap) into the
// module list the Modules and Roadmap pages draw. The committed list in
// modules-content.ts stays the copy and the fallback; Cloud decides readiness.
import type { CatalogModule, RoadmapEntry } from '@/lib/catalog-client'
import type { Lane, ModuleInfo, RoadmapItem } from '@/lib/modules-content'
import type { Status } from '@/components/landing/ui'

export type LiveCatalog = { modules: CatalogModule[]; roadmap: RoadmapEntry[] }

// An entry is available or preview only when the catalog lists the module it links to
// and attests that level. A link to a module the catalog does not list, or no link,
// is planned: availability is never assumed.
export function statusOf(entry: RoadmapEntry, modules: CatalogModule[]): Status {
  const linked = entry.releaseSlug ? modules.find((m) => m.slug === entry.releaseSlug) : undefined
  return linked ? linked.availability : 'roadmap'
}

const lowerFirst = (text: string) => text.replace(/^./, (c) => c.toLowerCase())

export function mergeModules(base: ModuleInfo[], live: LiveCatalog): ModuleInfo[] {
  const bySlug = new Map(live.roadmap.map((entry) => [entry.slug, entry]))
  const name = (slug: string) => bySlug.get(slug)?.name ?? base.find((m) => m.id === slug)?.name ?? slug
  return base.map((m) => {
    const entry = bySlug.get(m.id)
    if (!entry) return m
    return {
      ...m,
      status: statusOf(entry, live.modules),
      desc: entry.summary || m.desc,
      needs: entry.requires.length ? entry.requires.map(name).join(', ') : m.needs,
      missing: entry.limitations.length ? entry.limitations.join(' ') : undefined,
    }
  })
}

const LANE_COPY: Record<'building' | 'next' | 'later', { title: string; sub: string; status: Status }> = {
  building: { title: 'Building', sub: 'Visible, not selectable yet', status: 'preview' },
  next: { title: 'Planned next', sub: 'No dates promised', status: 'roadmap' },
  later: { title: 'Planned later', sub: 'No dates promised', status: 'roadmap' },
}

// Lanes follow readiness first: what is Available is "Now" whatever its horizon, then
// each remaining entry sits in the lane Cloud's horizon names.
export function buildLanes(live: LiveCatalog): Lane[] {
  const sorted = [...live.roadmap].sort((a, b) => a.sort - b.sort || a.slug.localeCompare(b.slug))
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
