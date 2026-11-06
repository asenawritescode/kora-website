import type { Template } from '@/components/landing/ExamplesPage/data'
import type { Article } from '@/components/landing/BlogPage/data'
import { fetchTemplates, type CatalogTemplate } from '@/lib/catalog-client'
import { BRAND } from '@/lib/brand'

const publicContentBaseURL = (
  import.meta.env.VITE_KORA_PUBLIC_CMS_BASE_URL as string | undefined
  || 'https://kora.mradiafrica.com'
).replace(/\/$/, '')

const publicContentSiteName = (
  import.meta.env.VITE_KORA_PUBLIC_CMS_SITE_NAME as string | undefined
  || 'kora-cms'
).trim()

type CmsListResponse<T = any> = {
  data?: T[]
  items?: T[]
}

type CmsBlogPost = {
  slug?: string
  title?: string
  description?: string
  body?: string
  category?: string
  published_at?: string
  publishedAt?: string
  author_name?: string
  authorName?: string
  seo_title?: string
  seoTitle?: string
  seo_description?: string
  seoDescription?: string
  og_image_url?: string
  ogImageUrl?: string
  og_image?: string
  ogImage?: string
  hero_image_url?: string
  heroImageUrl?: string
  hero_image?: string
  heroImage?: string
}

let templatesCache: Promise<Template[]> | null = null
let blogPostsCache: Promise<Article[]> | null = null
let blogPostCache = new Map<string, Promise<Article | null>>()

// Templates come from the Cloud catalog. A failed load is not cached, so a retry refetches.
export function getPublicTemplates(): Promise<Template[]> {
  templatesCache ??= fetchTemplates().then((items) => items.map(toTemplate))
  templatesCache.catch(() => { templatesCache = null })
  return templatesCache
}

export function getPublicBlogPosts(): Promise<Article[]> {
  blogPostsCache ??= fetchPublicBlogPosts()
  blogPostsCache.catch(() => { blogPostsCache = null })
  return blogPostsCache
}

function toTemplate(item: CatalogTemplate): Template {
  return {
    slug: item.slug,
    name: item.name,
    description: item.summary,
    category: item.category,
    availability: item.availability,
    features: item.components.map((c) => (c.selection === 'optional' ? `${c.name} (optional)` : c.name)),
  }
}

export async function fetchPublicBlogPost(slug: string): Promise<Article | null> {
  const trimmed = slug.trim()
  if (!trimmed) return null
  const cached = blogPostCache.get(trimmed)
  if (cached) return cached
  const request = fetchCmsBlogPost(trimmed)
    .then((post) => post ? normalizeBlogPost(post) : null)
    .finally(() => {
      blogPostCache.delete(trimmed)
    })
  blogPostCache.set(trimmed, request)
  return request
}

async function fetchPublicBlogPosts(): Promise<Article[]> {
  const payload = await fetchCmsList<CmsBlogPost>('/api/public/resource/Blog%20Post?limit=100')
  return payload.map(normalizeBlogPost).filter((post): post is Article => Boolean(post.slug && post.title))
}

async function fetchCmsBlogPost(slug: string): Promise<CmsBlogPost | null> {
  const filters = encodeURIComponent(JSON.stringify([['slug', '=', slug]]))
  const payload = await fetchCmsList<CmsBlogPost>(`/api/public/resource/Blog%20Post?limit=1&filters=${filters}`)
  return payload[0] ?? null
}

async function fetchCmsList<T>(path: string): Promise<T[]> {
  const res = await fetchCms(path)
  if (!res.ok) {
    throw new Error(`content request failed: ${res.status}`)
  }
  const payload = await res.json() as CmsListResponse<T>
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  return []
}

async function fetchCms(path: string): Promise<Response> {
  return fetch(`${publicContentBaseURL}/s/${encodeURIComponent(publicContentSiteName)}${path}`, {
    headers: {
      Accept: 'application/json',
    },
  })
}

function normalizeBlogPost(item: CmsBlogPost): Article {
  const publishedAt = String(item.published_at || item.publishedAt || '').trim()
  const body = String(item.body || '').trim()
  const description = String(item.description || '').trim()
  const slug = String(item.slug || '').trim()
  const heroImage =
    normalizeOptionalString(item.hero_image_url || item.heroImageUrl)
    || resolveCmsAssetUrl(normalizeOptionalString(item.hero_image || item.heroImage))
  const ogImage =
    normalizeOptionalString(item.og_image_url || item.ogImageUrl)
    || resolveCmsAssetUrl(normalizeOptionalString(item.og_image || item.ogImage))
    || heroImage
  return {
    slug,
    category: String(item.category || 'Guides').trim() || 'Guides',
    title: String(item.title || '').trim(),
    description,
    readTime: estimateReadTime(body || description),
    body,
    publishedAt,
    authorName: String(item.author_name || item.authorName || `${BRAND} Team`).trim() || `${BRAND} Team`,
    seoTitle: normalizeOptionalString(item.seo_title || item.seoTitle),
    seoDescription: normalizeOptionalString(item.seo_description || item.seoDescription),
    heroImage,
    ogImage,
  }
}

function normalizeOptionalString(value: string | undefined): string | undefined {
  const normalized = String(value || '').trim()
  return normalized || undefined
}

function resolveCmsAssetUrl(value?: string): string | undefined {
  if (!value) return undefined
  if (/^(https?:)?\/\//.test(value) || value.startsWith('data:')) {
    return value
  }
  const normalized = value.replace(/^\/+/, '')
  if (!normalized) return undefined
  return `${publicContentBaseURL}/s/${encodeURIComponent(publicContentSiteName)}/api/public/files/${encodePath(normalized)}`
}

function encodePath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}
