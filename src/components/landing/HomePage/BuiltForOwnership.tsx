import { Scale, Server, Database, GitBranch } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: Scale,
    title: 'Open source',
    description: 'Inspect, modify, and run Kora on your own terms.',
  },
  {
    icon: Server,
    title: 'Self-Host Anywhere',
    description: 'Deploy to AWS, GCP, or your own infrastructure.',
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
    <section className="bg-[#f1edec] py-[120px]">
      <div className="max-w-[960px] mx-auto px-6 text-center">
        <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold mb-6 md:mb-8 tracking-[-0.02em] md:tracking-[-0.03em]">
          Built for ownership
        </h2>
        <p className="text-lg leading-7 text-[#444748] max-w-2xl mx-auto mb-[120px]">
          Kora is designed so teams can start fast without giving up control of their app, data, or deployment path.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="p-6">
              <item.icon className="h-10 w-10 text-[#FF6B35] mb-4 mx-auto" />
              <h4 className="text-xs font-medium uppercase mb-2" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                {item.title}
              </h4>
              <p className="text-base text-[#444748]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
