import { useCallback, useEffect, useState } from 'react'
import type { CatalogTemplate } from '@/lib/catalog-client'
import { buildLanes, mergeModules, type LiveCatalog } from '@/lib/live-catalog'
import { LANES, MODULES, type Lane, type ModuleInfo } from '@/lib/modules-content'
import { getCatalogTemplates, getLiveCatalog } from '@/lib/public-content'

// The one place the site reads Cloud's catalog. Every page that shows modules,
// the roadmap, an industry preset or the set-up picker reads this, so they all
// see the same answer.
//
// Templates and the live list (modules + roadmap) load side by side and fail
// separately: a Cloud that lists templates but has no roadmap still lets the
// picker work, and the other pages say their status is the last published list.

export type CatalogState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; templates: CatalogTemplate[] }

// where the module list came from: Cloud, the committed list while Cloud answers,
// or the committed list because Cloud could not be reached.
export type CatalogSource = 'live' | 'loading' | 'fallback'

export type CatalogParts = {
  templates: CatalogTemplate[] | 'failed' | null
  live: LiveCatalog | 'failed' | null
}

export type CatalogView = { state: CatalogState; modules: ModuleInfo[]; lanes: Lane[]; source: CatalogSource }

export const LOADING: CatalogParts = { templates: null, live: null }

export function viewOf({ templates, live }: CatalogParts): CatalogView {
  const state: CatalogState =
    templates === null ? { status: 'loading' } : templates === 'failed' ? { status: 'error' } : { status: 'ready', templates }
  if (live && live !== 'failed') return { state, modules: mergeModules(MODULES, live), lanes: buildLanes(live), source: 'live' }
  return { state, modules: MODULES, lanes: LANES, source: live === 'failed' ? 'fallback' : 'loading' }
}

export function useCatalog(): CatalogView & { retry: () => void } {
  const [parts, setParts] = useState<CatalogParts>(LOADING)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let alive = true
    setParts(LOADING)
    getCatalogTemplates().then(
      (templates) => alive && setParts((p) => ({ ...p, templates })),
      () => alive && setParts((p) => ({ ...p, templates: 'failed' })),
    )
    getLiveCatalog().then(
      (live) => alive && setParts((p) => ({ ...p, live })),
      () => alive && setParts((p) => ({ ...p, live: 'failed' })),
    )
    return () => { alive = false }
  }, [attempt])
  return { ...viewOf(parts), retry: useCallback(() => setAttempt((n) => n + 1), []) }
}
