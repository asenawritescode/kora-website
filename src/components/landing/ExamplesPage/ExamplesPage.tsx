import { useMemo, useState } from 'react'
import { FilterBar } from './FilterBar'
import { TemplateCard } from './TemplateCard'
import { TemplateEmpty, TemplateError, TemplateSkeleton } from './TemplateStatus'
import { useTemplates } from '@/lib/use-templates'

const GRID = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'

export default function ExamplesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const state = useTemplates()
  const templates = state.status === 'ready' ? state.templates : []

  // Only categories the catalog actually returns; chips need at least two.
  const categories = useMemo(
    () => [...new Set(templates.map((t) => t.category).filter((c): c is string => Boolean(c)))],
    [templates],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return templates.filter((t) => {
      const cat = activeCategory === 'All' || t.category === activeCategory
      return cat && (!q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    })
  }, [activeCategory, search, templates])

  return (
    <section className="max-w-[960px] mx-auto px-6 pb-[120px]">
      <div className="mb-16 text-center">
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-ink mb-4 tracking-[-0.03em] md:tracking-[-0.04em]">
          Templates
        </h1>
        <p className="text-lg leading-7 text-ink-3 max-w-2xl mx-auto">
          Starting points for your shop. Each one lists what it includes before you sign up.
        </p>
      </div>

      {state.status === 'loading' && <TemplateSkeleton count={3} className={GRID} />}
      {state.status === 'error' && <TemplateError onRetry={state.retry} />}
      {state.status === 'ready' && templates.length === 0 && <TemplateEmpty />}
      {state.status === 'ready' && templates.length > 0 && (
        <>
          {templates.length > 1 && (
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              search={search}
              onSearchChange={setSearch}
            />
          )}
          {filtered.length > 0 ? (
            <div className={GRID}>
              {filtered.map((template) => (
                <TemplateCard key={template.slug} template={template} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-3">No templates match the current filters.</p>
          )}
        </>
      )}
    </section>
  )
}
