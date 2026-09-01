import { ArrowRight, Cloud, Database, Mail, ShieldCheck, Workflow } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const STEPS = [
  { title: 'Submit workspace', description: 'Choose a site name, create your admin account, and tell Kora what the team does.' },
  { title: 'Provision app', description: 'Kora Cloud prepares the workspace, database, users, and first workflow structure.' },
  { title: 'Open workspace', description: 'Launch the workspace and start capturing records right away.' },
  { title: 'Run your team', description: 'Keep improving the workflow as your process becomes clearer.' },
]

const BENEFITS = [
  { icon: Database, title: 'Hosted workspaces', description: 'Start with a live workspace instead of setting up servers first.' },
  { icon: Workflow, title: 'Workspace provisioning', description: 'Create the app, database, admin account, and first workflow from onboarding.' },
  { icon: Mail, title: 'Operational support', description: 'Use managed cloud when your team wants help running the software.' },
  { icon: ShieldCheck, title: 'Ownership path remains open', description: 'Keep the open-source engine and self-hosting path available.' },
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
          Managed Kora for teams that want to go live fast.
        </h1>
        <p className="text-lg leading-7 text-[#444748] max-w-2xl">
          Hosted workspaces, onboarding, provisioning, and support for teams that want a working business app without setting up infrastructure first.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/onboard" className="inline-flex items-center gap-2 bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-sm hover:bg-[#E55B25] transition-colors font-mono">
            Start onboarding
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/pricing" className="inline-flex items-center gap-2 bg-white text-black border border-[#e5e5e5] text-xs font-medium px-6 py-3 rounded-sm hover:border-black transition-colors font-mono">
            View pricing
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
            What managed cloud handles
          </h2>
          <p className="text-lg leading-7 text-[#5d5f5f]">
            Kora Cloud handles the setup and support around hosted workspaces so your team can focus on the business process.
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
            Use shared cloud for trials and small teams. Use a private managed instance when a customer or agency client needs a dedicated runtime.
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
