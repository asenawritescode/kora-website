import { Link } from '@tanstack/react-router'
import { BRAND } from '@/lib/brand'
import { SignupLink } from '@/components/landing/SignupLink'
import { PRICE_LINE } from '@/lib/pilot'

// Below the picker: what works today (real captures), how setup goes, where it
// runs, and one closing action. Every line is something the pilot does today;
// see the truthfulness table in kora-website#1.

const h2 = 'font-display text-[clamp(32px,3.6vw,52px)] font-[740] leading-[1.02] tracking-[-0.025em] text-ink [text-wrap:balance]'
const wrap = 'max-w-[1200px] mx-auto px-4 sm:px-6 py-[clamp(48px,6vw,88px)]'
const textLink = 'inline-flex min-h-12 items-center font-semibold text-ink underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] hover:decoration-action hover:decoration-2'

const TODAY = [
  ['Sales at the counter', 'Each sale gets a number, a total in KES and the till session it was rung up in. Cash is taken at the till; mobile-money payments are recorded by hand.'],
  ['Stock that moves with each sale', 'Every item has a count for each location and a reorder level, so low stock shows up.'],
  ['An owner dashboard', "Today's totals, recent sales, payments by method and items running low."],
  ['Your team, with set access', 'Invite staff and choose what each person can see and change.'],
]

const STEPS = [
  { title: 'Choose your modules', body: 'Pick what your shop needs above. Kigae shows what comes with it and why.' },
  { title: 'Create your account', body: `Sign up on ${BRAND} Cloud with your name, email and business name. Your module choice goes with you. Confirm your email, then sign in.` },
  { title: 'Add items, then sell', body: 'Add your items and opening stock, invite your staff, and record the first sale from a phone or a computer.' },
]

export function HomeBody() {
  return (
    <>
      <section aria-labelledby="today-title" className="border-t border-outline-variant">
        <div className={`${wrap} grid gap-10 pb-10! lg:grid-cols-12`}>
          <div className="lg:col-span-5">
            <h2 id="today-title" className={h2}>What you get today</h2>
            <p className="mt-6 text-[16px] leading-[1.5] text-on-surface-variant">
              M-Pesa payments can be recorded by hand against a till or paybill number, but {BRAND} is not connected to M-Pesa. Card payments, receipt printers and eTIMS are not supported yet.
            </p>
          </div>
          <dl className="lg:col-span-7 border-t border-ink lg:mt-3">
            {TODAY.map(([term, detail]) => (
              <div key={term} className="border-b border-outline-variant py-4">
                <dt className="text-[17px] font-semibold text-ink">{term}</dt>
                <dd className="mt-1 text-[16px] leading-[1.5] text-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-[clamp(48px,6vw,88px)]">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
            <img
              src="/studio-register-tablet.webp"
              width={1030}
              height={720}
              loading="lazy"
              alt="The register on a tablet in a pilot shop: items with prices in KES on the left, and on the right a cart with two loaves of bread and a 2L cola, a total of KES 527.00 and a Charge button."
              className="hidden sm:block w-full h-auto border border-outline-variant bg-white"
            />
            <img
              src="/studio-register-phone.webp"
              width={390}
              height={844}
              loading="lazy"
              alt="The same register on a phone: the open till, a barcode search, item prices in KES and a bar showing 3 items, KES 527.00 and Charge."
              className="block w-full max-w-[390px] sm:max-w-[290px] mx-auto sm:mx-0 lg:w-[clamp(240px,24vw,290px)] h-auto border border-outline-variant bg-white"
            />
          </div>
          {/* Screens are real Studio captures of the Sell register. Retake both when the register changes. */}
          <figcaption className="mt-3 text-[14px] text-muted">The register, on a tablet and on a phone.</figcaption>
        </figure>
      </section>

      <section aria-labelledby="how-title" className="bg-surface-container">
        <div className={wrap}>
          <h2 id="how-title" className={`${h2} max-w-[18ch]`}>How setting up works</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`border-t-2 border-ink pt-5 md:pr-8 ${i === 2 ? 'md:border-action' : ''}`}>
                <span aria-hidden="true" className={`block font-display text-[clamp(56px,7vw,96px)] font-[780] leading-[0.9] tracking-[-0.04em] ${i === 2 ? 'text-action' : 'text-ink'}`}>{i + 1}</span>
                <h3 className="mt-4 font-display text-[clamp(20px,2vw,26px)] font-[680] leading-[1.15] text-ink">{s.title}</h3>
                <p className="mt-2 max-w-[22rem] text-[16px] leading-[1.6] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="where-title">
        <div className={`${wrap} grid gap-10 md:grid-cols-12`}>
          <h2 id="where-title" className={`${h2} md:col-span-6`}>Hosted for you, or on your own server</h2>
          <div className="md:col-span-6 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-[22px] font-[680] text-ink">{BRAND} Cloud</h3>
              <p className="mt-2 text-[16px] leading-[1.6] text-muted">We run it for you. You and your staff sign in from the browser.</p>
              <Link to="/cloud" className={`${textLink} mt-2`}>How {BRAND} Cloud works</Link>
            </div>
            <div>
              <h3 className="font-display text-[22px] font-[680] text-ink">{BRAND} Engine</h3>
              <p className="mt-2 text-[16px] leading-[1.6] text-muted">Open source under AGPL-3.0. Run it on your own server with MySQL or LibSQL, and read every line of the code.</p>
              <Link to="/open-source" className={`${textLink} mt-2`}>Run it yourself</Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="start-title" className="border-t border-outline-variant">
        <div className={`${wrap} flex flex-col gap-8 md:flex-row md:items-end md:justify-between`}>
          <div>
            <h2 id="start-title" className="font-display text-[clamp(40px,5.6vw,80px)] font-[780] leading-[0.96] tracking-[-0.03em] text-ink max-w-[16ch] [text-wrap:balance]">
              Start with the till and the stock count.
            </h2>
            <p className="mt-5 text-[16px] text-muted">{PRICE_LINE}</p>
          </div>
          <SignupLink className="inline-flex min-h-12 shrink-0 items-center self-start bg-action px-[22px] text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-action-busy active:translate-y-px md:self-auto" />
        </div>
      </section>
    </>
  )
}
