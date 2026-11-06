import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { HeaderSkyline } from './HeaderSkyline'

const html = renderToStaticMarkup(<HeaderSkyline />)
const bands = html.split('class="hsky ').slice(1)
const [full, compact] = bands
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length

describe('HeaderSkyline', () => {
  test('decorative: hidden from assistive technology, nothing focusable', () => {
    expect(html.startsWith('<div aria-hidden="true" role="presentation"')).toBe(true)
    expect(count(html, /<svg /g)).toBe(4)
    expect(count(html, /aria-hidden="true"/g)).toBe(5)
    expect(count(html, /focusable="false"/g)).toBe(4)
    expect(html).not.toMatch(/<(a|button|input)\b|tabindex/i)
  })

  test('no layout shift: every layer has width, height and a viewBox', () => {
    expect(count(html, /width="1920" height="18" viewBox="0 0 1920 18"/g)).toBe(4)
    expect(count(html, /preserveAspectRatio="xMidYMax slice"/g)).toBe(4)
  })

  test('one colour per layer from the tokens, no hard-coded colour', () => {
    expect(count(html, /stroke="currentColor"/g)).toBe(4)
    expect(html).not.toMatch(/#[0-9a-f]{3,6}\b/i)
  })

  test('the full band and a simpler phone band', () => {
    expect(bands.length).toBe(2)
    expect(full).toContain('hsky-full')
    expect(compact).toContain('hsky-compact')
    expect(count(compact, /<path /g)).toBeLessThan(count(full, /<path /g))
    expect(count(compact, /class="hsky-window"/g)).toBeLessThan(count(full, /class="hsky-window"/g))
  })

  test('every line can be drawn in, left to right', () => {
    for (const band of bands) {
      const paths = count(band, /<path /g)
      expect(count(band, /pathLength="1"/g)).toBe(paths)
      expect(count(band, /--x:/g)).toBe(paths)
    }
  })

  test('both bands keep the named landmarks: KICC helipad drum and cone hall, Times Tower, the ridge', () => {
    for (const band of bands) {
      expect(band).toContain('M898.5 2.2 A2.5 0.7 0 0 1 903.5 2.2')
      expect(band).toContain('M909 15.4 L929 10 L949 15.4 Z')
      expect(band).toContain('M772 18 V2 H786 V18')
      expect(band).toContain('data-layer="ridge"')
    }
  })
})
