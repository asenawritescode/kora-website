import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { LogoMark } from '@/components/landing/LogoMark'
import { SkipLink } from '@/components/landing/SkipLink'
import { H1, StatusBadge, Warn, type Status } from '@/components/landing/ui'
import { INDUSTRIES, industrySlug, type Industry } from '@/lib/industries-content'
import { choiceFrom, inclusionNote, modulesFrom, resolve, selectability, toggle } from '@/lib/module-picker'
import { industryFor, infoFor, notReady, presetKeys } from '@/lib/picker-preset'
import { setChoice, useChoice, useSignupHref } from '@/lib/signup-choice'
import { useCatalog } from '@/lib/use-catalog'
import { BRAND } from '@/lib/brand'

const POPULAR: [string, string, string][] = [
  ['retail-and-general-shops', 'Shop or kiosk', 'Dukas, minimarts, hardware stores, boutiques'],
  ['restaurants-and-cafes', 'Restaurant or café', 'Food, drinks, takeaway'],
  ['pharmacies-and-clinics', 'Pharmacy or clinic', 'Medicines and health products'],
  ['wholesale-and-distribution', 'Wholesale or distribution', 'Selling in bulk to other businesses'],
]
const POPULAR_SLUGS = new Set(POPULAR.map((p) => p[0]))
const OTHERS = INDUSTRIES.filter((i) => !POPULAR_SLUGS.has(industrySlug(i)))
const SCRATCH = 'scratch'
const OTHER = 'other'
const primary = 'flex min-h-[52px] w-full items-center justify-center rounded-md bg-action text-base font-semibold text-paper no-underline sm:w-auto sm:max-w-[300px] sm:flex-[1_1_200px]'

