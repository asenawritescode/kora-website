import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { SignupLink } from '@/components/landing/SignupLink'
import { ProductScreens } from '@/components/landing/HomePage/ProductScreens'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, CARD, H1, StatusBadge, Tick, type Status } from '@/components/landing/ui'
import { INDUSTRIES, industrySlug, inPreset } from '@/lib/industries-content'
import { groupByJob, type ModuleInfo } from '@/lib/live-catalog'
import { industryFor } from '@/lib/picker-preset'
import { useCatalog } from '@/lib/use-catalog'
import { usePhone } from '@/lib/use-phone'

type Filter = 'all' | Status
const FILTERS: [Filter, string][] = [['all', 'All'], ['available', 'Available'], ['preview', 'Preview'], ['roadmap', 'On the roadmap']]
const h2 = 'text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.02em]'

// How the design words the button for a module: "Choose point of sale".
const SHORT: Record<string, string> = { pos: 'point of sale', inventory: 'inventory' }

const countByStatus = (modules: ModuleInfo[], status: Status) => modules.filter((m) => m.status === status).length

export default function ModulesPage() {
  const { modules: MODULES, source } = useCatalog()
  const [filter, setFilter] = useState<Filter>('all')
  // "For my business" keeps the modules a kind of business starts with. A link can set it: /modules?for=retail-and-general-shops.
  const [business, setBusiness] = useState(() => {
    const asked = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('for')
    return industryFor(asked) ? asked! : ''
  })
  const scope = inPreset(industryFor(business), MODULES)
  const countFor = (f: Filter) => (f === 'all' ? scope.length : countByStatus(scope, f))
  const phone = usePhone()
  // null follows the screen (closed on a phone, open elsewhere) until the visitor toggles it.
  const [plannedOpen, setPlannedOpen] = useState<boolean | null>(null)
  const shown = scope.filter((m) => filter === 'all' || m.status === filter)
  const cards = shown.filter((m) => m.status !== 'roadmap')
  const planned = shown.filter((m) => m.status === 'roadmap')

  return (
    <div className="flex-1 bg-surface" data-catalog-source={source}>
      <div className="mx-auto flex max-w-[1232px] flex-col gap-6 px-4 pb-[clamp(56px,6vw,88px)] pt-[clamp(32px,5vw,64px)]">
        <div className="flex max-w-[760px] flex-col gap-2.5">
          <h1 className={H1}>Pick only what your business needs</h1>
          <p className="text-[1.125rem] leading-[1.55] text-ink-2">
            {MODULES.length} modules: {countByStatus(MODULES, 'available')} available, {countByStatus(MODULES, 'preview')} in preview, {countByStatus(MODULES, 'roadmap')} on the roadmap. Pick only what you need.
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <SignupLink className={BUTTON_PRIMARY} />
            <p className="text-[0.9375rem] text-ink-3">Free during the pilot. No card needed.</p>
          </div>
        </div>

        <section aria-labelledby="mod-today" className="flex flex-col items-center gap-3 py-2">
          <h2 id="mod-today" className={`${h2} text-center`}>The two Available modules, as they look today</h2>
          <div className="w-full max-w-[880px]"><ProductScreens variant="modules" autoplay={false} /></div>
        </section>

        <label className="flex flex-col gap-1.5 text-[0.9375rem] font-bold sm:flex-row sm:items-center sm:gap-3">
          For my business
          <select
            value={business} onChange={(e) => setBusiness(e.target.value)}
            className="min-h-11 min-w-0 rounded-md border border-line-control bg-paper px-3 text-base font-normal text-ink sm:w-[320px]"
          >
            <option value="">Any kind of business</option>
            {INDUSTRIES.map((i) => <option key={i.name} value={industrySlug(i)}>{i.name}</option>)}
          </select>
        </label>

        <div role="group" aria-label="Filter by state" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {FILTERS.map(([id, label]) => {
            const on = id === filter
            return (
              <button
                key={id} type="button" aria-pressed={on} onClick={() => setFilter(id)}
                className={`inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border px-3.5 text-[0.9375rem] font-semibold transition-colors duration-200 sm:flex-none ${on ? 'border-ink bg-ink text-paper' : 'border-line-control bg-paper text-ink'}`}
              >
                <span aria-hidden="true" className={`grid transition-[grid-template-columns,opacity] duration-200 ease-out ${on ? 'grid-cols-[1fr] opacity-100' : 'grid-cols-[0fr] opacity-0'}`}>
                  <span className="overflow-hidden"><Tick className="mr-1.5 size-4" /></span>
                </span>
                {label} ({countFor(id).toLocaleString('en-US')})
              </button>
            )
          })}
        </div>
        {source === 'fallback' && <p role="alert" className="text-[0.9375rem] text-amber-ink">Live status could not be loaded, so this is the last published list. Try again shortly.</p>}
        <p role="status" className="text-[0.9375rem] text-ink-3">Showing {shown.length.toLocaleString('en-US')} of {MODULES.length.toLocaleString('en-US')} modules</p>

        {groupByJob(cards).map((group) => group.modules.length > 0 && (
          <section key={group.job ?? 'all'} aria-label={group.job} className="flex flex-col gap-3">
            {group.job && <h2 className={h2}>{group.job}</h2>}
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr))]">
              {group.modules.map((m) => (
                <article key={m.id} className={`${CARD} flex flex-col gap-3 p-[22px]`}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    {group.job ? <h3 className="text-[1.3125rem] leading-tight">{m.name}</h3> : <h2 className="text-[1.3125rem] leading-tight">{m.name}</h2>}
                    <StatusBadge status={m.status} />
                  </div>
                  <p className="text-base leading-normal text-ink-2">{m.desc}</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm leading-[1.45]">
                    <dt className="font-bold text-ink-3">Needs</dt><dd>{m.needs}</dd>
                    {m.missing && (<><dt className="font-bold text-amber-ink">Missing</dt><dd className="text-amber-ink">{m.missing}</dd></>)}
                    {m.status !== 'available' && (<><dt className="font-bold text-ink-3">Screens</dt><dd className="text-ink-3">No screenshots yet</dd></>)}
                  </dl>
                  <div className="mt-auto flex flex-col gap-2 pt-1.5">
                    {m.status === 'available' ? (
                      <Link to="/start" className="flex min-h-12 items-center justify-center rounded-md border border-line-control bg-paper text-[0.9375rem] font-semibold text-ink no-underline">Choose {SHORT[m.id] ?? m.name.toLowerCase()}</Link>
                    ) : (
                      <Link to="/roadmap" className="flex min-h-12 items-center justify-center rounded-md border border-line-control bg-paper text-[0.9375rem] font-semibold text-ink no-underline">See the roadmap</Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {planned.length > 0 && (
          <details
            open={plannedOpen ?? !phone}
            onToggle={(e) => { if (e.currentTarget.open !== (plannedOpen ?? !phone)) setPlannedOpen(e.currentTarget.open) }}
            className="mt-5"
          >
            <summary className="flex min-h-12 cursor-pointer items-center">
              <h2 id="rm-title" className={h2}>Planned next</h2>
            </summary>
            <div className="flex flex-col gap-2.5 pt-2.5">
              <p className="mb-1.5 max-w-[680px] text-base leading-normal text-ink-2">No dates promised. Needs to be confirmed. No screenshots yet.</p>
              <Link to="/roadmap" className="inline-flex min-h-11 items-center self-start text-[0.9375rem] font-semibold">See the roadmap</Link>
              {groupByJob(planned).map((group) => (
                <div key={group.job ?? 'all'} className="flex flex-col gap-2">
                  {group.job && <h3 className="mt-2 text-[1.25rem] font-bold">{group.job}</h3>}
                  <ul className={CARD}>
                    {group.modules.map((m, i) => (
                      <li key={m.id} className={`flex flex-col gap-1 px-5 py-4 ${i ? 'border-t border-line-faint' : ''}`}>
                        {group.job ? <h4 className="text-[1.0625rem]">{m.name} <StatusBadge status={m.status} quiet /></h4> : <h3 className="text-[1.0625rem]">{m.name} <StatusBadge status={m.status} quiet /></h3>}
                        <p className="text-base leading-normal text-ink-2">{m.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        )}

        <section aria-label="Get started" className="on-band mt-6 flex flex-wrap items-center justify-between gap-5 rounded-xl bg-band p-[clamp(24px,4vw,44px)] text-on-band">
          <div className="flex flex-[1_1_360px] flex-col gap-2">
            <h2 className="text-[clamp(1.625rem,3vw,2.25rem)] tracking-[-0.02em]">Start with what works today</h2>
            <p className="text-base leading-normal text-on-band-2">Sales and point of sale includes Inventory and stock.</p>
          </div>
          <SignupLink className="flex min-h-[52px] items-center rounded-md bg-accent px-6 text-base font-bold text-on-accent no-underline" />
        </section>
      </div>
    </div>
  )
}
