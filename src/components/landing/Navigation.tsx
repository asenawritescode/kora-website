import { Link, useLocation } from '@tanstack/react-router'
import { HOME_LINK, PRIMARY_LINKS } from '@/lib/site-links'
import { SignupLink } from '@/components/landing/SignupLink'
import { LogoMark } from '@/components/landing/LogoMark'
import { BRAND } from '@/lib/brand'
import { buildSignInUrl, cloudSignupBase } from '@/lib/cloud-signup'

const NAV_LINKS = [HOME_LINK, ...PRIMARY_LINKS]

// Two rows, as in the design: the mark and the actions, then the page links in
// a row that scrolls sideways on a phone.
export function Navigation() {
  const path = useLocation().pathname

  return (
    <header className="border-b border-line bg-paper text-ink">
      <div className="mx-auto flex max-w-[1200px] flex-col px-4 pt-2">
        <div className="flex min-h-14 items-center gap-2">
          <Link to="/" aria-label={`${BRAND} home`} className="flex min-h-12 items-center gap-2.5 no-underline">
            <LogoMark />
            <span className="font-display text-[1.4375rem] font-bold lowercase tracking-[-0.02em]">{BRAND}</span>
          </Link>
          <span className="flex-1" />
          <a href={buildSignInUrl(cloudSignupBase())} className="flex min-h-12 items-center px-2.5 text-[0.9375rem] font-semibold no-underline">
            Sign in
          </a>
          <SignupLink className="flex min-h-12 items-center whitespace-nowrap rounded-md bg-action px-[18px] text-[0.9375rem] font-semibold text-paper no-underline" />
        </div>
        <nav aria-label="Main" className="-mx-1.5 flex gap-0.5 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const current = link.href === '/' ? path === '/' : path.startsWith(link.href)
            return (
              <Link
                key={link.label}
                to={link.href}
                aria-current={current ? 'page' : undefined}
                className={`box-border flex min-h-12 flex-none items-center border-b-[3px] px-2.5 text-[0.9375rem] no-underline ${
                  current ? 'border-action font-bold text-action' : 'border-transparent font-medium text-ink-2'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
