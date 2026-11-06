import ExamplesPage from '@/components/landing/ExamplesPage/ExamplesPage'
import { Seo } from '@/components/landing/Seo'

export default function ExamplesRoute() {
  return (
    <>
      <Seo
        title="Kora Templates — Start from a business workflow template"
        description="Starting points for your shop. Each one lists what it includes before you sign up."
        path="/examples"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Kora business app templates',
          itemListElement: ['Retail POS'].map((name, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name,
          })),
        }}
      />
      <ExamplesPage />
    </>
  )
}
