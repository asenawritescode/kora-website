import { useRef, useState, type FormEvent, type RefObject } from 'react'
import { FIELD_INPUT, Field, H1, Warn } from '@/components/landing/ui'
import { buildSignInUrl, cloudSignupBase } from '@/lib/cloud-signup'
import { followSignup, postSignup, validateOwner, type Owner, type OwnerErrors, type Selection } from '@/lib/onboard-client'

const EMPTY: Owner = { name: '', business: '', email: '', password: '' }
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const newKey = () => crypto.randomUUID()

type Phase = 'form' | 'working' | 'check_email' | 'timeout'

// The last step of set-up: the account and the workspace start together, here, without a
// second site. The chosen set-up is shown and can be changed; the password goes to Cloud and
// is dropped from the page as soon as Cloud has taken it.
export default function AccountStep({ selection, setupLine, headingRef, onChange, onSelectionRefused }: {
  selection: Selection
  setupLine: string
  headingRef: RefObject<HTMLHeadingElement | null>
  onChange: () => void
  onSelectionRefused: (message: string) => void
}) {
  const [owner, setOwner] = useState(EMPTY)
  const [errors, setErrors] = useState<OwnerErrors>({})
  const [phase, setPhase] = useState<Phase>('form')
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<{ text: string; signIn?: boolean } | null>(null)
  // The same details and choice keep one key, so asking again returns the same workspace;
  // any change starts a new attempt.
  const key = useRef(newKey())
  const lastAttempt = useRef<string | null>(null)
  const run = useRef(0)

  const set = (field: keyof Owner) => (e: { target: { value: string } }) => {
    setOwner((o) => ({ ...o, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }
  const border = (field: keyof OwnerErrors) => (errors[field] ? 'border border-red shadow-[inset_0_0_0_1px_var(--color-red)]' : 'border border-line-control')
  const aria = (field: keyof OwnerErrors) => ({ 'aria-invalid': !!errors[field], 'aria-describedby': errors[field] ? `a-${field}-err` : undefined })

  async function submit(e?: FormEvent) {
    e?.preventDefault()
    if (busy) return
    const found = validateOwner(owner)
    setErrors(found)
    setProblem(null)
    const first = Object.keys(found)[0]
    if (first) { document.getElementById(`a-${first}`)?.focus(); return }
    const attempt = JSON.stringify([owner.name.trim(), owner.business.trim(), owner.email.trim(), owner.password, selection])
    if (lastAttempt.current !== null && lastAttempt.current !== attempt) key.current = newKey()
    lastAttempt.current = attempt
    const mine = ++run.current
    setBusy(true)
    const result = await followSignup(() => postSignup(owner, selection, key.current), {
      sleep, now: Date.now,
      onWorking: () => { if (run.current === mine) setPhase('working') },
    })
    if (run.current !== mine) return
    setBusy(false)
    switch (result.kind) {
      case 'check_email': setPhase('check_email'); setOwner((o) => ({ ...o, password: '' })); return
      case 'timeout': setPhase('timeout'); return
      case 'selection': onSelectionRefused('That set-up could not be used any more. Choose your modules again.'); return
      case 'exists': setProblem({ text: 'An account with this email may already exist.', signIn: true }); break
      case 'details_changed': setProblem({ text: 'We already started a workspace from different details. Use the details you entered first, or sign in.', signIn: true }); break
      case 'refused': setProblem({ text: result.message }); break
      case 'failed': setProblem({ text: result.reason === 'rate_limited' ? 'Too many workspaces were set up from this connection. Try again in a little while.' : 'We could not reach Zana. Check your connection and try again.' }); break
    }
    setPhase('form')
  }

  const title = (text: string) => <h1 ref={headingRef} tabIndex={-1} className={`${H1} text-[clamp(1.75rem,5vw,2.5rem)] leading-[1.1] focus:outline-none`}>{text}</h1>

  if (phase === 'working' || phase === 'timeout') {
    return (
      <div className="flex flex-col gap-3">
        {title(phase === 'working' ? `Setting up ${owner.business.trim()}` : 'Still setting up')}
        <p role="status" className="text-base leading-normal text-ink-2">
          {phase === 'working' ? 'This can take a minute. Keep this page open.' : 'Setting up is taking longer than usual. Your details are saved; check again in a moment.'}
        </p>
        {phase === 'working'
          ? [0, 1].map((i) => <div key={i} data-skeleton="" aria-hidden="true" className="h-[56px] rounded-xl bg-skeleton" />)
          : <button type="button" onClick={() => submit()} className="min-h-12 self-start rounded-md bg-action px-5 text-base font-semibold text-paper">Check again</button>}
      </div>
    )
  }
  if (phase === 'check_email') {
    return (
      <div className="flex flex-col gap-3">
        {title('Check your email')}
        <p role="status" className="text-base leading-normal text-ink-2">
          We sent a link to <strong className="text-ink">{owner.email.trim()}</strong>. Open it to finish setting up {owner.business.trim()}.
        </p>
        <button type="button" onClick={() => { setPhase('form'); setOwner(EMPTY) }} className="min-h-12 self-start px-1 font-semibold text-ink underline underline-offset-[0.18em]">Wrong address? Start again</button>
      </div>
    )
  }
  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-1.5">
        {title('Create your account')}
        <p className="flex flex-wrap items-center gap-x-2 text-base text-ink-2">
          {setupLine}
          <button type="button" onClick={onChange} className="min-h-11 px-1 font-semibold text-ink underline underline-offset-[0.18em]">Change</button>
        </p>
      </div>
      {problem && (
        <p role="alert" className="flex flex-wrap items-center gap-x-1.5 rounded-md border-2 border-red bg-red-wash px-3.5 py-3 text-[0.9375rem] font-semibold text-red-ink">
          <Warn />{problem.text}{problem.signIn && <a href={buildSignInUrl(cloudSignupBase())} className="underline">Sign in</a>}
        </p>
      )}
      <Field id="a-name" title="Your name" error={errors.name}>
        <input id="a-name" name="name" autoComplete="name" spellCheck={false} value={owner.name} onChange={set('name')} className={`${FIELD_INPUT} ${border('name')}`} {...aria('name')} aria-required enterKeyHint="next" />
      </Field>
      <Field id="a-business" title="Business name" error={errors.business}>
        <input id="a-business" name="business" autoComplete="organization" value={owner.business} onChange={set('business')} className={`${FIELD_INPUT} ${border('business')}`} {...aria('business')} aria-required enterKeyHint="next" />
      </Field>
      <Field id="a-email" title="Email" error={errors.email}>
        <input id="a-email" name="email" type="email" autoComplete="email" spellCheck={false} value={owner.email} onChange={set('email')} className={`${FIELD_INPUT} ${border('email')}`} {...aria('email')} aria-required enterKeyHint="next" />
      </Field>
      <Field id="a-password" title="Password" error={errors.password}>
        <input id="a-password" name="password" type="password" autoComplete="new-password" value={owner.password} onChange={set('password')} className={`${FIELD_INPUT} ${border('password')}`} {...aria('password')} aria-required enterKeyHint="go" />
      </Field>
      <button type="submit" disabled={busy} className="flex min-h-[52px] items-center justify-center rounded-md bg-action text-[1.0625rem] font-semibold text-paper disabled:opacity-60">{busy ? 'Creating…' : 'Create workspace'}</button>
      <p className="text-sm leading-normal text-ink-3">Free during the pilot. Your password goes to Zana and is never sent to your workspace.</p>
    </form>
  )
}
