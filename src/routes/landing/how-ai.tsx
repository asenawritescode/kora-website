import HowAiPage from '@/components/landing/HowAiPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function HowAiRoute() {
  return (
    <>
      <Seo {...seoFor('/how-ai')} />
      <HowAiPage />
    </>
  )
}
