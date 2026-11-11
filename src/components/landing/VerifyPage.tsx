import { useEffect, useRef, useState } from 'react'
import { H1 } from '@/components/landing/ui'
import { buildSignInUrl, cloudSignupBase } from '@/lib/cloud-signup'
import { appBaseURL, redeemHandoff, tokenFromHash, verifyEmail, workspaceUrl } from '@/lib/onboard-client'

type State = 'opening' | 'expired' | 'failed' | 'incomplete'

const COPY: Record<Exclude<State, 'opening'>, { title: string; text: string }> = {
  expired: { title: 'This link has expired', text: 'It may already have been used. Sign in to open your workspace.' },
  failed: { title: 'We could not open your workspace', text: 'Sign in to open it. If your email was just confirmed, signing in is all that is left.' },
  incomplete: { title: 'This link is not complete', text: 'Open the link from your email again, or sign in.' },
}

// Where the link in the verification email lands. It confirms the address, then opens the
// workspace with the one-time code Cloud hands back; the token is taken out of the address
// bar at once so it cannot be shared or kept in history.
export default function VerifyPage() {
  const [state, setState] = useState<State>('opening')
  const started = useRef(false)
  useEffect(() => {
    // Development runs effects twice; a link can only be used once.
    if (started.current) return
    started.current = true
    const token = tokenFromHash(window.location.hash)
    window.history.replaceState(null, '', '/verify')
    const appBase = appBaseURL()
    if (!token) { setState('incomplete'); return }
    if (!appBase) { setState('failed'); return }
    void (async () => {
      const verified = await verifyEmail(token)
      if (verified.kind !== 'ready') { setState(verified.kind); return }
      if (await redeemHandoff(appBase, verified.tenant, verified.code)) window.location.assign(workspaceUrl(appBase, verified.tenant))
      else setState('failed')
    })()
  }, [])

  const copy = state === 'opening' ? { title: 'Opening your workspace', text: 'One moment.' } : COPY[state]
  return (
    <div className="flex-1 bg-surface">
      <div className="mx-auto flex max-w-[640px] flex-col gap-3 px-4 pb-[clamp(3.5rem,6vw,5.5rem)] pt-[clamp(2rem,5vw,4.5rem)]">
        <h1 className={H1}>{copy.title}</h1>
        <p role={state === 'opening' ? 'status' : 'alert'} className="text-[1.125rem] leading-[1.55] text-ink-2">{copy.text}</p>
        {state !== 'opening' && (
          <a href={buildSignInUrl(cloudSignupBase())} className="flex min-h-[52px] items-center self-start rounded-md bg-action px-6 text-base font-semibold text-paper no-underline">Sign in</a>
        )}
      </div>
    </div>
  )
}
