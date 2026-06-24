import { Copy } from 'lucide-react'

const DOCKER_CMD = `docker run -d --name kora -p 8000:8000 \\
  -e KORA_DB_TYPE=mysql \\
  -e KORA_DB_HOST=127.0.0.1 \\
  -e KORA_DB_USER=root \\
  -e KORA_DB_PASSWORD=yourpassword \\
  -e CONSOLE_EMAIL=admin@kora.local \\
  -e CONSOLE_PASSWORD=admin123 \\
  smitdockerhub/kora:latest`

const LOCAL_CMD = `git clone https://github.com/asenawritescode/kora.git
cd kora
docker compose up -d mysql
make dev DB_PASS=kora123 ADMIN_PASS=kora123`

export function QuickStartSection() {
  return (
    <section className="mb-[120px]">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-4">
        Quick Start
      </h2>
      <p className="text-base text-[#5d5f5f] mb-8">
        Get Kora running in under two minutes. You&apos;ll have a working application
        engine with a database, REST API, admin UI, and AI chat — all from a single binary.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Docker */}
        <div className="bg-[#FAFAFA] border border-outline-variant rounded-sm p-6 flex flex-col justify-between hover:border-black transition-colors group">
          <div>
            <h3 className="font-bold text-sm text-black mb-2">Docker</h3>
            <p className="text-[#5d5f5f] text-sm mb-4">
              Pull the image and start. MySQL or LibSQL. All config via environment variables.
            </p>
          </div>
          <div className="bg-black text-white p-3 rounded-sm text-xs overflow-x-auto group-hover:bg-[#1a1a1a] transition-colors" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
            <pre className="whitespace-pre-wrap"><code>{DOCKER_CMD}</code></pre>
          </div>
        </div>

        {/* From Source */}
        <div className="bg-[#FAFAFA] border border-outline-variant rounded-sm p-6 flex flex-col justify-between hover:border-black transition-colors group">
          <div>
            <h3 className="font-bold text-sm text-black mb-2">From Source</h3>
            <p className="text-[#5d5f5f] text-sm mb-4">
              Clone the repo, build, and run. Go 1.25+ and Bun required for the UI.
            </p>
          </div>
          <div className="bg-black text-white p-3 rounded-sm text-xs overflow-x-auto group-hover:bg-[#1a1a1a] transition-colors" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
            <pre className="whitespace-pre-wrap"><code>{LOCAL_CMD}</code></pre>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#5d5f5f] mt-4" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
        Open <span className="text-black">http://localhost:8000/console</span> → create your first site.
        All config via env vars, all data in the database. No YAML files to lose.
      </p>
    </section>
  )
}
