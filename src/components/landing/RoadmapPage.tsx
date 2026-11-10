import { SignupLink } from '@/components/landing/SignupLink'
import { CARD, H1, StatusBadge } from '@/components/landing/ui'
import { LANES, type Lane } from '@/lib/modules-content'

const RAIL: Record<Lane['status'], string> = { available: 'border-action text-action', preview: 'border-amber-ink text-amber-ink', roadmap: 'border-line-strong text-ink-3' }

// What works now, what is being built and what is planned. No dates, no email
// capture: there is no endpoint to send roadmap updates yet.
export default function RoadmapPage() {
  return (
    <div className="flex-1 bg-surface">
      <div className="mx-auto flex max-w-[1232px] flex-col gap-8 px-4 pb-[clamp(3.5rem,6vw,5.5rem)] pt-[clamp(2rem,5vw,4.5rem)]">
        <div className="flex max-w-[560px] flex-col gap-2.5">
          <h1 className={H1}>Roadmap</h1>
          <p className="text-[1.125rem] leading-[1.55] text-ink-2">What works now, what’s being built and what’s planned. Order may change. No dates promised.</p>
        </div>

        <ol aria-label="Roadmap stages" className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr))]">
          {LANES.map((lane) => (
            <li key={lane.title} className="flex min-w-0 flex-col gap-3">
              <div className={`flex flex-col gap-2 border-t-[3px] pt-3.5 ${(RAIL[lane.status] ?? RAIL.roadmap).split(' ')[0]}`}>
                <h2 className="text-[1.375rem] tracking-[-0.01em] text-ink">{lane.title}</h2>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <StatusBadge status={lane.status} />
                  <span className="text-sm text-ink-3">{lane.sub}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-2">
                {lane.items.map((item) => (
                  <li key={item.name} className={`${CARD} flex flex-col gap-1 px-4 py-3.5`}>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3 className="text-base leading-snug">{item.name}</h3>
                      {item.feature && <span className="rounded-full border border-line-2 px-2 py-px text-xs font-semibold text-ink-3">Feature</span>}
                    </div>
                    <p className="text-base leading-[1.45] text-ink-2">{item.desc}</p>
                    {item.missing && <p className="text-base leading-[1.45] text-amber-ink"><strong>Missing:</strong> {item.missing}</p>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <section aria-label="Get started" className="on-band flex flex-wrap items-center justify-between gap-5 rounded-xl bg-band p-[clamp(1.5rem,4vw,2.75rem)] text-on-band">
          <div className="flex flex-[1_1_360px] flex-col gap-1.5">
            <h2 className="text-[clamp(1.625rem,3vw,2.25rem)] tracking-[-0.02em]">Start with what works today</h2>
            <p className="text-base text-on-band-2">Free during the pilot.</p>
          </div>
          <SignupLink className="flex min-h-[52px] items-center rounded-md bg-accent px-6 text-base font-bold text-on-accent no-underline" />
        </section>
      </div>
    </div>
  )
}
