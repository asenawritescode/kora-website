import { ArrowRight, MessageSquareText, Sparkles, Workflow, Table2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const EXAMPLES = [
  'Create a CRM for our sales team',
  'Add approvals for purchase requests',
  'Track customers, payments, and onboarding',
  'Build a clinic system with appointments and billing',
]

const CAPABILITIES = [
  {
    icon: Workflow,
    title: 'Workflows',
    description: 'Describe approvals, state changes, and handoffs in plain English.',
  },
  {
    icon: Table2,
    title: 'Data model',
    description: 'Generate tables, fields, and relationships from business language.',
  },
  {
    icon: Sparkles,
    title: 'Admin UI',
    description: 'Create forms, lists, and dashboards from the same description.',
  },
]

export function AISection() {
  return (
    <section className="max-w-[960px] mx-auto px-6 py-[120px]">
      <div className="grid md:grid-cols-5 gap-10 md:gap-12 items-start">
        <div className="md:col-span-2">
          <div className="inline-flex items-center gap-2 text-[10px] font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono mb-4">
            <MessageSquareText className="h-3.5 w-3.5" />
            AI Builder
          </div>
          <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold tracking-[-0.02em] md:tracking-[-0.03em] mb-4">
            Talk to Kora in English.
          </h2>
          <p className="text-lg leading-7 text-[#444748] mb-6">
            Describe the system you want, and Kora turns that into doctypes, workflows, permissions, and a working admin UI.
          </p>
          <Link to="/onboard" className="inline-flex items-center gap-2 bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-sm hover:bg-[#E55B25] transition-colors font-mono">
            Try it now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="md:col-span-3 bg-white border border-[#e5e5e5] rounded-sm p-6 md:p-8">
          <div className="grid gap-3">
            {EXAMPLES.map((example) => (
              <div key={example} className="flex items-start gap-3 border border-[#f1edec] bg-[#fafafa] px-4 py-3 rounded-sm">
                <MessageSquareText className="h-4 w-4 text-[#FF6B35] mt-0.5 shrink-0" />
                <p className="text-sm text-[#1c1b1b]">{example}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {CAPABILITIES.map((item) => (
              <div key={item.title} className="border border-[#e5e5e5] p-4 rounded-sm">
                <item.icon className="h-5 w-5 text-[#FF6B35] mb-3" />
                <h3 className="text-sm font-semibold text-black mb-1">{item.title}</h3>
                <p className="text-sm text-[#5d5f5f]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
