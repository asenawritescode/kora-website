import BenefitsPage from '@/components/landing/BenefitsPage'
import { Seo } from '@/components/landing/Seo'

export default function BenefitsRoute() {
  return (
    <>
      <Seo
        title="Kora Cloud Benefits"
        description="See how Kora Cloud helps sales, ops, and devs move faster with one control plane."
        path="/benefits"
      />
      <BenefitsPage />
    </>
  )
}
