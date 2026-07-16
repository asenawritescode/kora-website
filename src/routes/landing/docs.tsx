import DocsPage from '@/components/landing/DocsPage/DocsPage'
import { Seo } from '@/components/landing/Seo'

export default function DocsRoute() {
  return (
    <>
      <Seo
        title="Kora Docs — API, deployment, and self-hosting"
        description="Read the technical documentation for building, extending, deploying, and self-hosting Kora."
        path="/docs"
      />
      <DocsPage />
    </>
  )
}
