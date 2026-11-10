import { ENGINE_BRAND } from '@/lib/brand'
export function ArchitectureSection() {
  return (
    <section className="mb-24" id="architecture">
      <h2 className="text-[30px] leading-[38px] font-semibold text-ink mb-3">
        Architecture
      </h2>
      <p className="text-base text-ink-3 mb-6 leading-relaxed">
        {ENGINE_BRAND} is a single Go binary — about 30MB — with a React admin UI embedded inside.
        It talks directly to MySQL or LibSQL. No Redis, no message queue, no external
        services. Deploy anywhere.
      </p>

      {/* Request flow */}
      <div className="bg-paper border border-line rounded-sm p-5 mb-6 overflow-x-auto">
        <h3 className="font-bold text-ink text-sm mb-3">Request Flow</h3>
        <div className="font-mono flex items-center gap-1.5 text-[11px] mb-3 flex-wrap">
          <span className="text-ink-3">Request</span>
          <span className="text-ink-3">→</span>
          <span className="px-1.5 py-0.5 bg-paper border border-line rounded-sm">Recovery</span>
          <span className="text-ink-3">→</span>
          <span className="px-1.5 py-0.5 bg-paper border border-line rounded-sm">CORS</span>
          <span className="text-ink-3">→</span>
          <span className="px-1.5 py-0.5 bg-action text-paper rounded-sm">SiteRouter</span>
          <span className="text-ink-3">→</span>
          <span className="px-1.5 py-0.5 bg-paper border border-line rounded-sm">RateLimiter</span>
          <span className="text-ink-3">→</span>
          <span className="text-ink-3">API / SPA / Console</span>
        </div>
        <p className="text-xs text-ink-3">
          The SiteRouter maps incoming hostnames to sites. Each site gets its own database,
          users, and configuration — all in-process, no orchestration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-line rounded-sm p-4">
          <h3 className="font-bold text-ink text-sm mb-1">Config Engine</h3>
          <p className="text-sm text-ink-3 leading-relaxed">
            DocTypes, workflows, and permissions defined in YAML. The engine reads config
            and generates database tables, APIs, and UI at runtime. No code generation —
            your config is your app.
          </p>
        </div>
        <div className="border border-line rounded-sm p-4">
          <h3 className="font-bold text-ink text-sm mb-1">Multi-Site</h3>
          <p className="text-sm text-ink-3 leading-relaxed">
            Host-based or path-based routing. Hot-add sites without restarting.
            Per-site databases and analytics pipelines. Built for agencies and MSPs.
          </p>
        </div>
        <div className="border border-line rounded-sm p-4">
          <h3 className="font-bold text-ink text-sm mb-1">SQL Dialect</h3>
          <p className="text-sm text-ink-3 leading-relaxed">
            MySQL and LibSQL from the same codebase. All SQL goes through a dialect
            abstraction layer. PostgreSQL on the roadmap.
          </p>
        </div>
      </div>
    </section>
  )
}
