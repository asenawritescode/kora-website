import { cloudSignupBase } from '@/lib/cloud-signup'

const box = 'bg-paper border border-line rounded-sm p-6 text-sm text-ink-3'
const btn = 'text-sm font-semibold text-ink underline underline-offset-4'

export function TemplateSkeleton({ count, className }: { count: number; className: string }) {
  return (
    <div className={className} role="status" aria-busy="true">
      <span className="sr-only">Loading templates</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-paper border border-line rounded-sm p-6 space-y-4" aria-hidden="true">
          <div className="h-7 w-2/3 bg-surface-2" />
          <div className="h-4 w-full bg-surface-2" />
          <div className="h-4 w-5/6 bg-surface-2" />
        </div>
      ))}
    </div>
  )
}

export function TemplateError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={box} role="alert">
      <p className="mb-3">We could not load templates.</p>
      <button type="button" onClick={onRetry} className={`${btn} min-h-12`}>Try again</button>
    </div>
  )
}

export function TemplateEmpty() {
  return (
    <div className={box}>
      <p className="mb-3">No templates are published yet.</p>
      <a href={cloudSignupBase()} className={`${btn} inline-flex min-h-12 items-center`}>Set up a blank workspace</a>
    </div>
  )
}

export function PreviewLabel() {
  return (
    <span className="inline-block border border-ink-3 rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-wider text-ink-3 font-mono">
      Preview
    </span>
  )
}
