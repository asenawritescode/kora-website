import { Link } from '@tanstack/react-router'
import { SignupLink } from '@/components/landing/SignupLink'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, H2, StatusBadge, Tick, type Status } from '@/components/landing/ui'

// Below the hero: who it is for, before and after, three steps, what works today,
// the rules, the price and the closing band. Every line is something the pilot
// does today or is marked as not yet; see the truthfulness table in kora-website#1.

const h2 = H2
const button = BUTTON_PRIMARY
const card = 'flex flex-col gap-3 rounded-xl border border-line bg-paper p-[clamp(1.5rem,3vw,2.25rem)]'

const SHOP_TYPES = ['Dukas', 'Minimarts', 'Kiosks', 'Hardware stores', 'Boutiques']

const SWAPS = [
  ['Counting stock at night', 'Stock updates with every sale'],
  ['Sales written in a notebook', 'Every sale saved, with the time and how it was paid'],
  ['Guessing what to restock', 'See how many of each product are left'],
  ['M-Pesa codes on scraps of paper', 'Type the M-Pesa code into the sale'],
]

const STEPS = [
  { title: 'Pick your business', text: 'Shops come with selling and stock ticked. Change anything.' },
  { title: 'Create your account', text: 'Your name, your shop’s name, email and a password.' },
  { title: 'Make your first sale', text: 'Add your products, open the till and sell.' },
]

const TODAY: { title: string; items: [string, Status][] }[] = [
  { title: 'Works today', items: [['Selling at the counter', 'available'], ['Stock that updates with every sale', 'available'], ['Cash sales', 'available'], ['M-Pesa and other mobile money, recorded by hand', 'available']] },
  { title: 'Not yet', items: [['Purchase orders and supplier bills', 'preview'], ['Card payments', 'roadmap'], ['Receipt printers', 'roadmap'], ['KRA eTIMS tax receipts', 'roadmap'], ['AI agents working in your workspace', 'roadmap']] },
]

