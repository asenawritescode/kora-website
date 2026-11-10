import { useRef, useState, type FormEvent } from 'react'
import { H1, Warn } from '@/components/landing/ui'
import { TOPICS, mailtoHref, supportEmail, validateContact, type ContactErrors, type ContactFields } from '@/lib/contact'

const EMPTY: ContactFields = { name: '', email: '', phone: '', topic: TOPICS[0], message: '' }
const input = 'min-h-12 w-full min-w-0 rounded-md bg-paper px-3 text-base text-ink'
const label = 'text-[0.9375rem] font-bold'

function Field({ id, title, error, children }: { id: string; title: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={label}>{title}</label>
      {error && <span id={`${id}-err`} className="flex gap-1.5 text-sm font-semibold leading-[1.45] text-red"><Warn />{error}</span>}
      {children}
    </div>
  )
}

export default function ContactPage() {
  const to = supportEmail()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [opened, setOpened] = useState(false)
  const form = useRef<HTMLFormElement>(null)

  const set = (key: keyof ContactFields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }
  const border = (key: keyof ContactErrors) => (errors[key] ? 'border border-red shadow-[inset_0_0_0_1px_var(--color-red)]' : 'border border-line-control')
  const aria = (key: keyof ContactErrors) => ({ 'aria-invalid': !!errors[key], 'aria-describedby': errors[key] ? `f-${key}-err` : undefined })

  function submit(e: FormEvent) {
    e.preventDefault()
    const found = validateContact(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) { document.getElementById(`f-${first}`)?.focus(); return }
    window.location.href = mailtoHref(to!, values)
    setOpened(true)
  }

  const count = Object.values(errors).filter(Boolean).length

  return (
    <div className="flex-1 bg-surface">
      <div className="mx-auto flex max-w-[1000px] flex-wrap items-start gap-8 px-4 pb-[clamp(3.5rem,6vw,5.5rem)] pt-[clamp(2rem,5vw,4.5rem)]">
        <div className="flex flex-[1_1_280px] flex-col gap-3">
          <h1 className={H1}>Contact us</h1>
          <p className="max-w-[620px] text-[1.125rem] leading-[1.55] text-ink-2">Questions about Zana, the pilot or a problem in your workspace.</p>
          <p className="text-[0.9375rem] text-ink-3">Based in Nairobi, Kenya.</p>
        </div>
        <div className="flex-[2_1_420px] rounded-xl border border-line bg-paper p-4 sm:p-6">
          {!to ? (
            <div className="flex flex-col gap-2.5">
              <h2 className="text-2xl tracking-[-0.02em]">Ask on GitHub</h2>
              <p className="text-base leading-normal text-ink-2">The team reads the public issue tracker. Open an issue with your question or the problem you hit.</p>
              <a href="https://github.com/asenawritescode/kora/issues" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center self-start rounded-md bg-action px-4 text-base font-semibold text-paper no-underline">Open an issue</a>
            </div>
          ) : opened ? (
            <div role="status" className="flex flex-col gap-2.5">
              <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.02em]">Your email app should open</h2>
              <p className="text-base leading-normal text-ink-2">Send the message from there, and the reply comes to <strong className="text-ink">{values.email}</strong>.</p>
              <button type="button" onClick={() => { setOpened(false); setValues(EMPTY) }} className="min-h-12 self-start rounded-md border border-line-control bg-paper px-4 text-base font-semibold text-ink">Write another message</button>
            </div>
          ) : (
            <form ref={form} noValidate onSubmit={submit} className="flex flex-col gap-[18px]">
              {count > 0 && (
                <p role="alert" className="rounded-md border-2 border-red bg-red-wash px-3.5 py-3 text-[0.9375rem] font-semibold text-red-ink">
                  {count === 1 ? 'Fix 1 thing to send your message.' : `Fix ${count} things to send your message.`}
                </p>
              )}
              <Field id="f-name" title="Your name" error={errors.name}>
                <input id="f-name" name="name" autoComplete="name" spellCheck={false} value={values.name} onChange={set('name')} className={`${input} ${border('name')}`} {...aria('name')} aria-required enterKeyHint="next" />
              </Field>
              <Field id="f-email" title="Email" error={errors.email}>
                <input id="f-email" name="email" type="email" autoComplete="email" spellCheck={false} value={values.email} onChange={set('email')} className={`${input} ${border('email')}`} {...aria('email')} aria-required enterKeyHint="next" />
              </Field>
              <Field id="f-phone" title={<>Phone <span className="font-normal text-ink-3">(optional)</span></>}>
                <input id="f-phone" name="phone" type="tel" autoComplete="tel" enterKeyHint="next" value={values.phone} onChange={set('phone')} className={`${input} border border-line-control`} />
              </Field>
              <Field id="f-topic" title="Topic">
                <select id="f-topic" name="topic" value={values.topic} onChange={set('topic')} className={`${input} border border-line-control`}>
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field id="f-message" title="Message" error={errors.message}>
                <textarea id="f-message" name="message" rows={5} value={values.message} onChange={set('message')} className={`min-h-[120px] w-full resize-y rounded-md bg-paper p-3 text-base leading-normal text-ink ${border('message')}`} {...aria('message')} aria-required maxLength={1200} />
              </Field>
              <button type="submit" className="flex min-h-[52px] items-center justify-center rounded-md bg-action text-[1.0625rem] font-semibold text-paper">Send message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
