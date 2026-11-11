// How choosing modules works on the set-up page. Only modules the Cloud catalog
// lists can be chosen, and only those the catalog attests as available. A
// template is what Cloud installs, so choosing a module chooses its template;
// one template is set up at a time. What a choice installs, including what each
// part needs, is Cloud's to say (resolve-client.ts); this file only keeps the
// ticks and words Cloud's answer for the page.
import type { Availability, CatalogTemplate } from '@/lib/catalog-client'
import type { IncludedPart } from '@/lib/resolve-client'

export type PickerModule = {
  key: string
  // The release id of the part ("erp-sell-1.0.6").
  id?: string
  name: string
  summary: string
  availability: Availability
  selection: string
  template: { slug: string; name: string; releaseId?: string }
}

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
      template: { slug: t.slug, name: t.name, releaseId: t.releaseId },
    })),
  )
}

// A part can be ticked when the catalog attests it. Whether everything it needs
// is ready too is Cloud's answer, shown once a choice is checked.
export const isSelectable = (m: PickerModule) => m.availability === 'available'

// Keys that can still be ticked, all from one template. Used on a choice
// restored from a previous visit, when the catalog may have changed.
export function prune(modules: PickerModule[], keys: Iterable<string>): string[] {
  const kept = [...keys].flatMap((key) => {
    const m = modules.find((x) => x.key === key)
    return m && isSelectable(m) ? [m] : []
  })
  const slug = kept[0]?.template.slug
  return kept.filter((m) => m.template.slug === slug).map((m) => m.key)
}

// What the rest of the site carries to Cloud signup: the template slug and the
// optional release ids, plus the ticked keys so the picker can show them again.
export type Choice = { template?: string; optional: string[]; keys: string[] }

export function choiceFrom(modules: PickerModule[], keys: Iterable<string>): Choice {
  const kept = new Set(prune(modules, keys))
  const chosen = modules.filter((m) => kept.has(m.key))
  return {
    template: chosen[0]?.template.slug,
    optional: chosen.filter((m) => m.selection === 'optional' && m.id).map((m) => m.id!),
    keys: chosen.map((m) => m.key),
  }
}

// The template a set of ticked keys belongs to.
export const templateOf = (modules: PickerModule[], keys: string[]) => modules.find((m) => keys.includes(m.key))?.template

// Toggling a module from another template starts a new choice: one template
// can be set up at a time. A part that cannot be chosen yet changes nothing.
export function toggle(modules: PickerModule[], chosenKeys: string[], key: string): string[] {
  if (chosenKeys.includes(key)) return chosenKeys.filter((k) => k !== key)
  const m = modules.find((x) => x.key === key)
  if (!m || !isSelectable(m)) return chosenKeys
  return [...chosenKeys.filter((k) => modules.find((x) => x.key === k)?.template.slug === m.template.slug), key]
}

// The line under a part Cloud installs without being ticked: Cloud's own
// sentence when another part needs it, else that the template sets it up.
// A part the visitor ticked needs no line.
export function inclusionNote(part: IncludedPart, templateName: string): string | undefined {
  if (part.reason === 'selected') return undefined
  return part.explanation ? `Included: ${part.explanation}` : `Included: the ${templateName} template sets up ${part.name} with your choice.`
}
