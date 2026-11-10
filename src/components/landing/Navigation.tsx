import { useEffect, useRef } from 'react'
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
  const links = useRef<HTMLElement>(null)
  // On a phone the row scrolls: bring the current page's tab into view.
  useEffect(() => {
    const row = links.current
    const tab = row?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!row || !tab) return
    const center = () => { row.scrollLeft = tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2 }
    // Fonts and the viewport change the widths, so follow them.
    const watch = new ResizeObserver(center)
    watch.observe(row)
    watch.observe(tab)
    return () => watch.disconnect()
  }, [path])

  return (
    <header className="border-b border-line bg-paper text-ink">
      <div className="mx-auto flex max-w-[1232px] flex-col px-4 pt-2">
        <div className="flex min-h-14 items-center gap-2">
          <Link to="/" aria-label={`${BRAND} home`} className="flex min-h-12 min-w-0 items-center gap-2.5 no-underline">
            <LogoMark />
            <span className="min-w-0 truncate font-display text-[1.4375rem] font-bold lowercase tracking-[-0.02em]">{BRAND}</span>
          </Link>
          <span className="flex-1" />
          <a href={buildSignInUrl(cloudSignupBase())} className="flex min-h-12 shrink-0 items-center whitespace-nowrap px-2.5 text-[0.9375rem] font-semibold no-underline">
            Sign in
          </a>
          <SignupLink className="flex min-h-12 shrink-0 items-center whitespace-nowrap rounded-md bg-action px-[18px] text-[0.9375rem] font-semibold text-paper no-underline" />
        </div>
        <nav
          ref={links} aria-label="Main"
          className="relative -mx-3.5 -my-2 flex gap-0.5 overflow-x-auto px-2 py-2 [mask-image:linear-gradient(to_right,var(--color-ink)_calc(100%-28px),transparent)] [scrollbar-width:none] sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
        >
          {NAV_LINKS.map((link) => {
            const current = link.href === '/' ? path === '/' : path.startsWith(link.href)
            return (
              <Link
                key={link.label}
                to={link.href}
                aria-current={current ? 'page' : undefined}
                className={`box-border flex min-h-12 flex-none items-center border-b-[3px] px-2.5 text-base no-underline sm:text-[0.9375rem] focus-visible:shadow-none focus-visible:outline-offset-[-4px] ${
                  current ? 'border-action font-bold text-action' : 'border-transparent font-normal text-ink-2'
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
