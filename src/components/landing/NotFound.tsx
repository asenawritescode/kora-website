import { Link } from '@tanstack/react-router'
import { NOT_FOUND_SEO } from '@/lib/seo-routes'
import { Seo } from './Seo'

export default function NotFound() {
  return (
    <>
      <Seo title={NOT_FOUND_SEO.title} description={NOT_FOUND_SEO.description} noindex />
      <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-[72px] leading-[80px] font-bold text-black mb-4 tracking-[-0.04em]">
            404
          </h1>
          <p className="text-lg text-[#5d5f5f] mb-8">
            This page doesn&apos;t exist.
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-white text-xs font-medium px-6 py-3 rounded-sm hover:opacity-90 transition-opacity font-mono"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  )
}
