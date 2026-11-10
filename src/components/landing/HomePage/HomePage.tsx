import { HeroSection } from './HeroSection'
import { ModulePicker } from './ModulePicker'
import { ClosingBand, HomeBody } from './HomeBody'

// The module picker stays on Home until it moves to its own page (the picker PR).
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeBody />
      <ModulePicker />
      <ClosingBand />
    </>
  )
}
