import OpenSourcePage from '@/components/landing/OpenSourcePage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function OpenSourceRoute() {
  return (
    <>
      <Seo {...seoFor('/open-source')} />
      <OpenSourcePage />
    </>
  )
}
