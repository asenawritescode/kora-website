import IndustriesPage from '@/components/landing/IndustriesPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function IndustriesRoute() {
  return (
    <>
      <Seo {...seoFor('/industries')} />
      <IndustriesPage />
    </>
  )
}
