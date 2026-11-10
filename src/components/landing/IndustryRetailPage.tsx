import { Link } from '@tanstack/react-router'
import { SignupLink } from '@/components/landing/SignupLink'
import { ProductScreens } from '@/components/landing/HomePage/ProductScreens'
import { BUTTON_PRIMARY, CARD, H1, StatusBadge, Tick } from '@/components/landing/ui'
import { INDUSTRIES, RETAIL, presetModules, readyModules } from '@/lib/industries-content'

const industry = INDUSTRIES[0]
const h2 = 'text-[clamp(1.625rem,3vw,2.25rem)] tracking-[-0.02em]'

export default function IndustryRetailPage() {
  const modules = presetModules(industry)
  const ready = readyModules(industry).length

  return (
    <>
      <section className="bg-surface px-4 pb-[clamp(36px,5vw,64px)] pt-[clamp(28px,4vw,56px)]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
            <Link to="/industries" className="inline-flex min-h-11 items-center">Industries</Link> / <span aria-current="page">{industry.name}</span>
          </nav>
          <div className="flex max-w-[760px] flex-col gap-3">
            <h1 className={H1}>Zana for {industry.name.toLowerCase()}</h1>
            <p className="max-w-[640px] text-[1.125rem] leading-[1.55] text-ink-2">
              {RETAIL.intro} <strong className="text-ink">{ready} of the {modules.length} modules in this preset work today.</strong>
            </p>
            <div className="mt-1 flex flex-wrap gap-3">
              <SignupLink className={BUTTON_PRIMARY}>Start with this preset</SignupLink>
              <a href="#day" className="flex min-h-[52px] items-center px-0 text-base font-semibold sm:px-[18px]">See the day it supports</a>
            </div>
            <p className="text-[0.9375rem] text-ink-3">Free during the pilot. No card needed.</p>
          </div>
        </div>
      </section>

      <section aria-label="What it looks like" className="px-4 pt-[clamp(2rem,5vw,4rem)]">
        <div className="mx-auto max-w-[880px]"><ProductScreens autoplay={false} /></div>
      </section>

      <section aria-labelledby="preset-title" className="mx-auto flex max-w-[1232px] flex-wrap gap-8 px-4 py-[clamp(56px,5vw,72px)]">
        <div className="flex flex-[2_1_480px] flex-col gap-3">
          <h2 id="preset-title" className={h2}>Modules in this preset</h2>
          <p className="text-base text-ink-2">Ready modules come ticked. The rest are coming.</p>
          {modules.map((m) => {
            const on = m.status === 'available'
            return (
              <div key={m.id} className={`flex flex-wrap items-center gap-x-3.5 gap-y-2 rounded-xl border border-line px-4 py-3.5 ${on ? 'bg-ok-wash' : 'bg-paper'}`}>
                <span aria-hidden="true" className={`flex size-7 flex-none items-center justify-center rounded-lg border-2 text-paper ${on ? 'border-action bg-action' : 'border-line-strong bg-paper'}`}>
                  {on && <Tick className="size-4" />}
                </span>
                <div className="flex flex-[1_1_220px] flex-col gap-0.5">
                  <strong className="text-base">{m.name}</strong>
                  <span className="text-sm text-ink-2">{RETAIL.note(m.status, m.name)}</span>
                </div>
                <StatusBadge status={m.status} />
              </div>
            )
          })}
        </div>
        <div className="flex flex-[1_1_300px] flex-col gap-3">
          <h2 className={h2}>Your words</h2>
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full border-collapse text-[0.9375rem]">
              <thead>
                <tr className="bg-surface">
                  <th scope="col" className="px-3.5 py-3 text-left text-[0.8125rem] text-ink-3">Usually called</th>
                  <th scope="col" className="px-3.5 py-3 text-left text-[0.8125rem] text-ink-3">In your shop</th>
                </tr>
              </thead>
              <tbody>
                {RETAIL.words.map(([from, to]) => (
                  <tr key={from} className="border-t border-line"><td className="p-3.5 text-ink-2">{from}</td><td className="p-3.5 font-bold">{to}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="day" aria-labelledby="day-title" className="bg-surface px-4 py-[clamp(56px,5vw,72px)]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
          <h2 id="day-title" className={h2}>The day it supports</h2>
          <ol className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr))]">
            {RETAIL.day.map(([title, text], i) => (
              <li key={title} className={`${CARD} flex flex-col gap-2.5 p-[18px]`}>
                <span className="flex items-center gap-3">
                  <span className="flex size-9 flex-none items-center justify-center rounded-full bg-ink font-bold text-paper">{i + 1}</span>
                  <strong className="text-[1.125rem]">{title}</strong>
                </span>
                <span className="self-start"><StatusBadge status="available" /></span>
                <span className="text-[0.9375rem] leading-normal text-ink-2">{text}</span>
              </li>
            ))}
          </ol>
          <div className={`${CARD} flex gap-2.5 px-4 py-3.5 text-[0.9375rem] leading-normal`}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="flex-none text-slate">
              <path d="M10 3a7 7 0 1 1 0 14a7 7 0 1 1 0-14M10 9v5 M10 6.5v.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span><strong>Not supported yet:</strong> card payments, receipt printers and KRA eTIMS tax receipts.</span>
          </div>
        </div>
      </section>

      <section aria-label="Get started" className="px-4 py-[clamp(56px,5vw,72px)]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-5 rounded-xl bg-accent p-[clamp(24px,4vw,44px)] text-on-accent">
          <div className="flex flex-[1_1_360px] flex-col gap-1.5">
            <h2 className="text-[clamp(1.625rem,3vw,2.25rem)]">Open your till this week</h2>
            <p className="text-base">Free during the pilot. Change modules anytime.</p>
          </div>
          <SignupLink className="flex min-h-[52px] items-center rounded-md bg-band px-6 text-base font-bold text-on-band no-underline">Start with this preset</SignupLink>
        </div>
      </section>
    </>
  )
}
