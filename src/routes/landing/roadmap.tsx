import RoadmapPage from '@/components/landing/RoadmapPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function RoadmapRoute() {
  return (
    <>
      <Seo {...seoFor('/roadmap')} />
      <RoadmapPage />
    </>
  )
}
