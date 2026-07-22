import type { Template } from '@/components/landing/ExamplesPage/data'
import type { Article } from '@/components/landing/BlogPage/data'

const publicContentBaseURL = (import.meta.env.VITE_KORA_PUBLIC_CONTENT_BASE_URL as string | undefined)?.replace(/\/$/, '')
  || 'https://cloud.kora.mradiafrica.com/api/cloud/public'

type PublicTemplate = {
  slug: string
  name: string
  description: string
  category?: string
  features?: string[]
}

// ── Module-level fetch-once cache ──────────────────────────────────────────
// Templates and blog posts are fetched once per page load and shared across
// every component that needs them. The cache lives for the lifetime of the
// SPA session (no expiry needed — the user isn't on the page long enough
// for CMS data to go stale, and a hard refresh gets fresh data).

let templatesCache: Promise<Template[]> | null = null
let blogPostsCache: Promise<Article[]> | null = null

export function getPublicTemplates(): Promise<Template[]> {
  if (!templatesCache) {
    templatesCache = fetchPublicTemplates()
  }
  return templatesCache
}

export function getPublicBlogPosts(): Promise<Article[]> {
  if (!blogPostsCache) {
    blogPostsCache = fetchPublicBlogPosts()
  }
  return blogPostsCache
}

// ── Raw fetch functions (internal) ────────────────────────────────────────

async function fetchPublicTemplates(): Promise<Template[]> {
  const res = await fetch(`${publicContentBaseURL}/templates`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`template request failed: ${res.status}`)
  }
  const payload = await res.json()
  const items: PublicTemplate[] = Array.isArray(payload.items) ? payload.items : []
  return items.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    icon: 'Database',
    category: item.category || 'Operations',
    features: (item.features || []).slice(0, 3).map((label) => ({ iconType: 'Database', label })),
  }))
}

export async function fetchPublicBlogPosts(): Promise<Article[]> {
  const res = await fetch(`${publicContentBaseURL}/blog-posts`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`blog request failed: ${res.status}`)
  }
  const payload = await res.json()
  const items = Array.isArray(payload.items) ? payload.items : []
  return items.map((item: any) => ({
    slug: String(item.slug || ''),
    category: String(item.category || 'Guides'),
    title: String(item.title || ''),
    description: String(item.description || ''),
    readTime: estimateReadTime(String(item.body || item.description || '')),
    body: String(item.body || ''),
    publishedAt: String(item.published_at || ''),
    authorName: String(item.author_name || 'Kora Team'),
    seoTitle: String(item.seo_title || ''),
    seoDescription: String(item.seo_description || ''),
    ogImage: String(item.og_image || ''),
  })).filter((item: Article) => item.slug && item.title)
}

export async function fetchPublicBlogPost(slug: string): Promise<Article | null> {
  const posts = await getPublicBlogPosts()
  return posts.find((item) => item.slug === slug) ?? null
}

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}
