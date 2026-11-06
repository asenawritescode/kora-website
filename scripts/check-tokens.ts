// Fails the build when a hex colour appears in src/ outside src/styles/tokens.css,
// so the palette can be swapped in that one file. Use a token utility instead
// (text-muted, bg-accent ...). A line may opt out with `tokens-ok: <reason>`.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = join(import.meta.dir, '..')
const HEX = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/

export function hexLines(text: string): number[] {
  const lines = text.split('\n')
  return lines.flatMap((line, i) => {
    if (line.includes('tokens-ok:') || (i > 0 && lines[i - 1].includes('tokens-ok:'))) return []
    // Skip URL fragments such as href="#main" or /docs#api: not a colour unless 3, 6 or 8 hex digits.
    return HEX.test(line.replace(/(href|to)=["'][^"']*["']/g, '')) ? [i + 1] : []
  })
}

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (/\.(tsx?|css)$/.test(name) && !/\.test\.tsx?$/.test(name)) yield p
  }
}

export function findHexProblems(): string[] {
  const problems: string[] = []
  for (const file of walk(join(root, 'src'))) {
    const rel = relative(root, file)
    if (rel === 'src/styles/tokens.css' || rel.includes('__fixtures__')) continue
    const lines = readFileSync(file, 'utf8').split('\n')
    for (const n of hexLines(lines.join('\n'))) problems.push(`${rel}:${n}: hard-coded colour (use a token from src/styles/tokens.css)\n    ${lines[n - 1].trim()}`)
  }
  return problems
}

if (import.meta.main) {
  const problems = findHexProblems()
  if (problems.length) {
    console.error(`Hard-coded colours found (${problems.length}):\n${problems.join('\n')}`)
    process.exit(1)
  }
  console.log('validate:tokens ok')
}
