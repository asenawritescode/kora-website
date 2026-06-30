import { useState, type FormEvent } from 'react'
import { BadgeCheck, Server, Database, Terminal } from 'lucide-react'

const onboardAPIBaseURL = 'https://cloud.kora.mradiafrica.com'
const workspaceBaseURL = (import.meta.env.VITE_KORA_APP_BASE_URL as string | undefined)?.replace(/\/$/, '') || 'https://app.kora.mradiafrica.com'

const TEMPLATES = [
  'Kiosk & Retail', 'B2B CRM', 'Clinic Admin', 'School Admin',
  'Property Mgmt', 'SACCO Core', 'Logistics Fleet', 'Event Ticketing',
]

const TRUST_SIGNALS = [
  { icon: BadgeCheck, label: 'AGPL-3.0 open source' },
  { icon: Server, label: 'Self-hosted' },
  { icon: Database, label: 'MySQL or LibSQL' },
  { icon: Terminal, label: 'Single 30MB binary' },
]

export default function OnboardPage() {
  const [hostname, setHostname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${onboardAPIBaseURL}/api/cloud/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_name: hostname,
          admin_email: email,
          admin_password: password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : data.error?.message || 'Something went wrong. Please try again.')
        return
      }

      const engineURL = typeof data?.site?.engine_url === 'string' && data.site.engine_url.length > 0
        ? data.site.engine_url.replace(/\/$/, '')
        : `${workspaceBaseURL}/s/${hostname}`
      setSuccess(`${engineURL}/workspace`)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6">
            <BadgeCheck className="h-8 w-8 text-[#10B981]" />
          </div>
          <h2 className="text-[32px] leading-[40px] font-semibold text-black mb-4">
            Your application is ready
          </h2>
          <p className="text-base text-[#5d5f5f] mb-8">
            Your database has been created. Your admin UI, REST API, and AI chat are ready. Start building.
          </p>
          <a
            href={success}
            className="inline-block bg-[#FF6B35] text-white text-sm font-medium px-8 py-3 rounded-sm hover:bg-[#E55B25] transition-colors font-mono"
          >
            Open your workspace →
          </a>
          <p className="text-xs text-[#5d5f5f] mt-6 font-mono">
            Want analytics? Enable KORA_ANALYTICS=true.<br />
            Need AI? Add your API key at /workspace/admin/secrets.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-[960px] mx-auto">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          {/* Left: Marketing content */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <h1 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[56px] md:leading-[64px] font-bold text-black mb-4 tracking-[-0.03em]">
                Create your application.
              </h1>
              <p className="text-lg text-[#5d5f5f] max-w-lg">
                No credit card. No time limit. You&apos;ll have a working database,
                REST API, admin UI, and AI chat in under two minutes.
              </p>
            </div>

            {/* Template gallery */}
            <div>
              <h3 className="text-sm font-semibold text-black mb-3 font-mono uppercase tracking-wider">
                What are you building?
              </h3>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="text-xs font-medium text-[#5d5f5f] bg-[#FAFAFA] border border-outline-variant rounded-sm px-3 py-1.5 hover:border-black hover:text-black transition-colors font-mono"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#5d5f5f] mt-2 font-mono">
                Pick one or start from scratch — you can add doctypes anytime.
              </p>
            </div>

            {/* What happens next */}
            <div>
              <h3 className="text-sm font-semibold text-black mb-3 font-mono uppercase tracking-wider">
                What happens next
              </h3>
              <ul className="space-y-2 text-sm text-[#5d5f5f]">
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] mt-0.5 font-mono">1.</span>
                  Your database and system tables are created automatically.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] mt-0.5 font-mono">2.</span>
                  You get a full REST API, admin UI, and AI chat.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] mt-0.5 font-mono">3.</span>
                  Add doctypes, workflows, and users — or use AI to do it for you.
                </li>
              </ul>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3">
              {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-[#5d5f5f] font-mono">
                  <Icon className="h-3.5 w-3.5 text-[#c4c7c7]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-2">
            <div className="bg-white border border-outline-variant rounded-sm p-6 md:p-8 sticky top-24">
              <h3 className="text-lg font-semibold text-black mb-6">
                Get started free
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-black mb-1.5 font-mono" htmlFor="hostname">
                    Site name
                  </label>
                  <div className="flex items-center border border-outline-variant rounded-sm focus-within:border-black transition-colors">
                    <input
                      id="hostname"
                      type="text"
                      required
                      minLength={3}
                      maxLength={50}
                      pattern="[a-z0-9-]+"
                      placeholder="mybusiness"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="flex-1 px-3 py-2.5 text-sm text-black bg-transparent outline-none font-mono"
                    />
                    <span className="pr-3 text-xs text-[#c4c7c7] font-mono">.local</span>
                  </div>
                  <p className="text-[10px] text-[#c4c7c7] mt-1 font-mono">
                    Lowercase letters, numbers, and hyphens only.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black mb-1.5 font-mono" htmlFor="email">
                    Admin email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-black border border-outline-variant rounded-sm bg-transparent outline-none focus:border-black transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black mb-1.5 font-mono" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-black border border-outline-variant rounded-sm bg-transparent outline-none focus:border-black transition-colors font-mono"
                  />
                </div>

                {error && (
                  <div className="text-xs text-[#DC2626] bg-[#DC2626]/5 border border-[#DC2626]/20 rounded-sm p-3 font-mono">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF6B35] text-white text-sm font-medium px-6 py-3 rounded-sm hover:bg-[#E55B25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                >
                  {loading ? 'Creating your application...' : 'Create my application →'}
                </button>
              </form>

              <p className="text-[10px] text-[#c4c7c7] mt-4 leading-relaxed font-mono">
                By creating an application you agree to our Terms.
                Your data lives in your own database. No vendor lock-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
