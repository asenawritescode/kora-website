// The Contact page has no server to post to. When VITE_KORA_SUPPORT_EMAIL is
// set, a valid message opens the visitor's email app addressed to it; when it is
// not, the page points at the public issue tracker instead of pretending to send.
export type ContactFields = { name: string; email: string; phone: string; topic: string; message: string }
export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>

export const TOPICS = ['Getting started', 'Pricing and the pilot', 'A problem in my workspace', 'Something else']

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function supportEmail(): string | undefined {
  return (import.meta.env?.VITE_KORA_SUPPORT_EMAIL as string | undefined)?.trim() || undefined
}

export function validateContact(f: ContactFields): ContactErrors {
  const errors: ContactErrors = {}
  if (!f.name.trim()) errors.name = 'Enter your name.'
  const email = f.email.trim()
  if (!email) errors.email = 'Enter your email address.'
  else if (!EMAIL.test(email)) errors.email = 'Use the form name@example.com.'
  if (!f.message.trim()) errors.message = 'Write your message.'
  return errors
}

export function mailtoHref(to: string, f: ContactFields): string {
  const body = [f.message.trim(), '', `From: ${f.name.trim()} <${f.email.trim()}>`, f.phone.trim() && `Phone: ${f.phone.trim()}`].filter((l) => l !== '').join('\n')
  return `mailto:${to}?subject=${encodeURIComponent(f.topic)}&body=${encodeURIComponent(body)}`
}