// Two screens, as in the design: what kind of business, then the modules.
// What can be ticked comes from Cloud's catalog; what is not ready yet comes
// from the module list.
export default function PickerPage() {
  const { state, retry } = useCatalog()
  const choice = useChoice()
  const signupHref = useSignupHref()
  const [screen, setScreen] = useState<'business' | 'setup'>('business')
  const [kind, setKind] = useState('')
  const [error, setError] = useState('')
  const [tried, setTried] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const firstScreen = useRef(true)
  // Changing screens starts at the top, with the heading focused for screen readers.
  useEffect(() => {
    if (firstScreen.current) { firstScreen.current = false; return }
    window.scrollTo(0, 0)
    heading.current?.focus({ preventScroll: true })
  }, [screen])

  const modules = useMemo(() => (state.status === 'ready' ? modulesFrom(state.templates) : []), [state])
  const result = useMemo(() => resolve(modules, choice.keys), [modules, choice.keys])
  const industry: Industry | undefined = industryFor(kind)

  // A link from an industry page starts on the setup screen for that industry.
  const [preset, setPreset] = useState<string | null>(() => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('for')))
  useEffect(() => {
    if (state.status !== 'ready' || !preset) return
    const found = industryFor(preset)
    if (found) { setKind(industrySlug(found)); setChoice(choiceFrom(modules, presetKeys(modules, found))); setScreen('setup') }
    setPreset(null)
  }, [state.status, preset, modules])

  const chosen = new Set(result.chosen.map((m) => m.key))
  const count = result.chosen.length + result.included.size
  const later = notReady(modules, industry)
  const showOther = kind === OTHER || (!!kind && kind !== SCRATCH && !POPULAR_SLUGS.has(kind))

  function next() {
    if (screen === 'business') {
      if (!kind || kind === OTHER) { setError(kind === OTHER ? 'Choose your business from the list, or pick modules yourself.' : 'Choose the kind of business you run.'); return }
      setChoice(choiceFrom(modules, industry ? presetKeys(modules, industry) : []))
      setScreen('setup'); setError(''); setTried(false)
    } else if (count === 0) setTried(true)
  }

  const forLine = kind === SCRATCH ? 'You’re choosing modules yourself.' : industry ? `Set up for ${industry.name.toLowerCase()}.` : ''

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SkipLink />
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[720px] items-center justify-between gap-3 px-4 py-2">
          <Link to="/" aria-label={`${BRAND} home`} className="flex min-h-12 items-center gap-2.5 text-ink no-underline">
            <LogoMark />
            <span className="font-display text-[1.4375rem] font-bold lowercase">{BRAND}</span>
          </Link>
          <span className="text-sm text-ink-3">Step 1 of 3</span>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-5 px-4 pb-8 pt-[clamp(1.5rem,5vw,3rem)] focus:outline-none">
        {screen === 'business' ? (
          <fieldset className="flex min-w-0 flex-col gap-3">
            <legend className="mb-4 p-0"><h1 ref={heading} tabIndex={-1} className={`${H1} text-[clamp(1.75rem,5vw,2.5rem)] leading-[1.1] focus:outline-none`}>What kind of business do you run?</h1></legend>
            {error && <p role="alert" className="flex gap-2 text-[0.9375rem] font-semibold text-red"><Warn />{error}</p>}
            {[...POPULAR, [OTHER, 'Another kind of business', `Choose from ${OTHERS.length} more, or pick modules yourself`]].map(([id, title, hint]) => {
              const on = id === OTHER ? showOther : kind === id
              return (
                <label key={id} className={`flex min-h-16 cursor-pointer items-center gap-3.5 rounded-xl px-4 py-3.5 ${on ? 'border-2 border-action bg-ok-wash' : 'border-2 border-line bg-paper'} has-[:focus-visible]:shadow-[0_0_0_4px_var(--color-accent)]`}>
                  <input type="radio" name="kind" value={id} checked={on} onChange={() => { setKind(id === OTHER ? OTHER : id); setError('') }} className="m-0 size-[22px] flex-none accent-action" />
                  <span className="flex min-w-0 flex-col gap-0.5"><span className="text-[1.0625rem] font-bold">{title}</span><span className="text-sm text-ink-2">{hint}</span></span>
                </label>
              )
            })}
            {showOther && (
              <label className="flex flex-col gap-1.5 text-[0.9375rem] font-bold">
                Choose your business
                <select
                  value={kind === OTHER ? '' : kind}
                  onChange={(e) => { setKind(e.target.value || OTHER); setError('') }}
                  className="min-h-12 rounded-md border border-line-control bg-paper px-3 text-base font-normal text-ink"
                >
                  <option value="">Choose one</option>
                  {OTHERS.map((i) => <option key={i.name} value={industrySlug(i)}>{i.name}</option>)}
                  <option value={SCRATCH}>None of these: I’ll choose modules myself</option>
                </select>
              </label>
            )}
          </fieldset>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <h1 ref={heading} tabIndex={-1} className={`${H1} text-[clamp(1.75rem,5vw,2.5rem)] leading-[1.1] focus:outline-none`}>Your setup</h1>
              <p className="flex flex-wrap items-center gap-x-2 text-base text-ink-2">
                {forLine}
                <button type="button" onClick={() => { setScreen('business'); setTried(false) }} className="min-h-11 px-1 font-semibold text-ink underline underline-offset-[0.18em]">Change</button>
              </p>
            </div>

            {state.status === 'loading' && (
              <>
                <p role="status" className="text-[0.9375rem] text-ink-2">Loading modules…</p>
                {[0, 1].map((i) => <div key={i} data-skeleton="" aria-hidden="true" className="h-[92px] rounded-xl bg-skeleton" />)}
              </>
            )}
            {state.status === 'error' && (
              <div role="alert" className="flex flex-col gap-2.5 rounded-xl border-2 border-red bg-red-wash p-4 text-red-ink">
                <p className="flex gap-2 text-base leading-normal"><Warn /><span><strong>The modules didn’t load.</strong> Check your connection and try again. Your choices are kept.</span></p>
                <button type="button" onClick={retry} className="min-h-12 self-start rounded-md bg-action px-[18px] text-base font-semibold text-paper">Try again</button>
              </div>
            )}
            {state.status === 'ready' && (
              <>
                {modules.length === 0 && (
                  <div className="flex flex-col items-start gap-1 rounded-xl border border-line bg-paper p-4 text-base text-ink-2">
                    <p>No modules are published yet.</p>
                    <Link to="/contact" className="inline-flex min-h-11 items-center font-semibold text-ink">Contact us</Link>
                  </div>
                )}
                <ul aria-label="Modules you can choose" className="flex flex-col gap-2.5">
                  {modules.filter((m) => selectability(modules, m).ok).map((m) => {
                    const inc = result.included.get(m.key)
                    const checked = chosen.has(m.key) || !!inc
                    return (
                      <li key={m.key} className={`rounded-xl ${checked ? 'border-2 border-action bg-ok-wash' : 'border-2 border-line bg-paper'} has-[:focus-visible]:shadow-[0_0_0_4px_var(--color-accent)]`}>
                        <label className="flex cursor-pointer items-start gap-3.5 p-4 has-[:disabled]:cursor-default">
                          <input
                            type="checkbox" checked={checked} disabled={!!inc}
                            onChange={() => setChoice(choiceFrom(modules, toggle(modules, choice.keys, m.key)))}
                            className="mt-0.5 size-6 flex-none accent-action"
                          />
                          <span className="flex min-w-0 flex-col gap-1">
                            <span className="text-[1.0625rem] font-bold">{m.name}</span>
                            <span className="line-clamp-3 text-base leading-[1.45] text-ink-2">{m.summary || infoFor(m.name)?.desc}</span>
                            {inc && <span className="text-sm font-semibold leading-[1.45] text-ok-ink">{inclusionNote(inc, m.name)}</span>}
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
                {later.length > 0 && (
                  <details className="rounded-xl border border-line bg-paper px-4">
                    <summary className="flex min-h-14 cursor-pointer items-center text-base font-semibold">
                      {later.length} more {industry ? 'in this setup aren’t' : 'modules aren’t'} ready yet
                    </summary>
                    <ul className="pb-2">
                      {later.map((m) => (
                        <li key={m.id} className="flex flex-col gap-1 border-t border-line-faint py-3">
                          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5"><span className="text-[0.9375rem] font-semibold">{m.name}</span><StatusBadge status={m.status as Status} /></span>
                          {m.missing && <span className="text-sm text-amber-ink">Not finished: {m.missing.replace(/^./, (c) => c.toLowerCase())}</span>}
                        </li>
                      ))}
                    </ul>
                    <Link to="/roadmap" className="mb-2 inline-flex min-h-12 items-center text-[0.9375rem] font-semibold">See the roadmap</Link>
                  </details>
                )}
              </>
            )}
          </>
        )}
      </main>

      <div className="sticky bottom-0 border-t border-line-2 bg-paper shadow-[0_-4px_16px_color-mix(in_srgb,var(--color-ink)_6%,transparent)]">
        <div className="mx-auto flex max-w-[720px] flex-col gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          {screen === 'setup' && tried && count === 0 && (
            <p role="alert" className="flex gap-2 text-sm font-semibold text-red"><Warn />Tick at least one module. Most shops start with Sales and point of sale.</p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-[0.9375rem]">
              {screen === 'setup' && <strong>{count === 0 ? 'No modules ticked.' : `${count.toLocaleString('en-US')} ${count === 1 ? 'module' : 'modules'}.`}</strong>} <span className="text-ink-3">Free during the pilot.</span>
            </p>
            {screen === 'setup' && count > 0
              ? <a href={signupHref} className={primary}>Continue to create account</a>
              : <button type="button" onClick={next} className={primary}>{screen === 'business' ? 'Continue' : 'Continue to create account'}</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
