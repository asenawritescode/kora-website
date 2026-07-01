import HomePage from '@/components/landing/HomePage/HomePage'
import { Seo } from '@/components/landing/Seo'

export default function HomeRoute() {
  return (
    <>
      <Seo
        title="Kora — Custom business software, without custom development"
        description="Build internal tools, client portals, and operational apps from YAML with one Go backend, database, admin UI, workflows, and AI."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Kora',
          url: 'https://kora.mradiafrica.com',
        }}
      />
      <HomePage />
    </>
  )
}
