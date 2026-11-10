import { ArticleCard } from './ArticleCard'
import type { Article } from './data'

export function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8 border-b border-line pb-4">
        <h3 className="text-[30px] leading-[38px] font-semibold text-ink">Latest Technical Posts</h3>
        <a
          href="#"
          className="text-xs font-medium text-ink hover:underline flex items-center gap-1 uppercase tracking-[0.15em]"
         
        >
          View All <ArrowRight />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.title} article={article} />
        ))}
      </div>
    </section>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
