import { SignupLink } from '@/components/landing/SignupLink'
import { BUTTON_PRIMARY, CARD, StatusBadge } from '@/components/landing/ui'

const h2 = 'text-[clamp(1.625rem,3vw,2.375rem)] tracking-[-0.02em]'

type Kind = 'yes' | 'no' | 'log' | 'wait'
const KIND: Record<Kind, { box: string; icon: string }> = {
  yes: { box: 'bg-ok-tint text-ok-ink', icon: 'M4.5 10.5l3.5 3.5 7.5-8' },
  no: { box: 'bg-red-tint text-red', icon: 'M5.5 5.5l9 9 M14.5 5.5l-9 9' },
  log: { box: 'bg-slate-tint text-slate', icon: 'M10 4v6l4 2' },
  wait: { box: 'bg-amber-tint text-amber-ink', icon: 'M10 4v6l4 2' },
}

type Rule = { title: string; text: string; cardTitle: string; surface: boolean; approve?: boolean; lines: [Kind, string, string][] }

const RULES: Rule[] = [
  { title: 'An agent gets a role, like any staff member', text: 'You choose the role. The agent can do what that role allows, nothing more.', cardTitle: 'Role: Stock clerk', surface: false,
    lines: [['yes', 'Count stock', 'Allowed'], ['yes', 'Add stock that arrived', 'Allowed'], ['no', 'Change prices', 'Not allowed'], ['no', 'Void a sale', 'Not allowed']] },
  { title: 'Everything goes into one activity log', text: 'Every action is recorded: who, what and when. One log for people and agents.', cardTitle: 'Activity log', surface: true,
    lines: [['log', 'Amina (Owner) opened the till', '09:02'], ['log', 'Kevin (Cashier) sold 3 items', '09:14'], ['log', 'Stock agent counted 40 products', '10:30']] },
  { title: 'Risky actions wait for a person', text: 'Voids, price changes and stock write-offs wait for a person to approve.', cardTitle: 'Waiting for approval', surface: false, approve: true,
    lines: [['wait', 'Stock agent wants to write off 2 trays of eggs (damaged)', '11:40']] },
]

const FAQ = [
  ['Can an agent do something my staff can’t?', 'No. An agent gets a role, with the same limits as a person in it.'],
  ['Will I see what an agent did?', 'Yes. Agent actions go in the same activity log, with the time and role.'],
  ['When can I use agents?', 'It’s on the roadmap, with no dates promised. See the roadmap page.'],
]

export default function HowAiPage() {
  return (
    <>
      <section className="bg-surface px-4 py-[clamp(32px,5vw,72px)]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
          <h1 className="max-w-[820px] text-[clamp(2.125rem,4.8vw,3.75rem)] leading-[1.05]">How AI works with your tools</h1>
          <p className="max-w-[680px] text-[1.125rem] leading-[1.55] text-ink-2">People use Zana through screens. AI agents will follow the same rules.</p>
          <div role="note" className="flex max-w-[720px] gap-3 rounded-xl bg-slate-tint p-4">
            <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true" className="flex-none text-slate">
              <path d="M5 17.5V3h9l-2 3.25L14 9.5H5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-base leading-normal"><strong>Agent access is on the roadmap.</strong> No dates promised. Here are the rules agents will follow.</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="two-ways" className="mx-auto flex max-w-[1232px] flex-col gap-6 px-4 py-[clamp(40px,5vw,80px)]">
        <h2 id="two-ways" className={h2}>Built once, used two ways</h2>
        <div className="flex flex-wrap items-stretch gap-4">
          <div className={`${CARD} flex flex-[1_1_240px] flex-col gap-2 p-5`}>
            <strong className="text-[1.125rem]">People</strong>
            <span className="text-[0.9375rem] leading-normal text-ink-2">Use screens on a phone or computer.</span>
            <span className="self-start"><StatusBadge status="available" /></span>
          </div>
          <div className={`${CARD} flex flex-[1_1_240px] flex-col gap-2 p-5`}>
            <strong className="text-[1.125rem]">AI agents</strong>
            <span className="text-[0.9375rem] leading-normal text-ink-2">Use the same actions, without screens.</span>
            <span className="self-start"><StatusBadge status="roadmap" /></span>
          </div>
          <div className="flex flex-[2_1_380px] flex-col gap-2.5 rounded-xl bg-band p-5 text-on-band">
            <strong className="text-[1.125rem]">Both go through the same three things</strong>
            <ol className="text-[0.9375rem] leading-[1.6] text-on-band-2">
              <li>1. The role’s permissions</li>
              <li>2. Approval, if the action is risky</li>
              <li>3. One activity log: who, what and when</li>
            </ol>
          </div>
        </div>
      </section>

      {RULES.map((r) => (
        <section key={r.title} className={`px-4 py-[clamp(40px,5vw,72px)] ${r.surface ? 'bg-surface' : ''}`}>
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-8">
            <div className="flex flex-[1_1_400px] flex-col gap-3">
              <h2 className={h2}>{r.title}</h2>
              <p className="text-[1.0625rem] leading-[1.55] text-ink-2">{r.text}</p>
            </div>
            <figure className={`${CARD} flex-[1_1_420px] overflow-hidden shadow-[0_10px_28px_color-mix(in_srgb,var(--color-ink)_6%,transparent)]`}>
              <div className="flex justify-between gap-2 border-b border-line px-[18px] py-3">
                <strong className="text-[0.9375rem]">{r.cardTitle}</strong>
                <span className="text-xs font-semibold text-ink-3">Example</span>
              </div>
              {r.lines.map(([kind, text, meta]) => (
                <div key={text} className="flex items-center gap-2.5 border-b border-line-faint px-[18px] py-3 text-[0.9375rem]">
                  <span className={`flex size-6 flex-none items-center justify-center rounded-md ${KIND[kind].box}`}>
                    <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
                      <path d={KIND[kind].icon} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="flex-1">{text}</span>
                  <span className="text-[0.8125rem] font-semibold text-ink-3">{meta}</span>
                </div>
              ))}
              {r.approve && (
                <div aria-hidden="true" className="flex flex-wrap gap-2 px-[18px] py-3.5">
                  <span className="flex min-h-12 flex-[1_1_120px] items-center justify-center rounded-md bg-action text-[0.9375rem] font-semibold text-paper">Approve write-off</span>
                  <span className="flex min-h-12 flex-[1_1_120px] items-center justify-center rounded-md border border-line-control bg-paper text-[0.9375rem] font-semibold">Decline</span>
                </div>
              )}
            </figure>
          </div>
        </section>
      ))}

      <section aria-labelledby="faq" className="mx-auto flex max-w-[860px] flex-col gap-3 px-4 py-[clamp(40px,5vw,80px)]">
        <h2 id="faq" className={`${h2} mb-2`}>Questions owners ask</h2>
        {FAQ.map(([q, a]) => (
          <details key={q} className={`${CARD} px-[18px]`}>
            <summary className="flex min-h-14 cursor-pointer items-center text-[1.0625rem] font-semibold">{q}</summary>
            <div className="pb-[18px]"><p className="text-base leading-[1.55] text-ink-2">{a}</p></div>
          </details>
        ))}
        <SignupLink className={`${BUTTON_PRIMARY} mt-3 self-start px-6`} />
      </section>
    </>
  )
}
