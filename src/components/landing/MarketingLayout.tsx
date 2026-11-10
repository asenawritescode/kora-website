import type { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { SkipLink } from './SkipLink'
import { Footer } from './Footer'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink antialiased">
      <SkipLink />
      <Navigation />
      <main id="main" tabIndex={-1} className="focus:outline-none flex flex-col flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
