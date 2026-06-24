const ENV_VARS = [
  { var: 'KORA_DB_TYPE', default: 'mysql', desc: 'mysql or libsql' },
  { var: 'KORA_DB_HOST', default: '127.0.0.1', desc: 'Database host (or HTTP URL for LibSQL)' },
  { var: 'KORA_DB_PORT', default: '3306', desc: 'Database port' },
  { var: 'KORA_DB_USER', default: '—', desc: 'Database user' },
  { var: 'KORA_DB_PASSWORD', default: '—', desc: 'Database password' },
  { var: 'DB_DSN', default: '—', desc: 'Full connection string (overrides individual params)' },
  { var: 'KORA_HTTP_PORT', default: '8000', desc: 'Server port' },
  { var: 'CONSOLE_EMAIL', default: 'admin@kora.local', desc: 'Console admin login' },
  { var: 'CONSOLE_PASSWORD', default: 'admin123', desc: 'Console admin password' },
  { var: 'KORA_ANALYTICS', default: 'false', desc: 'Enable analytics (true/false)' },
  { var: 'KORA_SHARED_AI_ENABLED', default: 'false', desc: 'Enable shared AI key for all sites' },
  { var: 'KORA_SHARED_OPENAI_API_KEY', default: '—', desc: 'Shared OpenAI key (fallback when site has none)' },
  { var: 'KORA_SHARED_DEEPSEEK_API_KEY', default: '—', desc: 'Shared DeepSeek key' },
  { var: 'KORA_SHARED_ANTHROPIC_API_KEY', default: '—', desc: 'Shared Anthropic key' },
]

export function DeploymentSection() {
  return (
    <section className="mb-24" id="deployment">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-3">
        Deployment
      </h2>
      <p className="text-base text-[#5d5f5f] mb-6 leading-relaxed">
        A single 30MB binary. Deploy on a Raspberry Pi behind a shop counter, on a
        cloud VM serving hundreds of users, or pull the Docker image. Everything
        configured through environment variables — no config files to manage.
      </p>

      <h3 className="font-bold text-black mb-3">Environment Variables</h3>
      <p className="text-sm text-[#5d5f5f] mb-4">
        All configuration is via environment variables. No YAML config files needed
        for the server itself.
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-left">
              <th className="py-2 pr-4 font-medium text-black text-[11px] uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Variable</th>
              <th className="py-2 pr-2 font-medium text-black text-[11px] uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Default</th>
              <th className="py-2 font-medium text-black text-[11px] uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {ENV_VARS.map((v) => (
              <tr key={v.var} className="border-b border-outline-variant/30">
                <td className="py-2 pr-4" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                  <code className="text-black text-xs">{v.var}</code>
                </td>
                <td className="py-2 pr-2 text-[#5d5f5f] text-xs" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                  {v.default}
                </td>
                <td className="py-2 text-[#5d5f5f] text-sm">{v.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-bold text-black mb-3">Docker</h3>
      <p className="text-sm text-[#5d5f5f] mb-4">
        Official image:{' '}
        <a href="https://hub.docker.com/r/smitdockerhub/kora" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">
          smitdockerhub/kora
        </a>
        . Pure Go, no CGO, ~30MB compressed. Supports MySQL and LibSQL.
      </p>

      <h3 className="font-bold text-black mb-3">Database Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#FAFAFA] border border-outline-variant rounded-sm p-4">
          <h4 className="font-bold text-black text-sm mb-1">MySQL 8.0 / MariaDB</h4>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            Each site gets its own database. Complete isolation. Best for multi-tenant production.
          </p>
        </div>
        <div className="bg-[#FAFAFA] border border-outline-variant rounded-sm p-4">
          <h4 className="font-bold text-black text-sm mb-1">LibSQL (SQLite)</h4>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            Single database, site-specific tables. Great for edge deployments or single-server setups.
          </p>
        </div>
      </div>

      <h3 className="font-bold text-black mt-8 mb-3">Shared AI Keys</h3>
      <p className="text-sm text-[#5d5f5f] mb-4 leading-relaxed">
        Superadmins can set a global AI provider key so new users get AI chat immediately
        — no per-site configuration needed. Set{' '}
        <code className="text-xs bg-[#f1edec] px-1 rounded-sm text-black font-mono">KORA_SHARED_AI_ENABLED=true</code>
        {' '}and one of the shared key env vars. Site-specific keys always take priority.
        Disable at any time by removing the env var.
      </p>
    </section>
  )
}
