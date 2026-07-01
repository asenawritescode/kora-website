import BlogPage from '@/components/landing/BlogPage/BlogPage'
import { Seo } from '@/components/landing/Seo'

export default function BlogRoute() {
  return (
    <>
      <Seo
        title="Kora Blog"
        description="Architecture notes, product decisions, and operational lessons from building Kora."
        path="/blog"
      />
      <BlogPage />
    </>
  )
}
