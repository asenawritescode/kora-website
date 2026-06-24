import { QuickStartSection } from './QuickStartSection'
import { CoreConceptsSection } from './CoreConceptsSection'
import { ArchitectureSection } from './ArchitectureSection'
import { YamlConfigSection } from './YamlConfigSection'
import { ApiReferenceSection } from './ApiReferenceSection'
import { CliCommandsSection } from './CliCommandsSection'
import { DeploymentSection } from './DeploymentSection'

export default function DocsPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#5d5f5f] mb-8" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
        <a href="#" className="hover:text-black transition-colors">Docs</a>
        <span className="text-sm">›</span>
        <span className="text-black">Getting Started</span>
      </div>

      {/* Page Header */}
      <div className="mb-12 border-b border-outline-variant pb-8">
        <h1 className="text-[48px] leading-[56px] font-semibold text-black mb-4 tracking-[-0.03em]">
          Documentation
        </h1>
        <p className="text-lg leading-7 text-[#5d5f5f]">
          Everything you need to build applications with Kora — from your first
          doctype to production deployment. Whether you prefer YAML, the admin UI,
          or describing your business to the AI, this guide covers it all.
        </p>
      </div>

      <QuickStartSection />
      <CoreConceptsSection />
      <ArchitectureSection />
      <YamlConfigSection />
      <ApiReferenceSection />
      <CliCommandsSection />
      <DeploymentSection />
    </>
  )
}
