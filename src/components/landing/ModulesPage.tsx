import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { SignupLink } from '@/components/landing/SignupLink'
import { ProductScreens } from '@/components/landing/HomePage/ProductScreens'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, CARD, H1, StatusBadge, Tick, type Status } from '@/components/landing/ui'
import { MODULES, countByStatus } from '@/lib/modules-content'

type Filter = 'all' | Status
const FILTERS: [Filter, string][] = [['all', 'All'], ['available', 'Available'], ['preview', 'Preview'], ['roadmap', 'On the roadmap']]
const h2 = 'text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.02em]'

const countFor = (f: Filter) => (f === 'all' ? MODULES.length : countByStatus(f))

export default function ModulesPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const shown = MODULES.filter((m) => filter === 'all' || m.status === filter)
  const cards = shown.filter((m) => m.status !== 'roadmap')
  const planned = shown.filter((m) => m.status === 'roadmap')

  return (
    <div className="flex-1 bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 pb-[clamp(48px,6vw,88px)] pt-[clamp(32px,5vw,64px)]">
        <div className="flex max-w-[760px] flex-col gap-2.5">
          <h1 className={H1}>Pick only what your business needs</h1>
          <p className="text-[1.125rem] leading-[1.55] text-ink-2">
            {MODULES.length} modules: {countByStatus('available')} available, {countByStatus('preview')} in preview, {countByStatus('roadmap')} on the roadmap. Pick only what you need.
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <SignupLink className={BUTTON_PRIMARY} />
            <p className="text-[0.9375rem] text-ink-3">Free during the pilot. No card needed.</p>
          </div>
        </div>

        <section aria-labelledby="mod-today" className={`${CARD} flex flex-col items-center gap-3 px-4 py-[clamp(1.25rem,3vw,2rem)]`}>
          <h2 id="mod-today" className={`${h2} text-center`}>The two Available modules, as they look today</h2>
          <div className="w-full max-w-[880px]"><ProductScreens variant="modules" /></div>
        </section>

        <div role="group" aria-label="Filter by state" className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(([id, label]) => {
            const on = id === filter
            return (
              <button
                key={id} type="button" aria-pressed={on} onClick={() => setFilter(id)}
                className={`inline-flex min-h-12 flex-none items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[0.9375rem] font-semibold ${on ? 'border-ink bg-ink text-paper' : 'border-line-control bg-paper text-ink'}`}
              >
                {on && <Tick className="size-4" />}
                {label} ({countFor(id)})
              </button>
            )
          })}
        </div>
        <p role="status" className="text-[0.9375rem] text-ink-3">Showing {shown.length} of {MODULES.length} modules</p>

        {cards.length > 0 && (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr))]">
            {cards.map((m) => (
              <article key={m.id} className={`${CARD} flex flex-col gap-3 p-[22px]`}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h2 className="text-[1.3125rem] leading-tight">{m.name}</h2>
                  <StatusBadge status={m.status} />
                </div>
                <p className="text-base leading-normal text-ink-2">{m.desc}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm leading-[1.45]">
                  <dt className="font-bold text-ink-3">Needs</dt><dd>{m.needs}</dd>
                  {m.missing && (<><dt className="font-bold text-amber-ink">Missing</dt><dd className="text-amber-ink">{m.missing}</dd></>)}
                  <dt className="font-bold text-ink-3">Screens</dt><dd className="text-ink-3">No screenshots yet</dd>
                </dl>
                <div className="mt-auto flex flex-col gap-2 pt-1.5">
                  {m.status === 'available' ? (
                    <Link to="/" hash="modules" className="flex min-h-12 items-center justify-center rounded-md bg-action text-[0.9375rem] font-semibold text-paper no-underline">Choose {m.short}</Link>
                  ) : (
                    <Link to="/roadmap" className="flex min-h-12 items-center justify-center rounded-md border border-line-control bg-paper text-[0.9375rem] font-semibold text-ink no-underline">See the roadmap</Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {planned.length > 0 && (
          <section aria-labelledby="rm-title" className="mt-5 flex flex-col gap-2.5">
            <h2 id="rm-title" className={h2}>Planned next</h2>
            <p className="mb-1.5 max-w-[680px] text-base leading-normal text-ink-2">No dates promised. Needs to be confirmed. No screenshots yet.</p>
            <Link to="/roadmap" className="inline-flex min-h-11 items-center self-start text-[0.9375rem] font-semibold">See the roadmap</Link>
            <ul className={CARD}>
              {planned.map((m, i) => (
                <li key={m.id} className={`flex flex-col gap-1 px-5 py-4 ${i ? 'border-t border-line-faint' : ''}`}>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <h3 className="text-[1.0625rem]">{m.name}</h3>
                    <StatusBadge status={m.status} />
                  </div>
                  <p className="text-[0.9375rem] leading-normal text-ink-2">{m.desc}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="Get started" className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-band p-[clamp(24px,4vw,44px)] text-on-band">
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
