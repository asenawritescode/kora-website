import type { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { Seo } from './Seo'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f8] text-[#1c1b1b] antialiased" style={{ fontFamily: "'Geist Variable', sans-serif" }}>
      <Seo
        title="Kora — Custom business software, without custom development"
        description="Kora turns YAML into running business software: database, API, admin UI, workflows, and AI chat."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Kora',
          url: 'https://kora.mradiafrica.com',
          slogan: 'Custom business software, without custom development',
        }}
      />
      <Navigation />
      <main className="flex-grow pt-20 md:pt-24">
        {children}
      </main>
      <Footer />
    </div>
  )
}
