const box = 'bg-white border border-outline-variant rounded-sm p-6 text-sm text-muted'
const btn = 'text-sm font-semibold text-black underline underline-offset-4'

export function TemplateSkeleton({ count, className }: { count: number; className: string }) {
  return (
    <div className={className} role="status" aria-busy="true">
      <span className="sr-only">Loading templates</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white border border-outline-variant rounded-sm p-6 space-y-4" aria-hidden="true">
          <div className="h-7 w-2/3 bg-surface-container" />
          <div className="h-4 w-full bg-surface-container" />
          <div className="h-4 w-5/6 bg-surface-container" />
        </div>
      ))}
    </div>
  )
}

export function TemplateError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={box} role="alert">
      <p className="mb-3">We could not load templates.</p>
      <button type="button" onClick={onRetry} className={btn}>Try again</button>
    </div>
  )
}

export function TemplateEmpty() {
  return (
    <div className={box}>
      <p className="mb-3">No templates are published yet.</p>
      <a href="/onboard" className={btn}>Set up a blank workspace</a>
    </div>
  )
}

export function PreviewLabel() {
  return (
    <span className="inline-block border border-muted rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-wider text-muted font-mono">
      Preview
    </span>
  )
}
