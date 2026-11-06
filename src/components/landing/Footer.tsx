import { Link } from '@tanstack/react-router'
import { CTA_LINK, EXPLORE_LINKS, PRIMARY_LINKS } from '@/lib/site-links'
import { BRAND, BRAND_BY_PUBLISHER } from '@/lib/brand'

const FOOTER_LINKS = {
  Product: [...PRIMARY_LINKS, CTA_LINK],
  Explore: EXPLORE_LINKS,
}

export function Footer() {
  return (
    <footer className="w-full bg-[#f1edec] border-t border-outline-variant">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-16 md:py-[120px] grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-1 flex flex-col">
          <span className="text-[30px] leading-[38px] font-semibold text-black mb-4 tracking-tight">
            {BRAND}
          </span>
          <p className="text-xs text-[#5d5f5f] mt-auto font-mono">
            Records, workflows, and ownership.
          </p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
          <div key={category} className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-xs font-medium text-[#5d5f5f] hover:text-black hover:underline transition-all w-fit font-mono"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        {/* Publisher + Copyright */}
        <div className="md:col-span-3 mt-8 pt-8 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-[#5d5f5f]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
            {BRAND_BY_PUBLISHER}
          </p>
          <p className="text-xs text-[#5d5f5f]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
            &copy; 2026 {BRAND}
          </p>
        </div>
      </div>
    </footer>
  )
}
