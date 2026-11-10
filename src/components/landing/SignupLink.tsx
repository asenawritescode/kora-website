import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { CTA_LINK } from '@/lib/site-links'
import { useSignupHref } from '@/lib/signup-choice'

// Every "Set up my shop" button. It opens the module picker, which keeps the
// choice; `direct` skips the picker and goes straight to Zana Cloud signup with
// whatever the visitor has already chosen (template and optional modules).
export function SignupLink({ className, children = CTA_LINK.label, direct = false }: { className: string; children?: ReactNode; direct?: boolean }) {
  const href = useSignupHref()
  return direct ? (
    <a href={href} className={className}>{children}</a>
  ) : (
    <Link to="/start" className={className}>{children}</Link>
  )
}
