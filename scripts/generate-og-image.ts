// Renders public/og-image.png (1200x630): a plain typographic card from text only,
// no stock art and no mock UI. Replace it with a real product capture when a
// current one is on main (kora-website#8). Run: bun run og:image (needs Chrome).
//   CHROME=/usr/bin/google-chrome bun scripts/generate-og-image.ts
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { BRAND, PUBLISHER } from '../src/lib/brand'

const root = join(import.meta.dir, '..')
const font = join(root, 'node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')
const chrome = process.env.CHROME ?? 'google-chrome'

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: Geist; src: url("file://${font}"); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #f8f7f4; color: #171716; font-family: Geist, sans-serif; padding: 72px 80px; display: flex; flex-direction: column; justify-content: space-between; }
.mark { font-size: 40px; font-weight: 690; letter-spacing: -0.04em; border-left: 8px solid #C84018; padding-left: 20px; }
h1 { font-size: 96px; font-weight: 690; line-height: 1; letter-spacing: -0.06em; max-width: 960px; }
p { font-size: 30px; color: #62615e; letter-spacing: -0.01em; }
</style>
<div class="mark">${BRAND}</div>
<h1>Sales and stock for small shops.</h1>
<p>Cash sales, stock counts and a daily till close. ${BRAND} by ${PUBLISHER}.</p>`

const dir = mkdtempSync(join(tmpdir(), 'og-'))
try {
  writeFileSync(join(dir, 'card.html'), html)
  const profile = join(dir, 'profile')
  const run = Bun.spawnSync([
    chrome, '--headless=new', '--no-sandbox', '--disable-gpu', `--user-data-dir=${profile}`, '--hide-scrollbars',
    '--window-size=1200,630', '--force-device-scale-factor=1', '--virtual-time-budget=2000',
    `--screenshot=${join(root, 'public/og-image.png')}`, `file://${join(dir, 'card.html')}`,
  ])
  if (run.exitCode !== 0) throw new Error(`Chrome failed: ${run.stderr.toString()}`)
} finally {
  rmSync(dir, { recursive: true, force: true })
}
console.log('wrote public/og-image.png')
