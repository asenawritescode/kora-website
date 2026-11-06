// The visitor's current choice (template, optional modules) as one small store,
// so the module picker, the template pages and every "Set up your shop" button
// carry the same choice into Cloud signup. It lives in sessionStorage for the
// visit; the page works without it.
import { useSyncExternalStore } from 'react'
import { buildSignupUrl, cloudSignupBase } from '@/lib/cloud-signup'
import type { Choice } from '@/lib/module-picker'

export const EMPTY_CHOICE: Choice = { template: undefined, optional: [], keys: [] }

const STORAGE_KEY = 'kigae.signup-choice'
const ID = /^[a-z0-9][a-z0-9._-]{0,127}$/i
const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])

// Whatever was stored is checked again: only plain ids come back.
export function parseStoredChoice(raw: string | null): Choice {
  if (!raw) return EMPTY_CHOICE
  let v: unknown
  try {
    v = JSON.parse(raw)
  } catch {
    return EMPTY_CHOICE
  }
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return EMPTY_CHOICE
  const o = v as Record<string, unknown>
  if (typeof o.template !== 'string' || !ID.test(o.template)) return EMPTY_CHOICE
  return { template: o.template, optional: strings(o.optional).filter((id) => ID.test(id)), keys: strings(o.keys) }
}

export function signupHrefFor(base: string, choice: Choice): string {
  return buildSignupUrl(base, { template: choice.template, optional: choice.optional })
}

function readStored(): Choice {
  try {
    return parseStoredChoice(window.sessionStorage.getItem(STORAGE_KEY))
  } catch {
    return EMPTY_CHOICE
  }
}

let current: Choice = typeof window === 'undefined' ? EMPTY_CHOICE : readStored()
const listeners = new Set<() => void>()

export function getChoice(): Choice {
  return current
}

export function setChoice(next: Choice): void {
  const same =
    next.template === current.template &&
    next.optional.join() === current.optional.join() &&
    next.keys.join() === current.keys.join()
  if (same) return
  current = next
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Private window or blocked storage: the choice still holds for this page view.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useChoice(): Choice {
  return useSyncExternalStore(subscribe, getChoice, () => EMPTY_CHOICE)
}

// The Cloud signup link for the current choice.
export function useSignupHref(): string {
  return signupHrefFor(cloudSignupBase(), useChoice())
}
