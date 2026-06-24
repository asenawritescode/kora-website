import { Link } from '@tanstack/react-router'

const FOOTER_LINKS = {
  Product: [
    { label: 'Product', href: '/' },
    { label: 'Examples', href: '/examples' },
    { label: 'Docs', href: '/docs' },
    { label: 'Blog', href: '/blog' },
  ],
  Company: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
  Resources: [
    { label: 'Status', href: '#' },
    { label: 'Security', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="w-full bg-[#f1edec] border-t border-outline-variant">
      <div className="max-w-[960px] mx-auto px-6 py-[120px] grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col">
          <span className="text-[30px] leading-[38px] font-semibold text-black mb-4 tracking-tight">
            Kora
          </span>
          <p className="text-xs text-[#5d5f5f] mt-auto" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
            Built for ownership.
          </p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
          <div key={category} className="flex flex-col gap-2">
            {links.map((link) => {
              const isActive = link.label === 'Blog' // highlight Blog as active when on blog
              return (
                <Link
                  key={link.label}
                  to={link.href as any}
                  className={`text-xs font-medium hover:underline transition-all w-fit ${
                    isActive ? 'text-black font-bold' : 'text-[#5d5f5f] hover:text-black'
                  }`}
                  style={{ fontFamily: "'Geist Mono Variable', monospace" }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        ))}

        {/* Sponsor + Copyright */}
        <div className="col-span-2 md:col-span-4 mt-8 pt-8 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-[#5d5f5f]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
            Sponsored by{' '}
            <a href="https://mradiafrica.com" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">
              Mradi Africa
            </a>
            {' '}— infrastructure &amp; development
          </p>
          <p className="text-xs text-[#5d5f5f]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
            &copy; 2026 Kora. Built for ownership.
          </p>
        </div>
      </div>
    </footer>
  )
}
