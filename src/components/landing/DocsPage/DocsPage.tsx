import { QuickStartSection } from './QuickStartSection'
import { CoreConceptsSection } from './CoreConceptsSection'
import { ArchitectureSection } from './ArchitectureSection'
import { YamlConfigSection } from './YamlConfigSection'
import { ApiReferenceSection } from './ApiReferenceSection'
import { ExtensibilitySection } from './ExtensibilitySection'
import { SdkSection } from './SdkSection'
import { CliCommandsSection } from './CliCommandsSection'
import { DeploymentSection } from './DeploymentSection'

export default function DocsPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#5d5f5f] mb-8" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
        <span>Docs</span>
        <span className="text-sm">›</span>
        <span className="text-black">Getting Started</span>
      </div>

      {/* Page Header */}
      <div className="mb-12 border-b border-outline-variant pb-8">
        <h1 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold text-black mb-4 tracking-[-0.02em] md:tracking-[-0.03em]">
          Documentation
        </h1>
        <p className="text-lg leading-7 text-[#5d5f5f] max-w-xl">
          Technical documentation for building, extending, deploying, and self-hosting Kora.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <a href="https://github.com/asenawritescode/kora" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-4 py-2 rounded-sm hover:opacity-90 transition-opacity font-mono">
            GitHub
          </a>
          <a href="/open-source" className="inline-flex items-center gap-2 bg-white text-black border border-[#e5e5e5] text-xs font-medium px-4 py-2 rounded-sm hover:border-black transition-colors font-mono">
            Open Source
          </a>
        </div>
      </div>

      <QuickStartSection />
      <CoreConceptsSection />
      <ArchitectureSection />
      <YamlConfigSection />
      <ApiReferenceSection />
      <ExtensibilitySection />
      <SdkSection />
      <CliCommandsSection />
      <DeploymentSection />
    </>
  )
}
