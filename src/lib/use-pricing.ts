import { useEffect, useState } from 'react'
import { fetchPricing, type Pricing } from '@/lib/pricing-client'

// The pilot terms until Cloud says otherwise, so the first paint and an
// unreachable Cloud both show what the site has already published.
export function usePricing(): Pricing {
  const [pricing, setPricing] = useState<Pricing>({ mode: 'pilot' })
  useEffect(() => {
    let alive = true
    fetchPricing().then((p) => alive && setPricing(p))
    return () => { alive = false }
  }, [])
  return pricing
}
