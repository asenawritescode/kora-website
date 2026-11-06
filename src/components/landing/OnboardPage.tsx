import { useMemo } from 'react'
import { buildSignInUrl, buildSignupUrl, cloudSignupBase, readSelection } from '@/lib/cloud-signup'
import { getChoice } from '@/lib/signup-choice'

// Signup and identity are owned by Kigae Cloud. This page only hands the visitor
// over and carries their template selection in the URL.
export default function OnboardPage() {
  const { signupHref, signInHref } = useMemo(() => {
    const base = cloudSignupBase()
    const search = typeof window === 'undefined' ? '' : window.location.search
    // A link with a template wins; otherwise the choice made on the site so far.
    const fromLink = readSelection(search)
    return {
      signupHref: buildSignupUrl(base, fromLink.template ? fromLink : getChoice()),
      signInHref: buildSignInUrl(base),
    }
  }, [])

  return (
    <div className="py-12 md:py-24 px-4 sm:px-6">
      <div className="max-w-[640px] mx-auto">
        <h1 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-bold text-black mb-4 tracking-[-0.03em]">
          Set up your shop on Kigae Cloud
        </h1>
        <p className="text-lg text-on-surface-variant mb-8">
          On Kigae Cloud you choose what your business needs, then create an account with your name, email and business name. We send you an email to confirm it, and then you can sign in to your workspace.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10">
          <a
            href={signupHref}
            className="inline-flex min-h-12 items-center justify-center bg-accent text-white text-sm font-medium px-8 py-3 hover:bg-accent-strong transition-colors"
          >
            Continue to sign up
          </a>
          <p className="text-sm text-on-surface-variant">
            Already have a workspace?{' '}
            <a href={signInHref} className="inline-flex min-h-12 items-center text-black underline underline-offset-2 hover:no-underline">Sign in</a>
          </p>
        </div>
        <p className="text-sm text-on-surface-variant">
          Kigae is in a pilot with a small number of shops. It records sales and stock. M-Pesa payments can be recorded by hand, but Kigae is not connected to M-Pesa. Card payments, receipt printers and eTIMS are not supported yet.
        </p>
      </div>
    </div>
  )
}
