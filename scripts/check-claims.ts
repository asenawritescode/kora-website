// Fails the build when a claim the product cannot back appears in src/.
// Source of truth: kora-website#4 and the truthfulness table in kora-website#1.
// A line is allowed only if it carries `claims-ok:` with a link to evidence.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { legacyNameLines } from './brand-rules'

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
  // Signup (kora-cloud#39): a business type and modules are chosen first; no site name; no generated workflow.
  { pattern: /site name/i, why: 'Cloud signup no longer asks for a site name' },
  { pattern: /first workflow|workflow structure/i, why: 'Self-service signup generates no workflow' },
  { pattern: /Start onboarding|Submit workspace|Provision app/, why: 'Old Cloud page steps; use SIGNUP_STEPS from src/lib/signup-steps.ts' },
  // Payments (kora-website#1): M-Pesa is recorded by hand, never connected; card, printers and eTIMS are not supported.
  { pattern: /Not supported yet: card and M-Pesa/i, why: 'M-Pesa payments can be recorded by hand; say that Kigae is not connected to M-Pesa' },
  { pattern: /only payment the pilot supports|records cash sales\b/i, why: 'Manual mobile-money recording works; cash is not the only payment' },
  { pattern: /Card, M-Pesa and receipt printing are not available/i, why: 'M-Pesa can be recorded by hand; name card, receipt printers and eTIMS instead' },
  { pattern: /(connects?|integrat\w+) (with|to) M-Pesa|M-Pesa (integration|payments? (are|is) (supported|accepted))/i, why: 'Kigae is not connected to M-Pesa' },
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
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (line.includes('claims-ok:')) return
    for (const ban of BANNED) {
      if (ban.exceptFiles?.includes(rel)) continue
      if (ban.pattern.test(line)) hits.push(`src/${rel}:${i + 1}: ${ban.pattern} (${ban.why})\n    ${line.trim()}`)
    }
  })
}

// The old product name, in src/ and the static HTML shell.
const brandFiles = [...walk(join(root, 'src')), join(root, 'index.html')]
for (const file of brandFiles) {
  if (/\.test\.tsx?$/.test(file) || file.includes('__fixtures__')) continue
  const text = readFileSync(file, 'utf8')
  const lines = text.split('\n')
  for (const n of legacyNameLines(text)) {
    hits.push(`${relative(root, file)}:${n}: legacy product name "Kora" (use BRAND from src/lib/brand.ts, or add claims-ok: <reason>)\n    ${lines[n - 1].trim()}`)
  }
}

if (hits.length) {
  console.error(`Unbacked claims found (${hits.length}):\n${hits.join('\n')}`)
  process.exit(1)
}
console.log('validate:claims ok')
