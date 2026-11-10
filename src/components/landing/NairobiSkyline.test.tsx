import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { NairobiSkyline } from './NairobiSkyline'

const svg = renderToStaticMarkup(<NairobiSkyline />)

test('the drawing is decorative and hidden from assistive technology', () => {
  expect(svg).toContain('aria-hidden="true"')
  expect(svg).toContain('focusable="false"')
})

test('one colour: every line is currentColor and nothing is filled or hard-coded', () => {
  expect(svg).toContain('stroke="currentColor"')
  expect(svg).toContain('fill="none"')
  expect(svg).not.toMatch(/#[0-9a-f]{3,6}\b/i)
  expect(svg).not.toMatch(/rgb\(/)
})

test('crops around the centre at narrow widths and keeps the ground line', () => {
  expect(svg).toContain('preserveAspectRatio="xMidYMax slice"')
  expect(svg).toContain('d="M10 320 L1430 320"')
})

test('keeps the canvas drawing: many shapes in a few stroke weights', () => {
  expect((svg.match(/<(path|rect|circle|ellipse) /g) ?? []).length).toBeGreaterThan(300)
  expect((svg.match(/<g /g) ?? []).length).toBeLessThan(20)
})
