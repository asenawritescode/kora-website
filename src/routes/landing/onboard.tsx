import OnboardPage from '@/components/landing/OnboardPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function OnboardRoute() {
  return (
    <>
      <Seo {...seoFor('/onboard')} />
      <OnboardPage />
    </>
  )
}
