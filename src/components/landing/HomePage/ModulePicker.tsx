import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CatalogTemplate } from '@/lib/catalog-client'
import { getCatalogTemplates } from '@/lib/public-content'
import { inclusionNote, modulesFrom, resolve, roadmapFor, ROADMAP, toggle, type PickerModule } from '@/lib/module-picker'
import { buildSignupUrl, cloudSignupBase } from '@/lib/cloud-signup'
import { PRICE_LINE } from '@/lib/pilot'

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; templates: CatalogTemplate[] }

function useCatalog() {
  const [state, setState] = useState<State>({ status: 'loading' })
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

const label = 'font-mono text-[11px] font-medium uppercase tracking-[0.08em]'

function Tick() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100">
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}

function ModuleRow({ m, chosen, note, onToggle }: { m: PickerModule; chosen: boolean; note?: string; onToggle: () => void }) {
  const included = !chosen && note !== undefined
  const noteId = `${m.key}-note`.replace(/[^a-z0-9-]/gi, '-')
  return (
    <li className={`border-b border-outline-variant last:border-b-0 ${chosen ? 'bg-accent-tint' : 'bg-white'}`}>
      <label className="flex cursor-pointer gap-4 px-5 py-[18px] has-[:disabled]:cursor-default has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent has-[:focus-visible]:-outline-offset-3">
        <span className="relative mt-1 size-[22px] shrink-0">
          <input
            type="checkbox"
            checked={chosen || included}
            disabled={included}
            onChange={onToggle}
            aria-describedby={note ? noteId : undefined}
            className={`peer size-[22px] appearance-none border-[1.5px] border-ink bg-white checked:border-accent checked:bg-accent disabled:checked:border-ink disabled:checked:bg-ink focus-visible:outline-none`}
          />
          <Tick />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="font-display text-[clamp(20px,2vw,24px)] font-[680] leading-[1.15] text-ink">{m.name}</span>
            {m.availability === 'preview' && <span className={`${label} border border-ink px-1.5 py-0.5 text-ink`}>Preview</span>}
          </span>
          {m.summary && <span className="mt-1 block text-[16px] leading-[1.5] text-muted">{m.summary}</span>}
          {note && <span id={noteId} className="mt-2 block text-[14px] leading-[1.5] text-on-surface-variant">{note}</span>}
        </span>
      </label>
    </li>
  )
}

export function ModulePicker() {
  const { state, retry } = useCatalog()
  const [chosen, setChosen] = useState<string[]>([])
  const modules = useMemo(() => (state.status === 'ready' ? modulesFrom(state.templates) : []), [state])
  const result = useMemo(() => resolve(modules, chosen), [modules, chosen])
  const roadmap = state.status === 'ready' ? roadmapFor(modules) : ROADMAP
  const names = [...result.chosen, ...modules.filter((m) => result.included.has(m.key))].map((m) => m.name)
  const href = result.template
    ? buildSignupUrl(cloudSignupBase(), { template: result.template.slug, optional: result.optional.join(',') || undefined })
    : undefined

  return (
    <section id="modules" aria-labelledby="modules-title" className="bg-paper border-t border-outline-variant">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:gap-y-8 px-4 py-[clamp(64px,9vw,128px)] sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="modules-title" className="font-display text-[clamp(32px,3.6vw,52px)] font-[740] leading-[1.02] tracking-[-0.025em] text-ink [text-wrap:balance]">
            Pick the modules your shop needs. They work together.
          </h2>
          <p className="mt-5 max-w-[30rem] text-[18px] leading-[1.5] text-on-surface-variant">
            Choose what you need today. When a module needs another one, it comes with it, and we tell you why. Add more as new modules are published.
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
          {state.status === 'loading' && (
            <div role="status" className="border border-outline-variant">
              <span className="sr-only">Loading modules</span>
              {[0, 1].map((i) => <div key={i} aria-hidden="true" className="h-[92px] border-b border-outline-variant bg-surface-container last:border-b-0 motion-safe:animate-pulse" />)}
            </div>
          )}
          {state.status === 'error' && (
            <div role="alert" className="border border-outline-variant bg-white px-5 py-6 text-[16px] text-on-surface-variant">
              <p>We could not load the module list.</p>
              <button type="button" onClick={retry} className="mt-3 min-h-11 font-semibold text-ink underline underline-offset-[6px] hover:decoration-accent hover:decoration-2">Try again</button>
            </div>
          )}
          {state.status === 'ready' && modules.length === 0 && (
            <p className="border border-outline-variant bg-white px-5 py-6 text-[16px] text-on-surface-variant">No modules are published yet.</p>
          )}
          {modules.length > 0 && (
            <ul aria-label="Modules you can choose" className="border border-outline-variant">
              {modules.map((m) => {
                const inc = result.included.get(m.key)
                return (
                  <ModuleRow key={m.key} m={m} chosen={chosen.includes(m.key)} note={inc ? inclusionNote(inc, m.name) : undefined} onToggle={() => setChosen((c) => toggle(modules, c, m.key))} />
                )
              })}
            </ul>
          )}
          {roadmap.length > 0 && (
            <div className="mt-6 bg-surface-container px-5 py-5">
              <h3 className={`${label} text-on-surface-variant`}>On the roadmap</h3>
              <p className="mt-2 font-display text-[20px] font-[680] leading-[1.3] text-muted">{roadmap.join(' · ')}</p>
              <p className="mt-2 text-[14px] text-muted">Not available yet, so they cannot be chosen.</p>
            </div>
          )}
        </div>
        <div className="border-t border-ink pt-5 lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:self-start lg:sticky lg:top-[96px]">
          <p aria-live="polite" className="text-[16px] font-semibold text-ink">
            {result.template ? `${result.template.name}: ${names.join(', ')}` : 'Nothing chosen yet.'}
          </p>
          <p className="mt-2 text-[16px] leading-[1.5] text-muted">{PRICE_LINE}</p>
          {href ? (
            <a href={href} className="mt-5 inline-flex min-h-12 items-center bg-accent px-[22px] text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-accent-strong active:translate-y-px">
              Set up with {result.template!.name}
            </a>
          ) : (
            <p className="mt-5 text-[14px] text-muted">Tick a module to see what comes with it.</p>
          )}
        </div>
      </div>
    </section>
  )
}
