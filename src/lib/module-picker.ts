// How choosing modules works on the set-up page. Only modules the Cloud catalog
// lists can be chosen, and only those the catalog attests as available: a
// preview part, or a part that needs a preview part, cannot be ticked. A
// template is what Cloud installs, so choosing a module chooses its template,
// and the template's required parts come with it, each with a stated reason.
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

// Cloud installs these whatever was ticked.
const installedAnyway = (selection: string) => selection === 'required' || selection === 'default'

export function modulesFrom(templates: CatalogTemplate[]): PickerModule[] {
  return templates.flatMap((t) =>
    t.components.map((c) => ({
      key: `${t.slug}:${c.name}`,
      id: c.id,
      name: c.name,
      summary: c.summary,
      // Nothing under a template that is not attested can be set up.
      availability: t.availability === 'available' ? c.availability : 'preview',
      selection: c.selection,
      requires: c.requires,
      template: { slug: t.slug, name: t.name },
    })),
  )
}

export type Inclusion = { by: string; why?: string } | { template: string }

export type Resolved = {
  template?: { slug: string; name: string }
  chosen: PickerModule[]
  included: Map<string, Inclusion>
  // Release ids of the optional parts to install: the ones ticked and the ones
  // they need, in catalog order. Parts the template installs anyway are not here.
  optional: string[]
}

type Need = { name: string; why?: string }

// What a module needs: the catalog's `requires`, nothing else.
const needsOf = (m: PickerModule): Need[] => m.requires.map((name) => ({ name }))

export type Selectability = { ok: true } | { ok: false; reason: 'preview' } | { ok: false; reason: 'needs-preview'; by: string }

// A module can be ticked when the catalog attests it and everything it needs.
export function selectability(modules: PickerModule[], m: PickerModule): Selectability {
  if (m.availability !== 'available') return { ok: false, reason: 'preview' }
  const byName = new Map(modules.filter((x) => x.template.slug === m.template.slug).map((x) => [x.name, x]))
  const seen = new Set([m.key])
  const queue = [m]
  while (queue.length) {
    for (const need of needsOf(queue.shift()!)) {
      const dep = byName.get(need.name)
      if (!dep || seen.has(dep.key)) continue
      if (dep.availability !== 'available') return { ok: false, reason: 'needs-preview', by: dep.name }
      seen.add(dep.key)
      queue.push(dep)
    }
  }
  return { ok: true }
}

// Keys that can still be ticked, all from one template. Used on a choice
// restored from a previous visit, when the catalog may have changed.
export function prune(modules: PickerModule[], keys: Iterable<string>): string[] {
  const kept = [...keys].flatMap((key) => {
    const m = modules.find((x) => x.key === key)
    return m && selectability(modules, m).ok ? [m] : []
  })
  const slug = kept[0]?.template.slug
  return kept.filter((m) => m.template.slug === slug).map((m) => m.key)
}

export function resolve(modules: PickerModule[], chosenKeys: Iterable<string>): Resolved {
  const keys = new Set(prune(modules, chosenKeys))
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
    for (const need of needsOf(m)) {
      const dep = byName.get(need.name)
      if (!dep || keys.has(dep.key) || included.has(dep.key)) continue
      included.set(dep.key, { by: m.name, why: need.why })
      queue.push(dep)
    }
  }
  // The template installs its required parts whatever was ticked.
  for (const m of siblings) {
    if (installedAnyway(m.selection) && !keys.has(m.key) && !included.has(m.key)) included.set(m.key, { template: template.name })
  }
  const optional = siblings
    .filter((m) => (keys.has(m.key) || included.has(m.key)) && !installedAnyway(m.selection) && m.id)
    .map((m) => m.id!)
  return { template, chosen, included, optional }
}

// What the rest of the site carries to Cloud signup: the template slug and the
// optional release ids, plus the ticked keys so the picker can show them again.
export type Choice = { template?: string; optional: string[]; keys: string[] }

export function choiceFrom(modules: PickerModule[], keys: Iterable<string>): Choice {
  const r = resolve(modules, keys)
  return { template: r.template?.slug, optional: r.optional, keys: r.chosen.map((m) => m.key) }
}

// Toggling a module from another template starts a new choice: one template
// can be set up at a time. A part that cannot be chosen yet changes nothing.
export function toggle(modules: PickerModule[], chosenKeys: string[], key: string): string[] {
  if (chosenKeys.includes(key)) return chosenKeys.filter((k) => k !== key)
  const m = modules.find((x) => x.key === key)
  if (!m || !selectability(modules, m).ok) return chosenKeys
  return [...chosenKeys.filter((k) => modules.find((x) => x.key === k)?.template.slug === m.template.slug), key]
}

export function inclusionNote(inc: Inclusion, name: string): string {
  if ('template' in inc) return `Included: the ${inc.template} template sets up ${name} with your choice.`
  return inc.why ? `Included: ${inc.by} needs ${name}, because ${inc.why}.` : `Included: ${inc.by} needs ${name}.`
}
