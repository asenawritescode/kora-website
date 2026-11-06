import { useEffect, useRef } from 'react'
import { motionMode, parallaxOffset, PARALLAX } from '@/lib/skyline-motion'

// The header's Nairobi skyline: a compact companion to the home page drawing
// (NairobiSkyline.tsx), hand-built for an 18 px band along the bottom of the
// navigation. Original line art, not traced from a photograph or artwork.
// DESIGN.md, "The Nairobi skyline", has the rules.
//
// Coordinates: 1920 x 18 user units, ground at y = 18 (the header's lower
// rule is the ground line, so buildings are open at the bottom). At 18 px
// tall one unit is one pixel; the art is centred and cropped from both sides.
// Two layers, so the parallax can move them at different rates: the distant
// Ngong Hills ridge, and the city in front of it.
//
// The drawing is decorative and hidden from assistive technology.

const W = 1920
const H = 18

type Shape = {
  d: string
  /** Left edge in user units: the draw-in runs left to right by this. */
  x: number
  /** Filled with the header colour so the ridge behind it stays hidden. */
  filled?: boolean
  /** Also drawn in the compact (phone) band. */
  compact?: boolean
}

type Win = { x: number; y: number; compact?: boolean }

const n = (v: number) => Math.round(v * 10) / 10

// Low unnamed rooftops: a stepped line from x0, each step [width, height].
function roofs(x0: number, steps: [number, number][], compact = false): Shape {
  let x = x0
  let d = `M${x0} ${H}`
  for (const [w, h] of steps) {
    d += ` V${H - h} H${x + w}`
    x += w
  }
  return { d: `${d} V${H}`, x: x0, filled: true, compact }
}

// A rounded park tree (Uhuru Park, Nyayo grounds): two-lobed canopy on a short trunk.
function parkTree(cx: number, r: number, compact = false): Shape[] {
  const b = H - 3.5
  return [
    { d: `M${cx} ${H} V${b}`, x: cx, compact },
    { d: `M${cx - r} ${b} A${r * 0.6} ${r * 0.6} 0 0 1 ${cx} ${b - r} A${r * 0.6} ${r * 0.6} 0 0 1 ${cx + r} ${b} Z`, x: cx - r, filled: true, compact },
  ]
}

// Ngong Hills: a far ridge that rises from the horizon east of the city,
// shows its four "knuckles", then runs down in a long tail to the south.
// Split into segments so it draws in left to right with the city.
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
function ridgeY(x: number): number {
  const g = (mu: number, s: number) => Math.exp(-((x - mu) ** 2) / (2 * s * s))
  const rise = x < 1050 ? smooth(990, 1050, x) : 1 - smooth(1100, 1670, x)
  const knuckles = 3.4 * g(1034, 6) + 4 * g(1062, 6.5) + 3.6 * g(1090, 6.5) + 2.6 * g(1117, 6)
  return H - 6.5 * rise - knuckles
}
const RIDGE: Shape[] = Array.from({ length: 5 }, (_, s) => {
  const x0 = 990 + s * 136
  let d = `M${x0} ${n(ridgeY(x0))}`
  for (let x = x0 + 4; x <= x0 + 136; x += 4) d += ` L${x} ${n(ridgeY(x))}`
  return { d, x: x0, compact: true }
})

