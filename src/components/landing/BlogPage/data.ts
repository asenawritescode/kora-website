export interface Article {
  slug: string
  category: string
  title: string
  description: string
  readTime: string
  body?: string
  publishedAt?: string
  authorName?: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
}

export const ARTICLES: Article[] = []
