import { Link } from '@tanstack/react-router'
import { CARD, H1 } from '@/components/landing/ui'
import { ICONS, INDUSTRIES, industrySlug, presetModules, readyModules } from '@/lib/industries-content'

// A ruled list rather than a grid of identical cards: the ready count carries the
// weight, Retail (the only preset with its own page) leads, and presets with
// nothing ready are quieter.
export default function IndustriesPage() {
  return (
    <div className="flex-1 bg-surface">
      <div className="mx-auto flex max-w-[1232px] flex-col gap-7 px-4 pb-[clamp(48px,6vw,88px)] pt-[clamp(32px,5vw,64px)]">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-[1_1_520px] flex-col gap-2.5">
            <h1 className={H1}>Start from your kind of business</h1>
            <p className="text-[1.125rem] leading-[1.55] text-ink-2">A starting point, not a separate product: preset modules and your own words. Change anything.</p>
          </div>
          <div className={`${CARD} flex flex-[1_1_300px] flex-col gap-2 p-4`}>
            <span className="text-[0.8125rem] font-bold text-ink-3">Each starting point gives you</span>
            <span className="text-[0.9375rem]">Preset modules</span>
            <span className="text-[0.9375rem]">Your words: Product, not Item</span>
            <span className="text-[0.9375rem]">Your day, step by step</span>
          </div>
        </div>

        <ul className={`${CARD} overflow-hidden`}>
          {INDUSTRIES.map((industry, idx) => {
            const ready = readyModules(industry)
            const total = presetModules(industry).length
            const lead = idx === 0
            const none = ready.length === 0
            const row = `grid min-h-12 items-center gap-x-6 gap-y-1 px-5 py-4 text-ink no-underline sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_9.5rem] ${lead ? 'bg-ok-wash py-6' : idx ? 'border-t border-line-faint' : ''}`
            const body = (
              <>
                <h2 className={`flex min-w-0 items-center gap-3 leading-tight ${lead ? 'text-xl' : 'text-lg'} ${none ? 'text-ink-3' : ''}`}>
                  <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true" className="flex-none text-ink-3">
                    <path d={ICONS[industry.icon]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="min-w-0">{industry.name}</span>
                </h2>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className={`text-sm ${none ? 'text-ink-3' : 'text-ink-2'}`}>
                    <strong className={none ? 'text-ink-3' : 'text-ok-ink'}>{ready.length} of {total}</strong> preset modules {ready.length === 1 ? 'works' : 'work'} today
                  </span>
                  <span className="line-clamp-2 text-sm leading-[1.45] text-ink-3">
                    {ready.length ? `Ready: ${ready.map((m) => m.name).join(', ')}.` : 'Nothing in this preset works yet.'}
                  </span>
                </div>
                <span className={`text-[0.9375rem] font-semibold sm:text-right ${none ? 'text-ink-3' : 'text-action'}`}>
                  {lead ? 'See what’s ready' : ready.length ? 'Start with this preset' : 'See the plan'}
                </span>
              </>
            )
            return (
              <li key={industry.name}>
                {lead ? <Link to="/industries/retail" className={row}>{body}</Link>
                  : ready.length ? <Link to="/start" search={{ for: industrySlug(industry) }} className={row}>{body}</Link>
                  : <Link to="/roadmap" className={row}>{body}</Link>}
              </li>
            )
          })}
        </ul>

        <p className="text-[0.9375rem] text-ink-3">
          Don’t see your business? <Link to="/start" className="font-semibold">Start from scratch</Link> and pick the modules yourself, or <Link to="/contact" className="font-semibold">talk to the team</Link>.
        </p>
      </div>
    </div>
  )
}
