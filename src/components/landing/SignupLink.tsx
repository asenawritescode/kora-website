import type { ReactNode } from 'react'
import { CTA_LINK } from '@/lib/site-links'
import { useSignupHref } from '@/lib/signup-choice'

// Every "Set up your shop" button. A plain link to Kigae Cloud signup that
// carries whatever the visitor has chosen so far (template and optional modules).
export function SignupLink({ className, children = CTA_LINK.label }: { className: string; children?: ReactNode }) {
  return (
    <a href={useSignupHref()} className={className}>
      {children}
    </a>
  )
}
