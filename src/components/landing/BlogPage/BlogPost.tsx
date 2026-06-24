import { ArrowLeft, Clock, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface BlogPostProps {
  slug: string
}

const POSTS: Record<string, { title: string; category: string; date: string; readTime: string; description: string }> = {
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
  const post = POSTS[slug] || POSTS['building-from-africa']

  return (
    <>
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
              <div className="text-xs text-black font-mono">Kora Team</div>
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

          <div className="my-8 bg-black rounded-xl overflow-hidden border border-[#333]">
            <div className="bg-[#111] px-4 py-2 border-b border-[#333] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
              <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="ml-4 text-sm text-[#c6c6c7] font-mono">terminal</span>
            </div>
            <pre className="p-4 text-sm text-[#E5E5E5] overflow-x-auto font-mono">
              <code>{`docker run -d --name kora -p 8000:8000 \\
  -e KORA_DB_TYPE=mysql \\
  -e KORA_DB_HOST=127.0.0.1 \\
  -e KORA_DB_USER=root \\
  -e KORA_DB_PASSWORD=yourpassword \\
  -e CONSOLE_EMAIL=admin@kora.local \\
  -e CONSOLE_PASSWORD=admin123 \\
  smitdockerhub/kora:latest`}</code>
            </pre>
          </div>

          <h2 className="text-[30px] leading-[38px] font-semibold text-black mt-16 mb-6">Multi-Tenant by Default</h2>
          <p>
            One Kora instance can serve dozens of isolated sites. Each site gets its own database, users, doctype registry, and analytics pipeline. Sites can be hot-added and removed without restarting. This makes Kora ideal for agencies managing applications for multiple clients.
          </p>

          <div className="my-8 p-8 bg-[#f1edec] border-l-4 border-[#FF6B35] rounded-r-xl">
            <h3 className="text-[24px] font-semibold text-black mb-2">Built for Ownership</h3>
            <p className="text-[#444748] m-0">
              Your data lives in your database. Your config is YAML — version control it, export it, take it anywhere. No vendor lock-in. No proprietary formats. No telemetry.
            </p>
          </div>
        </div>
      </article>
    </>
  )
}
