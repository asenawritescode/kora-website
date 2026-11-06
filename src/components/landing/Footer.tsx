import { Link } from '@tanstack/react-router'
import { EXPLORE_LINKS, PRIMARY_LINKS } from '@/lib/site-links'
import { SignupLink } from '@/components/landing/SignupLink'
import { BRAND, BRAND_BY_PUBLISHER } from '@/lib/brand'

const FOOTER_LINKS = {
  Product: PRIMARY_LINKS,
  Explore: EXPLORE_LINKS,
}

const link = 'inline-flex min-h-12 items-center w-fit text-[15px] text-night-muted underline-offset-[6px] transition-colors duration-150 hover:text-night-ink hover:underline'

export function Footer() {
  return (
    <footer className="w-full bg-night text-night-ink">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-16 pb-10 md:pt-20 grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-2 md:col-span-6">
          <span className="font-display text-[clamp(40px,5vw,64px)] leading-[0.95] font-[800] tracking-[-0.03em]">{BRAND}</span>
          <p className="mt-4 max-w-[22rem] text-[16px] leading-[1.5] text-night-muted">
            Sales and stock for small shops. The engine is open source under AGPL-3.0.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
          <nav key={category} aria-label={category} className="md:col-span-3 flex flex-col">
            <h2 className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-night-muted">{category}</h2>
            {links.map((l) => (
              <Link key={l.label} to={l.href} className={link}>{l.label}</Link>
            ))}
            {category === 'Product' && <SignupLink className={link} />}
          </nav>
        ))}
        <div className="col-span-2 md:col-span-12 pt-6 border-t border-night-raised flex flex-col sm:flex-row justify-between gap-3 text-[14px] text-night-muted">
          <p>{BRAND_BY_PUBLISHER}</p>
          <p>&copy; 2026 {BRAND}</p>
        </div>
      </div>
    </footer>
  )
}
