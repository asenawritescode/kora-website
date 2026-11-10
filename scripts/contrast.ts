// Fails the build when a text/background pair declared in src/styles/tokens.css
// is below its WCAG 2.x minimum. Colours and pairs are read from that one file.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const tokensPath = join(import.meta.dir, '../src/styles/tokens.css')

const DARK_BLOCK = /:root\[data-theme="dark"\]\s*\{([^}]*)\}/

function hexColors(css: string): Record<string, string> {
  const colors: Record<string, string> = {}
  for (const m of css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})\s*;/g)) colors[m[1]] = m[2].toLowerCase()
  return colors
}

/** The light theme: every colour outside the dark override block. */
export function parseColors(css: string): Record<string, string> {
  return hexColors(css.replace(DARK_BLOCK, ''))
}

/** The dark theme: the light colours with the dark block's values on top. */
export function parseDarkColors(css: string): Record<string, string> {
  return { ...parseColors(css), ...hexColors(css.match(DARK_BLOCK)?.[1] ?? '') }
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

export type Result = Pair & { mode: 'light' | 'dark'; ratio: number; ok: boolean; error?: string }

export function checkPairs(css: string): Result[] {
  const modes = [['light', parseColors(css)]] as [Result['mode'], Record<string, string>][]
  if (DARK_BLOCK.test(css)) modes.push(['dark', parseDarkColors(css)])
  return modes.flatMap(([mode, colors]) =>
    parsePairs(css).map((p) => {
      if (!colors[p.fg] || !colors[p.bg]) return { ...p, mode, ratio: 0, ok: false, error: `unknown token in "${p.fg} on ${p.bg}"` }
      const ratio = contrastRatio(colors[p.fg], colors[p.bg])
      return { ...p, mode, ratio, ok: ratio >= p.min }
    }),
  )
}

if (import.meta.main) {
  const results = checkPairs(readFileSync(tokensPath, 'utf8'))
  if (results.length === 0) {
    console.error('validate:contrast: no `pair:` lines found in src/styles/tokens.css')
    process.exit(1)
  }
  for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} [${r.mode}] ${r.fg} on ${r.bg}: ${r.ratio.toFixed(2)}:1 (min ${r.min})${r.error ? ' ' + r.error : ''}`)
  if (results.some((r) => !r.ok)) process.exit(1)
  console.log('validate:contrast ok')
}
