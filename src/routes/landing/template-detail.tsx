import { useParams } from '@tanstack/react-router'
import TemplateDetailPage from '@/components/landing/TemplatePage/TemplateDetailPage'

export default function TemplateDetailRoute() {
  const { slug } = useParams({ from: '/templates/$slug' })
  return <TemplateDetailPage slug={slug} />
}
