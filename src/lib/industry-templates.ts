import type { CatalogTemplate } from './catalog-client'
import type { Industry } from './industries-content'

// What stops a business kind from being set up: it names no template, Cloud does not list the one it names, or
// a part of that template that is required or on by default is not available (an optional part may be missing).
export function templateGaps(industries: Industry[], templates: CatalogTemplate[]): string[] {
  const bySlug = new Map(templates.map((t) => [t.slug, t]))
  return industries.flatMap((industry) => {
    if (!industry.template) return [`${industry.name}: names no template`]
    const template = bySlug.get(industry.template)
    if (!template) return [`${industry.name}: Cloud lists no template "${industry.template}"`]
    return template.components
      .filter((part) => part.selection !== 'optional' && part.availability !== 'available')
      .map((part) => `${industry.name}: part "${part.name}" of ${template.slug} is ${part.availability}, not available`)
  })
}
