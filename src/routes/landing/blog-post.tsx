import { useParams } from '@tanstack/react-router'
import BlogPost from '@/components/landing/BlogPage/BlogPost'
import { Seo } from '@/components/landing/Seo'
import { BRAND } from '@/lib/brand'

export default function BlogPostRoute() {
  const { slug } = useParams({ from: '/blog/$slug' })
  return (
    <>
      <Seo
        title={slug === 'building-from-africa' ? 'Building Application Infrastructure from Africa' : `${BRAND} Blog Post`}
        description={`Long-form technical writing on ${BRAND} architecture, multi-tenancy, and practical software delivery.`}
        path={`/blog/${slug}`}
      />
      <BlogPost slug={slug} />
    </>
  )
}
