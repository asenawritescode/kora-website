import { ArrowRight, Code2, Database, FileCode2, GitBranch, KeyRound, Scale, Server, Workflow } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { TerminalDemo } from './HomePage/TerminalDemo'

const CAPABILITIES = [
  { icon: FileCode2, title: 'REST API + Swagger', description: 'Every workspace exposes documented endpoints for integrations and custom clients.' },
  { icon: Code2, title: 'SDKs', description: 'Use the Go and TypeScript SDKs when you need custom extensions or integrations.' },
  { icon: Workflow, title: 'Workflows', description: 'Model approvals, state changes, and business actions from configuration.' },
  { icon: KeyRound, title: 'Permissions', description: 'Control access by role, record type, and workspace boundary.' },
  { icon: GitBranch, title: 'Extensions', description: 'Add scripts, hooks, webhooks, and custom API methods where the app needs code.' },
  { icon: Database, title: 'SQL Databases', description: 'Run on MySQL, MariaDB, or LibSQL without proprietary data formats.' },
]

const FAQS = [
  ['Is Kora open source?', 'Yes. Kora is AGPL-3.0 and can be reviewed, modified, and self-hosted.'],
  ['Can Kora be self-hosted?', 'Yes. Kora ships as a single Go binary and can run with MySQL, MariaDB, or LibSQL.'],
  ['Does Kora include an API?', 'Yes. Kora creates REST API routes and Swagger documentation for workspace data.'],
  ['Can teams start hosted and move later?', 'Yes. Kora Cloud is the fastest start, while the open-source engine keeps the self-hosted path available.'],
]

export default function OpenSourcePage() {
  return (
    <div className="max-w-[960px] mx-auto px-6 pb-[120px] space-y-[120px]">
      <header className="pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-[10px] font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
          <Scale className="h-3.5 w-3.5" />
          Open Source
        </div>
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-black tracking-[-0.03em] md:tracking-[-0.04em]">
          Open-source app engine for custom business software.
        </h1>
        <p className="text-lg leading-7 text-[#444748] max-w-2xl">
          Kora gives technical teams a self-hostable engine for databases, APIs, admin UI, workflows, permissions, and extensions.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="https://github.com/asenawritescode/kora" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-sm hover:bg-[#E55B25] transition-colors font-mono">
            View GitHub
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link to="/docs" className="inline-flex items-center gap-2 bg-white text-black border border-[#e5e5e5] text-xs font-medium px-6 py-3 rounded-sm hover:border-black transition-colors font-mono">
            Read docs
          </Link>
        </div>
      </header>

      <section className="bg-[#f1edec] p-8 rounded-sm">
        <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold text-black tracking-[-0.02em] mb-6">
          Built for ownership
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            ['AGPL-3.0', 'Free to inspect, modify, and run.'],
            ['Self-host anywhere', 'Deploy on cloud VMs, private infrastructure, or local hardware.'],
            ['Direct SQL access', 'Your data lives in MySQL, MariaDB, or LibSQL.'],
            ['Single binary', 'Go backend with embedded UI for simpler operations.'],
          ].map(([title, description]) => (
            <div key={title} className="bg-white border border-[#e5e5e5] p-6 rounded-sm">
              <Server className="h-6 w-6 text-[#FF6B35] mb-4" />
              <h3 className="text-sm font-semibold text-black mb-2 font-mono uppercase">{title}</h3>
              <p className="text-sm text-[#5d5f5f]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="max-w-2xl mb-8">
          <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold text-black tracking-[-0.02em] mb-4">
            Developer capabilities
          </h2>
          <p className="text-lg leading-7 text-[#5d5f5f]">
            The technical details live here, where developers and technical buyers can evaluate the engine properly.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {CAPABILITIES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white border border-[#e5e5e5] p-6 rounded-sm">
              <Icon className="h-6 w-6 text-[#FF6B35] mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
              <p className="text-sm text-[#5d5f5f]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Link to="/cloud" className="bg-white border border-[#e5e5e5] p-6 rounded-sm hover:border-black transition-colors">
          <h2 className="text-2xl font-semibold text-black mb-2">Use managed cloud</h2>
          <p className="text-sm text-[#5d5f5f] mb-4">Start faster with hosted workspaces, provisioning, and operational support.</p>
          <span className="text-xs font-medium text-[#FF6B35] font-mono">View Kora Cloud →</span>
        </Link>
        <Link to="/docs" className="bg-white border border-[#e5e5e5] p-6 rounded-sm hover:border-black transition-colors">
          <h2 className="text-2xl font-semibold text-black mb-2">Self-host the engine</h2>
          <p className="text-sm text-[#5d5f5f] mb-4">Review setup, configuration, deployment, APIs, SDKs, and extension points.</p>
          <span className="text-xs font-medium text-[#FF6B35] font-mono">Read docs →</span>
        </Link>
      </section>

      <section>
        <div className="max-w-2xl mb-8">
          <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold text-black tracking-[-0.02em] mb-4">
            Run Kora from a single binary
          </h2>
          <p className="text-lg leading-7 text-[#5d5f5f]">
            The deployment details belong here for developers evaluating the open-source engine.
          </p>
        </div>
        <TerminalDemo />
      </section>

      <section className="bg-black text-white p-8 rounded-sm">
        <h2 className="text-[32px] leading-[40px] font-semibold mb-6">Technical FAQ</h2>
        <div className="space-y-6">
          {FAQS.map(([q, a]) => (
            <div key={q}>
              <h3 className="text-lg font-semibold mb-2">{q}</h3>
              <p className="text-[#c6c6c7] text-sm leading-6">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
