import { Seo } from '@/components/landing/Seo'
import VerifyPage from '@/components/landing/VerifyPage'
import { seoFor } from '@/lib/seo-routes'

export default function VerifyRoute() {
  return (
    <>
      <Seo {...seoFor('/verify')} />
      <VerifyPage />
    </>
  )
}
