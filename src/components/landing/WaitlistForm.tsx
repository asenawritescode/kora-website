import { Link } from '@tanstack/react-router'
import { useRef, useState, type FormEvent } from 'react'
import { FIELD_INPUT, Field } from '@/components/landing/ui'
import type { ContactErrors } from '@/lib/contact'
import type { Industry } from '@/lib/industries-content'
import { sendWaitlist, validateWaitlist, type WaitlistFields } from '@/lib/waitlist-lead'

const EMPTY: WaitlistFields = { name: '', email: '', note: '' }

// Shown in place of the module list when nothing in the catalog is ready for a kind
// of business: leave an email and hear when it is, rather than pick modules that do
// not fit.
export default function WaitlistForm({ industry, planned }: { industry: Industry; planned: string[] }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const form = useRef<HTMLFormElement>(null)
  const key = useRef(crypto.randomUUID())
  const what = industry.name.toLowerCase()

  const set = (field: keyof WaitlistFields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }
  const border = (field: keyof ContactErrors) => (errors[field] ? 'border border-red shadow-[inset_0_0_0_1px_var(--color-red)]' : 'border border-line-control')
  const aria = (field: keyof ContactErrors) => ({ 'aria-invalid': !!errors[field], 'aria-describedby': errors[field] ? `w-${field}-err` : undefined })

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (sending) return
    const found = validateWaitlist(values)
    setErrors(found)
    setProblem(null)
    const first = Object.keys(found)[0]
    if (first) { document.getElementById(`w-${first}`)?.focus(); return }
    setSending(true)
    const honeypot = new FormData(form.current ?? undefined).get('website')
    const result = await sendWaitlist(industry, values, key.current, typeof honeypot === 'string' ? honeypot : '')
    setSending(false)
    if (result.kind === 'sent') { key.current = crypto.randomUUID(); setSent(true); return }
    if (result.kind === 'invalid') { setErrors(result.errors); return }
    setProblem(result.reason === 'rate_limited' ? 'Too many requests from this connection. Try again in a minute.' : 'We could not save your email. Try again in a moment.')
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col gap-2.5 rounded-xl border border-line bg-paper p-4 sm:p-6">
        <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.02em]">You are on the list</h2>
        <p className="text-base leading-normal text-ink-2">We will write to <strong className="text-ink">{values.email}</strong> when {what} is ready.</p>
        <Link to="/roadmap" className="inline-flex min-h-12 items-center font-semibold text-ink">See the roadmap</Link>
      </div>
    )
  }
  return (
    <form ref={form} noValidate onSubmit={submit} className="flex flex-col gap-[18px] rounded-xl border border-line bg-paper p-4 sm:p-6">
      <p className="text-base leading-normal text-ink-2">
        Zana does not have what {what} need yet{planned.length > 0 && <>: {planned.join(', ').replace(/^./, (c) => c.toLowerCase())} {planned.length === 1 ? 'is' : 'are'} planned</>}. Leave your email and we will write to you when it does.
      </p>
      {problem && <p role="alert" className="rounded-md border-2 border-red bg-red-wash px-3.5 py-3 text-[0.9375rem] font-semibold text-red-ink">{problem}</p>}
      <Field id="w-name" title="Your name" error={errors.name}>
        <input id="w-name" name="name" autoComplete="name" spellCheck={false} value={values.name} onChange={set('name')} className={`${FIELD_INPUT} ${border('name')}`} {...aria('name')} aria-required enterKeyHint="next" />
      </Field>
      <Field id="w-email" title="Email" error={errors.email}>
        <input id="w-email" name="email" type="email" autoComplete="email" spellCheck={false} value={values.email} onChange={set('email')} className={`${FIELD_INPUT} ${border('email')}`} {...aria('email')} aria-required enterKeyHint="next" />
      </Field>
      <Field id="w-note" title={<>What you would use it for <span className="font-normal text-ink-3">(optional)</span></>}>
        <textarea id="w-note" name="note" rows={3} value={values.note} onChange={set('note')} className="min-h-[88px] w-full resize-y rounded-md border border-line-control bg-paper p-3 text-base leading-normal text-ink" />
      </Field>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <button type="submit" disabled={sending} className="flex min-h-[52px] items-center justify-center rounded-md bg-action text-[1.0625rem] font-semibold text-paper disabled:opacity-60">{sending ? 'Saving…' : 'Tell me when it is ready'}</button>
    </form>
  )
}
