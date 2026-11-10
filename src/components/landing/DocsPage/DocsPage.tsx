import { QuickStartSection } from './QuickStartSection'
import { CoreConceptsSection } from './CoreConceptsSection'
import { ArchitectureSection } from './ArchitectureSection'
import { YamlConfigSection } from './YamlConfigSection'
import { ApiReferenceSection } from './ApiReferenceSection'
import { ExtensibilitySection } from './ExtensibilitySection'
import { SdkSection } from './SdkSection'
import { CliCommandsSection } from './CliCommandsSection'
import { DeploymentSection } from './DeploymentSection'
import { ENGINE_BRAND } from '@/lib/brand'

export default function DocsPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-ink-3 mb-8">
        <span>Docs</span>
        <span className="text-sm">›</span>
        <span className="text-ink">Getting Started</span>
      </div>

      {/* Page Header */}
      <div className="mb-12 border-b border-line pb-8">
        <h1 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold text-ink mb-4 tracking-[-0.02em] md:tracking-[-0.03em]">
          Documentation
        </h1>
        <p className="text-lg leading-7 text-ink-3 max-w-xl">
          Technical documentation for building, extending, deploying, and self-hosting {ENGINE_BRAND}.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <a href="https://github.com/asenawritescode/kora" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-action text-paper text-sm font-semibold px-4 py-2 rounded-sm hover:opacity-90 transition-opacity">
            GitHub
          </a>
          <a href="/open-source" className="inline-flex items-center gap-2 bg-paper text-ink border border-line text-sm font-semibold px-4 py-2 rounded-sm hover:border-ink transition-colors">
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
