const LINKS = [
  { label: 'Quick Start', href: '#quick-start' },
  { label: 'Core Concepts', href: '#core-concepts' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'YAML Config', href: '#yaml-configuration' },
  { label: 'API Reference', href: '#api-reference' },
  { label: 'CLI Commands', href: '#cli-commands' },
  { label: 'Deployment', href: '#deployment' },
]

export function DocsMobileNav() {
  return (
    <div className="md:hidden sticky top-16 z-40 bg-[#fdf8f8]/95 backdrop-blur-sm border-b border-outline-variant">
      <div className="flex overflow-x-auto gap-1 px-4 py-2">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 text-[11px] font-medium text-[#5d5f5f] hover:text-black px-2 py-1.5 rounded-sm whitespace-nowrap transition-colors font-mono"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
