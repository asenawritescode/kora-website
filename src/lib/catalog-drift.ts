// Compares the committed snapshot with what Cloud publishes. Cloud holds the
// attestation and the words, so when the two differ the snapshot is the one
// that is stale: run `bun run sync:catalog` and commit the result.
import { wire } from '@/lib/catalog-snapshot'
import type { LiveCatalog } from '@/lib/live-catalog'

function differences(what: string, committed: { slug: string }[], live: { slug: string }[]): string[] {
  const mine = new Map(committed.map((i) => [i.slug, JSON.stringify(i)]))
  const theirs = new Map(live.map((i) => [i.slug, JSON.stringify(i)]))
  const out: string[] = []
  for (const [slug, text] of mine) {
    if (!theirs.has(slug)) out.push(`${what} ${slug}: in the snapshot but not in Cloud`)
    else if (theirs.get(slug) !== text) out.push(`${what} ${slug}: the snapshot differs from Cloud`)
  }
  for (const slug of theirs.keys()) if (!mine.has(slug)) out.push(`${what} ${slug}: in Cloud but not in the snapshot`)
  return out
}

export function catalogDrift(committed: LiveCatalog, live: LiveCatalog): string[] {
  const a = wire(committed)
  const b = wire(live)
  return [
    ...differences('module', a.modules.data.items, b.modules.data.items),
    ...differences('roadmap', a.roadmap.data.items, b.roadmap.data.items),
  ]
}
