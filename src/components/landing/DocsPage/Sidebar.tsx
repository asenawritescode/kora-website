const SECTIONS = [
  {
    title: 'Getting Started',
    links: [
      { label: 'Quick Start', href: '#quick-start' },
      { label: 'Core Concepts', href: '#core-concepts' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Architecture', href: '#architecture' },
      { label: 'YAML Configuration', href: '#yaml-configuration' },
      { label: 'API Reference', href: '#api-reference' },
    ],
  },
  {
    title: 'Extend',
    links: [
      { label: 'Extensibility', href: '#extensibility' },
      { label: 'SDKs & Tools', href: '#sdks' },
    ],
  },
  {
    title: 'Operations',
    links: [
      { label: 'CLI Commands', href: '#cli-commands' },
      { label: 'Deployment', href: '#deployment' },
    ],
  },
]

export function DocsSidebar() {
  return (
    <aside className="hidden md:block w-64 shrink-0 border-r border-outline-variant pt-8 pr-8 overflow-y-auto h-[calc(100vh-64px)] sticky top-16">
      <nav className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-[10px] font-medium text-[#5d5f5f] uppercase mb-2 tracking-[0.15em]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block px-2 py-1.5 text-sm rounded-sm text-[#5d5f5f] hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
