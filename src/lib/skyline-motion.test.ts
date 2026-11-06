import { describe, expect, test } from 'bun:test'
import { motionMode, parallaxOffset, PARALLAX, type MotionInputs, type MotionMode } from './skyline-motion'

describe('motionMode', () => {
  const cases: { name: string; in: MotionInputs; want: MotionMode }[] = [
    { name: 'visible tab, on screen: runs', in: { reducedMotion: false, hidden: false, intersecting: true }, want: 'running' },
    { name: 'tab in the background: pauses', in: { reducedMotion: false, hidden: true, intersecting: true }, want: 'paused' },
    { name: 'off screen: pauses', in: { reducedMotion: false, hidden: false, intersecting: false }, want: 'paused' },
    { name: 'hidden and off screen: pauses', in: { reducedMotion: false, hidden: true, intersecting: false }, want: 'paused' },
    { name: 'reduced motion: static even when visible', in: { reducedMotion: true, hidden: false, intersecting: true }, want: 'static' },
    { name: 'reduced motion wins over hidden', in: { reducedMotion: true, hidden: true, intersecting: false }, want: 'static' },
  ]
  for (const c of cases) test(c.name, () => expect(motionMode(c.in)).toBe(c.want))
})

describe('parallaxOffset', () => {
  const cases: { name: string; y: number; rate: number; max: number; want: number }[] = [
    { name: 'top of the page: no drift', y: 0, rate: 0.012, max: 6, want: 0 },
    { name: 'overscroll (negative) is ignored', y: -80, rate: 0.012, max: 6, want: 0 },
    { name: 'drifts left with scroll', y: 250, rate: 0.012, max: 6, want: -3 },
    { name: 'rounds to a quarter pixel', y: 110, rate: 0.012, max: 6, want: -1.25 },
    { name: 'capped far down the page', y: 20000, rate: 0.012, max: 6, want: -6 },
    { name: 'not a number: no drift', y: Number.NaN, rate: 0.012, max: 6, want: 0 },
    { name: 'zero rate: no drift', y: 500, rate: 0, max: 6, want: 0 },
  ]
  for (const c of cases) test(c.name, () => expect(parallaxOffset(c.y, c.rate, c.max)).toBe(c.want))

  test('the ridge drifts less than the city and both stay within a few px', () => {
    for (const y of [50, 300, 900, 5000]) {
      const ridge = Math.abs(parallaxOffset(y, PARALLAX.ridge.rate, PARALLAX.ridge.max))
      const city = Math.abs(parallaxOffset(y, PARALLAX.city.rate, PARALLAX.city.max))
      expect(ridge).toBeLessThanOrEqual(city)
      expect(city).toBeLessThanOrEqual(6)
    }
  })
})
