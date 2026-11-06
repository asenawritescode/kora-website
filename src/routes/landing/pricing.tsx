import PricingPage from '@/components/landing/PricingPage'
import { Seo } from '@/components/landing/Seo'

export default function PricingRoute() {
  return (
    <>
      <Seo
        title="Kora Pricing — Free workspace and self-hosting"
        description="Start with a free starter workspace on Kora Cloud, or self-host the open-source engine. Managed cloud pricing is not announced yet."
        path="/pricing"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Kora',
          applicationCategory: 'BusinessApplication',
          offers: [
            { '@type': 'Offer', name: 'Free Workspace', price: '0', priceCurrency: 'KES' },
          ],
        }}
      />
      <PricingPage />
    </>
  )
}
