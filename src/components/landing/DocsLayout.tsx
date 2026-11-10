import type { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { SkipLink } from './SkipLink'
import { Footer } from './Footer'
import { DocsSidebar } from './DocsPage/Sidebar'
import { DocsMobileNav } from './DocsPage/MobileNav'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink antialiased">
      <SkipLink />
      <Navigation />
      {/* Mobile section nav — only visible below md */}
      <DocsMobileNav />
      <div className="flex-grow flex max-w-[960px] mx-auto w-full px-4 sm:px-6 md:px-0 md:pt-[72px]">
        <DocsSidebar />
        <main id="main" tabIndex={-1} className="focus:outline-none flex-grow pt-6 md:pt-8 pb-16 md:pb-[120px] md:pl-8 w-full min-w-0">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
