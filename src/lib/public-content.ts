import { TEMPLATES as FALLBACK_TEMPLATES, type Template } from '@/components/landing/ExamplesPage/data'
import { ARTICLES as FALLBACK_ARTICLES, type Article } from '@/components/landing/BlogPage/data'

const publicContentBaseURL = (import.meta.env.VITE_KORA_PUBLIC_CONTENT_BASE_URL as string | undefined)?.replace(/\/$/, '')
  || 'https://cloud.kora.mradiafrica.com/api/cloud/public'

type PublicTemplate = {
  slug: string
  name: string
  description: string
  category?: string
  features?: string[]
}

export async function fetchPublicTemplates(): Promise<Template[]> {
  const res = await fetch(`${publicContentBaseURL}/templates`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`template request failed: ${res.status}`)
  }
  const payload = await res.json()
  const items: PublicTemplate[] = Array.isArray(payload.items) ? payload.items : []
  if (items.length === 0) {
    return FALLBACK_TEMPLATES
  }
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
  if (items.length === 0) {
    return FALLBACK_ARTICLES
  }
  return items.map((item: any) => ({
    slug: String(item.slug || ''),
    category: String(item.category || 'Guides'),
    title: String(item.title || ''),
    description: String(item.description || ''),
    readTime: '5 min read',
  })).filter((item: Article) => item.slug && item.title)
}
