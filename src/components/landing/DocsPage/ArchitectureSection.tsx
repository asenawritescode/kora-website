export function ArchitectureSection() {
  return (
    <section className="mb-[120px]">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-4 border-b border-outline-variant pb-2">
        Architecture
      </h2>
      <p className="mb-6 text-[#5d5f5f]">
        Kora is a single Go binary with an embedded React SPA. It connects directly to
        MySQL or LibSQL — no Redis, no message queue, no external services. One binary,
        deploy anywhere.
      </p>

      {/* Middleware flow diagram */}
      <div className="bg-[#FAFAFA] border border-outline-variant rounded-sm p-6 mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs mb-4" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
          <span className="text-[#5d5f5f]">Request</span>
          <span className="text-[#c4c7c7]">→</span>
          <span className="px-2 py-1 bg-white border border-outline-variant rounded-sm text-black">Recovery</span>
          <span className="text-[#c4c7c7]">→</span>
          <span className="px-2 py-1 bg-white border border-outline-variant rounded-sm text-black">RequestID</span>
          <span className="text-[#c4c7c7]">→</span>
          <span className="px-2 py-1 bg-white border border-outline-variant rounded-sm text-black">CORS</span>
          <span className="text-[#c4c7c7]">→</span>
          <span className="px-2 py-1 bg-black text-white rounded-sm">SiteRouter</span>
          <span className="text-[#c4c7c7]">→</span>
          <span className="px-2 py-1 bg-white border border-outline-variant rounded-sm text-black">RateLimiter</span>
          <span className="text-[#c4c7c7]">→</span>
          <span className="text-[#5d5f5f]">API / SPA / Console</span>
        </div>
        <p className="text-xs text-[#5d5f5f]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
          Every request passes through the middleware chain. The SiteRouter resolves
          the hostname to a site — each site gets its own database, users, and doctype registry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-l-2 border-black pl-4">
          <h4 className="font-bold text-black mb-1 text-sm">Config Engine</h4>
          <p className="text-[#5d5f5f] text-sm">
            DocTypes, fields, workflows, and permissions are defined in YAML and stored
            in your database. The engine reads config and generates everything at runtime.
          </p>
        </div>
        <div className="border-l-2 border-[#c4c7c7] pl-4">
          <h4 className="font-bold text-black mb-1 text-sm">Multi-Site Router</h4>
          <p className="text-[#5d5f5f] text-sm">
            One instance serves many isolated sites. Host-based or path-based routing
            (<code className="text-xs bg-[#f1edec] px-1 rounded">/s/sitename/workspace</code>).
            Hot-add and remove sites without restarting.
          </p>
        </div>
        <div className="border-l-2 border-[#c4c7c7] pl-4">
          <h4 className="font-bold text-black mb-1 text-sm">SQL Dialect Layer</h4>
          <p className="text-[#5d5f5f] text-sm">
            All SQL goes through a dialect abstraction. MySQL and LibSQL supported today.
            PostgreSQL on the roadmap. Never write database-specific SQL.
          </p>
        </div>
      </div>
    </section>
  )
}
