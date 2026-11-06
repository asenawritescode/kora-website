import BlogPage from '@/components/landing/BlogPage/BlogPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function BlogRoute() {
  return (
    <>
      <Seo {...seoFor('/blog')} />
      <BlogPage />
    </>
  )
}
