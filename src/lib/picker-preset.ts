// Turns a kind of business into ticks in the module picker. Presets name modules
// by the design's ids; Cloud's catalog names them its own way, so each module
// lists the catalog names it answers to (modules-content.ts).
import { INDUSTRIES, industrySlug, type Industry } from './industries-content'
import { MODULES, type ModuleInfo } from './modules-content'
import { selectability, toggle, type PickerModule } from './module-picker'

export const industryFor = (slug: string | null | undefined): Industry | undefined => INDUSTRIES.find((i) => industrySlug(i) === slug)

export function infoFor(catalogName: string): ModuleInfo | undefined {
  const name = catalogName.toLowerCase()
  return MODULES.find((m) => m.name.toLowerCase() === name || m.catalog?.some((c) => c.toLowerCase() === name))
}

// Catalog keys to tick for a preset: the preset's modules the catalog lists and
// attests, all from one template (the first it finds).
export function presetKeys(modules: PickerModule[], industry: Industry): string[] {
  const wanted = new Set(industry.preset)
  let keys: string[] = []
  for (const m of modules) {
    const info = infoFor(m.name)
    if (info && wanted.has(info.id) && selectability(modules, m).ok) keys = toggle(modules, keys, m.key)
  }
  return keys
}

// Preset modules with nothing the catalog can offer yet, for "not ready" lists.
export function notReady(modules: PickerModule[], industry?: Industry): ModuleInfo[] {
  const offered = new Set(modules.filter((m) => selectability(modules, m).ok).flatMap((m) => infoFor(m.name)?.id ?? []))
  const ids = industry ? industry.preset : MODULES.map((m) => m.id)
  return ids.filter((id) => !offered.has(id)).map((id) => MODULES.find((m) => m.id === id)!)
}
