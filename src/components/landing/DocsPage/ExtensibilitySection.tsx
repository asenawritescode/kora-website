export function ExtensibilitySection() {
  return (
    <section id="extensibility" className="mb-16 scroll-mt-20">
      <div className="border-b border-outline-variant pb-4 mb-6">
        <h2 className="text-[20px] leading-[28px] font-semibold text-black mb-1 tracking-[-0.02em]">
          Extensibility &amp; Plugin System
        </h2>
        <p className="text-sm text-[#5d5f5f]">
          Extend Kora with JavaScript, webhooks, custom API endpoints, and workflow automation.
        </p>
      </div>

      <div className="space-y-8">
        {/* Script Engine */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">JavaScript Script Engine</h3>
          <p className="text-sm text-[#5d5f5f] mb-2">
            Write scripts in JavaScript (ES5.1+) that run on Kora's embedded goja runtime.
            15 prewarmed VMs, 128MB memory limit, 5-second timeout. Scripts can read and write
            documents, call external APIs, and access encrypted secrets.
          </p>
          <pre className="bg-[#0A0A0A] text-[#E5E5E5] rounded-lg p-4 text-xs font-mono overflow-x-auto">
{`// before_save script — validate an order before saving
var order = event.doc;
if (!order.total || order.total <= 0) {
  throw new Error('Order total must be greater than zero');
}

// Call an external API
var response = kora.http.fetch({
  method: 'POST',
  url: 'https://api.example.com/validate',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId: order.name, total: order.total })
});

kora.log.info('Order validated:', order.name, 'Status:', response.status);
return { doc: order };`}
          </pre>
        </div>

        {/* Event Hooks */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">Event Hooks</h3>
          <p className="text-sm text-[#5d5f5f] mb-2">
            Scripts hook into 8 ORM lifecycle events. Synchronous events can reject operations.
            Async events fire-and-forget for side effects.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {[
              ['before_insert', 'sync — can reject'],
              ['after_insert', 'async — side effects'],
              ['before_save', 'sync — can reject'],
              ['after_save', 'async — side effects'],
              ['before_delete', 'sync — can reject'],
              ['after_delete', 'async — cleanup'],
              ['validate', 'sync — custom validation'],
              ['computed', 'sync — compute field values'],
            ].map(([event, desc]) => (
              <div key={event} className="bg-[#f5f5f5] rounded px-3 py-1.5 flex justify-between">
                <span className="text-black">{event}</span>
                <span className="text-[#8E8E8E]">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Webhook Extensions */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">Webhook Extensions</h3>
          <p className="text-sm text-[#5d5f5f] mb-2">
            Register webhook endpoints that receive document events. HMAC-SHA256 signed
            with Stripe-compatible headers. Automatic retry with exponential backoff.
            Auto-disables after 15 consecutive failures.
          </p>
          <pre className="bg-[#0A0A0A] text-[#E5E5E5] rounded-lg p-4 text-xs font-mono overflow-x-auto">
{`# Webhook delivery to your endpoint
POST https://your-app.com/kora-webhook
Content-Type: application/json
Kora-Signature: t=1719000000,v1=a1b2c3d4e5f6...

{
  "id": "01J...",
  "event": "after_save",
  "doctype": "Order",
  "document": { "name": "ORD-0001", "total": 150.00 },
  "site": "myapp.kora.dev"
}`}
          </pre>
        </div>

        {/* Custom API Methods */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">Custom API Methods</h3>
          <p className="text-sm text-[#5d5f5f]">
            Define custom endpoints at <code className="bg-gray-100 px-1 rounded text-xs">/api/method/:name</code> backed by scripts.
            Authenticate with Bearer tokens or session cookies. Use for webhooks, integrations,
            or custom business logic that other services call into.
          </p>
        </div>

        {/* Workflow Actions */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">Workflow Actions</h3>
          <p className="text-sm text-[#5d5f5f]">
            Attach scripts or webhooks to workflow transitions. <code className="bg-gray-100 px-1 rounded text-xs">on_transition</code>,
            <code className="bg-gray-100 px-1 rounded text-xs">on_success</code>, and <code className="bg-gray-100 px-1 rounded text-xs">on_failure</code> triggers
            execute when documents change state. Automate notifications, integrations, and audit trails.
          </p>
        </div>

        {/* Computed Fields */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">Computed Fields</h3>
          <p className="text-sm text-[#5d5f5f]">
            Expression-based (<code className="bg-gray-100 px-1 rounded text-xs">quantity * unit_price</code>) or
            script-based (<code className="bg-gray-100 px-1 rounded text-xs">@script:calculate_tax</code>).
            Dependency-ordered evaluation with support for <code className="bg-gray-100 px-1 rounded text-xs">SUM()</code>,
            <code className="bg-gray-100 px-1 rounded text-xs">ROUND()</code>, and arithmetic.
          </p>
        </div>

        {/* Scheduled Scripts */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">Scheduled Scripts</h3>
          <p className="text-sm text-[#5d5f5f]">
            Run scripts on cron schedules. Use for daily reports, data cleanup, periodic syncs.
            Managed through the built-in scheduler alongside doctype alerts and email reports.
          </p>
        </div>
      </div>
    </section>
  )
}
