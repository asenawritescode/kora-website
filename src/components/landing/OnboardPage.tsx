import { useMemo } from 'react'
import { buildSignInUrl, buildSignupUrl, cloudSignupBase, readSelection } from '@/lib/cloud-signup'

// Signup and identity are owned by Kigae Cloud. This page only hands the visitor
// over and carries their template selection in the URL.
export default function OnboardPage() {
  const { signupHref, signInHref } = useMemo(() => {
    const base = cloudSignupBase()
    const search = typeof window === 'undefined' ? '' : window.location.search
    return {
      signupHref: buildSignupUrl(base, readSelection(search)),
      signInHref: buildSignInUrl(base),
    }
  }, [])

  return (
    <div className="py-12 md:py-24 px-4 sm:px-6">
      <div className="max-w-[640px] mx-auto">
        <h1 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-bold text-black mb-4 tracking-[-0.03em]">
          Set up your shop on Kigae Cloud
        </h1>
        <p className="text-lg text-[#444748] mb-8">
          You will create an account with your name, email and business name. We send you an email to confirm it, and then you can sign in to your workspace.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10">
          <a
            href={signupHref}
            className="inline-block text-center bg-[#FF6B35] text-white text-sm font-medium px-8 py-3 rounded-sm hover:bg-[#E55B25] transition-colors font-mono"
          >
            Continue to sign up
          </a>
          <p className="text-sm text-[#444748]">
            Already have a workspace?{' '}
            <a href={signInHref} className="text-black underline underline-offset-2 hover:no-underline">Sign in</a>
          </p>
        </div>
        <p className="text-sm text-[#444748]">
          Kigae is in a pilot with a small number of shops. It records cash sales and stock. Card, M-Pesa and receipt printing are not available yet.
        </p>
      </div>
    </div>
  )
}
