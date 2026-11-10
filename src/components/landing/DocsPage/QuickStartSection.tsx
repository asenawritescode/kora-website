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
      <h2 className="text-[30px] leading-[38px] font-semibold text-ink mb-3">
        Quick Start
      </h2>
      <p className="text-base text-ink-3 mb-6 leading-relaxed">
        To run the application, pull the Docker
        image, set a few environment variables, and open your browser. That&apos;s it.
      </p>

      <div className="bg-code rounded-sm overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-2 bg-code-rule border-b border-line/30">
          <span className="font-mono text-xs text-code-muted">terminal</span>
        </div>
        <pre className="font-mono p-4 text-xs text-code-ink overflow-x-auto leading-relaxed">
          <code>{DOCKER_CMD}</code>
        </pre>
      </div>

      <p className="text-sm text-ink-3 mb-8">
        Then open{' '}
        <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded-sm text-ink">http://localhost:8000/console</code>
        {' '}and create your first site. All config via environment variables — no YAML
        files to lose, nothing to sync between servers.
      </p>

      <h3 className="font-bold text-ink mb-3">Prefer to build from source?</h3>
      <div className="bg-code rounded-sm overflow-hidden mb-4">
        <pre className="font-mono p-4 text-xs text-code-ink overflow-x-auto leading-relaxed">
          <code>{`git clone https://github.com/asenawritescode/kora.git
cd kora
docker compose up -d mysql
make dev DB_PASS=kora123 ADMIN_PASS=kora123`}</code>
        </pre>
      </div>
      <p className="text-sm text-ink-3">
        Requires Go 1.25+ and Bun. The <code className="text-xs bg-surface-2 px-1 rounded-sm text-ink">make dev</code> command
        handles everything: MySQL, build, setup, and serve.
      </p>
    </section>
  )
}
