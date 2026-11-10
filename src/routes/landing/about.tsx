import AboutPage from '@/components/landing/AboutPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function AboutRoute() {
  return (
    <>
      <Seo {...seoFor('/about')} />
      <AboutPage />
    </>
  )
}
