import HomePage from '@/components/landing/HomePage/HomePage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function HomeRoute() {
  return (
    <>
      <Seo {...seoFor('/')} />
      <HomePage />
    </>
  )
}
