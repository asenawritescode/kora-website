import DocsPage from '@/components/landing/DocsPage/DocsPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function DocsRoute() {
  return (
    <>
      <Seo {...seoFor('/docs')} />
      <DocsPage />
    </>
  )
}
