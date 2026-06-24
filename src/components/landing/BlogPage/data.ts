export interface Article {
  slug: string
  category: string
  title: string
  description: string
  readTime: string
}

export const ARTICLES: Article[] = [
  {
    slug: 'why-yaml-matters',
    category: 'DevOps',
    title: 'Why YAML matters',
    description: 'Exploring how declarative configuration became the cornerstone of config-driven application development.',
    readTime: '5 min read',
  },
  {
    slug: 'deploying-on-raspberry-pi',
    category: 'Edge Computing',
    title: 'Deploying on Raspberry Pi',
    description: 'A practical guide to running local-first business applications on low-power ARM hardware.',
    readTime: '8 min read',
  },
  {
    slug: 'multi-tenancy-at-scale',
    category: 'Architecture',
    title: 'Multi-tenancy at Scale',
    description: 'Database isolation strategies, routing mechanisms, and ensuring data integrity across isolated sites.',
    readTime: '12 min read',
  },
]
