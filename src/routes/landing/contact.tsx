import ContactPage from '@/components/landing/ContactPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function ContactRoute() {
  return (
    <>
      <Seo {...seoFor('/contact')} />
      <ContactPage />
    </>
  )
}
