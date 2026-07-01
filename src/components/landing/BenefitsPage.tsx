import { ArrowRight, Gauge, Users, ShieldCheck, ChartColumnBig, MessageSquareText } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const BENEFITS = [
  {
    icon: Users,
    title: 'Sales can close faster',
    description: 'Track leads, onboarding status, and payment state in one control panel.',
  },
  {
    icon: Gauge,
    title: 'Ops can see what is broken',
    description: 'Provisioning jobs, site health, and failures are visible instead of hidden in logs.',
  },
  {
    icon: ChartColumnBig,
    title: 'Devs get usage signals',
    description: 'Measure what customers actually use, where they stall, and what needs fixing.',
  },
  {
    icon: ShieldCheck,
    title: 'You keep ownership',
    description: 'No forced platform lock-in. The engine, data, and runtime remain yours.',
  },
]

const SIGNALS = [
  'lead created',
  'trial started',
  'site provisioned',
  'first login',
  'first record created',
  'invoice marked paid',
]

export default function BenefitsPage() {
  return (
    <div className="max-w-[960px] mx-auto px-6 pb-[120px] space-y-[120px]">
      <header className="pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-[10px] font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
          <MessageSquareText className="h-3.5 w-3.5" />
          Benefits
        </div>
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-black tracking-[-0.03em] md:tracking-[-0.04em]">
          Benefits that sales, ops, and devs can act on.
        </h1>
        <p className="text-lg leading-7 text-[#444748] max-w-2xl">
          Kora Cloud is not only a way to host software. It is a system for getting customers live, keeping them paid, and seeing what is happening across the lifecycle.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-white border border-[#e5e5e5] p-6 rounded-sm">
            <Icon className="h-6 w-6 text-[#FF6B35] mb-4" />
            <h2 className="text-2xl font-semibold text-black mb-2">{title}</h2>
            <p className="text-sm text-[#5d5f5f]">{description}</p>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-5 gap-6 items-start">
        <div className="md:col-span-2">
          <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold text-black tracking-[-0.02em] mb-4">
            What the control panel should show
          </h2>
          <p className="text-lg leading-7 text-[#5d5f5f] mb-6">
            The point is not to collect data for its own sake. The point is to make the next action obvious.
          </p>
          <Link to="/cloud" className="inline-flex items-center gap-2 bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-sm hover:bg-[#E55B25] transition-colors font-mono">
            See Kora Cloud
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="md:col-span-3 bg-[#f1edec] border border-[#e5e5e5] p-6 rounded-sm">
          <div className="grid grid-cols-2 gap-3">
            {SIGNALS.map((signal) => (
              <div key={signal} className="bg-white border border-[#e5e5e5] px-4 py-3 rounded-sm text-sm text-black">
                {signal}
              </div>
            ))}
          </div>
          <p className="text-sm text-[#5d5f5f] mt-4">
            These are the real milestones to measure: lead to trial, trial to provisioned site, provisioned site to first login, first login to first record, and billing status.
          </p>
        </div>
      </section>
    </div>
  )
}
