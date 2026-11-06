// Pure rules for the header skyline's motion (src/components/landing/HeaderSkyline.tsx).
// Kept free of the DOM so they can be tested with `bun test`.

export type MotionMode = 'static' | 'paused' | 'running'

export type MotionInputs = {
  /** The visitor asked for less motion (prefers-reduced-motion: reduce). */
  reducedMotion: boolean
  /** The tab is in the background (document.hidden). */
  hidden: boolean
  /** The band is on screen (IntersectionObserver). */
  intersecting: boolean
}

/**
 * What the skyline may do right now.
 * - static: fully drawn, no ambient windows, no parallax. Reduced motion always wins.
 * - paused: animations hold where they are and the scroll listener is off
 *   (tab hidden, or the band is off screen).
 * - running: draw-in, ambient windows and parallax.
 */
export function motionMode({ reducedMotion, hidden, intersecting }: MotionInputs): MotionMode {
  if (reducedMotion) return 'static'
  if (hidden || !intersecting) return 'paused'
  return 'running'
}

/** Parallax layers: how far each drifts per pixel scrolled, and its cap in px. */
export const PARALLAX = {
  ridge: { rate: 0.004, max: 2 },
  city: { rate: 0.012, max: 6 },
} as const

/**
 * Horizontal drift for a layer, in px, for a given scroll position. Negative
 * (the city slides left as the page moves on), capped at `max`, rounded to a
 * quarter pixel so the transform does not change on every scroll event.
 */
export function parallaxOffset(scrollY: number, rate: number, max: number): number {
  if (!Number.isFinite(scrollY) || scrollY <= 0 || rate <= 0 || max <= 0) return 0
  const px = Math.min(scrollY * rate, max)
  return -Math.round(px * 4) / 4
}
