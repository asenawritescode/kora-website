import PricingPage from '@/components/landing/PricingPage'
import { Seo } from '@/components/landing/Seo'

export default function PricingRoute() {
  return (
    <>
      <Seo
        title="Kora Cloud Pricing"
        description="Simple pricing for shared cloud and private managed Kora instances."
        path="/pricing"
      />
      <PricingPage />
    </>
  )
}
