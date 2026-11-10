import { Link } from '@tanstack/react-router'
import { SignupLink } from '@/components/landing/SignupLink'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, CARD, H1 } from '@/components/landing/ui'

const PRINCIPLES = [
  ['Built once, used two ways', 'People use each module through screens. AI agents will use the same actions, with the same permissions and log.'],
  ['Honest labels', 'Everything is Available, Preview or On the roadmap. Nothing is shown as working before it does.'],
  ['Start small', 'Pick only the modules you need. Your industry is a starting point, never a separate product.'],
]

const h2 = 'text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.02em]'

export default function AboutPage() {
  return (
    <div className="flex-1 bg-surface">
      <section className="mx-auto flex max-w-[1232px] flex-col gap-4 px-4 py-[clamp(2rem,6vw,5rem)]">
        <h1 className={`${H1} max-w-[820px]`}>Business tools, made in Nairobi</h1>
        <p className="max-w-[620px] text-[1.125rem] leading-[1.55] text-ink-2">Zana means “tools” in Swahili. One system for small businesses.</p>
      </section>
      <section className="bg-accent px-4 py-[clamp(2.5rem,6vw,5rem)] text-on-accent">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-x-12 gap-y-6">
          <h2 className={`${h2} flex-[1_1_280px]`}>Why Zana</h2>
          <div className="flex flex-[2_1_420px] flex-col gap-3.5 text-[1.125rem] leading-[1.6]">
            <p>Many shops run on a paper book, a phone and memory. Business software often assumes a big budget, a desktop and a fast connection.</p>
            <p>Zana starts from the other end: a low-cost phone, a slow connection and only the modules you need.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto flex max-w-[1232px] flex-col gap-6 px-4 py-[clamp(2.5rem,6vw,5rem)]">
        <h2 className={h2}>How Zana is built</h2>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          {PRINCIPLES.map(([title, text]) => (
            <div key={title} className={`${CARD} flex flex-col gap-2 p-[22px]`}>
              <h3 className="text-[1.1875rem]">{title}</h3>
              <p className="text-base leading-[1.55] text-ink-2">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto flex max-w-[1232px] flex-wrap items-center justify-between gap-4 px-4 pb-[clamp(3rem,6vw,5rem)]">
        <p className="text-[1.125rem] font-semibold">From Nairobi to the world.</p>
        <div className="flex flex-wrap gap-3">
          <SignupLink className={BUTTON_PRIMARY} />
          <Link to="/contact" className={BUTTON_SECONDARY}>Contact us</Link>
        </div>
      </section>
    </div>
  )
}
