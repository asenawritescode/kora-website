import { SignupLink } from '@/components/landing/SignupLink'
import { NairobiSkyline } from '@/components/landing/NairobiSkyline'

// First screen: who it is for and what it does, one action, the real product,
// and the skyline as the horizon. Copy rules: PRODUCT.md and
// docs/african-b2b-copywriting-principles.md. Every verb here was checked in a
// real pilot workspace: a sale writes a stock issue and the balance drops.
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="bg-paper">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-10 md:pt-14 md:pb-14 grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <h1
            id="hero-title"
            className="font-display text-ink text-[clamp(44px,5vw,72px)] leading-[0.96] font-[780] tracking-[-0.03em] [text-wrap:balance]"
          >
            Record every sale. Know what stock is left.
          </h1>
          <p className="mt-6 max-w-[36rem] text-[18px] md:text-[20px] leading-[1.5] text-on-surface-variant">
            Shop software for small businesses. Each sale you record comes off your stock count, and the owner dashboard shows what sold and what is running low.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <SignupLink className="inline-flex min-h-12 items-center bg-accent px-[22px] text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-accent-strong active:translate-y-px" />
            <a
              href="#modules"
              className="inline-flex min-h-12 items-center text-[15px] font-semibold text-ink underline decoration-1 underline-offset-[6px] transition-[text-decoration-color,text-decoration-thickness] hover:decoration-accent hover:decoration-2"
            >
              Choose your modules
            </a>
          </div>
          <p className="mt-5 text-[14px] text-muted">Free during the pilot. Works in the browser on a phone or a computer.</p>
        </div>
        <div className="hidden lg:block lg:col-span-5">
          <img
            src="/studio-owner-dashboard.webp"
            width={1200}
            height={700}
            fetchPriority="high"
            alt="The Kigae owner dashboard in a pilot shop: items such as maize flour, sugar and cooking oil with their barcodes and prices in KES."
            className="block w-full h-auto border border-outline-variant bg-white"
          />
        </div>
      </div>
      <div className="bg-night text-night-ink">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 md:pt-8">
          <p className="font-display text-[clamp(22px,2.4vw,32px)] leading-[1.1] font-[720] tracking-[-0.02em]">
            From Nairobi to the world
          </p>
        </div>
        <div className="relative h-[clamp(140px,15vw,220px)] overflow-hidden text-gold">
          <NairobiSkyline className="skyline-draw absolute inset-0 h-full w-full" />
        </div>
      </div>
    </section>
  )
}
