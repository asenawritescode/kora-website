export function ApiReferenceSection() {
  return (
    <section className="mb-24" id="api-reference">
      <h2 className="text-[30px] leading-[38px] font-semibold text-ink mb-3">
        API Reference
      </h2>
      <p className="text-base text-ink-3 mb-6 leading-relaxed">
        Every DocType you create gets a full REST API. No code. List, create, read,
        update, and delete — all secured with session auth and CSRF protection.
        Auto-generated OpenAPI spec at{' '}
        <code className="text-xs bg-surface-2 px-1 rounded-sm text-ink">/api/openapi.json</code>
        {' '}with Swagger UI at{' '}
        <code className="text-xs bg-surface-2 px-1 rounded-sm text-ink">/api/swagger-ui</code>.
      </p>

      <div className="space-y-3">
        <div className="border border-line rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-surface-2 border-b border-line">
            <span className="font-mono px-2 py-0.5 bg-success-strong text-white rounded-sm text-[11px] font-bold uppercase">GET</span>
            <code className="font-mono text-sm text-ink">/api/resource/Customer</code>
          </div>
          <div className="p-4 bg-paper">
            <p className="text-sm text-ink-3 mb-3">List documents. Paginate, filter, sort — all via query params.</p>
            <div className="space-y-1.5">
              {[
                { param: 'limit', desc: 'Max results per page' },
                { param: 'offset', desc: 'Pagination offset' },
                { param: 'order_by', desc: 'Field to sort by' },
                { param: 'fields', desc: 'Fields to include (comma-separated)' },
                { param: 'filters', desc: 'Filter by field values (JSON)' },
              ].map((p) => (
                <div key={p.param} className="flex items-start gap-3 text-sm">
                  <code className="font-mono w-20 shrink-0 text-ink text-xs pt-0.5">{p.param}</code>
                  <span className="text-ink-3">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-line rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-surface-2 border-b border-line">
            <span className="font-mono px-2 py-0.5 bg-action text-paper rounded-sm text-[11px] font-bold uppercase">POST</span>
            <code className="font-mono text-sm text-ink">/api/resource/Customer</code>
          </div>
          <div className="p-4 bg-paper">
            <p className="text-sm text-ink-3">Create a document. Send a JSON body with field values. Auto-generates document names.</p>
          </div>
        </div>

        <div className="border border-line rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-surface-2 border-b border-line">
            <span className="font-mono px-2 py-0.5 bg-success-strong text-white rounded-sm text-[11px] font-bold uppercase">GET</span>
            <code className="font-mono text-sm text-ink">/api/resource/Customer/:name</code>
          </div>
          <div className="p-4 bg-paper">
            <p className="text-sm text-ink-3">Get a single document by its name (ULID or auto-generated ID).</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-ink-3 mt-4">
        Response envelope:{' '}
        <code className="text-ink">{'{"data": ..., "meta": {"doctype": "...", "total": N}}'}</code>
      </p>
    </section>
  )
}
