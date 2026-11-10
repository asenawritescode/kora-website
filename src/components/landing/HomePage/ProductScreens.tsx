import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

// Real screens with sample data, in a laptop whose lid opens as it scrolls into
// view (a phone below 640 px). Four tabs, an optional slow autoplay with a
// pause button, and no motion at all under prefers-reduced-motion.

type Screen = { id: string; label: string; module?: string; caption: string; alt: string }

const ALL = {
  sell: { id: 'sell', alt: 'The point of sale: product tiles with how many are left, and a cart of five items totalling KES 975' },
  stock: { id: 'stock', alt: 'The product list with category, price, SKU and stock quantity for each product' },
  sales: { id: 'sales', alt: 'The sales list: every sale with its date and time, payment method and register' },
  deliveries: { id: 'deliveries', alt: 'Stock movement history: deliveries received for each product' },
}

const SETS: Record<'home' | 'modules', Screen[]> = {
  home: [
    { ...ALL.sell, label: 'Sell', caption: 'Tap products, watch the total build, and see how many are left.' },
    { ...ALL.stock, label: 'Stock', caption: 'Every product, its price and how many are left.' },
    { ...ALL.sales, label: 'Sales', caption: 'Every sale, with the time and how it was paid.' },
    { ...ALL.deliveries, label: 'Deliveries', caption: 'Every delivery logged, so counts stay right.' },
  ],
  modules: [
    { ...ALL.sell, label: 'Point of sale', module: 'Sales and point of sale', caption: 'Tap products and the total builds as you go.' },
    { ...ALL.sales, label: 'Sales history', module: 'Sales and point of sale', caption: 'Every sale, with the time and how it was paid.' },
    { ...ALL.stock, label: 'Stock', module: 'Inventory and stock', caption: 'Every product, its price and how many are left.' },
    { ...ALL.deliveries, label: 'Deliveries', module: 'Inventory and stock', caption: 'Every delivery logged, so counts stay right.' },
  ],
}

const AUTOPLAY_MS = 4500
const NARROW_PX = 640

function reducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function ProductScreens({ variant = 'home', autoplay = true }: { variant?: 'home' | 'modules'; autoplay?: boolean }) {
  const SCREENS = SETS[variant]
  const root = useRef<HTMLDivElement>(null)
  const visible = useRef(true)
  const hold = useRef(false)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [narrow, setNarrow] = useState(false)
  const [open, setOpen] = useState(() => (reducedMotion() ? 1 : 0))
  const [settled, setSettled] = useState(() => reducedMotion())
  const [announce, setAnnounce] = useState(false)
  const still = reducedMotion()

  useEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => setNarrow(el.getBoundingClientRect().width < NARROW_PX)
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(el)
    const seen = new IntersectionObserver((entries) => { visible.current = entries[0].isIntersecting }, { threshold: 0.4 })
    seen.observe(el)
    return () => { resize.disconnect(); seen.disconnect() }
  }, [])

  // The lid opens with scroll position, then settles to a quick follow.
  useEffect(() => {
    const el = root.current
    if (!el || still) return
    let frame = 0
    let settle = 0
    const read = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 800
      const next = Math.round(Math.max(0, Math.min(1, (vh - r.top - r.height * 0.1) / (vh * 0.7))) * 100) / 100
      setOpen((was) => (was === next ? was : next))
      settle ||= window.setTimeout(() => setSettled(true), 1200)
    }
    const onScroll = () => { frame ||= requestAnimationFrame(read) }
    const first = window.setTimeout(read, 120)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      clearTimeout(first); clearTimeout(settle)
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [still])

  useEffect(() => {
    if (still || paused || !autoplay) return
    const timer = window.setInterval(() => {
      if (visible.current && !hold.current && open >= 0.9) { setAnnounce(false); setIndex((i) => (i + 1) % SCREENS.length) }
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [still, paused, autoplay, open])

  const pick = (i: number, focus = false) => {
    setIndex(i); setPaused(true); setAnnounce(true)
    if (focus) setTimeout(() => document.getElementById(`screen-tab-${i}`)?.focus(), 0)
  }
  const onKeys = (e: KeyboardEvent) => {
    const last = SCREENS.length - 1
    const next = { ArrowRight: (index + 1) % SCREENS.length, ArrowLeft: (index + last) % SCREENS.length, Home: 0, End: last }[e.key]
    if (next !== undefined) { e.preventDefault(); pick(next, true) }
  }

  const current = SCREENS[index]
  const lid = settled ? 'transform 180ms linear' : 'transform 400ms var(--ease-out)'
  const glow = settled ? 'opacity 180ms linear' : 'opacity 900ms var(--ease-out)'
  const frame = 'absolute inset-0 block h-full w-full object-cover object-top-left'
  // The incoming screen fades in on top; the outgoing one stays put underneath
  // and is dropped after the fade, so the frame never dips to the paper behind.
  const fade = (i: number) => ({ opacity: i === index ? 1 : 0, zIndex: i === index ? 2 : 1, transition: i === index ? 'opacity 450ms var(--ease-out)' : 'opacity 0ms 450ms' })

  return (
    <div
      ref={root}
      onMouseEnter={() => { hold.current = true }} onMouseLeave={() => { hold.current = false }}
      onFocus={() => { hold.current = true }} onBlur={() => { hold.current = false }}
      className="flex w-full flex-col items-center gap-4 text-center"
    >
      {narrow ? (
        <div
          id="screen-panel" role="tabpanel" aria-labelledby={`screen-tab-${index}`}
          className="relative aspect-[780/1480] w-full max-w-[300px] overflow-hidden rounded-xl border border-line bg-skeleton shadow-[0_16px_36px_color-mix(in_srgb,var(--color-ink)_8%,transparent)]"
        >
          {SCREENS.map((s, i) => (
            <img key={s.id} src={`/screens/${s.id}-phone.webp`} alt={s.alt} aria-hidden={i !== index} width={780} height={1480} decoding="async" className={frame} style={fade(i)} />
          ))}
        </div>
      ) : (
        <div className="w-full max-w-[880px] [perspective:1700px]">
          <div
            className="origin-bottom rounded-t-[18px] rounded-b-[5px] bg-lid p-[1.7%] shadow-[inset_0_0_0_1.5px_var(--color-lid-edge)]"
            style={{ transform: `rotateX(${(86 - 82 * open).toFixed(2)}deg)`, transition: lid, willChange: 'transform' }}
          >
            <div
              id="screen-panel" role="tabpanel" aria-labelledby={`screen-tab-${index}`}
              className="relative aspect-[1100/600] overflow-hidden rounded-[9px] bg-skeleton"
              style={{ opacity: 0.2 + 0.8 * open, transition: glow }}
            >
              {SCREENS.map((s, i) => (
                <img key={s.id} src={`/screens/${s.id}-laptop.webp`} alt={s.alt} aria-hidden={i !== index} width={2200} height={1200} decoding="async" fetchPriority={i === 0 ? 'high' : undefined} className={frame} style={fade(i)} />
              ))}
            </div>
          </div>
          <div aria-hidden="true" className="-mx-[3.4%] h-[clamp(12px,2.3vw,22px)] rounded-[2px_2px_22px_22px/2px_2px_14px_14px] bg-deck" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div role="tablist" aria-label="Choose a screen" onKeyDown={onKeys} className="inline-flex flex-wrap justify-center gap-1 rounded-lg border border-line bg-paper p-1">
          {SCREENS.map((s, i) => (
            <button
              key={s.id} type="button" role="tab" id={`screen-tab-${i}`}
              aria-selected={i === index} aria-controls="screen-panel" tabIndex={i === index ? 0 : -1}
              onClick={() => pick(i)}
              className={`min-h-11 flex-[1_1_40%] whitespace-nowrap rounded-[9px] px-4 text-[0.9375rem] font-semibold sm:flex-none ${i === index ? 'bg-action text-paper' : 'text-ink'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {!still && autoplay && (
          <button
            type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play the screens' : 'Pause the screens'}
            className="flex size-12 items-center justify-center rounded-lg border border-line-control bg-paper text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <path d={paused ? 'M6 4l10 6-10 6z' : 'M5 4h3.5v12H5z M11.5 4H15v12h-3.5z'} fill="currentColor" />
            </svg>
          </button>
        )}
      </div>
      <p aria-live={announce ? 'polite' : 'off'} className="min-h-[3em] max-w-[36em] text-base leading-normal text-ink-2">
        {current.module && <strong className="text-ink">{current.module}. </strong>}{current.caption} <span className="text-ink-3">Real screens with sample data.</span>
      </p>
    </div>
  )
}
