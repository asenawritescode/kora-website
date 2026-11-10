import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { EXPLORE_LINKS, PRIMARY_LINKS } from '@/lib/site-links'
import { SignupLink } from '@/components/landing/SignupLink'
import { BRAND } from '@/lib/brand'
import { HeaderSkyline } from '@/components/landing/HeaderSkyline'

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const currentPath = location.pathname

  return (
    <header className="fixed top-0 w-full z-50 border-b border-outline-variant bg-paper">
      {/* The skyline sits on the lower rule, under the link text and behind the action button. */}
      <HeaderSkyline className="absolute inset-x-0 top-[58px] h-[14px] md:top-[54px] md:h-[18px]" />
      <nav aria-label="Primary" className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 flex justify-between items-center h-[72px] gap-4">
        {/* Logo + Desktop Links */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <Link to="/" className="font-display inline-flex min-h-12 items-center text-[26px] leading-[1] font-[800] text-ink tracking-[-0.03em] shrink-0">
            {BRAND}
          </Link>
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 min-w-0">
            {PRIMARY_LINKS.map((link) => {
              const isActive = link.href === '/'
                ? currentPath === '/'
                : currentPath.startsWith(link.href)
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`inline-flex min-h-12 items-center text-sm font-medium px-3 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-ink underline decoration-action decoration-2 underline-offset-[8px]'
                      : 'text-on-surface-variant hover:text-ink hover:underline hover:decoration-1 hover:underline-offset-[8px]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <details className="relative">
              <summary className="inline-flex min-h-12 items-center list-none cursor-pointer text-sm font-medium px-3 transition-colors whitespace-nowrap text-on-surface-variant hover:text-ink">
                Explore
              </summary>
              <div className="absolute left-0 mt-2 w-44 border border-outline-variant bg-paper py-2 z-20 shadow-[0_15px_38px_color-mix(in_srgb,var(--color-ink)_12%,transparent)]">
                {EXPLORE_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`flex min-h-12 items-center px-3 text-sm transition-colors ${
                      currentPath.startsWith(link.href)
                        ? 'text-ink underline decoration-action decoration-2 underline-offset-[8px]'
                        : 'text-on-surface-variant hover:text-ink hover:underline hover:decoration-1 hover:underline-offset-[8px]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center shrink-0">
          <SignupLink className="inline-flex min-h-12 items-center bg-action text-white text-[15px] font-semibold px-5 hover:bg-action-busy transition-colors whitespace-nowrap" />
        </div>

        {/* Mobile hamburger — animated */}
        <button
          className="lg:hidden group inline-flex min-h-12 min-w-12 items-center justify-center -mr-2 shrink-0"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <svg
            className="pointer-events-none"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M4 12L20 12"
              className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
            />
            <path
              d="M4 12H20"
              className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
            />
            <path
              d="M4 12H20"
              className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-outline-variant bg-paper">
          <div className="px-4 py-4 space-y-1">
            {[...PRIMARY_LINKS, ...EXPLORE_LINKS].map((link) => {
              const isActive = link.href === '/'
                ? currentPath === '/'
                : currentPath.startsWith(link.href)
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`block text-sm font-medium px-3 py-3 transition-colors ${
                    isActive
                      ? 'text-ink underline decoration-action decoration-2 underline-offset-[8px]'
                      : 'text-on-surface-variant hover:text-ink hover:underline hover:decoration-1 hover:underline-offset-[8px]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <SignupLink className="flex min-h-12 w-full items-center justify-center bg-action text-white text-[15px] font-semibold px-4 mt-3 hover:bg-action-busy" />
          </div>
        </div>
      )}
    </header>
  )
}
