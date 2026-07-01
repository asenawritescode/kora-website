import ExamplesPage from '@/components/landing/ExamplesPage/ExamplesPage'
import { Seo } from '@/components/landing/Seo'

export default function ExamplesRoute() {
  return (
    <>
      <Seo
        title="Kora Examples"
        description="Explore starter templates for CRM, retail, clinics, schools, property management, and more."
        path="/examples"
      />
      <ExamplesPage />
    </>
  )
}