const CITY: Shape[] = [
  // Rooftops first, so the landmarks cover them.
  roofs(70, [[18, 4], [14, 6], [22, 3], [12, 7], [26, 5], [16, 3], [20, 8], [18, 4], [24, 6], [14, 3], [30, 5], [20, 7], [16, 4], [22, 6], [18, 3], [26, 5], [14, 7], [20, 4], [16, 6], [12, 3], [10, 5], [22, 4], [18, 6], [14, 3], [20, 5], [16, 7], [24, 4]]),
  roofs(722, [[14, 4], [10, 6], [16, 3], [12, 5], [20, 7], [14, 4], [18, 6], [16, 3], [22, 5], [14, 7], [18, 4], [20, 6], [12, 3], [16, 5], [20, 4], [14, 6], [12, 3]], true),
  roofs(1220, [[14, 3], [18, 5], [12, 4], [20, 6], [16, 3], [22, 4], [14, 6], [18, 3], [16, 5], [20, 4]]),
  roofs(1480, [[16, 3], [20, 5], [14, 4], [24, 6], [18, 3], [12, 5], [22, 4], [16, 6], [20, 3], [14, 4]]),

  // Upper Hill. Britam Tower: the tallest, a prism whose roof slopes away.
  { d: `M586 ${H} V1.5 L598 7.5 V${H}`, x: 586, filled: true },
  { d: `M592 4.5 V${H}`, x: 592 },
  // Anniversary Towers: slender, with a pointed crown.
  { d: `M612 ${H} V7 L615.5 4.5 L619 7 V${H}`, x: 612, filled: true },

  // Uhuru Park trees, between Upper Hill and the city.
  ...parkTree(648, 4.5),
  ...parkTree(661, 5.5),
  ...parkTree(676, 4),
  ...parkTree(690, 5),

  // Teleposta Towers: a slab with a set-back top and a mast.
  { d: `M752 ${H} V5.5 H762 V${H}`, x: 752, filled: true, compact: true },
  { d: 'M754.5 5.5 V4 H759.5 V5.5', x: 754.5, filled: true, compact: true },
  { d: 'M757 4 V1.5', x: 757, compact: true },
  // Times Tower: the broad slab with its rooftop crown.
  { d: `M772 ${H} V2 H786 V${H}`, x: 772, filled: true, compact: true },
  { d: 'M774.5 2 V0.8 H783.5 V2', x: 774.5, compact: true },
  { d: `M776.5 2 V${H} M781.5 2 V${H}`, x: 776.5, compact: true },
  // Nation Centre: the two towers with their pointed tops.
  { d: `M798 ${H} V6 L803 3.5 L808 6 V${H}`, x: 798, filled: true, compact: true },
  { d: `M809 ${H} V8 L814 5.5 L819 8 V${H}`, x: 809, filled: true, compact: true },
  // I&M towers: a taller and a shorter tower with curved crowns.
  { d: `M833 ${H} V5.5 Q836.5 3.6 840 4.6 V${H}`, x: 833, filled: true, compact: true },
  { d: `M841 ${H} V8 Q844.5 6.4 848 7.2 V${H}`, x: 841, filled: true, compact: true },

  // KICC: the round tower with its flared crown and the helipad drum on top,
  // then the plenary hall with its cone roof beside it.
  { d: `M897 ${H} V7 L894.5 4.6 H907.5 L905 7 V${H}`, x: 894.5, filled: true, compact: true },
  { d: 'M894.5 4.6 V3.8 H907.5 V4.6', x: 894.5, compact: true },
  { d: 'M898.5 3.8 V2.2 H903.5 V3.8', x: 898.5, filled: true, compact: true },
  { d: 'M898.5 2.2 A2.5 0.7 0 0 1 903.5 2.2', x: 898.5, compact: true },
  { d: `M899.5 7 V${H} M902.5 7 V${H}`, x: 899.5, compact: true },
  { d: `M911 ${H} V15.4 H947 V${H}`, x: 911, filled: true, compact: true },
  { d: 'M909 15.4 L929 10 L949 15.4 Z', x: 909, filled: true, compact: true },

  // Nyayo grounds trees, east of the city.
  ...parkTree(962, 4.5, true),
  ...parkTree(975, 5.5, true),

  // An acacia on open ground below the Ngong Hills.
  { d: `M1166 ${H} C1166 15.5 1165.5 13.5 1163.5 11.6 M1166 14.4 C1168 12.8 1170.5 11.8 1173 11.2 M1164.8 12.8 C1162.5 11.9 1160.5 11.5 1158.5 11.2`, x: 1158.5, compact: true },
  { d: 'M1148 10.8 C1149 9.4 1153 8.8 1158 8.8 H1176 C1181 8.8 1185 9.4 1186 10.8 Z', x: 1148, filled: true, compact: true },
]

