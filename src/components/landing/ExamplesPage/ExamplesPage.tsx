import { useEffect, useMemo, useState } from 'react'
import { FilterBar } from './FilterBar'
import { TemplateCard } from './TemplateCard'
import { TEMPLATES, type Template } from './data'
import { fetchPublicTemplates } from '@/lib/public-content'

export default function ExamplesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const visibleTemplates = loadError ? TEMPLATES : templates

  useEffect(() => {
    let alive = true
    setIsLoading(true)
    setLoadError(false)
    fetchPublicTemplates()
      .then((items) => {
        if (alive) setTemplates(items)
      })
      .catch(() => {
        if (alive) setLoadError(true)
      })
      .finally(() => {
        if (alive) setIsLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    return visibleTemplates.filter((t) => {
      const cat = activeCategory === 'All' || t.category === activeCategory
      const q = !search || t.name.toLowerCase().includes(search.toLowerCase())
        || t.description.toLowerCase().includes(search.toLowerCase())
      return cat && q
    })
  }, [activeCategory, search, visibleTemplates])

  const preferredPopular = ['b2b-crm', 'fieldwork', 'kiosk-pos']
  const popular = visibleTemplates
    .filter((t) => preferredPopular.includes(t.slug))
    .concat(visibleTemplates.filter((t) => !preferredPopular.includes(t.slug)))
    .slice(0, 3)

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
        {isLoading ? (
          <PopularLoadingState />
        ) : popular.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {popular.map((template) => (
              <a key={template.slug} href={`/onboard?template=${template.slug}`} className="bg-white border border-[#e5e5e5] p-6 rounded-sm hover:border-black transition-colors">
                <h3 className="text-2xl font-semibold text-black mb-2">{template.name}</h3>
                <p className="text-sm text-[#5d5f5f] mb-4">{template.description}</p>
                <span className="text-xs font-medium text-[#FF6B35] font-mono">Start with this →</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e5e5e5] rounded-sm p-6 text-sm text-[#5d5f5f]">
            No public templates are available yet.
          </div>
        )}
      </div>

      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
      />

      {isLoading ? (
        <TemplateLoadingState />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((template) => (
            <TemplateCard key={template.name} template={template} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#e5e5e5] rounded-sm p-6 text-sm text-[#5d5f5f]">
          No templates match the current filters.
        </div>
      )}
    </section>
  )
}

function PopularLoadingState() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {[0, 1, 2].map((item) => (
        <div key={item} className="bg-white border border-[#e5e5e5] p-6 rounded-sm space-y-4">
          <div className="h-7 w-2/3 bg-[#f1edec]" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#f1edec]" />
            <div className="h-4 w-5/6 bg-[#f1edec]" />
          </div>
          <div className="h-4 w-28 bg-[#f1edec]" />
        </div>
      ))}
    </div>
  )
}

function TemplateLoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
        <div key={item} className="bg-white border border-outline-variant rounded-sm p-8 space-y-5">
          <div className="h-10 w-10 bg-[#f1edec]" />
          <div className="h-7 w-3/4 bg-[#f1edec]" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#f1edec]" />
            <div className="h-4 w-5/6 bg-[#f1edec]" />
          </div>
          <div className="border-t border-outline-variant pt-4 space-y-3">
            <div className="h-4 w-4/5 bg-[#f1edec]" />
            <div className="h-4 w-3/4 bg-[#f1edec]" />
          </div>
        </div>
      ))}
    </div>
  )
}
