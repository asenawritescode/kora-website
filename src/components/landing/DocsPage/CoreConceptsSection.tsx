export function CoreConceptsSection() {
  return (
    <section className="mb-[120px]">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-4 border-b border-outline-variant pb-2">
        Core Concepts
      </h2>
      <p className="mb-6 text-[#5d5f5f]">
        Kora uses a few key concepts. Understanding these will help you build applications
        quickly — whether you write YAML or use the AI Chat.
      </p>

      <div className="space-y-6">
        <div className="border-l-2 border-black pl-4">
          <h3 className="font-bold text-black mb-1">DocType</h3>
          <p className="text-sm text-[#5d5f5f]">
            A DocType defines a data model — like &quot;Customer&quot;, &quot;Invoice&quot;, or &quot;Product&quot;.
            It has fields (columns), constraints (validation rules), and optional workflows
            (state machines). When you activate a DocType, Kora creates the database table
            automatically. Think of it as a database table + form + API — defined in one place.
          </p>
        </div>

        <div className="border-l-2 border-[#c4c7c7] pl-4">
          <h3 className="font-bold text-black mb-1">Field</h3>
          <p className="text-sm text-[#5d5f5f]">
            Fields define the columns in your doctype. Kora supports 20+ field types:
            Data (text), Int, Float, Currency, Select (dropdown), Link (foreign key),
            Table (child records), Date, DateTime, Check (boolean), Text, Attach (file upload),
            and more. Fields can be required, unique, computed (expressions like{' '}
            <code className="text-xs bg-[#f1edec] px-1 rounded text-black">quantity * unit_price</code>),
            or read-only.
          </p>
        </div>

        <div className="border-l-2 border-[#c4c7c7] pl-4">
          <h3 className="font-bold text-black mb-1">Document</h3>
          <p className="text-sm text-[#5d5f5f]">
            A Document is a single record of a DocType — one customer, one invoice, one
            product. Every document gets system columns automatically: name (ID), owner,
            creation date, modified date, and doc_status (Draft → Submitted → Cancelled).
            Documents are stored as rows in your database. You own the data.
          </p>
        </div>

        <div className="border-l-2 border-[#c4c7c7] pl-4">
          <h3 className="font-bold text-black mb-1">Site</h3>
          <p className="text-sm text-[#5d5f5f]">
            A Site is an isolated workspace with its own database, users, doctypes,
            and analytics pipeline. One Kora instance can serve dozens of sites.
            Sites are created from the Console UI at <code className="text-xs bg-[#f1edec] px-1 rounded text-black">/console</code>.
            Each site has its own login, permissions, and data — completely isolated.
          </p>
        </div>

        <div className="border-l-2 border-[#c4c7c7] pl-4">
          <h3 className="font-bold text-black mb-1">Workflow</h3>
          <p className="text-sm text-[#5d5f5f]">
            Submittable doctypes can have workflows — state machines that control
            document lifecycle. Define states (Draft, Submitted, Approved, Archived),
            transitions (who can move from one state to another), and conditions.
            Workflows are defined in YAML and enforced by the engine. No custom code.
          </p>
        </div>
      </div>
    </section>
  )
}
