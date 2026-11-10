import LegalPage from '@/components/landing/LegalPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function PrivacyRoute() {
  return (
    <>
      <Seo {...seoFor('/privacy')} />
      <LegalPage doc="privacy" />
    </>
  )
}
