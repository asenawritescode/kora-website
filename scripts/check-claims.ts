// Fails the build when a claim the product cannot back appears in src/.
// Source of truth: kora-website#4 and the truthfulness table in kora-website#1.
// A line is allowed only if it carries `claims-ok:` with a link to evidence.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = join(import.meta.dir, '..')

type Ban = { pattern: RegExp; why: string; exceptFiles?: string[] }

const BANNED: Ban[] = [
  { pattern: /\$20/, why: 'No price is decided; Cloud plans are in KES' },
  { pattern: /Cancel anytime/i, why: 'There is no billing, so nothing to cancel' },
  { pattern: /in minutes/i, why: 'No measured setup time' },
  { pattern: /\bminutes? away\b/i, why: 'No measured setup time' },
  { pattern: /MariaDB/, why: 'Only MySQL and LibSQL are documented' },
  { pattern: /AWS, GCP/, why: 'No cloud-specific deployment guides' },
  { pattern: /AI builder/, why: 'AI chat is experimental and needs a provider key' },
  { pattern: /AI Assistant/, why: 'AI chat is experimental and needs a provider key' },
  { pattern: /fieldwork|helpdesk|property management/i, why: 'Only the Retail POS template is published' },
  { pattern: /Mradi Africa|Sponsored by/, why: 'The sponsor is Senumi' },
  { pattern: /Kora builds the app/, why: 'Signup gives a blank workspace' },
  { pattern: /Get a working workspace/, why: 'Signup gives a blank workspace' },
  { pattern: /Email support|Operational support|Priority support|Custom domain/, why: 'No support service or custom-domain feature is documented' },
  { pattern: /private (managed )?instance/i, why: 'No private instance offer exists' },
  { pattern: /Your data lives in your own database/, why: 'Cloud hosts the data' },
  { pattern: /open immediately/, why: 'The workspace opens after email confirmation' },
]

// Pages that #12 deletes outright. Their copy is not edited here.
const PENDING_REMOVAL = [
  'components/landing/AIBuilderPage.tsx',
  'routes/landing/ai-builder.tsx',
]

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (/\.(tsx?|css|html|md|json)$/.test(name)) yield p
  }
}

const hits: string[] = []
for (const file of walk(join(root, 'src'))) {
  const rel = relative(join(root, 'src'), file)
  if (PENDING_REMOVAL.includes(rel)) continue
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (line.includes('claims-ok:')) return
    for (const ban of BANNED) {
      if (ban.exceptFiles?.includes(rel)) continue
      if (ban.pattern.test(line)) hits.push(`src/${rel}:${i + 1}: ${ban.pattern} (${ban.why})\n    ${line.trim()}`)
    }
  })
}

if (hits.length) {
  console.error(`Unbacked claims found (${hits.length}):\n${hits.join('\n')}`)
  process.exit(1)
}
console.log('validate:claims ok')
