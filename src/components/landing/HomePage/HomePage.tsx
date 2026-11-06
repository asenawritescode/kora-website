import { HeroSection } from './HeroSection'
import { ProblemSection } from './ProblemSection'
import { FinalCTA } from './FinalCTA'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Database, FileText, KeyRound, Plug, Workflow } from 'lucide-react'
import { useTemplates } from '@/lib/use-templates'
import { PreviewLabel, TemplateEmpty, TemplateError, TemplateSkeleton } from '@/components/landing/ExamplesPage/TemplateStatus'
import { BRAND } from '@/lib/brand'

const CREATED = [
  { icon: FileText, title: 'Forms', description: 'Clean screens for capturing the records your team already works with.' },
  { icon: Database, title: 'Database', description: 'A real data model behind every workspace, ready for operational use.' },
  { icon: Workflow, title: 'Workflows', description: 'Approvals, handoffs, and statuses that match how work moves.' },
  { icon: KeyRound, title: 'Users & Roles', description: 'Invite your team and control who can see or change each record.' },
  { icon: Plug, title: 'API', description: 'Connect other tools when the app becomes part of your wider workflow.' },
]

export default function HomePage() {
  const templates = useTemplates()
  return (
    <>
      <HeroSection />
      <section className="max-w-[960px] mx-auto px-6 py-[120px]">
        <div className="max-w-2xl mb-12">
          <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold tracking-[-0.02em] md:tracking-[-0.03em] mb-4">
            What is in every workspace
          </h2>
          <p className="text-lg leading-7 text-[#444748]">
            Each workspace comes with the same building blocks. You shape them to fit your business.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {CREATED.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white border border-[#e5e5e5] p-6 rounded-sm">
              <Icon className="h-6 w-6 text-[#FF6B35] mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
              <p className="text-sm text-[#5d5f5f]">{description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-[960px] mx-auto px-6 py-[120px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold tracking-[-0.02em] md:tracking-[-0.03em] mb-4">
              What you can build
            </h2>
            <p className="text-lg leading-7 text-[#444748]">
              Start from a familiar business system, then shape it around how your team actually works.
            </p>
          </div>
          <Link to="/examples" className="inline-flex items-center gap-2 bg-white text-black border border-[#e5e5e5] text-xs font-medium px-6 py-3 rounded-sm hover:border-black transition-colors font-mono">
            View templates
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {templates.status === 'loading' && <TemplateSkeleton count={3} className="grid md:grid-cols-3 gap-4" />}
        {templates.status === 'error' && <TemplateError onRetry={templates.retry} />}
        {templates.status === 'ready' && templates.templates.length === 0 && <TemplateEmpty />}
        {templates.status === 'ready' && templates.templates.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4">
            {templates.templates.slice(0, 6).map((t) => (
              <a key={t.slug} href={`/onboard?template=${t.slug}`} className="bg-white border border-[#e5e5e5] p-6 rounded-sm hover:border-black transition-colors">
                <h3 className="text-2xl font-semibold text-black mb-2">{t.name}</h3>
                {t.availability === 'preview' && <div className="mb-3"><PreviewLabel /></div>}
                <p className="text-sm text-[#5d5f5f]">{t.description}</p>
                {t.features.length > 0 && <p className="text-xs text-[#5d5f5f] font-mono mt-4">{t.features.join(', ')}</p>}
              </a>
            ))}
          </div>
        )}
      </section>
      <ProblemSection />
      <section className="bg-[#f1edec] py-[120px]">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold tracking-[-0.02em] md:tracking-[-0.03em] mb-4">
              Start hosted. Keep ownership.
            </h2>
            <p className="text-lg leading-7 text-[#444748]">
              Use {BRAND} Cloud when you want a workspace quickly. Explore open source when your team wants the technical details.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/onboard" className="bg-white border border-[#e5e5e5] p-6 rounded-sm hover:border-black transition-colors">
              <h3 className="text-2xl font-semibold text-black mb-2">Start on {BRAND} Cloud</h3>
              <p className="text-sm text-[#5d5f5f] mb-4">Create a workspace, invite your team, and start shaping your app today.</p>
              <span className="text-xs font-medium text-[#FF6B35] font-mono">Start free →</span>
            </Link>
            <Link to="/open-source" className="bg-white border border-[#e5e5e5] p-6 rounded-sm hover:border-black transition-colors">
              <h3 className="text-2xl font-semibold text-black mb-2">Explore Open Source</h3>
              <p className="text-sm text-[#5d5f5f] mb-4">Review the engine, deployment model, API, SDKs, and self-hosting path.</p>
              <span className="text-xs font-medium text-[#FF6B35] font-mono">View technical details →</span>
            </Link>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
