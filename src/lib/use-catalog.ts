import { useCallback, useEffect, useState } from 'react'
import type { CatalogTemplate } from '@/lib/catalog-client'
import { getCatalogTemplates } from '@/lib/public-content'

export type CatalogState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; templates: CatalogTemplate[] }

export function useCatalog() {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let alive = true
    setState({ status: 'loading' })
    getCatalogTemplates()
      .then((templates) => alive && setState({ status: 'ready', templates }))
      .catch(() => alive && setState({ status: 'error' }))
    return () => { alive = false }
  }, [attempt])
  return { state, retry: useCallback(() => setAttempt((n) => n + 1), []) }
}