export function HomeBody() {
  return (
    <>
      <section aria-labelledby="for-title" className="border-t border-line px-4 py-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-[18px] text-center">
          <h2 id="for-title" className={h2}>Made for shops like yours</h2>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {SHOP_TYPES.map((name) => (
              <li key={name} className="rounded-full bg-accent px-[18px] py-2.5 text-base font-semibold text-on-accent">{name}</li>
            ))}
          </ul>
          <p className="text-base text-ink-2">Run a café, pharmacy or wholesale business? <Link to="/industries" className="font-semibold">See what’s ready for you</Link></p>
        </div>
      </section>

      <section aria-labelledby="swap-title" className="bg-surface px-4 py-[clamp(3rem,6vw,5.5rem)]">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-6">
          <h2 id="swap-title" className={`${h2} text-center`}>From the notebook to your phone</h2>
          <div role="table" aria-label="Before and with Zana" className="overflow-hidden rounded-2xl border border-line bg-paper">
            <div role="row" className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] border-b border-line bg-surface-2 sm:grid-cols-2">
              <span role="columnheader" className="px-4 py-3 text-sm font-bold text-ink-3 sm:px-5">Before</span>
              <span role="columnheader" className="px-4 py-3 text-sm font-bold text-ink sm:px-5">With Zana</span>
            </div>
            {SWAPS.map(([before, after], i) => (
              <div key={before} role="row" className={`grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:grid-cols-2 ${i ? 'border-t border-line-faint' : ''}`}>
                <span role="cell" className="px-4 py-[18px] text-[clamp(1rem,1.6vw,1.125rem)] leading-snug text-ink-3 sm:px-5">{before}</span>
                <span role="cell" className="flex gap-2.5 px-4 py-[18px] text-[clamp(1rem,1.6vw,1.125rem)] font-semibold leading-snug sm:px-5">
                  <Tick className="mt-0.5" />
                  {after}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="steps-title" className="px-4 py-[clamp(3rem,6vw,5.5rem)]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-7">
          <h2 id="steps-title" className={h2}>Selling in three steps</h2>
          <ol className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2.5 border-t-[3px] border-ink pt-[18px]">
                <span className="font-display text-[2.5rem] font-bold leading-none">{i + 1}</span>
                <h3 className="text-xl">{s.title}</h3>
                <p className="text-base leading-normal text-ink-2">{s.text}</p>
              </li>
            ))}
          </ol>
          <SignupLink className={`${button} self-start`} />
        </div>
      </section>

      <section id="today" aria-labelledby="today-title" className="bg-surface px-4 py-[clamp(48px,6vw,88px)]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-7">
          <h2 id="today-title" className={`${h2} max-w-[720px]`}>What works today, and what doesn’t</h2>
          <div className="flex flex-wrap gap-5">
            {TODAY.map((col) => (
              <div key={col.title} className="flex flex-[1_1_340px] flex-col gap-1 rounded-2xl border border-line bg-paper p-[22px]">
                <h3 className="mb-2 text-[1.1875rem]">{col.title}</h3>
                {col.items.map(([text, status]) => (
                  <div key={text} className="flex flex-wrap items-center justify-between gap-2 border-t border-line-faint py-3">
                    <span className="flex-[1_1_200px] text-base leading-snug">{text}</span>
                    <StatusBadge status={status} />
                  </div>
                ))}
                {col.title === 'Not yet' && <Link to="/roadmap" className="mt-2 inline-flex min-h-11 items-center self-start text-[0.9375rem] font-semibold">See the roadmap</Link>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="rules-title" className="px-4 py-[clamp(3rem,6vw,5rem)]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-x-12 gap-y-6">
          <div className="flex flex-[1_1_320px] flex-col gap-2.5">
            <h2 id="rules-title" className={h2}>Your rules, for people and AI</h2>
            <Link to="/how-ai" className="inline-flex min-h-11 items-center self-start text-base font-semibold">How AI works with your tools</Link>
          </div>
          <ul className="flex flex-[2_1_420px] flex-col gap-3.5 text-[1.0625rem] leading-normal">
            <li><strong>Everyone gets a role.</strong> Staff, and later AI agents, can do only what their role allows.</li>
            <li><strong>Every action is logged.</strong> Who, what and when, in one place.</li>
            <li><strong>Risky actions wait for you.</strong> Voids, price changes and write-offs need your approval.</li>
            <li className="text-ink-2">AI agents are on the roadmap. No dates promised.</li>
          </ul>
        </div>
      </section>

      <section aria-label="Price and help" className="bg-surface px-4 py-[clamp(3rem,6vw,5rem)]">
        <div className="mx-auto grid max-w-[1200px] gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          <div className={card}>
            <h2 className={h2}>Free during the pilot</h2>
            <p className="text-[1.0625rem] leading-[1.55] text-ink-2">
              The catch: none. You’ll see prices before the pilot ends, and nothing is charged unless you agree.
            </p>
            <Link to="/pricing" className="inline-flex min-h-11 items-center self-start text-base font-semibold">Pricing questions</Link>
          </div>
          <div className={card}>
            <h2 className={h2}>Talk to a person</h2>
            <p className="text-[1.0625rem] leading-[1.55] text-ink-2">Not sure Zana fits your shop? Ask the team in Nairobi.</p>
            <Link to="/contact" className={`${BUTTON_SECONDARY} self-start`}>Contact us</Link>
          </div>
        </div>
      </section>

    </>
  )
}

export function ClosingBand() {
  return (
    <section aria-labelledby="world-title" className="bg-accent px-4 py-[clamp(3.5rem,7vw,6.5rem)] text-on-accent">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-[18px] text-center">
        <h2 id="world-title" className="text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.02]">From Nairobi to the world</h2>
        <p className="max-w-[560px] text-[1.125rem] leading-[1.55]">Start with your shop today. Add more as Zana grows.</p>
        <SignupLink className="flex min-h-[52px] items-center rounded-md bg-band px-6 text-base font-semibold text-on-band no-underline" />
      </div>
    </section>
  )
}
