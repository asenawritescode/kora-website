import { Link } from '@tanstack/react-router'
import { NOT_FOUND_SEO } from '@/lib/seo-routes'
import { Seo } from './Seo'
import { BRAND } from '@/lib/brand'

export default function NotFound() {
  return (
    <>
      <Seo title={NOT_FOUND_SEO.title} description={NOT_FOUND_SEO.description} noindex />
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-[clamp(64px,9vw,128px)]">
        <h1 className="max-w-[14ch] font-display text-[clamp(44px,6vw,88px)] leading-[0.96] font-[780] tracking-[-0.03em] text-ink [text-wrap:balance]">
          This page is not here.
        </h1>
        <p className="mt-6 max-w-[34rem] text-[18px] leading-[1.5] text-on-surface-variant">
          Error 404. The link may be old, or the page may have moved. The home page has everything {BRAND} does today.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-12 items-center bg-accent px-[22px] text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-accent-strong active:translate-y-px"
        >
          Go to the home page
        </Link>
      </section>
    </>
  )
}
