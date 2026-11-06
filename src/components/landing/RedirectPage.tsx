import { Navigate } from '@tanstack/react-router'
import { BRAND } from '@/lib/brand'
import { Seo } from './Seo'

// Shown for a moment when a removed URL is opened inside the app. nginx answers
// these URLs with a 301; this covers other hosts and keeps crawlers from indexing them.
export default function RedirectPage({ to }: { to: string }) {
  return (
    <>
      <Seo title={BRAND} description="This page has moved." noindex />
      <Navigate to={to} replace />
    </>
  )
}
