import { Link } from '@tanstack/react-router'
import { BRAND } from '@/lib/brand'
import { SIGNUP_STEPS } from '@/lib/signup-steps'
import { SignupLink } from '@/components/landing/SignupLink'

const textLink = 'inline-flex min-h-12 items-center font-semibold text-ink underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] hover:decoration-accent hover:decoration-2'

// What Cloud does and the real sign-up steps (kora-website#13). The steps are the
// ones Cloud's own signup runs, in that order; see src/lib/signup-steps.ts.
export default function CloudPage() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-[clamp(40px,6vw,88px)] grid gap-12 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <h1 className="font-display text-ink text-[clamp(44px,6vw,88px)] leading-[0.96] font-[780] tracking-[-0.03em]">
            {BRAND} Cloud
          </h1>
          <p className="mt-6 max-w-[30rem] text-[18px] md:text-[20px] leading-[1.5] text-on-surface-variant">
            We host your workspace and keep it updated, so you only need a browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <SignupLink className="inline-flex min-h-12 items-center bg-accent px-[22px] text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-accent-strong active:translate-y-px" />
            <Link to="/pricing" className={textLink}>Pricing</Link>
          </div>
        </header>

        <section aria-labelledby="signup-steps" className="lg:col-span-6 lg:col-start-7">
          <h2 id="signup-steps" className="font-display text-[clamp(32px,3.6vw,52px)] font-[740] leading-[1.02] tracking-[-0.025em] text-ink [text-wrap:balance]">
            How sign-up works
          </h2>
          <ol className="mt-8 border-t border-ink">
            {SIGNUP_STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-x-2 border-b border-outline-variant py-5">
                <span aria-hidden="true" className="font-display text-[32px] font-[780] leading-[1] tracking-[-0.03em] text-ink">{i + 1}</span>
                <div>
                  <h3 className="font-display text-[clamp(20px,2vw,26px)] font-[680] leading-[1.15] text-ink">{step.title}</h3>
                  <p className="mt-1 text-[16px] leading-[1.6] text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[16px] leading-[1.6] text-muted">
            Prefer your own server? {BRAND} Engine is open source.{' '}
            <Link to="/open-source" className="font-semibold text-ink underline underline-offset-[6px] hover:decoration-accent hover:decoration-2">Run it yourself</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
