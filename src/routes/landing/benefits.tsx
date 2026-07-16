import BenefitsPage from '@/components/landing/BenefitsPage'
import { Seo } from '@/components/landing/Seo'

export default function BenefitsRoute() {
  return (
    <>
      <Seo
        title="Why Kora — Custom apps without spreadsheets or custom builds"
        description="See why teams use Kora instead of spreadsheets, rigid SaaS, or expensive custom software projects."
        path="/benefits"
      />
      <BenefitsPage />
    </>
  )
}
