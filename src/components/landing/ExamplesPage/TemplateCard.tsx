import { Link } from '@tanstack/react-router'
import type { Template } from './data'
import { PreviewLabel } from './TemplateStatus'

export function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="bg-paper border border-line rounded-sm p-8 hover:border-ink transition-colors group flex flex-col h-full">
      {/* Initial badge */}
      <div className="bg-surface-2 p-3 rounded-sm w-10 h-10 mb-4 group-hover:bg-action group-hover:text-paper transition-colors flex items-center justify-center">
        <span className="text-sm font-semibold text-ink group-hover:text-paper">
          {template.name.charAt(0)}
        </span>
      </div>

      <h3 className="text-[24px] leading-tight font-semibold text-ink mb-2">
        {template.name}
      </h3>
      {template.availability === 'preview' && <div className="mb-3"><PreviewLabel /></div>}
      <p className="text-base text-ink-3 mb-4 flex-grow">
        {template.description}
      </p>

      {/* Feature list */}
      <div className="border-t border-line pt-2 mt-auto">
        <ul className="space-y-2">
          {template.features.map((feature) => (
            <li key={feature} className="flex items-center text-ink-3 text-sm">
              <span className="mr-2 text-ink-3">—</span>
              {feature}
            </li>
          ))}
        </ul>
        <Link to="/templates/$slug" params={{ slug: template.slug }} className="mt-2 inline-flex min-h-12 items-center text-sm font-semibold text-action underline underline-offset-4">
          See what {template.name} includes
        </Link>
      </div>
    </div>
  )
}
