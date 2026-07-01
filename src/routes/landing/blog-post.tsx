import { useParams } from '@tanstack/react-router'
import BlogPost from '@/components/landing/BlogPage/BlogPost'
import { Seo } from '@/components/landing/Seo'

export default function BlogPostRoute() {
  const { slug } = useParams({ from: '/blog/$slug' })
  return (
    <>
      <Seo
        title={slug === 'building-from-africa' ? 'Building Application Infrastructure from Africa' : 'Kora Blog Post'}
        description="Long-form technical writing on Kora architecture, multi-tenancy, and practical software delivery."
        path={`/blog/${slug}`}
      />
      <BlogPost slug={slug} />
    </>
  )
}
