import { HeroSection } from './HeroSection'
import { AISection } from './AISection'
import { ProblemSection } from './ProblemSection'
import { BuiltForOwnership } from './BuiltForOwnership'
import { FinalCTA } from './FinalCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AISection />
      <ProblemSection />
      <BuiltForOwnership />
      <FinalCTA />
    </>
  )
}
