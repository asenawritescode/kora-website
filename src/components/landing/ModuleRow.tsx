import type { PickerModule, Selectability } from '@/lib/module-picker'

const label = 'font-mono text-[11px] font-medium uppercase tracking-[0.08em]'

function Tick() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute inset-0 m-auto size-3.5 text-paper opacity-0 peer-checked:opacity-100">
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}

export function unselectableNote(s: Selectability): string | undefined {
  if (s.ok) return undefined
  return s.reason === 'preview' ? 'Preview: it cannot be chosen yet.' : `It cannot be chosen yet: it needs ${s.by}, which is still a preview.`
}

// One module in a ruled list: checkbox, name, summary, and a note that says why
// it is included or why it cannot be chosen yet. Rules: DESIGN.md "Module picker".
export function ModuleRow({
  m,
  chosen,
  note,
  selectable,
  onToggle,
}: {
  m: PickerModule
  chosen: boolean
  note?: string
  selectable: Selectability
  onToggle: () => void
}) {
  const included = !chosen && note !== undefined && selectable.ok
  const blocked = !selectable.ok
  const text = note ?? unselectableNote(selectable)
  const id = m.key.replace(/[^a-z0-9-]/gi, '-')
  const [nameId, summaryId, noteId] = [`${id}-name`, `${id}-summary`, `${id}-note`]
  const describedBy = [m.summary && summaryId, text && noteId].filter(Boolean).join(' ') || undefined
  return (
    <li className={`border-b border-line last:border-b-0 ${chosen ? 'bg-ok-wash' : 'bg-paper'}`}>
      <label className="flex cursor-pointer gap-4 px-5 py-[18px] has-[:disabled]:cursor-default has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-action has-[:focus-visible]:-outline-offset-3">
        <span className="relative mt-1 size-[22px] shrink-0">
          <input
            type="checkbox"
            checked={chosen || included}
            disabled={included || blocked}
            onChange={onToggle}
            aria-labelledby={nameId}
            aria-describedby={describedBy}
            className="peer size-[22px] appearance-none border-[1.5px] border-ink bg-paper checked:border-action checked:bg-action disabled:border-ink-3 disabled:bg-surface-2 disabled:checked:border-ink disabled:checked:bg-ink focus-visible:outline-none"
          />
          <Tick />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span id={nameId} className={`font-display text-[clamp(20px,2vw,24px)] font-[680] leading-[1.15] ${blocked ? 'text-ink-3' : 'text-ink'}`}>{m.name}</span>
            {m.availability === 'preview' && <span className={`${label} border border-ink px-1.5 py-0.5 text-ink`}>Preview</span>}
          </span>
          {m.summary && <span id={summaryId} className="mt-1 block text-[16px] leading-[1.5] text-ink-3">{m.summary}</span>}
          {text && <span id={noteId} className="mt-2 block text-[14px] leading-[1.5] text-ink-2">{text}</span>}
        </span>
      </label>
    </li>
  )
}
