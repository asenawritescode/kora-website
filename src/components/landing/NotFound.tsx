import { Link } from '@tanstack/react-router'
import { NOT_FOUND_SEO } from '@/lib/seo-routes'
import { Seo } from './Seo'
import { PRIMARY_LINKS } from '@/lib/site-links'

const POPULAR = PRIMARY_LINKS

export default function NotFound() {
  return (
    <>
      <Seo title={NOT_FOUND_SEO.title} description={NOT_FOUND_SEO.description} noindex />
      <div className="flex-1 bg-surface">
        <section className="mx-auto flex max-w-[760px] flex-col gap-[18px] px-4 py-[clamp(3rem,8vw,6.5rem)]">
          <h1 className="text-[clamp(2.125rem,4.6vw,3.5rem)] leading-[1.05]">This page doesn’t exist</h1>
          <p className="max-w-[620px] text-[1.125rem] leading-[1.55] text-ink-2">
            The link may be old, or the address may have a typo.
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            <Link
              to="/"
              className="flex min-h-[52px] items-center rounded-md bg-action px-[22px] text-base font-semibold text-paper no-underline"
            >
              Go to the home page
            </Link>
          </div>
          <nav aria-label="Popular pages" className="mt-6 flex flex-col gap-1 border-t border-line pt-5">
            <span className="text-sm font-bold text-ink-3">Popular pages</span>
            {POPULAR.map((l) => (
              <Link key={l.label} to={l.href} className="flex min-h-11 items-center text-base">{l.label}</Link>
            ))}
          </nav>
        </section>
      </div>
    </>
  )
}
