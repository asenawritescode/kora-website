import ModulesPage from '@/components/landing/ModulesPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function ModulesRoute() {
  return (
    <>
      <Seo {...seoFor('/modules')} />
      <ModulesPage />
    </>
  )
}
