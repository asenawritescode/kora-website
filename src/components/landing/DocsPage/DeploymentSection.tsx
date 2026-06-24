const ENV_VARS = [
  { var: 'KORA_DB_TYPE', default: 'mysql', desc: 'Database type: mysql or libsql' },
  { var: 'KORA_DB_HOST', default: '127.0.0.1', desc: 'Database host (or HTTP URL for LibSQL)' },
  { var: 'KORA_DB_PORT', default: '3306', desc: 'Database port' },
  { var: 'KORA_DB_USER', default: '—', desc: 'Database user' },
  { var: 'KORA_DB_PASSWORD', default: '—', desc: 'Database password' },
  { var: 'KORA_DB_NAME', default: '—', desc: 'Database name (platform DB for site discovery)' },
  { var: 'DB_DSN', default: '—', desc: 'Full connection string (overrides host/user/password)' },
  { var: 'KORA_HTTP_PORT', default: '8000', desc: 'Server port' },
  { var: 'CONSOLE_EMAIL', default: 'admin@kora.local', desc: 'Console admin email' },
  { var: 'CONSOLE_PASSWORD', default: 'admin123', desc: 'Console admin password' },
  { var: 'KORA_ANALYTICS', default: 'false', desc: 'Enable analytics pipeline (true/false)' },
]

export function DeploymentSection() {
  return (
    <section className="mb-[120px]">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-4 border-b border-outline-variant pb-2">
        Deployment
      </h2>
      <p className="mb-6 text-[#5d5f5f]">
        Kora is a single 30MB binary. Deploy on a Raspberry Pi for a local kiosk,
        on a cloud VM serving hundreds of users, or pull the Docker image.
        All configuration is via environment variables — no config files needed.
      </p>

      <h3 className="font-bold text-black mb-3">Environment Variables</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-left">
              <th className="py-2 pr-4 font-medium text-black text-xs uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Variable</th>
              <th className="py-2 pr-4 font-medium text-black text-xs uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Default</th>
              <th className="py-2 font-medium text-black text-xs uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {ENV_VARS.map((v) => (
              <tr key={v.var} className="border-b border-outline-variant/50">
                <td className="py-2 pr-4" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                  <code className="text-black text-xs">{v.var}</code>
                </td>
                <td className="py-2 pr-4 text-[#5d5f5f] text-xs" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                  {v.default}
                </td>
                <td className="py-2 text-[#5d5f5f]">{v.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-bold text-black mt-8 mb-3">Docker</h3>
      <p className="text-sm text-[#5d5f5f] mb-3">
        Official image on Docker Hub:{' '}
        <a href="https://hub.docker.com/r/smitdockerhub/kora" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">
          smitdockerhub/kora
        </a>
        . Supports MySQL and LibSQL. Pure Go binary, no CGO, ~30MB.
      </p>

      <h3 className="font-bold text-black mt-8 mb-3">Database Support</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#FAFAFA] border border-outline-variant rounded-sm p-4">
          <h4 className="font-bold text-black text-sm mb-1">MySQL 8.0 / MariaDB</h4>
          <p className="text-sm text-[#5d5f5f]">
            Each site gets its own database. Complete isolation. Row-level locking.
            Ideal for multi-tenant production deployments.
          </p>
        </div>
        <div className="bg-[#FAFAFA] border border-outline-variant rounded-sm p-4">
          <h4 className="font-bold text-black text-sm mb-1">LibSQL (SQLite)</h4>
          <p className="text-sm text-[#5d5f5f]">
            Share one database across sites. Site-specific table naming for isolation.
            Ideal for single-server or edge deployments. WAL mode for concurrent writes.
          </p>
        </div>
      </div>
    </section>
  )
}
