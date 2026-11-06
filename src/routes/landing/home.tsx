import HomePage from '@/components/landing/HomePage/HomePage'
import { Seo } from '@/components/landing/Seo'

export default function HomeRoute() {
  return (
    <>
      <Seo
        title="Kora — Turn requests into a working app"
        description="Open-source software for keeping records, workflows, and approvals in one place. Start free."
        path="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Kora',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Kora is open-source business software with forms, a database, users and roles, workflows, and an API.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'What is Kora?', acceptedAnswer: { '@type': 'Answer', text: 'Kora is open-source software for keeping business records, workflows, and approvals in one place.' } },
              { '@type': 'Question', name: 'What can I build with Kora?', acceptedAnswer: { '@type': 'Answer', text: 'Today there is one published template, Retail POS, which covers point of sale and inventory. Teams can also model their own records and approvals.' } },
              { '@type': 'Question', name: 'Can I self-host Kora?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Kora has an open-source engine and a managed cloud option.' } },
            ],
          },
        ]}
      />
      <HomePage />
    </>
  )
}
