import AIBuilderPage from '@/components/landing/AIBuilderPage'
import { Seo } from '@/components/landing/Seo'

export default function AIBuilderRoute() {
  return (
    <>
      <Seo
        title="Kora AI Builder"
        description="Talk to Kora in English and get a system with tables, workflows, permissions, and admin UI."
        path="/ai-builder"
      />
      <AIBuilderPage />
    </>
  )
}
