import { useEffect, useState } from 'react'
import { refusalMessage, resolveSelection, type Resolution } from '@/lib/resolve-client'

// What Cloud says about the current choice. `checking` keeps the last answer so
// the page does not flicker between ticks.
export type ResolutionState =
  | { status: 'idle' }
  | { status: 'checking'; last?: Resolution }
  | { status: 'ready'; resolution: Resolution }
  | { status: 'refused'; message: string }
  | { status: 'failed'; reason: 'rate_limited' | 'unreachable' }

const DELAY_MS = 250

// Asks Cloud after the visitor stops ticking, one request at a time. No template
// chosen means nothing to ask.
export function useResolution(templateReleaseId: string | undefined, optional: string[]): ResolutionState {
  const [state, setState] = useState<ResolutionState>({ status: 'idle' })
  const wanted = templateReleaseId ? `${templateReleaseId}|${optional.join(',')}` : ''
  useEffect(() => {
    if (!templateReleaseId) { setState({ status: 'idle' }); return }
    const abort = new AbortController()
    setState((s) => ({ status: 'checking', last: s.status === 'ready' ? s.resolution : s.status === 'checking' ? s.last : undefined }))
    const timer = setTimeout(() => {
      resolveSelection(templateReleaseId, optional, { signal: abort.signal }).then(
        (r) => !abort.signal.aborted && setState(r.kind === 'ok' ? { status: 'ready', resolution: r.resolution } : r.kind === 'refused' ? { status: 'refused', message: refusalMessage(r.code) } : { status: 'failed', reason: r.reason }),
        () => {},
      )
    }, DELAY_MS)
    return () => { clearTimeout(timer); abort.abort() }
    // `wanted` stands for the template and the optional ids.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanted])
  return state
}
