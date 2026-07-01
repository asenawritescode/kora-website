import { ArrowRight, Cloud, Database, Mail, ShieldCheck, Workflow } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const STEPS = [
  { title: 'Onboard', description: 'A lead or customer submits the form and Kora Cloud creates the account record.' },
  { title: 'Provision', description: 'The platform creates the tenant database, bootstrap tables, admin user, and config version.' },
  { title: 'Reload', description: 'Kora Cloud notifies the running Kora service to hot-load the new tenant.' },
  { title: 'Operate', description: 'Sales, ops, and devs track billing, health, and usage from the control panel.' },
]

const BENEFITS = [
  { icon: Database, title: 'Tenant data stays isolated', description: 'Each site gets its own database and runtime state.' },
  { icon: Workflow, title: 'Provisioning is visible', description: 'Every step is stored as a job, so failures are not hidden.' },
  { icon: Mail, title: 'Manual billing works now', description: 'Mark invoices paid or unpaid until payment automation is worth the effort.' },
  { icon: ShieldCheck, title: 'Managed without lock-in', description: 'Keep ownership of the engine, the data, and the deployment model.' },
]

export default function CloudPage() {
  return (
    <div className="max-w-[960px] mx-auto px-6 pb-[120px] space-y-[120px]">
      <header className="pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-[10px] font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
          <Cloud className="h-3.5 w-3.5" />
          Kora Cloud
        </div>
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-black tracking-[-0.03em] md:tracking-[-0.04em]">
          Managed Kora for teams that need to ship now.
        </h1>
        <p className="text-lg leading-7 text-[#444748] max-w-2xl">
          Sales track leads and payments. Ops track provisioning and health. Devs track usage and failures. Customers get a live system, not a ticket.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/onboard" className="inline-flex items-center gap-2 bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-sm hover:bg-[#E55B25] transition-colors font-mono">
            Start onboarding
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/benefits" className="inline-flex items-center gap-2 bg-white text-black border border-[#e5e5e5] text-xs font-medium px-6 py-3 rounded-sm hover:border-black transition-colors font-mono">
            See benefits
          </Link>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        {STEPS.map((step, index) => (
          <div key={step.title} className="bg-white border border-[#e5e5e5] p-6 rounded-sm">
            <div className="text-[10px] font-medium text-[#FF6B35] uppercase tracking-wider font-mono mb-3">
              Step {index + 1}
            </div>
            <h2 className="text-2xl font-semibold text-black mb-2">{step.title}</h2>
            <p className="text-sm text-[#5d5f5f]">{step.description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold text-black tracking-[-0.02em] mb-4">
            Built for the whole operating team
          </h2>
          <p className="text-lg leading-7 text-[#5d5f5f]">
            This is not just hosting. It is the control plane around onboarding, billing, tenant provisioning, and product visibility.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-[#f1edec] border border-[#e5e5e5] p-6 rounded-sm">
              <Icon className="h-6 w-6 text-[#FF6B35] mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
              <p className="text-sm text-[#444748]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white p-8 rounded-sm">
        <div className="max-w-2xl">
          <h2 className="text-[30px] leading-[38px] font-semibold mb-4">
            Cloud plus private managed instance
          </h2>
          <p className="text-[#c6c6c7] mb-6">
            Use shared cloud for fast self-serve onboarding. Use a private managed instance when the customer needs dedicated deployment and a narrower support boundary.
          </p>
          <Link to="/pricing" className="inline-flex items-center gap-2 bg-white text-black text-xs font-medium px-6 py-3 rounded-sm hover:bg-[#e5e5e5] transition-colors font-mono">
            View pricing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
