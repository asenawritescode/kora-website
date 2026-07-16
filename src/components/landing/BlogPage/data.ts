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

export const ARTICLES: Article[] = [
  {
    slug: 'spreadsheet-to-business-app',
    category: 'Guides',
    title: 'How to turn a spreadsheet into a business app',
    description: 'A practical path from fragile spreadsheet workflows to a structured app with users, records, workflows, and an API.',
    readTime: '7 min read',
  },
  {
    slug: 'airtable-vs-kora',
    category: 'Comparisons',
    title: 'Airtable vs Kora',
    description: 'How to think about flexible databases, business workflows, self-hosting, and long-term ownership.',
    readTime: '6 min read',
  },
  {
    slug: 'retool-vs-kora',
    category: 'Comparisons',
    title: 'Retool vs Kora',
    description: 'A comparison for teams deciding between internal tool builders and workflow-first business apps.',
    readTime: '6 min read',
  },
  {
    slug: 'why-yaml-matters',
    category: 'Open Source',
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
