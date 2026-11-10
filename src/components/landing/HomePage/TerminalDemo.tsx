export function TerminalDemo() {
  return (
    <div className="bg-code rounded-lg p-6 max-w-3xl mx-auto text-left shadow-2xl overflow-hidden border border-code-border">
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-danger" />
        <div className="w-3 h-3 rounded-full bg-action" />
        <div className="w-3 h-3 rounded-full bg-success" />
      </div>

      <div className="space-y-3 font-mono text-sm">
        <div>
          <span className="text-code-muted">$ </span>
          <span className="text-code-ink">docker run -d --name kora -p 8000:8000 \</span>
        </div>
        <div className="text-code-ink leading-relaxed pl-4">
          -e KORA_DB_TYPE=mysql \<br />
          -e KORA_DB_HOST=127.0.0.1 \<br />
          -e KORA_DB_USER=root \<br />
          -e KORA_DB_PASSWORD=yourpassword \<br />
          -e CONSOLE_EMAIL=admin@kora.local \<br />
          -e CONSOLE_PASSWORD=admin123 \<br />
          smitdockerhub/kora:latest
        </div>

        <div className="text-success">396a1b2c3d4e — container started</div>

        <div className="pt-4 border-t border-code-border">
          <span className="text-code-muted">$ </span>
          <span className="text-code-accent">open</span>
          <span className="text-code-ink"> http://localhost:8000/console</span>
        </div>

        <div className="text-code-muted text-xs space-y-1">
          <div className="text-success">✓ Console admin panel loaded</div>
          <div className="text-success">✓ Create your first site — pick a name, set a domain</div>
          <div className="text-success">✓ Your application is live at /workspace</div>
        </div>

        <div className="text-white font-medium pt-2">
          One binary. All config via env vars. No files to lose.
        </div>
      </div>
    </div>
  )
}
