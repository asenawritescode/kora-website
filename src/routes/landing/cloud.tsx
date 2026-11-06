import CloudPage from '@/components/landing/CloudPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function CloudRoute() {
  return (
    <>
      <Seo {...seoFor('/cloud')} />
      <CloudPage />
    </>
  )
}
