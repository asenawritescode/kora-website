import { useParams } from '@tanstack/react-router'
import BlogPost from '@/components/landing/BlogPage/BlogPost'

export default function BlogPostRoute() {
  const { slug } = useParams({ from: '/blog/$slug' })
  return <BlogPost slug={slug} />
}
