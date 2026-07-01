import HomePage from '@/components/landing/HomePage/HomePage'
import { Seo } from '@/components/landing/Seo'

export default function HomeRoute() {
  return (
    <>
      <Seo
        title="Kora — Custom business software, without custom development"
        description="Describe your business in English and Kora builds the database, API, admin UI, workflows, and AI-powered backend."
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
