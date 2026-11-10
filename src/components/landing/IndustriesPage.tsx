import { Link } from '@tanstack/react-router'
import { CARD, H1 } from '@/components/landing/ui'
import { ICONS, INDUSTRIES, industrySlug, presetModules, readyModules } from '@/lib/industries-content'

export default function IndustriesPage() {
  return (
    <div className="flex-1 bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-7 px-4 pb-[clamp(48px,6vw,88px)] pt-[clamp(32px,5vw,64px)]">
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

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr))]">
          {INDUSTRIES.map((industry, idx) => {
            const ready = readyModules(industry)
            const total = presetModules(industry).length
            const cardClass = `${CARD} flex min-h-12 flex-col gap-3 p-[18px] text-ink no-underline`
            const body = (
              <>
                <span className="flex size-11 items-center justify-center rounded-lg bg-ok-tint text-ok-ink">
                  <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
                    <path d={ICONS[industry.icon]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h2 className="text-lg leading-tight">{industry.name}</h2>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm text-ink-2">
                    <strong className="text-ok-ink">{ready.length} of {total}</strong> preset modules {ready.length === 1 ? 'works' : 'work'} today
                  </span>
                  <span className="text-sm leading-[1.45] text-ink-3">
                    {ready.length ? `Ready: ${ready.map((m) => m.name).join(', ')}.` : 'Nothing in this preset works yet.'}
                  </span>
                </div>
                <span className="mt-auto text-[0.9375rem] font-semibold text-action">
                  {idx === 0 ? 'See what’s ready' : ready.length ? 'Start with this preset' : 'See the plan'}
                </span>
              </>
            )
            if (idx === 0) return <Link key={industry.name} to="/industries/retail" className={cardClass}>{body}</Link>
            return ready.length
              ? <Link key={industry.name} to="/start" search={{ for: industrySlug(industry) }} className={cardClass}>{body}</Link>
              : <Link key={industry.name} to="/roadmap" className={cardClass}>{body}</Link>
          })}
        </div>

        <p className="text-[0.9375rem] text-ink-3">
          Don’t see your business? <Link to="/start" className="font-semibold">Start from scratch</Link> and pick the modules yourself, or <Link to="/contact" className="font-semibold">talk to the team</Link>.
        </p>
      </div>
    </div>
  )
}
