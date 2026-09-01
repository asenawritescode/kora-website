import CloudPage from '@/components/landing/CloudPage'
import { Seo } from '@/components/landing/Seo'

export default function CloudRoute() {
  return (
    <>
      <Seo
        title="Kora Cloud — Managed workspaces for business apps"
        description="Managed Kora workspaces for teams that want to capture records, route requests, and run workflows without setup work first."
        path="/cloud"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Kora Cloud',
          serviceType: 'Managed business app workspace hosting',
          provider: { '@type': 'Organization', name: 'Kora' },
        }}
      />
      <CloudPage />
    </>
  )
}
