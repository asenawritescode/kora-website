import HomePage from '@/components/landing/HomePage/HomePage'
import { Seo } from '@/components/landing/Seo'

export default function HomeRoute() {
  return (
    <>
      <Seo
        title="Kora — Get a custom business app. No coding."
        description="Describe your work and Kora builds it — forms, database, workflows. 9 templates to start from. No credit card required."
        path="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Kora',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Kora creates custom business apps with forms, database, users, workflows, API, and AI assistance.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'What is Kora?', acceptedAnswer: { '@type': 'Answer', text: 'Kora is a platform for creating custom business apps from plain English workflows.' } },
              { '@type': 'Question', name: 'What can I build with Kora?', acceptedAnswer: { '@type': 'Answer', text: 'Teams can build CRM, inventory, fieldwork, invoicing, helpdesk, property management, and other internal business apps.' } },
              { '@type': 'Question', name: 'Can I self-host Kora?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Kora has an open-source engine and a managed cloud option.' } },
            ],
          },
        ]}
      />
      <HomePage />
    </>
  )
}
