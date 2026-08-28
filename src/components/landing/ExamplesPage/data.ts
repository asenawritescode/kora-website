export interface Template {
  slug: string
  name: string
  description: string
  category: string
  features: string[]
  tags?: string[]
  heroLabel?: string
  sortOrder?: number
}
