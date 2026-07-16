import { ArrowLeft, Clock, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Seo } from '@/components/landing/Seo'
import { fetchPublicBlogPost } from '@/lib/public-content'
import type { Article } from './data'

interface BlogPostProps {
  slug: string
}

const POSTS: Record<string, { title: string; category: string; date: string; readTime: string; description: string }> = {
  'spreadsheet-to-business-app': {
    title: 'How to turn a spreadsheet into a business app',
    category: 'Guides',
    date: 'Jul 16, 2026',
    readTime: '7 min read',
    description: 'A practical path from fragile spreadsheet workflows to a structured app with users, records, workflows, and an API.',
  },
  'airtable-vs-kora': {
    title: 'Airtable vs Kora',
    category: 'Comparisons',
    date: 'Jul 16, 2026',
    readTime: '6 min read',
    description: 'How to think about flexible databases, business workflows, self-hosting, and long-term ownership.',
  },
  'retool-vs-kora': {
    title: 'Retool vs Kora',
    category: 'Comparisons',
    date: 'Jul 16, 2026',
    readTime: '6 min read',
    description: 'A comparison for teams deciding between internal tool builders and workflow-first business apps.',
  },
  'why-yaml-matters': {
    title: 'Why YAML Matters',
    category: 'DevOps',
    date: 'Jun 15, 2026',
    readTime: '5 min read',
    description: 'How declarative configuration became the foundation of config-driven application development — and why it beats code generation.',
  },
  'deploying-on-raspberry-pi': {
    title: 'Deploying on Raspberry Pi',
    category: 'Edge Computing',
    date: 'Jun 10, 2026',
    readTime: '8 min read',
    description: 'A practical guide to running local-first business applications on low-power ARM hardware using a single Go binary.',
  },
  'multi-tenancy-at-scale': {
    title: 'Multi-Tenancy at Scale',
    category: 'Architecture',
    date: 'Jun 5, 2026',
    readTime: '12 min read',
    description: 'Database isolation strategies, site routing mechanisms, and how to ensure data integrity across isolated workspaces.',
  },
  'building-from-africa': {
    title: 'Building Application Infrastructure from Africa',
    category: 'Architecture',
    date: 'Jun 24, 2026',
    readTime: '12 min read',
    description: 'How we built a config-driven application engine that turns YAML definitions into production database schemas, REST APIs, and React UIs — all from a single Go binary.',
  },
}

export default function BlogPost({ slug }: BlogPostProps) {
  const fallbackPost = POSTS[slug] || POSTS['building-from-africa']
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

  const post = cmsPost
    ? {
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
    : {
        ...fallbackPost,
        body: '',
        authorName: 'Kora Team',
        seoTitle: fallbackPost.title,
        seoDescription: fallbackPost.description,
      }

  return (
    <>
      <Seo
        title={`${post.seoTitle} — Kora Blog`}
        description={post.seoDescription}
        path={`/blog/${slug}`}
      />
      <article className="max-w-[960px] mx-auto px-6 pb-[120px]">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs text-[#5d5f5f] hover:text-black transition-colors mb-8 font-mono">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
        </Link>

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
        </div>

        <div className="max-w-2xl mx-auto text-base text-[#444748] leading-relaxed space-y-8">
          {cmsPost?.body ? (
            <CmsBody body={cmsPost.body} />
          ) : loaded ? (
            <FallbackBody />
          ) : (
            <div className="space-y-3">
              <div className="h-4 w-full bg-[#f1edec]" />
              <div className="h-4 w-5/6 bg-[#f1edec]" />
              <div className="h-4 w-2/3 bg-[#f1edec]" />
            </div>
          )}
        </div>
      </article>
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

function FallbackBody() {
  return (
    <>
      <p className="first-letter:text-5xl first-letter:font-semibold first-letter:text-black first-letter:mr-3 first-letter:float-left">
        Kora takes a fundamentally different approach to building business software. Instead of generating code for each use case, it uses a permanent engine that interprets YAML configuration — turning declarative definitions into database schemas, REST APIs, and React UIs at runtime.
      </p>

      <h2 className="text-[30px] leading-[38px] font-semibold text-black mt-16 mb-6">The Config-Driven Approach</h2>
      <p>
        Traditional development follows a predictable pattern: gather requirements, design a schema, build CRUD endpoints, create forms, add workflows, add permissions, and configure analytics. Each step adds weeks. Each change requires code updates. Kora collapses this pipeline by making the configuration <em>be</em> the application.
      </p>

      <h2 className="text-[30px] leading-[38px] font-semibold text-black mt-16 mb-6">Single Binary, Zero Dependencies</h2>
      <p>
        Kora ships as a single 30MB Go binary with an embedded React SPA. It connects directly to MySQL or LibSQL — no Redis, no message queue, no orchestration layer. Deploy on a $35 Raspberry Pi for a local kiosk, or on a cloud VM serving hundreds of users.
      </p>

      <h2 className="text-[30px] leading-[38px] font-semibold text-black mt-16 mb-6">Multi-Tenant by Default</h2>
      <p>
        One Kora instance can serve dozens of isolated sites. Each site gets its own database, users, doctype registry, and analytics pipeline. Sites can be hot-added and removed without restarting. This makes Kora ideal for agencies managing applications for multiple clients.
      </p>
    </>
  )
}
