// The Zana mark: a rounded square with a Z stroke and one dot. In the header it
// is ink on paper; on the dark band it flips to cornflower with ink.
export function LogoMark({ onBand = false }: { onBand?: boolean }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" className={onBand ? 'fill-accent' : 'fill-action'} />
      <path
        d="M9 10h14L9 22h14"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={onBand ? 'stroke-on-accent' : 'stroke-paper'}
      />
      <circle cx="24" cy="9" r="2.5" className="fill-accent" />
    </svg>
  )
}