// Windows that light up in turn once the drawing has settled.
const WINDOWS: Win[] = [
  { x: 588.6, y: 10 },
  { x: 778.2, y: 5, compact: true },
  { x: 802.2, y: 9.5, compact: true },
  { x: 900.2, y: 10.5, compact: true },
  { x: 756, y: 9, compact: true },
  { x: 836, y: 8.5, compact: true },
  { x: 783.3, y: 12, compact: true },
  { x: 813.2, y: 12.5 },
]

function Layer({ shapes, layer, compact }: { shapes: Shape[]; layer: 'ridge' | 'city'; compact: boolean }) {
  const list = compact ? shapes.filter((s) => s.compact) : shapes
  const wins = layer === 'city' ? WINDOWS.filter((w) => !compact || w.compact) : []
  return (
    <svg
      aria-hidden="true"
      role="presentation"
      focusable="false"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      data-layer={layer}
      className={`hsky-layer hsky-${layer}`}
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {list.map((s, i) => (
        <path
          key={i}
          d={s.d}
          pathLength={1}
          className={s.filled ? 'fill-paper' : undefined}
          style={{ ['--x' as string]: s.x }}
        />
      ))}
      {wins.map((w, i) => (
        <rect
          key={`w${i}`}
          className="hsky-window"
          x={w.x}
          y={w.y}
          width={2}
          height={2}
          style={{ ['--w' as string]: i }}
        />
      ))}
    </svg>
  )
}

function Band({ compact }: { compact: boolean }) {
  return (
    <div className={`hsky ${compact ? 'hsky-compact md:hidden' : 'hsky-full hidden md:block'}`}>
      <Layer shapes={RIDGE} layer="ridge" compact={compact} />
      <Layer shapes={CITY} layer="city" compact={compact} />
    </div>
  )
}

/**
 * The animated band. It draws itself in once, then a few windows light up and
 * dim in turn, and the ridge and city drift a few px apart on scroll. Reduced
 * motion shows it complete and still; a hidden tab or an off-screen band
 * pauses it (src/lib/skyline-motion.ts).
 */
export function HeaderSkyline({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const layers = (name: 'ridge' | 'city') => Array.from(root.querySelectorAll<SVGSVGElement>(`[data-layer="${name}"]`))
    const ridge = layers('ridge')
    const city = layers('city')
    let intersecting = true
    let frame = 0
    let listening = false

    const place = () => {
      frame = 0
      const y = window.scrollY
      const r = parallaxOffset(y, PARALLAX.ridge.rate, PARALLAX.ridge.max)
      const c = parallaxOffset(y, PARALLAX.city.rate, PARALLAX.city.max)
      for (const el of ridge) el.style.transform = r ? `translate3d(${r}px,0,0)` : ''
      for (const el of city) el.style.transform = c ? `translate3d(${c}px,0,0)` : ''
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(place)
    }

    const update = () => {
      const mode = motionMode({ reducedMotion: reduce.matches, hidden: document.hidden, intersecting })
      root.dataset.motion = mode
      if (mode === 'running' && !listening) {
        window.addEventListener('scroll', onScroll, { passive: true })
        listening = true
        place()
      } else if (mode !== 'running' && listening) {
        window.removeEventListener('scroll', onScroll)
        listening = false
      }
      if (mode === 'static') for (const el of [...ridge, ...city]) el.style.transform = ''
    }

    const io = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver((entries) => {
        intersecting = entries.some((e) => e.isIntersecting)
        update()
      })
    io?.observe(root)
    document.addEventListener('visibilitychange', update)
    reduce.addEventListener('change', update)
    update()

    return () => {
      io?.disconnect()
      document.removeEventListener('visibilitychange', update)
      reduce.removeEventListener('change', update)
      if (listening) window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" role="presentation" className={`hsky-band pointer-events-none select-none ${className}`}>
      <Band compact={false} />
      <Band compact />
    </div>
  )
}
