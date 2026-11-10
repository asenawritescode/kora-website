import { Link } from '@tanstack/react-router'
import { H1 } from '@/components/landing/ui'

type Doc = 'privacy' | 'terms'

const DOCS: Record<Doc, { title: string; label: string; href: '/privacy' | '/terms'; sections: [string, string][] }> = {
  privacy: {
    title: 'Privacy', label: 'Privacy', href: '/privacy',
    sections: [
      ['What Zana collects', 'Which details and records Zana collects.'],
      ['Why', 'Why Zana needs each kind of data.'],
      ['Who can see it', 'Who inside and outside Zana can see your records.'],
      ['Where it’s stored and for how long', 'Where records are stored and how long they’re kept.'],
      ['Your rights', 'Seeing, correcting, exporting and deleting your data under Kenya’s Data Protection Act, 2019.'],
      ['Contact and complaints', 'How to reach Zana, and the Office of the Data Protection Commissioner.'],
    ],
  },
  terms: {
    title: 'Terms of use', label: 'Terms', href: '/terms',
    sections: [
      ['Using Zana', 'Who can use it and what it’s for.'],
      ['Your workspace and account', 'Keeping your sign-in safe, and who owns the records you enter.'],
      ['The pilot', 'Zana is free during the pilot, and pricing comes before it ends.'],
      ['What Zana does and doesn’t do', 'Only Available modules are offered. Preview and roadmap items carry no promise.'],
      ['Ending use', 'Stopping Zana, and what happens to your records.'],
      ['Changes to these terms', 'How you’ll hear about changes.'],
    ],
  },
}

// A draft outline: the headings show what each document will cover. The legal
// text itself is not written yet, so these routes are noindex until it is.
export default function LegalPage({ doc }: { doc: Doc }) {
  const d = DOCS[doc]
  return (
    <div className="flex-1 bg-surface">
      <div className="mx-auto flex max-w-[1000px] flex-col gap-6 px-4 pb-[clamp(3.5rem,6vw,5.5rem)] pt-[clamp(2rem,5vw,4.5rem)]">
        <nav aria-label="Document" className="inline-flex self-start rounded-lg border border-line bg-paper p-1">
          {(Object.keys(DOCS) as Doc[]).map((id) => (
            <Link
              key={id} to={DOCS[id].href} aria-current={id === doc ? 'page' : undefined}
              className={`flex min-h-11 items-center rounded-[9px] px-4 text-[0.9375rem] font-semibold no-underline ${id === doc ? 'bg-action text-paper' : 'text-ink'}`}
            >
              {DOCS[id].label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2">
          <h1 className={H1}>{d.title}</h1>
          <p className="text-[0.9375rem] text-ink-3">Draft.</p>
        </div>
        <p role="note" className="rounded-lg bg-amber-tint px-4 py-3.5 text-[0.9375rem] leading-normal text-amber-ink">
          <strong>Draft.</strong> The final text comes from Zana’s lawyers before launch. Headings show what it will cover.
        </p>
        <div className="flex flex-wrap items-start gap-8">
          <nav aria-label="On this page" className="flex flex-[1_1_280px] flex-col gap-0.5 lg:sticky lg:top-4">
            <span className="mb-1 text-[0.8125rem] font-bold text-ink-3">On this page</span>
            {d.sections.map(([title], i) => (
              <a key={title} href={`#${doc}-${i + 1}`} className="flex min-h-10 items-center text-[0.9375rem] text-ink-2 no-underline">{i + 1}. {title}</a>
            ))}
          </nav>
          <div className="flex flex-[3_1_460px] flex-col gap-7">
            {d.sections.map(([title, covers], i) => (
              <section key={title} id={`${doc}-${i + 1}`} className="flex flex-col gap-2">
                <h2 className="text-[1.375rem] leading-snug">{i + 1}. {title}</h2>
                <p className="text-base leading-[1.6] text-ink-2">{covers}</p>
              </section>
            ))}
            <p className="text-base leading-[1.6]">Questions? <Link to="/contact" className="font-semibold">Contact us</Link>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
