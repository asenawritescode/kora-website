import type { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { DocsSidebar } from './DocsPage/Sidebar'
import { DocsMobileNav } from './DocsPage/MobileNav'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f8] text-[#1c1b1b] antialiased" style={{ fontFamily: "'Geist Variable', sans-serif" }}>
      <Navigation />
      {/* Mobile section nav — only visible below md */}
      <DocsMobileNav />
      <div className="flex-grow flex max-w-[960px] mx-auto w-full px-4 sm:px-6 md:px-0">
        <DocsSidebar />
        <main className="flex-grow pt-6 md:pt-8 pb-16 md:pb-[120px] md:pl-8 w-full min-w-0">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
