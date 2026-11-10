// Shared pieces of the Zana design: button and heading classes, and the state
// badge used on Home, Modules and Roadmap.
export const BUTTON_PRIMARY = 'flex min-h-[52px] items-center rounded-md bg-action px-[22px] text-base font-semibold text-paper no-underline'
export const BUTTON_SECONDARY = 'flex min-h-[52px] items-center rounded-md border border-line-control bg-paper px-[22px] text-base font-semibold text-ink no-underline'
export const H1 = 'text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.05]'
export const H2 = 'text-[clamp(2rem,3.4vw,2.625rem)] leading-[1.1] tracking-[-0.02em]'
export const CARD = 'rounded-xl border border-line bg-paper'

export type Status = 'available' | 'preview' | 'roadmap'

const STATUS: Record<Status, { label: string; className: string; icon: string }> = {
  available: { label: 'Available', className: 'bg-ok-tint text-ok-ink', icon: 'M4.5 10.5l3.5 3.5 7.5-8' },
  preview: { label: 'Preview', className: 'bg-amber-tint text-amber-ink', icon: 'M10 3a7 7 0 1 1 0 14a7 7 0 1 1 0-14M10 6.5V10l2.5 1.5' },
  roadmap: { label: 'On the roadmap', className: 'bg-slate-tint text-slate', icon: 'M5 17.5V3h9l-2 3.25L14 9.5H5' },
}

export function StatusBadge({ status }: { status: Status }) {
  const s = STATUS[status] ?? STATUS.roadmap
  return (
    <span className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-full py-[3px] pl-[7px] pr-[9px] text-[0.8125rem] font-semibold ${s.className}`}>
      <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
        <path d={s.icon} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {s.label}
    </span>
  )
}

export function Tick({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className={`flex-none ${className}`}>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Warn() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className="flex-none">
      <path d="M10 2.5l8 14H2z M10 8v4 M10 14.5v.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
