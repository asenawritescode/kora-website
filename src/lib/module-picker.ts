// How choosing modules works on the home page. Only modules the Cloud catalog
// lists can be chosen. A template is what Cloud installs, so choosing a module
// chooses its template, and the template's required parts come with it, each
// with a stated reason. Roadmap modules are names only: they cannot be chosen.
import type { Availability, CatalogTemplate } from '@/lib/catalog-client'

export type PickerModule = {
  key: string
  id?: string
  name: string
  summary: string
  availability: Availability
  selection: string
  requires: string[]
  template: { slug: string; name: string }
}

// Modules planned but not published as packs. No dates are given anywhere.
export const ROADMAP = ['Sales', 'Purchasing', 'Accounting', 'People', 'Projects']

// Reasons checked in a pilot workspace (a sale writes a stock issue). The
// catalog's `requires` list decides what is needed; this only adds the why,
// and stands in for `requires` when an older catalog leaves it out.
const KNOWN_NEEDS: Record<string, { name: string; why: string }[]> = {
  'Point of Sale': [{ name: 'Inventory', why: 'each sale takes the items off the stock count' }],
}

export function modulesFrom(templates: CatalogTemplate[]): PickerModule[] {
  return templates.flatMap((t) =>
    t.components.map((c) => ({
      key: `${t.slug}:${c.name}`,
      id: c.id,
      name: c.name,
      summary: c.summary,
      availability: c.availability,
      selection: c.selection,
      requires: c.requires,
      template: { slug: t.slug, name: t.name },
    })),
  )
}

export function roadmapFor(modules: PickerModule[]): string[] {
  const listed = new Set(modules.map((m) => m.name.toLowerCase()))
  return ROADMAP.filter((name) => !listed.has(name.toLowerCase()))
}

export type Inclusion = { by: string; why?: string } | { template: string }

export type Resolved = {
  template?: { slug: string; name: string }
  chosen: PickerModule[]
  included: Map<string, Inclusion>
  optional: string[]
}

export function resolve(modules: PickerModule[], chosenKeys: Iterable<string>): Resolved {
  const keys = new Set(chosenKeys)
  const chosen = modules.filter((m) => keys.has(m.key))
  const template = chosen[0]?.template
  const included = new Map<string, Inclusion>()
  if (!template) return { chosen, included, optional: [] }
  const siblings = modules.filter((m) => m.template.slug === template.slug)
  const byName = new Map(siblings.map((m) => [m.name, m]))

  // Follow what chosen modules need, transitively.
  const queue = [...chosen]
  while (queue.length) {
    const m = queue.shift()!
    const known = KNOWN_NEEDS[m.name] ?? []
    const needs = m.requires.length
      ? m.requires.map((name) => ({ name, why: known.find((k) => k.name === name)?.why }))
      : known
    for (const need of needs) {
      const dep = byName.get(need.name)
      if (!dep || keys.has(dep.key) || included.has(dep.key)) continue
      included.set(dep.key, { by: m.name, why: need.why })
      queue.push(dep)
    }
  }
  // The template installs its required parts whatever was ticked.
  for (const m of siblings) {
    if (m.selection === 'required' && !keys.has(m.key) && !included.has(m.key)) included.set(m.key, { template: template.name })
  }
  const optional = chosen.filter((m) => m.selection === 'optional' && m.id).map((m) => m.id!)
  return { template, chosen, included, optional }
}

// Toggling a module from another template starts a new choice: one template
// can be set up at a time.
export function toggle(modules: PickerModule[], chosenKeys: string[], key: string): string[] {
  if (chosenKeys.includes(key)) return chosenKeys.filter((k) => k !== key)
  const slug = modules.find((m) => m.key === key)?.template.slug
  return [...chosenKeys.filter((k) => modules.find((m) => m.key === k)?.template.slug === slug), key]
}

export function inclusionNote(inc: Inclusion, name: string): string {
  if ('template' in inc) return `Included: the ${inc.template} template sets up ${name} with your choice.`
  return inc.why ? `Included: ${inc.by} needs ${name}, because ${inc.why}.` : `Included: ${inc.by} needs ${name}.`
}
