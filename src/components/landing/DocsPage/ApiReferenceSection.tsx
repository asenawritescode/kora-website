export function ApiReferenceSection() {
  return (
    <section className="mb-24" id="api-reference">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-3">
        API Reference
      </h2>
      <p className="text-base text-[#5d5f5f] mb-6 leading-relaxed">
        Every DocType you create gets a full REST API. No code. List, create, read,
        update, and delete — all secured with session auth and CSRF protection.
        Auto-generated OpenAPI spec at{' '}
        <code className="text-xs bg-[#f1edec] px-1 rounded-sm text-black">/api/openapi.json</code>
        {' '}with Swagger UI at{' '}
        <code className="text-xs bg-[#f1edec] px-1 rounded-sm text-black">/api/swagger-ui</code>.
      </p>

      <div className="space-y-3">
        <div className="border border-outline-variant rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-[#f1edec] border-b border-outline-variant">
            <span className="px-2 py-0.5 bg-[#16A34A] text-white rounded-sm text-[10px] font-bold uppercase" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>GET</span>
            <code className="text-sm text-black" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>/api/resource/Customer</code>
          </div>
          <div className="p-4 bg-[#FAFAFA]">
            <p className="text-sm text-[#5d5f5f] mb-3">List documents. Paginate, filter, sort — all via query params.</p>
            <div className="space-y-1.5">
              {[
                { param: 'limit', desc: 'Max results per page' },
                { param: 'offset', desc: 'Pagination offset' },
                { param: 'order_by', desc: 'Field to sort by' },
                { param: 'fields', desc: 'Fields to include (comma-separated)' },
                { param: 'filters', desc: 'Filter by field values (JSON)' },
              ].map((p) => (
                <div key={p.param} className="flex items-start gap-3 text-sm">
                  <code className="w-20 shrink-0 text-black text-xs pt-0.5" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{p.param}</code>
                  <span className="text-[#5d5f5f]">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-outline-variant rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-[#f1edec] border-b border-outline-variant">
            <span className="px-2 py-0.5 bg-[#FF6B35] text-white rounded-sm text-[10px] font-bold uppercase" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>POST</span>
            <code className="text-sm text-black" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>/api/resource/Customer</code>
          </div>
          <div className="p-4 bg-[#FAFAFA]">
            <p className="text-sm text-[#5d5f5f]">Create a document. Send a JSON body with field values. Auto-generates document names.</p>
          </div>
        </div>

        <div className="border border-outline-variant rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-[#f1edec] border-b border-outline-variant">
            <span className="px-2 py-0.5 bg-[#16A34A] text-white rounded-sm text-[10px] font-bold uppercase" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>GET</span>
            <code className="text-sm text-black" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>/api/resource/Customer/:name</code>
          </div>
          <div className="p-4 bg-[#FAFAFA]">
            <p className="text-sm text-[#5d5f5f]">Get a single document by its name (ULID or auto-generated ID).</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#5d5f5f] mt-4" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
        Response envelope:{' '}
        <code className="text-black">{'{"data": ..., "meta": {"doctype": "...", "total": N}}'}</code>
      </p>
    </section>
  )
}
