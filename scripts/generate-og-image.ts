// Renders public/og-image.png (1200x630): a plain typographic card from text only,
// no stock art and no mock UI. Replace it with a real product capture when a
// current one is on main (kora-website#8). Run: bun run og:image (needs Chrome).
//   CHROME=/usr/bin/google-chrome bun scripts/generate-og-image.ts
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { BRAND, PUBLISHER } from '../src/lib/brand'

const root = join(import.meta.dir, '..')
const fonts = (pkg: string) => join(root, `node_modules/@fontsource-variable/${pkg}/files/${pkg}-latin-wght-normal.woff2`)
const chrome = process.env.CHROME ?? 'google-chrome'

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: Inter; src: url("file://${fonts('inter')}"); font-weight: 100 900; }
@font-face { font-family: Grotesk; src: url("file://${fonts('space-grotesk')}"); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #ffffff; color: #0f0f12; font-family: Inter, sans-serif; padding: 72px 80px; display: flex; flex-direction: column; justify-content: space-between; }
.mark { font: 700 40px Grotesk, sans-serif; letter-spacing: -0.02em; border-left: 8px solid #6495ed; padding-left: 20px; }
h1 { font: 700 96px/1.03 Grotesk, sans-serif; letter-spacing: -0.03em; max-width: 960px; }
p { font-size: 30px; color: #5c5c66; }
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
