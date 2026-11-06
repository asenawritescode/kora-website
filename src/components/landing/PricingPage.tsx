import { Link } from '@tanstack/react-router'
import { SignupLink } from '@/components/landing/SignupLink'
import { BRAND } from '@/lib/brand'

const INCLUDED = [
  `A ${BRAND} Cloud workspace for your shop`,
  'Point of sale and inventory, from the Retail POS template',
  'Cash sales, and M-Pesa payments recorded by hand against a till or paybill number',
  'An owner dashboard',
]

const NOT_YET = ['Card payments', 'A connection to M-Pesa (payments are recorded by hand)', 'Receipt printers', 'eTIMS tax receipts']

function RuledList({ items, muted = false }: { items: string[]; muted?: boolean }) {
  return (
    <ul className="border-t border-outline-variant">
      {items.map((item) => (
        <li key={item} className={`border-b border-outline-variant py-3 text-base ${muted ? 'text-muted' : 'text-ink'}`}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function PricingPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 pb-[96px] space-y-12">
      <header className="pt-8 space-y-4">
        <h1 className="text-[40px] leading-[44px] sm:text-[56px] sm:leading-[58px] font-bold text-ink tracking-[-0.04em]">Pricing</h1>
        <p className="text-lg leading-7 text-ink">Free during the pilot. Pricing will be announced before the pilot ends.</p>
        <p className="text-base leading-7 text-muted">When there is a price, it will be shown in KES.</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-ink tracking-[-0.02em]">What the pilot includes</h2>
        <RuledList items={INCLUDED} />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-ink tracking-[-0.02em]">Not supported yet</h2>
        <RuledList items={NOT_YET} muted />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-ink tracking-[-0.02em]">Run it yourself</h2>
        <p className="text-base leading-7 text-ink">
          {BRAND} Engine is open source (AGPL-3.0). You can run it on your own server for free.{' '}
          <Link to="/docs" className="underline underline-offset-4 hover:text-accent">Read the self-hosting guide</Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-ink tracking-[-0.02em]">Questions about the pilot</h2>
        <p className="text-base leading-7 text-ink">
          Ask on GitHub:{' '}
          <a href="https://github.com/asenawritescode/kora/issues" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent">
            open an issue
          </a>
          .
        </p>
      </section>

      <SignupLink className="inline-flex items-center min-h-12 px-[22px] bg-accent text-white text-[15px] font-semibold hover:bg-accent-strong transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-accent" />
    </div>
  )
}
