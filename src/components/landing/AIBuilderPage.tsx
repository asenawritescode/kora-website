import { ArrowRight, MessageSquareText, Sparkles, Workflow, Table2, BadgeCheck } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const EXAMPLES = [
  'Build a CRM for our sales team',
  'Create an onboarding flow with approvals',
  'Track tenants, invoices, and payment status',
  'Make a clinic system with appointments and billing',
]

const FAQS = [
  {
    q: 'Can I describe the system in English?',
    a: 'Yes. Kora is designed to turn plain-language requirements into doctypes, workflows, permissions, and UI.',
  },
  {
    q: 'Does it create the database too?',
    a: 'Yes. The engine creates and bootstraps the tenant database as part of site provisioning.',
  },
  {
    q: 'Can it handle admin UI and workflows?',
    a: 'Yes. Those are part of the core runtime, not separate add-ons.',
  },
]

export default function AIBuilderPage() {
  return (
    <div className="max-w-[960px] mx-auto px-6 pb-[120px] space-y-[120px]">
      <header className="pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-[10px] font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
          <MessageSquareText className="h-3.5 w-3.5" />
          AI Builder
        </div>
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-black tracking-[-0.03em] md:tracking-[-0.04em]">
          Talk to Kora in English and get a system.
        </h1>
        <p className="text-lg leading-7 text-[#444748] max-w-2xl">
          The AI feature is not a chat toy. It is a way to move from business language to a real backend with data models, workflows, and UI.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        {EXAMPLES.map((example) => (
          <div key={example} className="bg-white border border-[#e5e5e5] p-6 rounded-sm flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-[#FF6B35] mt-0.5 shrink-0" />
            <p className="text-sm text-[#1c1b1b]">{example}</p>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#f1edec] border border-[#e5e5e5] p-6 rounded-sm">
          <Workflow className="h-6 w-6 text-[#FF6B35] mb-4" />
          <h2 className="text-2xl font-semibold text-black mb-2">Workflows</h2>
          <p className="text-sm text-[#444748]">Tell Kora who approves what, when records move, and what should happen next.</p>
        </div>
        <div className="bg-[#f1edec] border border-[#e5e5e5] p-6 rounded-sm">
          <Table2 className="h-6 w-6 text-[#FF6B35] mb-4" />
          <h2 className="text-2xl font-semibold text-black mb-2">Data model</h2>
          <p className="text-sm text-[#444748]">Generate doctypes, fields, links, and validation from the requirement itself.</p>
        </div>
        <div className="bg-[#f1edec] border border-[#e5e5e5] p-6 rounded-sm">
          <BadgeCheck className="h-6 w-6 text-[#FF6B35] mb-4" />
          <h2 className="text-2xl font-semibold text-black mb-2">Admin UI</h2>
          <p className="text-sm text-[#444748]">The same configuration drives the forms, lists, and actions users see.</p>
        </div>
      </section>

      <section className="bg-black text-white p-8 rounded-sm">
        <h2 className="text-[32px] leading-[40px] font-semibold mb-4">FAQ</h2>
        <div className="space-y-6">
          {FAQS.map((item) => (
            <div key={item.q}>
              <h3 className="text-lg font-semibold mb-2">{item.q}</h3>
              <p className="text-[#c6c6c7] text-sm leading-6">{item.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/onboard" className="inline-flex items-center gap-2 bg-white text-black text-xs font-medium px-6 py-3 rounded-sm hover:bg-[#e5e5e5] transition-colors font-mono">
            Try the builder
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
