import { Link } from '@tanstack/react-router'
import type { Template } from './data'
import { PreviewLabel } from './TemplateStatus'

export function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="bg-white border border-outline-variant rounded-sm p-8 hover:border-black transition-colors group flex flex-col h-full">
      {/* Initial badge */}
      <div className="bg-surface-container p-3 rounded-sm w-10 h-10 mb-4 group-hover:bg-action group-hover:text-white transition-colors flex items-center justify-center">
        <span className="text-sm font-semibold text-black group-hover:text-white">
          {template.name.charAt(0)}
        </span>
      </div>

      <h3 className="text-[24px] leading-tight font-semibold text-black mb-2">
        {template.name}
      </h3>
      {template.availability === 'preview' && <div className="mb-3"><PreviewLabel /></div>}
      <p className="text-base text-muted mb-4 flex-grow">
        {template.description}
      </p>

      {/* Feature list */}
      <div className="border-t border-outline-variant pt-2 mt-auto">
        <ul className="space-y-2">
          {template.features.map((feature) => (
            <li key={feature} className="flex items-center text-muted text-sm">
              <span className="mr-2 text-muted">—</span>
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
