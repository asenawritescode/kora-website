export function ApiReferenceSection() {
  return (
    <section className="mb-[120px]">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-4 border-b border-outline-variant pb-2">
        API Reference
      </h2>
      <p className="mb-4 text-[#5d5f5f]">
        Every doctype automatically gets a full REST API. No code needed. All endpoints
        are secured with session authentication and CSRF tokens. An auto-generated
        OpenAPI 3.x spec is available at <code className="text-xs bg-[#f1edec] px-1 rounded text-black">/api/openapi.json</code> with
        Swagger UI at <code className="text-xs bg-[#f1edec] px-1 rounded text-black">/api/swagger-ui</code>.
      </p>

      <div className="space-y-4">
        {/* GET List */}
        <div className="border border-outline-variant rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-[#f1edec] border-b border-outline-variant">
            <span className="px-2 py-0.5 bg-[#16A34A] text-white rounded-sm text-[10px] uppercase font-bold" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>GET</span>
            <code className="text-sm text-black" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>/api/resource/Customer</code>
          </div>
          <div className="p-4 bg-[#FAFAFA]">
            <p className="text-sm text-[#5d5f5f] mb-3">List documents with pagination, filtering, and ordering.</p>
            <div className="space-y-2">
              {[
                { param: 'limit', type: 'int', desc: 'Max results (default 20)' },
                { param: 'offset', type: 'int', desc: 'Pagination offset' },
                { param: 'order_by', type: 'string', desc: 'Field to sort by' },
                { param: 'fields', type: 'string[]', desc: 'Fields to return (comma-separated)' },
                { param: 'filters', type: 'json', desc: 'Field value filters' },
              ].map((p) => (
                <div key={p.param} className="flex items-start gap-3 text-sm">
                  <code className="w-20 shrink-0 text-black" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{p.param}</code>
                  <span className="text-[10px] text-[#5d5f5f] w-16 shrink-0 uppercase" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{p.type}</span>
                  <span className="text-[#5d5f5f]">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* POST Create */}
        <div className="border border-outline-variant rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-[#f1edec] border-b border-outline-variant">
            <span className="px-2 py-0.5 bg-[#FF6B35] text-white rounded-sm text-[10px] uppercase font-bold" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>POST</span>
            <code className="text-sm text-black" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>/api/resource/Customer</code>
          </div>
          <div className="p-4 bg-[#FAFAFA]">
            <p className="text-sm text-[#5d5f5f]">Create a new document. Send a JSON body with field values. Auto-generates document names.</p>
          </div>
        </div>

        {/* GET Single */}
        <div className="border border-outline-variant rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-[#f1edec] border-b border-outline-variant">
            <span className="px-2 py-0.5 bg-[#16A34A] text-white rounded-sm text-[10px] uppercase font-bold" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>GET</span>
            <code className="text-sm text-black" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>/api/resource/Customer/:name</code>
          </div>
          <div className="p-4 bg-[#FAFAFA]">
            <p className="text-sm text-[#5d5f5f]">Retrieve a single document by its name (ULID or auto-generated).</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#5d5f5f] mt-4" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
        All responses use the envelope: <code className="text-black">{'{"data": ..., "meta": {"doctype": "...", "total": N}}'}</code>.
        Errors: <code className="text-black">{'{"error": {"type": "UniqueConstraint", "message": "...", "field": "fieldname"}}'}</code>.
      </p>
    </section>
  )
}
