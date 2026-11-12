import { Link } from '@tanstack/react-router'
import { SignupLink } from '@/components/landing/SignupLink'
import { BUTTON_SECONDARY, CARD } from '@/components/landing/ui'
import { formatMonthly, type PublicPlan } from '@/lib/pricing-client'

// Shown only when Cloud answers "priced" with at least one plan. The prices and
// the notice are Cloud's words; this page adds nothing about what a plan includes.
export default function PricedPlans({ plans, notice }: { plans: PublicPlan[]; notice: string }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <h1 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.04]">Pricing</h1>
        {notice && <p className="max-w-[600px] text-[1.125rem] leading-[1.55] text-ink-2">{notice}</p>}
      </div>
      <ul className="flex flex-wrap justify-center gap-4">
        {plans.map((plan) => (
          <li key={plan.code} className={`${CARD} flex min-w-[240px] flex-[1_1_260px] flex-col gap-3.5 p-[clamp(22px,3.4vw,36px)]`}>
            <h2 className="text-[1.75rem] leading-[1.15] tracking-[-0.02em]">{plan.name}</h2>
            <p className="text-[1.375rem] font-semibold">{formatMonthly(plan)}</p>
            <SignupLink className={`${BUTTON_SECONDARY} justify-center`} />
          </li>
        ))}
      </ul>
      <p className="text-center text-[1.0625rem] leading-[1.55]">Questions about a plan? <Link to="/contact" className="font-semibold">Talk to the team</Link></p>
    </div>
  )
}
