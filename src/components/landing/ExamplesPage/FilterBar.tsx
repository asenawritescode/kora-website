import { Search } from 'lucide-react'

interface FilterBarProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (cat: string) => void
  search: string
  onSearchChange: (q: string) => void
}

export function FilterBar({ categories, activeCategory, onCategoryChange, search, onSearchChange }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-8 border-b border-outline-variant pb-2">
      {/* Category pills */}
      {categories.length >= 2 && <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`text-xs font-medium px-4 py-2 rounded-sm transition-colors border ${
              cat === activeCategory
                ? 'bg-black text-white border-black'
                : 'bg-transparent text-[#5d5f5f] border-outline-variant hover:border-black'
            }`}
            style={{ fontFamily: "'Geist Mono Variable', monospace" }}
          >
            {cat}
          </button>
        ))}
      </div>}

      {/* Search */}
      <div className="flex relative w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5d5f5f] h-3.5 w-3.5" />
        <input
          className="pl-10 pr-4 py-2 bg-transparent border border-outline-variant text-sm text-black focus:border-black placeholder-muted transition-colors w-full md:w-64 min-h-11"
          aria-label="Search templates"
          placeholder="Search templates..."
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
