const YAML_EXAMPLE = `name: Customer
module: CRM
title_field: customer_name
sort_field: modified
sort_order: DESC

fields:
  - fieldname: customer_name
    fieldtype: Data
    label: Customer Name
    reqd: true
    in_list_view: true
    search_index: true

  - fieldname: email
    fieldtype: Data
    label: Email
    unique: true

  - fieldname: industry
    fieldtype: Select
    label: Industry
    options: |
      Technology
      Healthcare
      Manufacturing
      Retail

  - fieldname: annual_revenue
    fieldtype: Currency
    label: Annual Revenue
    in_list_view: true

  - fieldname: is_active
    fieldtype: Check
    label: Active Customer
    default: "1"

  - fieldname: notes
    fieldtype: Text
    label: Notes`

export function YamlConfigSection() {
  return (
    <section className="mb-[120px]">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-4 border-b border-outline-variant pb-2">
        YAML Configuration
      </h2>
      <p className="mb-4 text-[#5d5f5f]">
        DocTypes are defined declaratively in YAML. Define fields, types, constraints,
        and relationships — Kora generates the database table, REST API, and React forms automatically.
      </p>
      <p className="mb-4 text-[#5d5f5f]">
        <strong>For non-technical users:</strong> You don&apos;t need to write YAML directly.
        Use the AI Chat to describe your business in plain English, and Kora creates
        validated doctype drafts for you. Review and activate when ready.
      </p>
      <div className="bg-[#0A0A0A] rounded-sm border border-outline-variant overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-outline-variant/30">
          <span className="text-sm text-[#5d5f5f]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>customer.yaml</span>
        </div>
        <pre className="p-4 text-sm text-[#E5E5E5] overflow-x-auto" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
          <code>
            {YAML_EXAMPLE.split('\n').map((line, i) => {
              const keyMatch = line.match(/^(\s*)([a-zA-Z_-]+):/)
              if (keyMatch) {
                const indent = keyMatch[1]
                const key = keyMatch[2]
                const rest = line.slice(keyMatch[0].length)
                return (
                  <span key={i}>
                    {indent}<span className="text-[#FF6B35]">{key}:</span>{rest}{'\n'}
                  </span>
                )
              }
              return <span key={i}>{line}{'\n'}</span>
            })}
          </code>
        </pre>
      </div>
    </section>
  )
}
