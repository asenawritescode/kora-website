// Fails when a business kind on the site has no template Cloud can set up, or when a part of that template that
// is required or on by default is not available. Set CATALOG_DRIFT_URL to a Cloud base URL to check; without it
// the check is skipped with a warning, so a build without network access still works.
import { fetchTemplates } from '../src/lib/catalog-client'
import { INDUSTRIES } from '../src/lib/industries-content'
import { templateGaps } from '../src/lib/industry-templates'

const baseURL = process.env.CATALOG_DRIFT_URL?.trim().replace(/\/$/, '')
if (!baseURL) {
  console.warn('validate:industry-templates skipped (set CATALOG_DRIFT_URL to check every business kind has a template)')
  process.exit(0)
}
try {
  const gaps = templateGaps(INDUSTRIES, await fetchTemplates({ baseURL }))
  if (gaps.length) {
    console.error(`Some business kinds cannot be set up from Cloud (${gaps.length}):\n${gaps.map((g) => `  ${g}`).join('\n')}`)
    process.exit(1)
  }
  console.log(`validate:industry-templates ok (${INDUSTRIES.length} business kinds each have an available template at ${baseURL})`)
} catch (err) {
  console.error(`validate:industry-templates could not read ${baseURL}: ${err instanceof Error ? err.message : err}`)
  process.exit(1)
}
