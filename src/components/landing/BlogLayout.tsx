import type { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { SkipLink } from './SkipLink'
import { Footer } from './Footer'

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink antialiased" style={{ fontFamily: "'Geist Variable', sans-serif" }}>
      <SkipLink />
      <Navigation />
      <main id="main" tabIndex={-1} className="focus:outline-none flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </div>
  )
}
