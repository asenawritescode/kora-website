import { ArrowRight, BadgeCheck, CreditCard, Layers3, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const PLANS = [
  {
    name: 'Starter Workspace',
    price: 'Free to begin',
    features: ['1 workspace', 'Template starting point', 'Email support'],
  },
  {
    name: 'Managed Cloud',
    price: 'From $20/month',
    features: ['Hosted workspaces', 'Team access', 'Operational support'],
  },
  {
    name: 'Private Instance',
    price: 'Custom pricing',
    features: ['Dedicated deployment', 'Custom domain', 'Priority support'],
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-[960px] mx-auto px-6 pb-[120px] space-y-[120px]">
      <header className="pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-[10px] font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
          <CreditCard className="h-3.5 w-3.5" />
          Pricing
        </div>
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-black tracking-[-0.03em] md:tracking-[-0.04em]">
          Simple plans for starting, hosting, and owning your workspace.
        </h1>
        <p className="text-lg leading-7 text-[#444748] max-w-2xl">
          Start free, move to managed cloud when you want help, or self-host when you need full control.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div key={plan.name} className="bg-white border border-[#e5e5e5] p-6 rounded-sm">
            <h2 className="text-2xl font-semibold text-black mb-2">{plan.name}</h2>
            <div className="text-sm text-[#5d5f5f] mb-4">{plan.price}</div>
            <ul className="space-y-3 text-sm text-[#444748]">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#10B981] mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="bg-white border border-[#e5e5e5] p-8 rounded-sm">
        <h2 className="text-[32px] leading-[40px] font-semibold text-black mb-6">What every plan includes</h2>
        <div className="grid md:grid-cols-3 gap-3 text-sm text-[#444748]">
          {['Forms', 'Records', 'Workflows', 'Users and roles', 'API', 'AI builder'].map((item) => (
            <div key={item} className="border border-[#e5e5e5] rounded-sm px-4 py-3">{item}</div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#f1edec] border border-[#e5e5e5] p-6 rounded-sm">
          <Users className="h-6 w-6 text-[#FF6B35] mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">Sales-friendly</h3>
          <p className="text-sm text-[#444748]">Start free and move to managed support when the workspace matters.</p>
        </div>
        <div className="bg-[#f1edec] border border-[#e5e5e5] p-6 rounded-sm">
          <Layers3 className="h-6 w-6 text-[#FF6B35] mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">Ops-friendly</h3>
          <p className="text-sm text-[#444748]">Use hosted cloud for fast starts or private instances for dedicated customers.</p>
        </div>
        <div className="bg-[#f1edec] border border-[#e5e5e5] p-6 rounded-sm">
          <BadgeCheck className="h-6 w-6 text-[#FF6B35] mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">Low-friction</h3>
          <p className="text-sm text-[#444748]">Keep ownership of the app structure and data path as the business grows.</p>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Link to="/cloud" className="inline-flex items-center gap-2 bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-sm hover:bg-[#E55B25] transition-colors font-mono">
          View Kora Cloud
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/onboard" className="inline-flex items-center gap-2 bg-white text-black border border-[#e5e5e5] text-xs font-medium px-6 py-3 rounded-sm hover:border-black transition-colors font-mono">
          Start onboarding
        </Link>
      </section>
    </div>
  )
}
