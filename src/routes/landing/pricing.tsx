import PricingPage from '@/components/landing/PricingPage'
import { Seo } from '@/components/landing/Seo'

export default function PricingRoute() {
  return (
    <>
      <Seo
        title="Kora Pricing — Free workspace, managed cloud, private instances"
        description="Start free with 5 doctypes. Upgrade to managed cloud from $20/month or request a private instance."
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
