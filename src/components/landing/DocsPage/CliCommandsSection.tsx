const COMMANDS = [
  { cmd: './kora serve --port 8000', desc: 'Start the server' },
  { cmd: './kora setup --site <hostname> --path <dir>', desc: 'Set up a new site from YAML config' },
  { cmd: './kora migrate --all', desc: 'Apply all pending schema migrations' },
  { cmd: './kora config import --site <s> --path <dir>', desc: 'Import YAML config to the database' },
  { cmd: './kora config versions --site <s>', desc: 'List config versions and their status' },
  { cmd: './kora config diff --site <s> --from <v1> --to <v2>', desc: 'Diff two config versions' },
  { cmd: './kora config rollback --site <s> --to-version <n>', desc: 'Roll back to a previous version' },
  { cmd: './kora secret set --site <s> --key <k> --value <v>', desc: 'Set an AI provider API key' },
  { cmd: './kora mcp --site <s>', desc: 'Start MCP server for Claude Desktop' },
]

const BUILD_COMMANDS = [
  { cmd: 'make build', desc: 'Build UI + Go binary' },
  { cmd: 'make serve', desc: 'Build + start server on :8000' },
  { cmd: 'make dev', desc: 'Full setup: MySQL + build + setup + serve' },
  { cmd: 'make test', desc: 'Run Go tests' },
  { cmd: 'make lint', desc: 'Lint Go + TypeScript' },
  { cmd: 'make fmt', desc: 'Format code' },
]

export function CliCommandsSection() {
  return (
    <section className="mb-24" id="cli-commands">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-3">
        CLI Commands
      </h2>
      <p className="text-base text-[#5d5f5f] mb-6 leading-relaxed">
        Kora ships as a single binary. Everything you can do in the admin UI, you can
        also do from the command line.
      </p>

      <h3 className="font-bold text-black mb-3">Runtime Commands</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <tbody>
            {COMMANDS.map((c) => (
              <tr key={c.cmd} className="border-b border-outline-variant/30">
                <td className="py-2 pr-4" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                  <code className="text-black text-xs">{c.cmd}</code>
                </td>
                <td className="py-2 text-[#5d5f5f]">{c.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-bold text-black mb-3">Build Commands</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {BUILD_COMMANDS.map((c) => (
              <tr key={c.cmd} className="border-b border-outline-variant/30">
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
