import { HeroPost } from './HeroPost'
import { ArticleGrid } from './ArticleGrid'
import { useEffect, useState } from 'react'
import { type Article } from './data'
import { getPublicBlogPosts } from '@/lib/public-content'

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const heroArticle = articles[0]
  const gridArticles = articles.slice(1)

  useEffect(() => {
    let alive = true
    setIsLoading(true)
    setLoadError(false)
    getPublicBlogPosts()
      .then((items) => {
        if (alive) setArticles(items)
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
          Practical articles for teams evaluating custom business apps, workflow design, open-source ownership, and Kora architecture.
        </p>
      </header>

      {loadError && (
        <div className="bg-white border border-[#e5e5e5] rounded-sm p-4 text-sm text-[#5d5f5f]">
          Showing local articles while the public content catalog is unavailable.
        </div>
      )}

      {isLoading ? (
        <BlogLoadingState />
      ) : heroArticle ? (
        <>
          <HeroPost article={heroArticle} />
          <ArticleGrid articles={gridArticles.length ? gridArticles : articles} />
        </>
      ) : (
        <div className="bg-white border border-[#e5e5e5] rounded-sm p-6 text-sm text-[#5d5f5f]">
          No published articles are available yet.
        </div>
      )}
    </div>
  )
}

function BlogLoadingState() {
  return (
    <>
      <div className="border border-outline-variant bg-white overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-3/5 h-[300px] md:h-auto bg-[#f1edec]" />
        <div className="md:w-2/5 p-8 md:p-10 space-y-6">
          <div className="h-4 w-32 bg-[#f1edec]" />
          <div className="space-y-3">
            <div className="h-8 w-full bg-[#f1edec]" />
            <div className="h-8 w-4/5 bg-[#f1edec]" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#f1edec]" />
            <div className="h-4 w-5/6 bg-[#f1edec]" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[0, 1, 2].map((item) => (
          <div key={item} className="border border-outline-variant bg-white">
            <div className="h-48 bg-[#f1edec]" />
            <div className="p-6 space-y-4">
              <div className="h-4 w-24 bg-[#f1edec]" />
              <div className="h-7 w-full bg-[#f1edec]" />
              <div className="h-4 w-5/6 bg-[#f1edec]" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
