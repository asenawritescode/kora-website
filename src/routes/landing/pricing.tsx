import PricingPage from '@/components/landing/PricingPage'
import { Seo } from '@/components/landing/Seo'

export default function PricingRoute() {
  return (
    <>
      <Seo
        title="Kora Pricing — Plans for custom business apps"
        description="Simple plans for building and running custom business apps with Kora, from a free workspace to managed cloud and private instances."
        path="/pricing"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Kora',
          applicationCategory: 'BusinessApplication',
          offers: [
            { '@type': 'Offer', name: 'Free Workspace', price: '0', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'Managed Cloud' },
            { '@type': 'Offer', name: 'Private Instance' },
          ],
        }}
      />
      <PricingPage />
    </>
  )
}
