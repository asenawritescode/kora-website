import { useCallback, useEffect, useState } from 'react'
import type { Template } from '@/components/landing/ExamplesPage/data'
import { getPublicTemplates } from '@/lib/public-content'

export type TemplatesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; templates: Template[] }

export function useTemplates(): TemplatesState & { retry: () => void } {
  const [state, setState] = useState<TemplatesState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setState({ status: 'loading' })
    getPublicTemplates()
      .then((templates) => alive && setState({ status: 'ready', templates }))
      .catch(() => alive && setState({ status: 'error' }))
    return () => { alive = false }
  }, [attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { ...state, retry }
}
