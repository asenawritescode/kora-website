import { Link } from '@tanstack/react-router'
import { EXPLORE_LINKS, PRIMARY_LINKS } from '@/lib/site-links'
import { SignupLink } from '@/components/landing/SignupLink'
import { LogoMark } from '@/components/landing/LogoMark'
import { BRAND } from '@/lib/brand'

const FOOTER_LINKS = {
  Product: PRIMARY_LINKS,
  Explore: EXPLORE_LINKS,
}

const link = 'flex min-h-11 w-fit items-center text-[0.9375rem] text-on-band-2 no-underline hover:text-on-band hover:underline'

export function Footer() {
  return (
    <footer className="bg-band px-4 pb-8 pt-12 text-on-band">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-9">
        <div className="flex flex-wrap gap-9">
          <div className="flex flex-[2_1_280px] flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <LogoMark onBand />
              <span className="font-display text-[1.4375rem] font-bold lowercase">{BRAND}</span>
            </div>
            <p className="font-display text-[1.375rem] font-medium">From Nairobi to the world</p>
            <p className="text-[0.9375rem] leading-[1.55] text-on-band-3">
              Zana means “tools” in Swahili. A selling and stock app for Kenyan shops.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <nav key={title} aria-label={title} className="flex flex-[1_1_150px] flex-col">
              <h2 className="mb-1 font-sans text-sm font-bold tracking-normal">{title}</h2>
              {links.map((l) => (
                <Link key={l.label} to={l.href} className={link}>{l.label}</Link>
              ))}
              {title === 'Product' && <SignupLink className={link} />}
            </nav>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-band-line pt-5 text-sm text-on-band-3">
          <span>English now, Kiswahili next</span>
          <span>&copy; 2026 {BRAND}, Nairobi, Kenya</span>
        </div>
      </div>
    </footer>
  )
}
