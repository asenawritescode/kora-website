export function CoreConceptsSection() {
  return (
    <section className="mb-24" id="core-concepts">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-3">
        Core Concepts
      </h2>
      <p className="text-base text-[#5d5f5f] mb-8 leading-relaxed">
        Kora uses a few key ideas to turn configuration into running applications.
        Understanding these will help you build faster — whether you write YAML or
        describe your business to the AI.
      </p>

      {/* DocTypes */}
      <div className="space-y-8">
        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-2">DocTypes</h3>
          <p className="text-sm text-[#5d5f5f] mb-3 leading-relaxed">
            A DocType is your data model. &quot;Customer,&quot; &quot;Invoice,&quot; &quot;Inventory Item&quot; — each
            one is a DocType. Define the fields you need, and Kora creates the database table,
            REST API, and React forms. Activate it and start creating documents immediately.
          </p>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            <strong>How to create one:</strong> Use the AI Chat to describe your business
            (&quot;I need to track products and stock levels&quot;), or write YAML directly in the
            admin panel. Every AI-created doctype starts as a Draft — review and activate
            when you&apos;re ready.
          </p>
        </div>

        {/* Fields */}
        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-3">Fields</h3>
          <p className="text-sm text-[#5d5f5f] mb-4 leading-relaxed">
            Fields define the columns in your doctype. Each field has a type, label, and
            optional properties like required, unique, or computed.
          </p>

          <h4 className="font-bold text-black text-sm mb-2">Field Types</h4>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-left">
                  <th className="py-2 pr-4 font-medium text-black text-xs uppercase tracking-wider font-mono">Type</th>
                  <th className="py-2 pr-4 font-medium text-black text-xs uppercase tracking-wider font-mono">Use when</th>
                  <th className="py-2 font-medium text-black text-xs uppercase tracking-wider font-mono">Example</th>
                </tr>
              </thead>
              <tbody className="text-[#5d5f5f]">
                {[
                  ['Data', 'Short text, names, emails, SKUs', 'customer_name, email, sku'],
                  ['Text', 'Long descriptions, notes, addresses', 'description, shipping_address'],
                  ['Int', 'Whole numbers, quantities, counters', 'quantity, age, reorder_level'],
                  ['Float', 'Decimal numbers, measurements', 'weight_kg, tax_rate'],
                  ['Currency', 'Any monetary amount', 'selling_price, total_amount, cost'],
                  ['Select', 'Fixed set of options', 'status (Pending/Paid/Cancelled)'],
                  ['Link', 'Reference to another doctype', 'customer → Customer doctype'],
                  ['Dynamic Link', 'Can link to multiple doctypes', 'reference → Invoice or Order'],
                  ['Table', 'Child rows in a parent document', 'Sale Items inside a Sale'],
                  ['Check', 'Boolean yes/no, on/off, active/inactive', 'is_active, taxable, in_stock'],
                  ['Date', 'Calendar dates only', 'due_date, birth_date'],
                  ['DateTime', 'Date with exact time', 'appointment_time, delivered_at'],
                  ['Attach', 'File uploads, images, documents', 'receipt, contract_pdf, photo'],
                  ['Section Break', 'Visual divider in forms', '(no data — layout only)'],
                  ['Column Break', 'Side-by-side field layout', '(no data — layout only)'],
                  ['Heading', 'Section title inside a form', '(no data — layout only)'],
                ].map(([type, use, example]) => (
                  <tr key={type} className="border-b border-outline-variant/30">
                    <td className="py-2 pr-4 font-mono text-black text-xs">{type}</td>
                    <td className="py-2 pr-4">{use}</td>
                    <td className="py-2 text-xs font-mono">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="font-bold text-black text-sm mb-2">Field Properties</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-left">
                  <th className="py-2 pr-4 font-medium text-black text-xs uppercase tracking-wider font-mono">Property</th>
                  <th className="py-2 font-medium text-black text-xs uppercase tracking-wider font-mono">What it does</th>
                </tr>
              </thead>
              <tbody className="text-[#5d5f5f]">
                {[
                  ['reqd', 'Required — cannot be left empty when saving'],
                  ['unique', 'Must be unique across all documents of this doctype'],
                  ['in_list_view', 'Shows in the list/table view (good for key fields)'],
                  ['in_standard_filter', 'Appears in the filter sidebar for quick filtering'],
                  ['computed', 'Auto-calculated from an expression, e.g. quantity * unit_price'],
                  ['read_only', 'Visible but not editable by users'],
                  ['depends_on', 'Show/hide this field based on another field\'s value'],
                  ['linked_field', 'Auto-populate from a linked document, e.g. product.selling_price'],
                  ['constraints', 'Validation rules: min, max, regex, one_of, etc.'],
                ].map(([prop, desc]) => (
                  <tr key={prop} className="border-b border-outline-variant/30">
                    <td className="py-2 pr-4 font-mono text-black text-xs">{prop}</td>
                    <td className="py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents */}
        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-2">Documents</h3>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            A Document is one record — one customer, one sale, one expense. Every document
            gets system columns automatically: name (ID), owner, creation date, modified date,
            and doc_status. Documents live as rows in your database. You can query them
            directly with SQL, export them, or back them up. No proprietary format.
          </p>
        </div>

        {/* Workflows */}
        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-2">Workflows</h3>
          <p className="text-sm text-[#5d5f5f] mb-3 leading-relaxed">
            Submittable doctypes can have workflows — state machines that control document
            lifecycle. Define states and transitions in YAML. The engine enforces the rules.
          </p>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            <strong>Example:</strong> An Invoice workflow might have states Draft → Submitted →
            Approved → Paid. Each transition defines who can move it (by role) and what
            conditions must be met. A cashier can submit, a manager can approve, and
            the system auto-transitions on payment.
          </p>
        </div>

        {/* Permissions */}
        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-2">Permissions</h3>
          <p className="text-sm text-[#5d5f5f] mb-3 leading-relaxed">
            Role-based access control. Each role gets 10 permissions per doctype: Read,
            Write, Create, Delete, Submit, Cancel, Amend, Export, Import, Report. The{' '}
            <code className="text-xs bg-[#f1edec] px-1 rounded-sm text-black">if_owner</code> flag
            scopes permissions to documents the user created. The Administrator role
            bypasses all checks.
          </p>
        </div>

        {/* Sites */}
        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-2">Sites</h3>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            A Site is an isolated workspace with its own database, users, doctypes, and
            analytics. One Kora instance can host dozens of sites. Access via hostname
            (<code className="text-xs bg-[#f1edec] px-1 rounded-sm text-black">mybusiness.local</code>)
            or path (<code className="text-xs bg-[#f1edec] px-1 rounded-sm text-black">/s/mybusiness/workspace</code>).
            Sites can be hot-added and removed without restarting the server.
          </p>
        </div>
      </div>
    </section>
  )
}
