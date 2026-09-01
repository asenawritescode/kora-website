import HomePage from '@/components/landing/HomePage/HomePage'
import { Seo } from '@/components/landing/Seo'

export default function HomeRoute() {
  return (
    <>
      <Seo
        title="Kora — Turn requests into a working app"
        description="Describe the work your team already does and Kora turns it into records, forms, workflows, and a live workspace. Start free."
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
              { '@type': 'Question', name: 'What is Kora?', acceptedAnswer: { '@type': 'Answer', text: 'Kora is a platform for turning everyday business requests into records, workflows, and a working app.' } },
              { '@type': 'Question', name: 'What can I build with Kora?', acceptedAnswer: { '@type': 'Answer', text: 'Teams can build CRMs, internal tools, client portals, intake systems, approvals, and other operational workspaces.' } },
              { '@type': 'Question', name: 'Can I self-host Kora?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Kora has an open-source engine and a managed cloud option.' } },
            ],
          },
        ]}
      />
      <HomePage />
    </>
  )
}
