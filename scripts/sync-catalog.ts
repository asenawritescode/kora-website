// Rewrites src/lib/catalog-snapshot.json from a running Cloud. Run it, review the
// diff, and commit it. Never run it against a Cloud you do not want the site to
// show: the snapshot is what visitors see when Cloud is unreachable.
//
//   CATALOG_URL=https://cloud.example bun run sync:catalog
import { writeFileSync } from 'node:fs'
import { fetchCatalogModules, fetchRoadmap } from '../src/lib/catalog-client'
import { serialize } from '../src/lib/catalog-snapshot'

const baseURL = process.env.CATALOG_URL?.trim().replace(/\/$/, '')
if (!baseURL) {
  console.error('set CATALOG_URL to the Cloud base URL to copy')
  process.exit(1)
}
const [modules, roadmap] = await Promise.all([fetchCatalogModules({ baseURL }), fetchRoadmap({ baseURL })])
if (!roadmap.length) {
  console.error(`${baseURL} has an empty roadmap; refusing to replace the snapshot with nothing`)
  process.exit(1)
}
const file = new URL('../src/lib/catalog-snapshot.json', import.meta.url)
writeFileSync(file, serialize({ modules, roadmap }))
console.log(`wrote ${modules.length} modules and ${roadmap.length} roadmap items from ${baseURL}`)
