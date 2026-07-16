import CloudPage from '@/components/landing/CloudPage'
import { Seo } from '@/components/landing/Seo'

export default function CloudRoute() {
  return (
    <>
      <Seo
        title="Kora Cloud — Managed business app workspaces"
        description="Managed Kora workspaces for teams that want to go live fast without setting up infrastructure first."
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
