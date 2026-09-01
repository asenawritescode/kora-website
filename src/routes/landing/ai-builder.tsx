import AIBuilderPage from '@/components/landing/AIBuilderPage'
import { Seo } from '@/components/landing/Seo'

export default function AIBuilderRoute() {
  return (
    <>
      <Seo
        title="Kora AI Builder — Describe the work and create the app"
        description="Use plain English to create app structure for business workflows, forms, records, permissions, and approvals."
        path="/ai-builder"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Kora AI Builder',
          applicationCategory: 'BusinessApplication',
        }}
      />
      <AIBuilderPage />
    </>
  )
}
