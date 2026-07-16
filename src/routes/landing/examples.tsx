import ExamplesPage from '@/components/landing/ExamplesPage/ExamplesPage'
import { Seo } from '@/components/landing/Seo'

export default function ExamplesRoute() {
  return (
    <>
      <Seo
        title="Kora Templates — Start from a business app template"
        description="Explore Kora templates for CRM, inventory, fieldwork, invoicing, helpdesk, property management, retail, and more."
        path="/examples"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Kora business app templates',
          itemListElement: ['CRM', 'Inventory', 'Fieldwork', 'Invoicing', 'Helpdesk', 'Property Management'].map((name, index) => ({
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
