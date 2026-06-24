import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'

const NAV_LINKS = [
  { label: 'Product', href: '/' },
  { label: 'Examples', href: '/examples' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
]

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
    <nav
      className={`fixed top-0 w-full z-50 border-b border-outline-variant transition-all duration-200 ${
        scrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
        {/* Logo + Desktop Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link to="/" className="text-[24px] sm:text-[30px] leading-[38px] font-semibold text-black tracking-tight">
            Kora
          </Link>
          <div className="hidden md:flex gap-4">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/'
                ? currentPath === '/'
                : currentPath.startsWith(link.href)
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-xs font-medium uppercase tracking-wider px-3 py-2 rounded-sm transition-colors font-mono ${
                    isActive
                      ? 'text-black border-b-2 border-black'
                      : 'text-[#5d5f5f] hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link
            to="/onboard"
            className="bg-black text-white text-xs font-medium px-4 py-2 rounded-sm hover:opacity-90 transition-opacity font-mono"
          >
            Start Building
          </Link>
        </div>

        {/* Mobile hamburger — animated */}
        <button
          className="md:hidden group p-2 -mr-2"
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
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant bg-white">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/'
                ? currentPath === '/'
                : currentPath.startsWith(link.href)
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`block text-sm font-medium px-3 py-3 rounded-sm transition-colors ${
                    isActive
                      ? 'text-black bg-gray-100'
                      : 'text-[#5d5f5f] hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              to="/onboard"
              className="block w-full text-center bg-black text-white text-sm font-medium px-4 py-3 rounded-sm mt-3 font-mono"
            >
              Start Building
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
