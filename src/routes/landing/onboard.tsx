import OnboardPage from '@/components/landing/OnboardPage'
import { Seo } from '@/components/landing/Seo'

export default function OnboardRoute() {
  return (
    <>
      <Seo
        title="Set up your shop on Kigae Cloud"
        description="Create a Kigae Cloud account to set up your shop. Kigae records cash sales and stock."
        path="/onboard"
      />
      <OnboardPage />
    </>
  )
}
