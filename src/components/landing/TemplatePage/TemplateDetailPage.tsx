import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CatalogError, DEFAULT_DETAIL_LABELS, type CatalogTemplateDetail, type DetailLabels } from '@/lib/catalog-client'
import { getCatalogTemplate } from '@/lib/public-content'
import { buildSignupUrl, cloudSignupBase } from '@/lib/cloud-signup'
import { choiceFrom, inclusionNote, modulesFrom, resolve, selectability, toggle } from '@/lib/module-picker'
import { setChoice, useChoice } from '@/lib/signup-choice'
import { SIGNUP_STEPS } from '@/lib/signup-steps'
import { PRICE_LINE } from '@/lib/pilot'
import { ModuleRow } from '@/components/landing/ModuleRow'
import { Seo } from '@/components/landing/Seo'
import { BRAND } from '@/lib/brand'

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'unavailable'; labels: DetailLabels }
  | { status: 'ready'; template: CatalogTemplateDetail }

function useTemplate(slug: string) {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let alive = true
    setState({ status: 'loading' })
    getCatalogTemplate(slug)
      .then((template) => alive && setState({ status: 'ready', template }))
      .catch((err) => {
        if (!alive) return
        if (err instanceof CatalogError && err.kind === 'not_found') setState({ status: 'unavailable', labels: err.labels ?? DEFAULT_DETAIL_LABELS })
        else setState({ status: 'error' })
      })
    return () => { alive = false }
  }, [slug, attempt])
  return { state, retry: useCallback(() => setAttempt((n) => n + 1), []) }
}

const label = 'font-mono text-[11px] font-medium uppercase tracking-[0.08em]'
const h2 = 'font-display text-[clamp(28px,3vw,40px)] font-[740] leading-[1.05] tracking-[-0.025em] text-ink [text-wrap:balance]'
const textLink = 'inline-flex min-h-12 items-center font-semibold text-ink underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] hover:decoration-action hover:decoration-2'
const button = 'inline-flex min-h-12 items-center bg-action px-[22px] text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-action-busy active:translate-y-px'

// What a visitor should know before signing up, from the Cloud catalog alone:
// who it helps (the summary), what is in it and what is optional, what to bring,
// what happens next. Nothing here names a module or claims availability the
// catalog does not attest.
const BRING = ['A phone, tablet or computer with a browser.', 'An email address you can open: we send a message to confirm it.']

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-[clamp(32px,5vw,72px)]">{children}</div>
}

function Loading() {
  return (
    <Frame>
      <div role="status" aria-busy="true">
        <span className="sr-only">Loading template</span>
        <div aria-hidden="true" className="space-y-6">
          <div className="h-5 w-40 bg-surface-container motion-safe:animate-pulse" />
          <div className="h-16 w-3/4 max-w-[28rem] bg-surface-container motion-safe:animate-pulse" />
          <div className="h-24 max-w-[36rem] bg-surface-container motion-safe:animate-pulse" />
          <div className="h-[92px] border border-outline-variant bg-surface-container motion-safe:animate-pulse" />
        </div>
      </div>
    </Frame>
  )
}

function Unavailable({ labels }: { labels: DetailLabels }) {
  return (
    <Frame>
      <h1 className="font-display text-[clamp(32px,4vw,56px)] font-[740] leading-[1.02] tracking-[-0.025em] text-ink [text-wrap:balance]">{labels.unavailableHeading}</h1>
      <p className="mt-4 max-w-[34rem] text-[18px] leading-[1.5] text-on-surface-variant">{labels.unavailableDescription}</p>
      <Link to="/examples" className={`${textLink} mt-4`}>{labels.templatesLink}</Link>
    </Frame>
  )
}

function Failed({ onRetry }: { onRetry: () => void }) {
  return (
    <Frame>
      <div role="alert" className="max-w-[34rem] border border-outline-variant bg-white px-5 py-6 text-[16px] text-on-surface-variant">
        <p>We could not load this template.</p>
        <button type="button" onClick={onRetry} className="mt-3 min-h-12 font-semibold text-ink underline underline-offset-[6px] hover:decoration-action hover:decoration-2">Try again</button>
      </div>
    </Frame>
  )
}

