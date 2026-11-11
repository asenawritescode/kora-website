// Fails the build when the committed catalog snapshot disagrees with Cloud.
// Set CATALOG_DRIFT_URL to a Cloud base URL to check; without it the check is
// skipped with a warning, so a build without network access still works.
import { fetchCatalogModules, fetchRoadmap } from '../src/lib/catalog-client'
import { catalogDrift } from '../src/lib/catalog-drift'
import { SNAPSHOT } from '../src/lib/catalog-snapshot'

const baseURL = process.env.CATALOG_DRIFT_URL?.trim().replace(/\/$/, '')
if (!baseURL) {
  console.warn('validate:catalog skipped (set CATALOG_DRIFT_URL to compare the committed snapshot with Cloud)')
  process.exit(0)
}
try {
  const [modules, roadmap] = await Promise.all([fetchCatalogModules({ baseURL }), fetchRoadmap({ baseURL })])
  const drift = catalogDrift(SNAPSHOT, { modules, roadmap })
  if (drift.length) {
    console.error(`The committed catalog snapshot disagrees with Cloud (${drift.length}):\n${drift.map((d) => `  ${d}`).join('\n')}\nRun: CATALOG_URL=${baseURL} bun run sync:catalog`)
    process.exit(1)
  }
  console.log(`validate:catalog ok (${SNAPSHOT.modules.length} modules, ${SNAPSHOT.roadmap.length} roadmap items match ${baseURL})`)
} catch (err) {
  console.error(`validate:catalog could not read ${baseURL}: ${err instanceof Error ? err.message : err}`)
  process.exit(1)
}
