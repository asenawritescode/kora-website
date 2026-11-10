import { ArrowLeft, Clock, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Seo } from '@/components/landing/Seo'
import { fetchPublicBlogPost } from '@/lib/public-content'
import type { Article } from './data'
import { BRAND } from '@/lib/brand'

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
          title={`Loading article — ${BRAND} Blog`}
          description={`Loading the latest article from ${BRAND} CMS.`}
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
          title={`Article unavailable — ${BRAND} Blog`}
          description="This article is not currently available."
          path={`/blog/${slug}`}
          noindex
        />
        <ArticleShell>
          <div className="max-w-2xl mx-auto rounded-sm border border-outline-variant bg-white p-6 text-sm text-muted">
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
    authorName: cmsPost.authorName || `${BRAND} Team`,
    seoTitle: cmsPost.seoTitle || cmsPost.title,
    seoDescription: cmsPost.seoDescription || cmsPost.description,
  }

  return (
    <>
      <Seo
        title={`${post.seoTitle} — ${BRAND} Blog`}
        description={post.seoDescription}
        path={`/blog/${slug}`}
        image={cmsPost.heroImage || cmsPost.ogImage}
      />
      <ArticleShell>
        <header className="mb-[120px] max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-semibold text-action-busy bg-action/10 px-2 py-1 rounded-sm">
              {post.category}
            </span>
            <span className="text-xs text-muted">{post.date}</span>
            <span className="text-xs text-muted flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readTime}
            </span>
          </div>
          <h1 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold text-black mb-8 tracking-[-0.02em] md:tracking-[-0.03em]">
            {post.title}
          </h1>
          <p className="text-lg leading-7 text-on-surface-variant max-w-2xl">
            {post.description}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant">
              <User className="h-5 w-5 text-muted" />
            </div>
            <div>
              <div className="text-xs text-black">{post.authorName}</div>
              <div className="text-xs text-muted">{BRAND}</div>
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
                  <div className="w-3 h-3 rounded-full bg-action" />
                  <div className="w-32 h-[1px] bg-action/50" />
                  <div className="w-3 h-3 rounded-full bg-action" />
                  <div className="w-32 h-[1px] bg-action/50" />
                  <div className="w-3 h-3 rounded-full bg-action" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          {cmsPost?.body ? <CmsBody body={cmsPost.body} /> : <p>{cmsPost.description}</p>}
        </div>
      </ArticleShell>
    </>
  )
}

function ArticleShell({ children }: { children: ReactNode }) {
  return (
    <article className="max-w-[960px] mx-auto px-6 pb-[120px]">
      <Link to="/blog" className="inline-flex items-center gap-2 text-xs text-muted hover:text-black transition-colors mb-8">
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
          <div className="h-6 w-24 bg-surface-container" />
          <div className="h-4 w-28 bg-surface-container" />
        </div>
        <div className="space-y-3">
          <div className="h-10 w-full bg-surface-container" />
          <div className="h-10 w-4/5 bg-surface-container" />
        </div>
        <div className="space-y-2 max-w-2xl">
          <div className="h-5 w-full bg-surface-container" />
          <div className="h-5 w-5/6 bg-surface-container" />
        </div>
      </header>
      <div className="mb-[120px] w-full aspect-[21/9] bg-surface-container rounded-xl border border-outline-variant" />
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="h-4 w-full bg-surface-container" />
        <div className="h-4 w-11/12 bg-surface-container" />
        <div className="h-4 w-5/6 bg-surface-container" />
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
  return (
    <div className="blog-content text-base leading-relaxed text-on-surface-variant">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  )
}
