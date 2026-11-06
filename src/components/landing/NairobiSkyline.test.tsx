import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { NairobiSkyline } from './NairobiSkyline'

const svg = renderToStaticMarkup(<NairobiSkyline />)

test('the drawing is decorative and hidden from assistive technology', () => {
  expect(svg).toContain('aria-hidden="true"')
  expect(svg).toContain('focusable="false"')
})

test('one colour: every line is currentColor and no colour is hard-coded', () => {
  expect(svg).toContain('stroke="currentColor"')
  expect(svg).not.toMatch(/#[0-9a-f]{3,6}\b/i)
})

test('crops around the centre at narrow widths and keeps the ground line', () => {
  expect(svg).toContain('preserveAspectRatio="xMidYMax slice"')
  expect(svg).toContain('d="M0 250 H1440"')
})

test('every line can be drawn in (pathLength) and buildings hide what is behind them', () => {
  const paths = svg.match(/<path /g) ?? []
  expect(paths.length).toBeGreaterThan(15)
  expect((svg.match(/pathLength="1"/g) ?? []).length).toBe(paths.length)
  expect(svg).toContain('class="fill-night"')
})
