import { ArrowLeft, Clock, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { Seo } from '@/components/landing/Seo'
import { fetchPublicBlogPost } from '@/lib/public-content'
import type { Article } from './data'

interface BlogPostProps {
  slug: string
}

export default function BlogPost({ slug }: BlogPostProps) {
  const [cmsPost, setCmsPost] = useState<Article | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    setLoaded(false)
    fetchPublicBlogPost(slug)
      .then((post) => {
        if (alive) setCmsPost(post)
      })
      .catch(() => {
        if (alive) setCmsPost(null)
      })
      .finally(() => {
        if (alive) setLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [slug])

  if (!loaded) {
    return (
      <>
        <Seo
          title="Loading article — Kora Blog"
          description="Loading the latest article from Kora CMS."
          path={`/blog/${slug}`}
          noindex
        />
        <ArticleShell>
          <ArticleLoadingState />
        </ArticleShell>
      </>
    )
  }

  if (!cmsPost) {
    return (
      <>
        <Seo
          title="Article unavailable — Kora Blog"
          description="This article is not currently available."
          path={`/blog/${slug}`}
          noindex
        />
        <ArticleShell>
          <div className="max-w-2xl mx-auto rounded-sm border border-[#e5e5e5] bg-white p-6 text-sm text-[#5d5f5f]">
            This article is not currently available.
          </div>
        </ArticleShell>
      </>
    )
  }

  const post = {
    title: cmsPost.title,
    category: cmsPost.category,
    date: formatPublishedDate(cmsPost.publishedAt),
    readTime: cmsPost.readTime,
    description: cmsPost.description,
    body: cmsPost.body,
    authorName: cmsPost.authorName || 'Kora Team',
    seoTitle: cmsPost.seoTitle || cmsPost.title,
    seoDescription: cmsPost.seoDescription || cmsPost.description,
  }

  return (
    <>
      <Seo
        title={`${post.seoTitle} — Kora Blog`}
        description={post.seoDescription}
        path={`/blog/${slug}`}
        image={cmsPost.heroImage || cmsPost.ogImage}
      />
      <ArticleShell>
        <header className="mb-[120px] max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-2 py-1 rounded-sm uppercase tracking-wider font-mono">
              {post.category}
            </span>
            <span className="text-xs text-[#5d5f5f] font-mono">{post.date}</span>
            <span className="text-xs text-[#5d5f5f] flex items-center gap-1 font-mono">
              <Clock className="h-3 w-3" /> {post.readTime}
            </span>
          </div>
          <h1 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold text-black mb-8 tracking-[-0.02em] md:tracking-[-0.03em]">
            {post.title}
          </h1>
          <p className="text-lg leading-7 text-[#444748] max-w-2xl">
            {post.description}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f1edec] flex items-center justify-center border border-outline-variant">
              <User className="h-5 w-5 text-[#5d5f5f]" />
            </div>
            <div>
              <div className="text-xs text-black font-mono">{post.authorName}</div>
              <div className="text-xs text-[#5d5f5f] font-mono">Kora</div>
            </div>
          </div>
        </header>

        <div className="mb-[120px] w-full aspect-[21/9] bg-black rounded-xl overflow-hidden border border-outline-variant relative">
          {cmsPost.heroImage || cmsPost.ogImage ? (
            <img
              src={cmsPost.heroImage || cmsPost.ogImage}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
                  <div className="w-32 h-[1px] bg-[#FF6B35]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
                  <div className="w-32 h-[1px] bg-[#FF6B35]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="max-w-2xl mx-auto text-base text-[#444748] leading-relaxed space-y-8">
          {cmsPost?.body ? (
            <CmsBody body={cmsPost.body} />
          ) : (
            <p>{cmsPost.description}</p>
          )}
        </div>
      </ArticleShell>
    </>
  )
}

function ArticleShell({ children }: { children: ReactNode }) {
  return (
    <article className="max-w-[960px] mx-auto px-6 pb-[120px]">
      <Link to="/blog" className="inline-flex items-center gap-2 text-xs text-[#5d5f5f] hover:text-black transition-colors mb-8 font-mono">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
      </Link>
      {children}
    </article>
  )
}

function ArticleLoadingState() {
  return (
    <>
      <header className="mb-[120px] max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-6 w-24 bg-[#f1edec]" />
          <div className="h-4 w-28 bg-[#f1edec]" />
        </div>
        <div className="space-y-3">
          <div className="h-10 w-full bg-[#f1edec]" />
          <div className="h-10 w-4/5 bg-[#f1edec]" />
        </div>
        <div className="space-y-2 max-w-2xl">
          <div className="h-5 w-full bg-[#f1edec]" />
          <div className="h-5 w-5/6 bg-[#f1edec]" />
        </div>
      </header>
      <div className="mb-[120px] w-full aspect-[21/9] bg-[#f1edec] rounded-xl border border-outline-variant" />
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="h-4 w-full bg-[#f1edec]" />
        <div className="h-4 w-11/12 bg-[#f1edec]" />
        <div className="h-4 w-5/6 bg-[#f1edec]" />
      </div>
    </>
  )
}

function formatPublishedDate(value?: string) {
  if (!value) return 'Jul 16, 2026'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Jul 16, 2026'
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}

function CmsBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean)
  return (
    <>
      {blocks.map((block, index) => {
        if (block.startsWith('## ')) {
          return <h2 key={index} className="text-[30px] leading-[38px] font-semibold text-black mt-16 mb-6">{block.slice(3)}</h2>
        }
        if (block.startsWith('### ')) {
          return <h3 key={index} className="text-[24px] leading-[32px] font-semibold text-black mt-12 mb-4">{block.slice(4)}</h3>
        }
        if (block.split('\n').every((line) => line.trim().startsWith('- '))) {
          return (
            <ul key={index} className="list-disc pl-6 space-y-2">
              {block.split('\n').map((line) => <li key={line}>{line.trim().slice(2)}</li>)}
            </ul>
          )
        }
        return (
          <p key={index} className={index === 0 ? 'first-letter:text-5xl first-letter:font-semibold first-letter:text-black first-letter:mr-3 first-letter:float-left' : ''}>
            {block}
          </p>
        )
      })}
    </>
  )
}
