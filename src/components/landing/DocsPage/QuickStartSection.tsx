const DOCKER_CMD = `docker run -d --name kora -p 8000:8000 \\
  -e KORA_DB_TYPE=mysql \\
  -e KORA_DB_HOST=127.0.0.1 \\
  -e KORA_DB_USER=root \\
  -e KORA_DB_PASSWORD=yourpassword \\
  -e CONSOLE_EMAIL=admin@kora.local \\
  -e CONSOLE_PASSWORD=admin123 \\
  smitdockerhub/kora:latest`

export function QuickStartSection() {
  return (
    <section className="mb-24" id="quick-start">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-3">
        Quick Start
      </h2>
      <p className="text-base text-[#5d5f5f] mb-6 leading-relaxed">
        You&apos;re two minutes away from a running application. Pull the Docker
        image, set a few environment variables, and open your browser. That&apos;s it.
      </p>

      <div className="bg-[#0A0A0A] rounded-sm overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-outline-variant/30">
          <span className="text-xs text-[#5d5f5f]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>terminal</span>
        </div>
        <pre className="p-4 text-xs text-[#E5E5E5] overflow-x-auto leading-relaxed" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
          <code>{DOCKER_CMD}</code>
        </pre>
      </div>

      <p className="text-sm text-[#5d5f5f] mb-8">
        Then open{' '}
        <code className="text-xs bg-[#f1edec] px-1.5 py-0.5 rounded-sm text-black">http://localhost:8000/console</code>
        {' '}and create your first site. All config via environment variables — no YAML
        files to lose, nothing to sync between servers.
      </p>

      <h3 className="font-bold text-black mb-3">Prefer to build from source?</h3>
      <div className="bg-[#0A0A0A] rounded-sm overflow-hidden mb-4">
        <pre className="p-4 text-xs text-[#E5E5E5] overflow-x-auto leading-relaxed" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
          <code>{`git clone https://github.com/asenawritescode/kora.git
cd kora
docker compose up -d mysql
make dev DB_PASS=kora123 ADMIN_PASS=kora123`}</code>
        </pre>
      </div>
      <p className="text-sm text-[#5d5f5f]">
        Requires Go 1.25+ and Bun. The <code className="text-xs bg-[#f1edec] px-1 rounded-sm text-black">make dev</code> command
        handles everything: MySQL, build, setup, and serve.
      </p>
    </section>
  )
}
