import OnboardPage from '@/components/landing/OnboardPage'
import { Seo } from '@/components/landing/Seo'

export default function OnboardRoute() {
  return (
    <>
      <Seo
        title="Create your Kora workspace"
        description="Create a real Kora workspace with an admin account, forms, database, workflows, API, and AI assistance."
        path="/onboard"
      />
      <OnboardPage />
    </>
  )
}
