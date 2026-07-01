import DocsPage from '@/components/landing/DocsPage/DocsPage'
import { Seo } from '@/components/landing/Seo'

export default function DocsRoute() {
  return (
    <>
      <Seo
        title="Kora Docs"
        description="Read the Kora product, API, deployment, and architecture documentation."
        path="/docs"
      />
      <DocsPage />
    </>
  )
}
