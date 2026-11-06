import { Scale, Server, Database, GitBranch } from 'lucide-react'
import { BRAND } from '@/lib/brand'

const TRUST_ITEMS = [
  {
    icon: Scale,
    title: 'Open source',
    description: `Inspect, modify, and run ${BRAND} on your own terms.`,
  },
  {
    icon: Server,
    title: 'Self-host',
    description: 'Runs on any Linux server with Docker.',
  },
  {
    icon: Database,
    title: 'Direct SQL Access',
    description: 'No proprietary format. Your data stays in SQL.',
  },
  {
    icon: GitBranch,
    title: 'Git-friendly',
    description: 'Keep schema and app changes in version control.',
  },
]

export function BuiltForOwnership() {
  return (
    <section className="bg-surface-container py-[120px]">
      <div className="max-w-[960px] mx-auto px-6 text-center">
        <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold mb-6 md:mb-8 tracking-[-0.02em] md:tracking-[-0.03em]">
          Built for ownership
        </h2>
        <p className="text-lg leading-7 text-on-surface-variant max-w-2xl mx-auto mb-[120px]">
          {BRAND} is designed so teams can start fast without giving up control of their app, data, or deployment path.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="p-6">
              <item.icon className="h-10 w-10 text-accent mb-4 mx-auto" />
              <h3 className="text-xs font-medium uppercase mb-2" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                {item.title}
              </h3>
              <p className="text-base text-on-surface-variant">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
