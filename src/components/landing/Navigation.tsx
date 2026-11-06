import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { CTA_LINK, EXPLORE_LINKS, PRIMARY_LINKS } from '@/lib/site-links'
import { BRAND } from '@/lib/brand'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const currentPath = location.pathname

  return (
    <header
      className={`fixed top-0 w-full z-50 border-b border-outline-variant transition-all duration-200 ${
        scrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <nav aria-label="Primary" className="max-w-[1120px] mx-auto px-4 sm:px-6 flex justify-between items-center h-16 gap-4">
        {/* Logo + Desktop Links */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <Link to="/" className="inline-flex min-h-11 items-center text-[22px] sm:text-[28px] leading-[1] font-semibold text-black tracking-tight shrink-0">
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
                  className={`inline-flex min-h-11 items-center text-sm font-medium px-3 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-black bg-surface-container'
                      : 'text-muted hover:text-black hover:bg-surface-container'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <details className="relative">
              <summary className="inline-flex min-h-11 items-center list-none cursor-pointer text-sm font-medium px-3 transition-colors whitespace-nowrap text-muted hover:text-black hover:bg-surface-container">
                Explore
              </summary>
              <div className="absolute left-0 mt-2 w-44 border border-outline-variant bg-white py-2 z-20">
                {EXPLORE_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`flex min-h-11 items-center px-3 text-sm transition-colors ${
                      currentPath.startsWith(link.href)
                        ? 'text-black bg-surface-container'
                        : 'text-muted hover:text-black hover:bg-surface-container'
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
          <Link
            to={CTA_LINK.href}
            className="inline-flex min-h-11 items-center bg-accent text-white text-sm font-medium px-5 hover:bg-accent-strong transition-colors whitespace-nowrap"
          >
            {CTA_LINK.label}
          </Link>
        </div>

        {/* Mobile hamburger — animated */}
        <button
          className="lg:hidden group inline-flex min-h-11 min-w-11 items-center justify-center -mr-2 shrink-0"
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
        <div className="lg:hidden border-t border-outline-variant bg-white">
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
                      ? 'text-black bg-surface-container'
                      : 'text-muted hover:text-black hover:bg-surface-container'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              to={CTA_LINK.href}
              className="block w-full text-center bg-accent text-white text-sm font-medium px-4 py-3 mt-3 hover:bg-accent-strong"
            >
              {CTA_LINK.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
