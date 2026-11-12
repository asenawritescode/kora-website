// A visitor whose kind of business has nothing ready yet leaves their email and
// hears when it is. It is the same lead Cloud stores for the Contact form, with
// a source that says which business asked, so the team can see who is waiting for what.
import { postLead } from '@/lib/contact-lead'
import { validateContact, type ContactErrors } from '@/lib/contact'
import { industrySlug, type Industry } from '@/lib/industries-content'

export type WaitlistFields = { name: string; email: string; note: string }

export const waitlistSource = (industry: Industry) => `waitlist:${industrySlug(industry)}`

export function waitlistBody(industry: Industry, f: WaitlistFields, honeypot = '') {
  const note = f.note.trim()
  return {
    name: f.name.trim(), email: f.email.trim(),
    message: `Waitlist: ${industry.name}${note ? `\n\n${note}` : ''}`,
    source: waitlistSource(industry), website: honeypot,
  }
}

// A note is optional; the name and the email are what Cloud needs.
export function validateWaitlist(f: WaitlistFields): ContactErrors {
  const { name, email } = validateContact({ ...f, phone: '', topic: '', message: 'x' })
  return { ...(name && { name }), ...(email && { email }) }
}

export const sendWaitlist = (industry: Industry, f: WaitlistFields, idempotencyKey: string, honeypot = '', doFetch: typeof fetch = fetch) =>
  postLead(waitlistBody(industry, f, honeypot), idempotencyKey, doFetch)
