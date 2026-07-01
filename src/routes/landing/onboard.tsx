import OnboardPage from '@/components/landing/OnboardPage'
import { Seo } from '@/components/landing/Seo'

export default function OnboardRoute() {
  return (
    <>
      <Seo
        title="Start with Kora"
        description="Create a Kora site and get a database, admin UI, API, and AI chat in under two minutes."
        path="/onboard"
      />
      <OnboardPage />
    </>
  )
}
