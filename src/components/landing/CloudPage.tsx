import { ArrowRight, Database, ShieldCheck, Workflow } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { BRAND } from '@/lib/brand'

const STEPS = [
  { title: 'Submit workspace', description: 'Choose a site name, create your admin account, and and confirm your email.' },
  { title: 'Provision app', description: `${BRAND} Cloud prepares the workspace, database, and users.` },
  { title: 'Open workspace', description: 'After email confirmation, open the workspace and start capturing records.' },
  { title: 'Run your team', description: 'Add users and change the workflow as your process becomes clearer.' },
]

const BENEFITS = [
  { icon: Database, title: 'Hosted workspaces', description: 'Start with a live workspace instead of setting up servers first.' },
  { icon: Workflow, title: 'Workspace provisioning', description: 'Create the database and admin account from onboarding.' },
  { icon: ShieldCheck, title: 'Ownership path remains open', description: 'Keep the open-source engine and self-hosting path available.' },
]

export default function CloudPage() {
  return (
    <div className="max-w-[960px] mx-auto px-6 pb-[120px] space-y-[120px]">
      <header className="pt-8 space-y-4">
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-black tracking-[-0.03em] md:tracking-[-0.04em]">
          Managed {BRAND} for teams that do not want to run their own server.
        </h1>
        <p className="text-lg leading-7 text-on-surface-variant max-w-2xl">
          Hosted workspaces with onboarding and provisioning, so you do not set up infrastructure first.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/onboard" className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-6 py-3 rounded-sm hover:bg-accent-strong transition-colors">
            Start onboarding
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/pricing" className="inline-flex items-center gap-2 bg-white text-black border border-outline-variant text-sm font-semibold px-6 py-3 rounded-sm hover:border-black transition-colors">
            View pricing
          </Link>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        {STEPS.map((step, index) => (
          <div key={step.title} className="bg-white border border-outline-variant p-6 rounded-sm">
            <div className="text-[11px] font-medium text-accent uppercase tracking-wider font-mono mb-3">
              Step {index + 1}
            </div>
            <h2 className="text-2xl font-semibold text-black mb-2">{step.title}</h2>
            <p className="text-sm text-muted">{step.description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
            <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold text-black tracking-[-0.02em] mb-4">
            What managed cloud handles
          </h2>
          <p className="text-lg leading-7 text-muted">
            {BRAND} Cloud handles the setup of hosted workspaces so your team can focus on the business process.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-surface-container border border-outline-variant p-6 rounded-sm">
              <Icon className="h-6 w-6 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
              <p className="text-sm text-on-surface-variant">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
