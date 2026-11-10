import { Link } from '@tanstack/react-router'
import type { Article } from './data'

export function ArticleCard({ article }: { article: Article }) {
  const heroImage = article.heroImage || article.ogImage
  return (
    <Link to="/blog/$slug" params={{ slug: article.slug }} className="group flex flex-col border border-line bg-paper hover:border-ink transition-colors">
      {/* Image */}
      <div className="h-48 border-b border-line overflow-hidden bg-surface-2 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-action z-10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
        {heroImage ? (
          <img
            src={heroImage}
            alt={article.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-white opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow gap-4">
        <div className="flex items-center gap-2 text-sm text-ink-3">
          <span className="text-action">■</span> {article.category}
        </div>
        <h4 className="text-[24px] leading-tight font-semibold text-ink">
          {article.title}
        </h4>
        <p className="text-base text-ink-2 flex-grow line-clamp-2">
          {article.description}
        </p>
        <div className="text-xs text-ink-3 pt-4 flex justify-between items-center">
          <span>{article.readTime}</span>
          <span className="group-hover:text-ink transition-colors">↗</span>
        </div>
      </div>
    </Link>
  )
}
