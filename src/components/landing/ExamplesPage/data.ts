import type { Availability } from '@/lib/catalog-client'

export interface Template {
  slug: string
  name: string
  description: string
  category?: string
  availability: Availability
  features: string[]
}
