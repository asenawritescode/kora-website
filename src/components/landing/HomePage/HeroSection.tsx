import { Link } from '@tanstack/react-router'
import { BadgeCheck, Terminal, Scale } from 'lucide-react'
import { TerminalDemo } from './TerminalDemo'

export function HeroSection() {
  return (
    <section className="max-w-[960px] mx-auto px-4 sm:px-6 py-20 md:py-[120px] text-center">
      <h1 className="text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] md:text-[72px] md:leading-[80px] font-bold text-black mb-3 tracking-[-0.03em] md:tracking-[-0.04em]">
        Custom business software,<br />without custom development.
      </h1>
      <div className="mb-6">
        <span className="inline-block text-[10px] font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
          AI-Powered
        </span>
      </div>
      <p className="text-lg leading-7 text-[#444748] max-w-2xl mx-auto mb-6">
        Describe your business in plain English, and Kora builds the database, API, UI, and workflows instantly.
      </p>
      <p className="text-sm text-[#8E8E8E] max-w-xl mx-auto mb-8">
        For developers and businesses that need custom software without custom engineering.
      </p>

      {/* CTAs */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <Link to="/onboard" className="bg-[#FF6B35] text-white text-xs font-medium px-8 py-3 rounded-sm flex items-center gap-2 hover:bg-[#E55B25] transition-colors font-mono">
          Start Building
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/docs" className="bg-transparent text-black border border-outline-variant text-xs font-medium px-8 py-3 rounded-sm flex items-center gap-2 hover:bg-gray-50 transition-colors font-mono">
          Read the Docs
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Trust signals */}
      <div className="flex justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-[#5d5f5f] mb-16 md:mb-[120px] flex-wrap font-mono">
        <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4" /><span>Open source</span></div>
        <div className="flex items-center gap-2"><Terminal className="h-4 w-4" /><span>Single 30MB binary</span></div>
        <div className="flex items-center gap-2"><Scale className="h-4 w-4" /><span>AGPL-3.0</span></div>
      </div>

      <TerminalDemo />
    </section>
  )
}

// Small helper to avoid extra file for a one-line icon wrapper
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
