import BlogPage from '@/components/landing/BlogPage/BlogPage'
import { Seo } from '@/components/landing/Seo'

export default function BlogRoute() {
  return (
    <>
      <Seo
        title="Kora Blog — Business app guides, comparisons, and open-source notes"
        description="Guides, comparisons, use cases, and technical notes about building custom business apps with Kora."
        path="/blog"
      />
      <BlogPage />
    </>
  )
}
