import { ENGINE_BRAND } from '@/lib/brand'
const YAML_EXAMPLE = `name: Customer
module: CRM
title_field: customer_name

fields:
  - fieldname: customer_name
    fieldtype: Data
    label: Customer Name
    reqd: true
    in_list_view: true

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

  - fieldname: notes
    fieldtype: Text
    label: Notes`

export function YamlConfigSection() {
  return (
    <section className="mb-24" id="yaml-configuration">
      <h2 className="text-[30px] leading-[38px] font-semibold text-black mb-3">
        YAML Configuration
      </h2>
      <p className="text-base text-muted mb-4 leading-relaxed">
        Define your data model in YAML. {ENGINE_BRAND} reads it and generates the database table,
        REST API, React forms, and analytics — automatically.
      </p>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        <strong>Not comfortable writing YAML?</strong> Use the AI Chat instead. Describe
        your business in plain English and {ENGINE_BRAND} creates validated doctype drafts for you.
        Review them, activate when ready — no YAML required.
      </p>
      <div className="bg-code rounded-sm border border-outline-variant overflow-hidden">
        <div className="flex items-center px-4 py-2 bg-code-rule border-b border-outline-variant/30">
          <span className="font-mono text-xs text-code-muted">customer.yaml</span>
        </div>
        <pre className="font-mono p-4 text-sm text-code-ink overflow-x-auto leading-relaxed">
          <code>
            {YAML_EXAMPLE.split('\n').map((line, i) => {
              const keyMatch = line.match(/^(\s*)([a-zA-Z_-]+):/)
              if (keyMatch) {
                const indent = keyMatch[1]
                const key = keyMatch[2]
                const rest = line.slice(keyMatch[0].length)
                return (
                  <span key={i}>
                    {indent}<span className="text-code-accent">{key}:</span>{rest}{'\n'}
                  </span>
                )
              }
              return <span key={i}>{line}{'\n'}</span>
            })}
          </code>
        </pre>
      </div>
      <p className="text-xs text-muted mt-3">
        This creates a full CRUD app at <code className="text-black">/workspace/Customer</code> —
        list view, form, search, and filters. Ready in seconds.
      </p>
    </section>
  )
}
