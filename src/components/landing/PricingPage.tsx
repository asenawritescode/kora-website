import { SignupLink } from '@/components/landing/SignupLink'
import { BUTTON_PRIMARY, CARD, Tick } from '@/components/landing/ui'

const INCLUDED = [
  'Every Available module: today, Sales and point of sale, and Inventory and stock',
  'New modules as they become Available',
  'The activity log',
]

const FAQ = [
  ['What’s the catch?', 'None. Everything Available is free during the pilot. When prices are set you’ll get notice first, and you can stop at any time.'],
  ['When does the pilot end?', 'No date is set. You’ll get notice and prices before it ends.'],
  ['Do I need payment details?', 'No. Sign-up asks for your name, a workspace name, email and password.'],
  ['What if I don’t want to pay later?', 'You can stop using Zana at any time.'],
  ['Are Preview modules included?', 'Not yet. When one becomes Available during the pilot, it’s free to add.'],
]

export default function PricingPage() {
  return (
    <div className="flex-1 bg-surface">
      <div className="mx-auto flex max-w-[1000px] flex-col gap-8 px-4 pb-[clamp(48px,6vw,88px)] pt-[clamp(32px,5vw,72px)]">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.04]">Free during the pilot</h1>
          <p className="max-w-[600px] text-[1.125rem] leading-[1.55] text-ink-2">You’ll see prices before the pilot ends, with time to decide.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <SignupLink className={BUTTON_PRIMARY} />
          </div>
          <p className="text-[0.9375rem] text-ink-3">Free during the pilot. No card needed.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-[3_1_420px] flex-col gap-4 rounded-2xl border-2 border-action bg-paper p-[clamp(22px,3.4vw,36px)]">
            <h2 className="text-[2.125rem] leading-[1.1] tracking-[-0.02em]">What’s included</h2>
            <span className="text-base text-ink-2">No payment details needed to sign up.</span>
            <ul className="flex flex-col gap-2.5">
              {INCLUDED.map((text) => (
                <li key={text} className="flex gap-2.5 text-base leading-[1.45]"><Tick className="text-action" />{text}</li>
              ))}
            </ul>
            <SignupLink className={`${BUTTON_PRIMARY} justify-center`} />
          </div>
          <div className={`${CARD} flex flex-[2_1_280px] flex-col gap-3.5 p-[clamp(22px,3.4vw,36px)]`}>
            <h2 className="text-[1.75rem] leading-[1.15] tracking-[-0.02em]">After the pilot: to be announced</h2>
            <p className="text-base leading-[1.55] text-ink-2">Prices aren’t set yet. When they are, they’ll be here in full. No hidden totals.</p>
            <p className="text-base leading-[1.55] text-ink-2">Nothing is charged unless you agree.</p>
          </div>
        </div>

        <section aria-labelledby="pq" className="flex flex-col gap-3">
          <h2 id="pq" className="mb-1.5 text-[clamp(1.625rem,3vw,2.25rem)] tracking-[-0.02em]">Pricing questions</h2>
          {FAQ.map(([q, a]) => (
            <details key={q} className={`${CARD} px-[18px]`}>
              <summary className="flex min-h-14 cursor-pointer items-center text-[1.0625rem] font-semibold">{q}</summary>
              <p className="mb-[18px] text-base leading-[1.55] text-ink-2">{a}</p>
            </details>
          ))}
        </section>
      </div>
    </div>
  )
}
