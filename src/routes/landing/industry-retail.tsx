import IndustryRetailPage from '@/components/landing/IndustryRetailPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function IndustryRetailRoute() {
  return (
    <>
      <Seo {...seoFor('/industries/retail')} />
      <IndustryRetailPage />
    </>
  )
}
