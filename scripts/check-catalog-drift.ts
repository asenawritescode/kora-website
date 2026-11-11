// Fails the build when the committed module list disagrees with Cloud's catalog.
// Set CATALOG_DRIFT_URL to a Cloud base URL to check; without it the check is
// skipped with a warning, so a build without network access still works.
import { fetchCatalogModules, fetchRoadmap } from '../src/lib/catalog-client'
import { catalogDrift } from '../src/lib/catalog-drift'
import { MODULES } from '../src/lib/modules-content'

const baseURL = process.env.CATALOG_DRIFT_URL?.trim().replace(/\/$/, '')
if (!baseURL) {
  console.warn('validate:catalog skipped (set CATALOG_DRIFT_URL to compare the committed list with Cloud)')
  process.exit(0)
}
try {
  const [modules, roadmap] = await Promise.all([fetchCatalogModules({ baseURL }), fetchRoadmap({ baseURL })])
  const drift = catalogDrift(MODULES, { modules, roadmap })
  if (drift.length) {
    console.error(`The committed module list disagrees with Cloud (${drift.length}):\n${drift.map((d) => `  ${d}`).join('\n')}\nUpdate src/lib/modules-content.ts to match, or fix the roadmap in Cloud.`)
    process.exit(1)
  }
  console.log(`validate:catalog ok (${MODULES.length} modules match ${baseURL})`)
} catch (err) {
  console.error(`validate:catalog could not read ${baseURL}: ${err instanceof Error ? err.message : err}`)
  process.exit(1)
}
