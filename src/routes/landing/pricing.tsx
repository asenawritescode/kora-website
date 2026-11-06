import PricingPage from '@/components/landing/PricingPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function PricingRoute() {
  return (
    <>
      <Seo {...seoFor('/pricing')} />
      <PricingPage />
    </>
  )
}
