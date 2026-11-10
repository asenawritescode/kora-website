import { useParams } from '@tanstack/react-router'
import BlogPost from '@/components/landing/BlogPage/BlogPost'
import { Seo } from '@/components/landing/Seo'
import { ENGINE_BRAND } from '@/lib/brand'

export default function BlogPostRoute() {
  const { slug } = useParams({ from: '/blog/$slug' })
  return (
    <>
      <Seo
        title={slug === 'building-from-africa' ? 'Building Application Infrastructure from Africa' : `${ENGINE_BRAND} Blog Post`}
        description={`Long-form technical writing on ${ENGINE_BRAND} architecture, multi-tenancy, and practical software delivery.`}
        path={`/blog/${slug}`}
      />
      <BlogPost slug={slug} />
    </>
  )
}
