// Compares the committed module list (the copy and the offline fallback) with
// what Cloud publishes. The two should say the same thing about readiness;
// when they do not, the committed list is the one that is wrong, because Cloud
// holds the attestation.
import { statusOf, type LiveCatalog } from '@/lib/live-catalog'
import type { ModuleInfo } from '@/lib/modules-content'

export function catalogDrift(committed: ModuleInfo[], live: LiveCatalog): string[] {
  const bySlug = new Map(live.roadmap.map((e) => [e.slug, e]))
  const drift: string[] = []
  for (const m of committed) {
    const entry = bySlug.get(m.id)
    if (!entry) {
      drift.push(`${m.id}: in the committed list but not in Cloud's roadmap`)
      continue
    }
    const level = statusOf(entry, live.modules)
    if (level !== m.status) drift.push(`${m.id}: committed ${m.status}, Cloud ${level}`)
  }
  const known = new Set(committed.map((m) => m.id))
  for (const e of live.roadmap) if (e.kind === 'module' && !known.has(e.slug)) drift.push(`${e.slug}: in Cloud's roadmap but not in the committed list`)
  return drift
}
