import { useEffect, useState } from 'react'
import { buildLanes, mergeModules, type LiveCatalog } from '@/lib/live-catalog'
import { LANES, MODULES, type Lane, type ModuleInfo } from '@/lib/modules-content'
import { getLiveCatalog } from '@/lib/public-content'

// where the data came from: Cloud, the committed list while Cloud answers, or the
// committed list because Cloud could not be reached.
export type ModulesSource = 'live' | 'loading' | 'fallback'

export function useModules(): { modules: ModuleInfo[]; lanes: Lane[]; source: ModulesSource } {
  const [live, setLive] = useState<LiveCatalog | 'failed' | null>(null)
  useEffect(() => {
    let alive = true
    getLiveCatalog().then((data) => alive && setLive(data), () => alive && setLive('failed'))
    return () => { alive = false }
  }, [])
  if (live && live !== 'failed') return { modules: mergeModules(MODULES, live), lanes: buildLanes(live), source: 'live' }
  return { modules: MODULES, lanes: LANES, source: live === 'failed' ? 'fallback' : 'loading' }
}
