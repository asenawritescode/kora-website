import CloudPage from '@/components/landing/CloudPage'
import { Seo } from '@/components/landing/Seo'

export default function CloudRoute() {
  return (
    <>
      <Seo
        title="Kora Cloud"
        description="Managed Kora for teams that need onboarding, tenant provisioning, billing tracking, and operational visibility."
        path="/cloud"
      />
      <CloudPage />
    </>
  )
}
