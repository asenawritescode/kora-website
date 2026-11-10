import { Link } from '@tanstack/react-router'
import { SignupLink } from '@/components/landing/SignupLink'
import { ProductScreens } from './ProductScreens'

// First screen: what the app does for a shop, one action, and the real product
// in an opening laptop. Copy rules: PRODUCT.md and
// docs/african-b2b-copywriting-principles.md.
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto flex max-w-[1200px] flex-col items-center gap-[clamp(1.75rem,4vw,3rem)] px-4 pb-[clamp(2.5rem,6vw,4.5rem)] pt-[clamp(2rem,6vw,5rem)] text-center">
      <div className="flex max-w-[780px] flex-col items-center gap-[18px]">
        <h1 id="hero-title" className="text-[clamp(2.25rem,6.4vw,4.75rem)] leading-[1.03]">
          Know what you sold and{' '}
          <span className="bg-[linear-gradient(transparent_62%,var(--color-accent-soft)_62%,var(--color-accent-soft)_92%,transparent_92%)]">what’s left</span>.
        </h1>
        <p className="max-w-[560px] text-[clamp(1.0625rem,1.7vw,1.3125rem)] leading-normal text-ink-2">
          A selling and stock app for Kenyan shops, on phone or computer.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <SignupLink className="flex min-h-[52px] items-center rounded-md bg-action px-[22px] text-base font-semibold text-paper no-underline" />
          <Link to="/contact" className="flex min-h-[52px] items-center rounded-md border border-line-control px-[22px] text-base font-semibold text-ink no-underline">
            Talk to the team
          </Link>
        </div>
        <p className="text-[0.9375rem] text-ink-3">Free during the pilot. No card needed.</p>
      </div>
      <div className="w-full max-w-[880px]">
        <ProductScreens />
      </div>
    </section>
  )
}