function Template({ template }: { template: CatalogTemplateDetail }) {
  const { labels } = template
  const modules = useMemo(() => modulesFrom([template]), [template])
  const choice = useChoice()
  // The same choice the picker on the home page holds, when it is for this template.
  const keys = choice.template === template.slug ? choice.keys : []
  useEffect(() => {
    // A choice from an earlier visit is checked against this catalog once.
    if (choice.template === template.slug) setChoice(choiceFrom(modules, choice.keys))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules])

  const result = useMemo(() => resolve(modules, keys), [modules, keys])
  const installed = modules.filter((m) => m.selection === 'required' || m.selection === 'default')
  const optional = modules.filter((m) => !installed.includes(m))
  const available = template.availability === 'available'
  const ticked = result.chosen.length > 0
  const canContinue = available && (installed.length > 0 || ticked)
  const href = buildSignupUrl(cloudSignupBase(), { template: template.slug, optional: result.optional })
  const count = modules.length

  return (
    <Frame>
      <nav aria-label={labels.breadcrumb} className="text-[14px] text-muted">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li><Link to="/examples" className="inline-flex min-h-12 items-center underline underline-offset-[6px] hover:text-ink">{labels.templatesLink}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{template.name}</li>
        </ol>
      </nav>

      <div className="mt-2 grid gap-10 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <h1 className="font-display text-ink text-[clamp(40px,5vw,72px)] leading-[0.96] font-[780] tracking-[-0.03em] [text-wrap:balance]">{template.name}</h1>
          {!available && <p className={`${label} mt-4 inline-block border border-ink px-1.5 py-0.5 text-ink`}>Preview</p>}

          <section aria-labelledby="outcomes" className="mt-8">
            <h2 id="outcomes" className="text-[16px] font-semibold text-ink">{labels.outcomesHeading}</h2>
            <p className="mt-2 max-w-[36rem] text-[18px] leading-[1.5] text-on-surface-variant">{template.summary || `${template.name} is a starting point for your business.`}</p>
          </section>

          {count > 0 && (
            <section aria-labelledby="composition" className="mt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h2 id="composition" className={h2}>{labels.compositionHeading}</h2>
                <span className="text-[16px] text-muted">{count} {count === 1 ? labels.partLabel : labels.partsLabel}</span>
              </div>
              {installed.length > 0 && (
                <ul className="mt-6 border border-outline-variant" aria-label={labels.includedLabel}>
                  {installed.map((m) => (
                    <li key={m.key} className="border-b border-outline-variant bg-white px-5 py-[18px] last:border-b-0">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="font-display text-[clamp(20px,2vw,24px)] font-[680] leading-[1.15] text-ink">{m.name}</span>
                        <span className={`${label} border border-ink px-1.5 py-0.5 text-ink`}>{m.availability === 'available' ? labels.includedLabel : 'Preview'}</span>
                      </span>
                      {m.summary && <span className="mt-1 block text-[16px] leading-[1.5] text-muted">{m.summary}</span>}
                    </li>
                  ))}
                </ul>
              )}
              {optional.length > 0 && (
                <>
                  <h3 className="mt-8 font-display text-[clamp(20px,2vw,26px)] font-[680] leading-[1.15] text-ink">{labels.optionalHeading}</h3>
                  <ul aria-label={labels.optionalHeading} className="mt-4 border border-outline-variant">
                    {optional.map((m) => {
                      const inc = result.included.get(m.key)
                      return (
                        <ModuleRow
                          key={m.key}
                          m={m}
                          chosen={keys.includes(m.key)}
                          note={inc ? inclusionNote(inc, m.name) : undefined}
                          selectable={selectability(modules, m)}
                          onToggle={() => setChoice(choiceFrom(modules, toggle(modules, keys, m.key)))}
                        />
                      )
                    })}
                  </ul>
                </>
              )}
            </section>
          )}

          <section aria-labelledby="bring" className="mt-12">
            <h2 id="bring" className={h2}>{labels.preparationHeading}</h2>
            <ul className="mt-6 border-t border-ink">
              {BRING.map((item) => <li key={item} className="border-b border-outline-variant py-3 text-[16px] text-ink">{item}</li>)}
            </ul>
          </section>

          <section aria-labelledby="next" className="mt-12">
            <h2 id="next" className={h2}>What happens next</h2>
            <ol className="mt-6 border-t border-ink">
              {SIGNUP_STEPS.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-outline-variant py-4">
                  <span aria-hidden="true" className="font-display text-[28px] font-[780] leading-[1] text-ink">{i + 1}</span>
                  <div>
                    <h3 className="text-[17px] font-semibold text-ink">{step.title}</h3>
                    <p className="mt-1 text-[16px] leading-[1.5] text-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside aria-label={labels.primaryAction} className="lg:col-span-5 lg:self-start lg:sticky lg:top-[96px] border-t border-ink pt-5">
          <p aria-live="polite" className="text-[16px] font-semibold text-ink">
            {ticked ? `${template.name}: ${[...result.chosen, ...modules.filter((m) => result.included.has(m.key))].map((m) => m.name).join(', ')}` : template.name}
          </p>
          <p className="mt-2 text-[16px] leading-[1.5] text-muted">{PRICE_LINE}</p>
          {canContinue ? (
            <>
              <a href={href} className={`${button} mt-5`}>{result.optional.length > 0 ? labels.optionalContinueAction : labels.primaryAction}</a>
              <p className="mt-3 text-[14px] leading-[1.5] text-muted">{labels.primaryReassurance}</p>
            </>
          ) : available ? (
            <p className="mt-5 text-[14px] leading-[1.5] text-muted">Tick at least one of the {labels.optionalHeading.toLowerCase()} to continue.</p>
          ) : (
            <p className="mt-5 text-[14px] leading-[1.5] text-muted">This template is a preview, so it cannot be set up yet.</p>
          )}
          <p className="mt-5 text-[14px] text-muted">
            Want something else? <Link to="/examples" className="font-semibold text-ink underline underline-offset-[6px]">{labels.templatesLink}</Link>
          </p>
        </aside>
      </div>
    </Frame>
  )
}

export default function TemplateDetailPage({ slug }: { slug: string }) {
  const { state, retry } = useTemplate(slug)
  const title =
    state.status === 'ready' ? `${state.template.name} template on ${BRAND} Cloud`
    : state.status === 'unavailable' ? `Template not available — ${BRAND}`
    : `Template — ${BRAND}`
  const description = state.status === 'ready' && state.template.summary ? state.template.summary : `What a ${BRAND} template includes, before you sign up.`
  return (
    <>
      <Seo title={title} description={description} path={`/templates/${slug}`} noindex={state.status === 'unavailable'} />
      {state.status === 'loading' && <Loading />}
      {state.status === 'error' && <Failed onRetry={retry} />}
      {state.status === 'unavailable' && <Unavailable labels={state.labels} />}
      {state.status === 'ready' && <Template template={state.template} />}
    </>
  )
}
