// The product is called Kigae (src/lib/brand.ts). The old name may survive only
// in technical identifiers, which are lowercase (`kora`, kora.mradiafrica.com)
// or upper snake case (KORA_*) and so never match. Anything else needs a
// `claims-ok: <reason>` comment on the same or the previous line.
export const LEGACY_NAME = /\bKora\b/

// Wire-format names that keep the legacy spelling for compatibility.
const ALLOWED_CONTEXTS = [/Kora-Signature/]

export function legacyNameLines(text: string): number[] {
  const lines = text.split('\n')
  const hits: number[] = []
  lines.forEach((line, i) => {
    if (line.includes('claims-ok:') || (i > 0 && lines[i - 1].includes('claims-ok:'))) return
    let rest = line
    for (const allowed of ALLOWED_CONTEXTS) rest = rest.replace(allowed, '')
    if (LEGACY_NAME.test(rest)) hits.push(i + 1)
  })
  return hits
}
