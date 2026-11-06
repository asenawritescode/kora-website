// Fails the build when a text/background pair declared in src/styles/tokens.css
// is below its WCAG 2.x minimum. Colours and pairs are read from that one file.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const tokensPath = join(import.meta.dir, '../src/styles/tokens.css')

export function parseColors(css: string): Record<string, string> {
  const colors: Record<string, string> = {}
  for (const m of css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})\s*;/g)) colors[m[1]] = m[2].toLowerCase()
  return colors
}

export type Pair = { fg: string; bg: string; min: number }

export function parsePairs(css: string): Pair[] {
  return [...css.matchAll(/pair:\s*([\w-]+)\s+on\s+([\w-]+)(?:\s+min\s+([\d.]+))?/g)].map((m) => ({
    fg: m[1],
    bg: m[2],
    min: m[3] ? Number(m[3]) : 4.5,
  }))
}

function channel(v: number): number {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const h = hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join('')}` : hex
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(h.slice(i, i + 2), 16)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export type Result = Pair & { ratio: number; ok: boolean; error?: string }

export function checkPairs(css: string): Result[] {
  const colors = parseColors(css)
  return parsePairs(css).map((p) => {
    if (!colors[p.fg] || !colors[p.bg]) return { ...p, ratio: 0, ok: false, error: `unknown token in "${p.fg} on ${p.bg}"` }
    const ratio = contrastRatio(colors[p.fg], colors[p.bg])
    return { ...p, ratio, ok: ratio >= p.min }
  })
}

if (import.meta.main) {
  const results = checkPairs(readFileSync(tokensPath, 'utf8'))
  if (results.length === 0) {
    console.error('validate:contrast: no `pair:` lines found in src/styles/tokens.css')
    process.exit(1)
  }
  for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.fg} on ${r.bg}: ${r.ratio.toFixed(2)}:1 (min ${r.min})${r.error ? ' ' + r.error : ''}`)
  if (results.some((r) => !r.ok)) process.exit(1)
  console.log('validate:contrast ok')
}
