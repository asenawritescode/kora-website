// An original line drawing of the Nairobi skyline, hand-built for this site
// (not traced from a photograph or artwork). One colour (currentColor), one
// stroke width (set in index.css per band size). Buildings are filled with
// the band colour so the rooftops behind them stay hidden. DESIGN.md, "The
// Nairobi skyline", has the rules; each building is named below so the owner
// can correct a silhouette in one place.
//
// The drawing is decorative: the line "From Nairobi to the world" next to it
// is the real text, so the SVG is hidden from assistive technology.

type Shape = { d: string; filled?: boolean }

// Coordinates: 1440 x 260 user units, ground at y = 250, roughly 1 unit per
// metre of height so the towers keep their real order of size.
const GROUND = 'M0 250 H1440'

// Low rooftops, unnamed, behind the landmarks. They stop before the open
// ground on the right where the acacia stands.
const ROOFS: Shape[] = [
  { d: 'M0 250 V228 H26 V236 H56 V232 H74 V236 H100 V224 H136 V232 H154 V208 H184 V224 H202 V208 H220 V232 H238 V236 H260 V208 H296 V224 H314 V228 H332 V208 H358 V232 H380 V220 H410 V250' },
  { d: 'M470 250 V228 H506 V224 H524 V232 H550 V232 H586 V236 H622 V224 H658 V208 H688 V214 H740 V202 H770 V220 H796 V228 H818 V224 H862 V220 H880 V214 H916 V214 H942 V232 H968 V208 H986 V214 H1008 V202 H1030 V236 H1060 V232 H1104 V214 H1156 V214 H1182 V202 H1190 V250' },
]

const LANDMARKS: Record<string, Shape[]> = {
  // Britam Tower, Upper Hill: the tallest, a prism whose roof slopes away.
  britam: [
    { d: 'M420 250 V50 L468 94 V250 Z', filled: true },
    { d: 'M444 72 V250' },
  ],
  // Anniversary Towers, University Way: slender, with a pointed crown.
  anniversary: [{ d: 'M512 250 V162 L526 146 L540 162 V250 Z', filled: true }],
  // Teleposta Towers, Kenyatta Avenue: a slab with a set-back top and mast.
  teleposta: [
    { d: 'M588 250 V140 H630 V250 Z', filled: true },
    { d: 'M598 140 V128 H620 V140 Z', filled: true },
    { d: 'M609 128 V104' },
  ],
  // Times Tower, Haile Selassie Avenue: the broad slab beside KICC.
  times: [
    { d: 'M668 250 V112 H722 V250 Z', filled: true },
    { d: 'M674 112 V104 H716 V112 Z', filled: true },
    { d: 'M686 112 V250 M704 112 V250' },
  ],
  // KICC: the round tower with its flared crown and rooftop drum, and the
  // low conference hall with the cone roof beside it.
  kicc: [
    { d: 'M836 250 V226 L896 190 L956 226 V250 Z', filled: true },
    { d: 'M836 226 H956' },
    { d: 'M792 250 V158 L782 146 H836 L826 158 V250 Z', filled: true },
    { d: 'M782 146 V142 H836 V146' },
    { d: 'M799 142 V132 H819 V142 Z', filled: true },
    { d: 'M809 132 V120' },
    { d: 'M803 158 V250 M815 158 V250' },
  ],
  // An acacia on open ground: a nod to Nairobi National Park.
  acacia: [
    { d: 'M1300 250 C1301 240 1301 232 1299 226 C1296 218 1290 212 1284 207 M1299 226 C1304 218 1310 212 1318 207 M1300 236 C1306 228 1318 220 1332 208' },
    { d: 'M1236 206 C1262 192 1330 190 1358 203 C1344 211 1254 213 1236 206 Z', filled: true },
  ],
}

// Draw order: ground and rooftops first, then the landmarks from the back.
const ORDER = ['britam', 'anniversary', 'teleposta', 'times', 'kicc', 'acacia'] as const

export function NairobiSkyline({ className = '', fillClassName = 'fill-accent' }: { className?: string; fillClassName?: string }) {
  let i = 0
  const path = (s: Shape, key: string) => (
    <path
      key={key}
      d={s.d}
      pathLength={1}
      className={s.filled ? fillClassName : 'fill-none'}
      style={{ ['--i' as string]: i++ }}
    />
  )
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 260"
      preserveAspectRatio="xMidYMax slice"
      className={`skyline ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {path({ d: GROUND }, 'ground')}
      {ROOFS.map((s, n) => path(s, `roof-${n}`))}
      {ORDER.flatMap((name) => LANDMARKS[name].map((s, n) => path(s, `${name}-${n}`)))}
    </svg>
  )
}
