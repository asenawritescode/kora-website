import { ArrowRight, Code2, Database, FileCode2, GitBranch, KeyRound, Server, Workflow } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { TerminalDemo } from './HomePage/TerminalDemo'
import { BRAND, ENGINE_BRAND } from '@/lib/brand'

const CAPABILITIES = [
  { icon: FileCode2, title: 'REST API + Swagger', description: 'Every workspace exposes documented endpoints for integrations and custom clients.' },
  { icon: Code2, title: 'SDKs', description: 'Use the Go and TypeScript SDKs when you need custom extensions or integrations.' },
  { icon: Workflow, title: 'Workflows', description: 'Model approvals, state changes, and business actions from configuration.' },
  { icon: KeyRound, title: 'Permissions', description: 'Control access by role, record type, and workspace boundary.' },
  { icon: GitBranch, title: 'Extensions', description: 'Add scripts, hooks, webhooks, and custom API methods where the app needs code.' },
  { icon: Database, title: 'SQL Databases', description: 'Run on MySQL or LibSQL without proprietary data formats.' },
]

const FAQS = [
  [`Is ${ENGINE_BRAND} open source?`, `Yes. ${ENGINE_BRAND} is AGPL-3.0 and can be reviewed, modified, and self-hosted.`],
  [`Can ${ENGINE_BRAND} be self-hosted?`, `Yes. ${ENGINE_BRAND} ships as a single Go binary and can run with MySQL or LibSQL.`],
  [`Does ${ENGINE_BRAND} include an API?`, `Yes. ${ENGINE_BRAND} creates REST API routes and Swagger documentation for workspace data.`],
  ['Can teams start hosted and move later?', `Yes. ${ENGINE_BRAND} Cloud is the fastest start, while the open-source engine keeps the self-hosted path available.`],
]

export default function OpenSourcePage() {
  return (
    <div className="max-w-[960px] mx-auto px-6 pb-[120px] space-y-[120px]">
      <header className="pt-8 space-y-4">
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-ink tracking-[-0.03em] md:tracking-[-0.04em]">
          Open-source engine for records, workflows, and business apps.
        </h1>
        <p className="text-lg leading-7 text-ink-2 max-w-2xl">
          {ENGINE_BRAND} gives technical teams a self-hostable engine for records, APIs, admin UI, workflows, permissions, and extensions.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="https://github.com/asenawritescode/kora" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-action text-paper text-sm font-semibold px-6 py-3 rounded-sm hover:bg-action-busy transition-colors">
            View GitHub
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link to="/docs" className="inline-flex items-center gap-2 bg-paper text-ink border border-line text-sm font-semibold px-6 py-3 rounded-sm hover:border-ink transition-colors">
            Read docs
          </Link>
        </div>
      </header>

      <section className="bg-surface-2 p-8 rounded-sm">
        <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold text-ink tracking-[-0.02em] mb-6">
          Built for ownership
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            ['AGPL-3.0', 'Free to inspect, modify, and run.'],
            ['Self-host', 'Runs on any Linux server with Docker.'],
            ['Direct SQL access', 'Your data lives in MySQL or LibSQL.'],
            ['Single binary', 'Go backend with embedded UI for simpler operations.'],
          ].map(([title, description]) => (
            <div key={title} className="bg-paper border border-line p-6 rounded-sm">
              <Server className="h-6 w-6 text-action mb-4" />
              <h3 className="text-sm font-semibold text-ink mb-2">{title}</h3>
              <p className="text-sm text-ink-3">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="max-w-2xl mb-8">
          <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold text-ink tracking-[-0.02em] mb-4">
          Developer capabilities
        </h2>
        <p className="text-lg leading-7 text-ink-3">
            The technical details live here, where developers and technical buyers can evaluate the engine properly.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {CAPABILITIES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-paper border border-line p-6 rounded-sm">
              <Icon className="h-6 w-6 text-action mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
              <p className="text-sm text-ink-3">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Link to="/cloud" className="bg-paper border border-line p-6 rounded-sm hover:border-ink transition-colors">
          <h2 className="text-2xl font-semibold text-ink mb-2">Use managed cloud</h2>
          <p className="text-sm text-ink-3 mb-4">Start with a hosted workspace instead of running your own server.</p>
          <span className="text-sm font-semibold text-action">View {BRAND} Cloud →</span>
        </Link>
        <Link to="/docs" className="bg-paper border border-line p-6 rounded-sm hover:border-ink transition-colors">
          <h2 className="text-2xl font-semibold text-ink mb-2">Self-host the engine</h2>
          <p className="text-sm text-ink-3 mb-4">Review setup, configuration, deployment, APIs, SDKs, and extension points.</p>
          <span className="text-sm font-semibold text-action">Read docs →</span>
        </Link>
      </section>

      <section>
        <div className="max-w-2xl mb-8">
          <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold text-ink tracking-[-0.02em] mb-4">
            Run {ENGINE_BRAND} from a single binary
          </h2>
          <p className="text-lg leading-7 text-ink-3">
            The deployment details belong here for developers evaluating the open-source engine.
          </p>
        </div>
        <TerminalDemo />
      </section>

      <section className="bg-action text-paper p-8 rounded-sm">
        <h2 className="text-[32px] leading-[40px] font-semibold mb-6">Technical FAQ</h2>
        <div className="space-y-6">
          {FAQS.map(([q, a]) => (
            <div key={q}>
              <h3 className="text-lg font-semibold mb-2">{q}</h3>
              <p className="text-code-muted text-sm leading-6">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
