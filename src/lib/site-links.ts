// Single source for the header and footer links. Every href must match a route
// in src/router.tsx; scripts/check-links.ts enforces that during the build.
export type SiteLink = { label: string; href: string }

export const HOME_LINK: SiteLink = { label: 'Home', href: '/' }

export const PRIMARY_LINKS: SiteLink[] = [
  { label: 'Modules', href: '/modules' },
  { label: 'Industries', href: '/industries' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'How AI works', href: '/how-ai' },
  { label: 'Pricing', href: '/pricing' },
]

export const COMPANY_LINKS: SiteLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Contact us', href: '/contact' },
  { label: 'Privacy and terms', href: '/privacy' },
]

export const CTA_LINK: SiteLink = { label: 'Set up my shop', href: '/start' }
