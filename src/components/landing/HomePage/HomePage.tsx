import { HeroSection } from './HeroSection'
import { AISection } from './AISection'
import { ProblemSection } from './ProblemSection'
import { FinalCTA } from './FinalCTA'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Bot, Database, FileText, KeyRound, Plug, Workflow } from 'lucide-react'
import { getPublicTemplates } from '@/lib/public-content'
import { useEffect, useState } from 'react'

const CREATED = [
  { icon: FileText, title: 'Forms', description: 'Clean screens for capturing the records your team already works with.' },
  { icon: Database, title: 'Database', description: 'A real data model behind every workspace, ready for operational use.' },
  { icon: Workflow, title: 'Workflows', description: 'Approvals, handoffs, and statuses that match how work moves.' },
  { icon: KeyRound, title: 'Users & Roles', description: 'Invite your team and control who can see or change each record.' },
  { icon: Plug, title: 'API', description: 'Connect other tools when the app becomes part of your wider workflow.' },
  { icon: Bot, title: 'AI Assistant', description: 'Use plain English to create structures and work with records faster.' },
]

const STEPS = [
  'Describe your workflow',
  'Kora builds the app',
  'Customize with AI',
  'Invite your team',
]

export default function HomePage() {
  const [homeTemplates, setHomeTemplates] = useState<{ slug: string; name: string; description: string }[]>([])
  const [homeTemplatesLoading, setHomeTemplatesLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setHomeTemplatesLoading(true)
    getPublicTemplates()
      .then((items) => {
        if (alive) setHomeTemplates(items.slice(0, 6))
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setHomeTemplatesLoading(false)
      })
    return () => { alive = false }
  }, [])
  return (
    <>
      <HeroSection />
      <section className="max-w-[960px] mx-auto px-6 py-[120px]">
        <div className="max-w-2xl mb-12">
          <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold tracking-[-0.02em] md:tracking-[-0.03em] mb-4">
            What Kora creates for you
          </h2>
          <p className="text-lg leading-7 text-[#444748]">
            Start with the workflow in your head. Kora turns it into the pieces a real business app needs.
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
      <AISection />
      <section className="max-w-[960px] mx-auto px-6 py-[120px]">
        <div className="grid md:grid-cols-4 gap-4">
          {STEPS.map((step, index) => (
            <div key={step} className="bg-white border border-[#e5e5e5] p-6 rounded-sm">
              <div className="text-[10px] font-medium text-[#FF6B35] uppercase tracking-wider font-mono mb-3">
                Step {index + 1}
              </div>
              <h3 className="text-2xl font-semibold text-black">{step}</h3>
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
        <div className="grid md:grid-cols-3 gap-4">
          {homeTemplatesLoading ? (
            [0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white border border-[#e5e5e5] p-6 rounded-sm space-y-3">
                <div className="h-7 w-2/3 bg-[#f1edec] rounded-sm animate-pulse" />
                <div className="h-4 w-full bg-[#f1edec] rounded-sm animate-pulse" />
              </div>
            ))
          ) : homeTemplates.length > 0 ? (
            homeTemplates.map((t) => (
              <a key={t.slug} href={`/onboard?template=${t.slug}`} className="bg-white border border-[#e5e5e5] p-6 rounded-sm hover:border-black transition-colors">
                <h3 className="text-2xl font-semibold text-black mb-2">{t.name}</h3>
                <p className="text-sm text-[#5d5f5f]">{t.description || 'Start with this workspace pattern and customize it for your operations.'}</p>
              </a>
            ))
          ) : (
            <div className="md:col-span-3 bg-white border border-[#e5e5e5] rounded-sm p-8 text-center">
              <p className="text-sm text-[#5d5f5f] mb-4">Template catalog is temporarily unavailable.</p>
              <a href="/onboard" className="text-xs font-medium text-[#FF6B35] hover:underline font-mono">
                Start from scratch →
              </a>
            </div>
          )}
        </div>
      </section>
      <ProblemSection />
      <section className="bg-[#f1edec] py-[120px]">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold tracking-[-0.02em] md:tracking-[-0.03em] mb-4">
              Start hosted. Keep ownership.
            </h2>
            <p className="text-lg leading-7 text-[#444748]">
              Use Kora Cloud when you want a workspace quickly. Explore open source when your team wants the technical details.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/onboard" className="bg-white border border-[#e5e5e5] p-6 rounded-sm hover:border-black transition-colors">
              <h3 className="text-2xl font-semibold text-black mb-2">Start on Kora Cloud</h3>
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
