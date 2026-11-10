import LegalPage from '@/components/landing/LegalPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function TermsRoute() {
  return (
    <>
      <Seo {...seoFor('/terms')} />
      <LegalPage doc="terms" />
    </>
  )
}
