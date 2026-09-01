import OpenSourcePage from '@/components/landing/OpenSourcePage'
import { Seo } from '@/components/landing/Seo'

export default function OpenSourceRoute() {
  return (
    <>
      <Seo
        title="Kora Open Source — Self-hosted engine for business workflows"
        description="Explore Kora's open-source engine for self-hosted business software, records, APIs, workflows, permissions, SDKs, and SQL databases."
        path="/open-source"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Kora',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Linux, macOS, Windows',
            softwareHelp: 'https://kora.mradiafrica.com/docs',
            codeRepository: 'https://github.com/asenawritescode/kora',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is Kora open source?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. Kora is AGPL-3.0 and can be reviewed, modified, and self-hosted.' },
              },
              {
                '@type': 'Question',
                name: 'Can Kora be self-hosted?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. Kora ships as a single Go binary and can run with MySQL, MariaDB, or LibSQL.' },
              },
            ],
          },
        ]}
      />
      <OpenSourcePage />
    </>
  )
}
