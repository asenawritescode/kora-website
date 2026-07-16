import { HeroPost } from './HeroPost'
import { ArticleGrid } from './ArticleGrid'
import { useEffect, useState } from 'react'
import { ARTICLES, type Article } from './data'
import { fetchPublicBlogPosts } from '@/lib/public-content'

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>(ARTICLES)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let alive = true
    fetchPublicBlogPosts()
      .then((items) => {
        if (alive) setArticles(items)
      })
      .catch(() => {
        if (alive) setLoadError(true)
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="max-w-[960px] mx-auto px-6 pb-[120px] space-y-[120px]">
      {/* Page Header */}
      <header className="space-y-4 pt-8">
        <div className="flex items-center gap-2 text-sm text-[#5d5f5f] uppercase tracking-[0.15em]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
          <span className="w-8 h-[1px] bg-outline-variant" />
          <span>Guides & Notes</span>
        </div>
        <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-black tracking-[-0.03em] md:tracking-[-0.04em]">
          Guides, comparisons, and open-source notes
        </h1>
        <p className="text-lg leading-7 text-[#444748] max-w-2xl">
          Practical articles for teams evaluating custom business apps, open-source ownership, AI builders, and Kora architecture.
        </p>
      </header>

      {loadError && (
        <div className="bg-white border border-[#e5e5e5] rounded-sm p-4 text-sm text-[#5d5f5f]">
          Showing local articles while the public content catalog is unavailable.
        </div>
      )}

      <HeroPost />
      <ArticleGrid articles={articles} />
    </div>
  )
}
