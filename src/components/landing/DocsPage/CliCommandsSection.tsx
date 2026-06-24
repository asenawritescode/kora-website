const COMMANDS = [
  { cmd: './kora serve --port 8000', desc: 'Start the Kora server' },
  { cmd: './kora setup --site <hostname> --path <config>', desc: 'Set up a new site from YAML config files' },
  { cmd: './kora migrate --all', desc: 'Apply all pending schema migrations' },
  { cmd: './kora config import --site <hostname> --path <dir>', desc: 'Re-import YAML config to the database' },
  { cmd: './kora config versions --site <hostname>', desc: 'List all config versions with status' },
  { cmd: './kora config diff --site <hostname> --from <v1> --to <v2>', desc: 'Diff two config versions' },
  { cmd: './kora config rollback --site <hostname> --to-version <n>', desc: 'Roll back to a previous config version' },
  { cmd: './kora mcp --site <hostname>', desc: 'Start MCP server for Claude Desktop integration' },
  { cmd: './kora secret set --site <hostname> --key <key> --value <val>', desc: 'Set an AI provider API key' },
]

const BUILD_COMMANDS = [
  { cmd: 'make build', desc: 'Build UI (bun) + Go binary' },
  { cmd: 'make serve', desc: 'Build + start server on :8000' },
  { cmd: 'make dev', desc: 'Full dev setup: MySQL + build + setup + serve' },
  { cmd: 'make test', desc: 'Run Go tests' },
  { cmd: 'make lint', desc: 'Run linters (Go + TypeScript)' },
  { cmd: 'make fmt', desc: 'Format code' },
]

export function CliCommandsSection() {
  return (
    <section className="mb-[120px]">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-4 border-b border-outline-variant pb-2">
        CLI Commands
      </h2>
      <p className="mb-6 text-[#5d5f5f]">
        Kora ships as a single binary. All management happens through the CLI or the admin UI.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-left">
              <th className="py-2 pr-4 font-medium text-black text-xs uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Command</th>
              <th className="py-2 font-medium text-black text-xs uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {COMMANDS.map((c) => (
              <tr key={c.cmd} className="border-b border-outline-variant/50">
                <td className="py-2 pr-4" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                  <code className="text-black text-xs">{c.cmd}</code>
                </td>
                <td className="py-2 text-[#5d5f5f]">{c.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-bold text-black mt-8 mb-3">Make Commands</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-left">
              <th className="py-2 pr-4 font-medium text-black text-xs uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Command</th>
              <th className="py-2 font-medium text-black text-xs uppercase tracking-wider" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {BUILD_COMMANDS.map((c) => (
              <tr key={c.cmd} className="border-b border-outline-variant/50">
                <td className="py-2 pr-4" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                  <code className="text-black text-xs">{c.cmd}</code>
                </td>
                <td className="py-2 text-[#5d5f5f]">{c.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
