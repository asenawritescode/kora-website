import { useEffect, useMemo, useState } from 'react'
import { FilterBar } from './FilterBar'
import { TemplateCard } from './TemplateCard'
import { TEMPLATES, type Template } from './data'
import { fetchPublicTemplates } from '@/lib/public-content'

export default function ExamplesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let alive = true
    fetchPublicTemplates()
      .then((items) => {
        if (alive) setTemplates(items)
      })
      .catch(() => {
        if (alive) setLoadError(true)
      })
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const cat = activeCategory === 'All' || t.category === activeCategory
      const q = !search || t.name.toLowerCase().includes(search.toLowerCase())
        || t.description.toLowerCase().includes(search.toLowerCase())
      return cat && q
    })
  }, [activeCategory, search, templates])

  const popular = templates.filter((t) => ['b2b-crm', 'fieldwork', 'kiosk-pos'].includes(t.slug)).slice(0, 3)

  return (
    <section className="max-w-[960px] mx-auto px-6 pb-[120px]">
      {/* Hero */}
      <div className="mb-[120px] text-center">
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-black mb-4 tracking-[-0.03em] md:tracking-[-0.04em]">
          Industry Templates
        </h1>
        <p className="text-lg leading-7 text-[#5d5f5f] max-w-2xl mx-auto">
          Start from a business app template for CRM, inventory, fieldwork, invoicing, helpdesk, property management, and more.
        </p>
      </div>

      {loadError && (
        <div className="mb-8 bg-white border border-[#e5e5e5] rounded-sm p-4 text-sm text-[#5d5f5f]">
          Showing starter templates while the public catalog is unavailable.
        </div>
      )}

      <div className="mb-[120px]">
        <h2 className="text-[32px] leading-[40px] font-semibold text-black mb-6 tracking-[-0.02em]">
          Popular starting points
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {popular.map((template) => (
            <a key={template.slug} href={`/onboard?template=${template.slug}`} className="bg-white border border-[#e5e5e5] p-6 rounded-sm hover:border-black transition-colors">
              <h3 className="text-2xl font-semibold text-black mb-2">{template.name}</h3>
              <p className="text-sm text-[#5d5f5f] mb-4">{template.description}</p>
              <span className="text-xs font-medium text-[#FF6B35] font-mono">Start with this →</span>
            </a>
          ))}
        </div>
      </div>

      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered.map((template) => (
          <TemplateCard key={template.name} template={template} />
        ))}
      </div>
    </section>
  )
}
