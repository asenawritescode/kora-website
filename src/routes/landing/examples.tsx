import ExamplesPage from '@/components/landing/ExamplesPage/ExamplesPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function ExamplesRoute() {
  return (
    <>
      <Seo {...seoFor('/examples')} />
      <ExamplesPage />
    </>
  )
}
