import { useSyncExternalStore } from 'react'

// True under 40rem: the phone layout. Used to start secondary lists closed on a
// phone and open everywhere else; the visitor can still toggle either way.
const QUERY = '(max-width: 39.99rem)'

function subscribe(onChange: () => void): () => void {
  const list = window.matchMedia(QUERY)
  list.addEventListener('change', onChange)
  return () => list.removeEventListener('change', onChange)
}

export function usePhone(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}
