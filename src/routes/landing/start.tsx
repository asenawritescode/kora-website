import PickerPage from '@/components/landing/PickerPage'
import { Seo } from '@/components/landing/Seo'
import { seoFor } from '@/lib/seo-routes'

export default function StartRoute() {
  return (
    <>
      <Seo {...seoFor('/start')} />
      <PickerPage />
    </>
  )
}
