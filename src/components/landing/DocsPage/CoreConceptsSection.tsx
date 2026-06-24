export function CoreConceptsSection() {
  return (
    <section className="mb-24" id="core-concepts">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-3">
        Core Concepts
      </h2>
      <p className="text-base text-[#5d5f5f] mb-8 leading-relaxed">
        Four ideas power everything in Kora. Once you understand them, you can build
        any business application — whether you write YAML or describe it to the AI.
      </p>

      <div className="space-y-6">
        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-1">DocType</h3>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            A DocType is a data model. &quot;Customer,&quot; &quot;Invoice,&quot; &quot;Inventory Item&quot; — each
            one is a DocType. Define the fields you need, and Kora creates the database table,
            the REST API, and the forms. All from one definition.
          </p>
        </div>

        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-1">Field</h3>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            Fields are the columns in your DocType. Text, numbers, dates, dropdowns, file
            uploads, links to other doctypes — Kora supports 20+ field types. Mark a field
            as required, unique, or computed (like{' '}
            <code className="text-xs bg-[#f1edec] px-1 rounded-sm text-black">quantity × price</code>).
            Kora handles validation and the database schema.
          </p>
        </div>

        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-1">Document</h3>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            A Document is one record — one customer, one sale, one expense. It lives as a row
            in your database. You own it. Export it, query it directly with SQL, back it up.
            No proprietary format, no lock-in.
          </p>
        </div>

        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-1">Site</h3>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            A Site is an isolated workspace. Each site has its own database, users, doctypes,
            and analytics. One Kora server can host dozens of sites — great for agencies
            managing multiple clients or teams running separate environments.
          </p>
        </div>

        <div className="border border-outline-variant rounded-sm p-5">
          <h3 className="font-bold text-black mb-1">Workflow</h3>
          <p className="text-sm text-[#5d5f5f] leading-relaxed">
            Need approvals? A document lifecycle? Define states and transitions in YAML.
            &quot;Draft → Submitted → Approved.&quot; Control who can move between states.
            The engine enforces the rules. No custom code.
          </p>
        </div>
      </div>
    </section>
  )
}
