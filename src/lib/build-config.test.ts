import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

// Vite bakes VITE_* values in during the build. In the Docker build only variables the Dockerfile declares reach it, so a
// setting that is missing there is silently empty in production: the in-site onboarding then switches itself off and
// "Create account" sends people to Cloud's portal.
const dockerfile = readFileSync(new URL('../../Dockerfile', import.meta.url), 'utf8')
const argDefault = (name: string) => dockerfile.match(new RegExp(`^ARG ${name}=(\\S+)$`, 'm'))?.[1]
const exportedToBuild = (name: string) => new RegExp(`^ENV ${name}=\\$\\{${name}\\}$`, 'm').test(dockerfile)

describe('production image build', () => {
  test('the app URL has an https default and reaches the build, so the in-site onboarding is on', () => {
    expect(argDefault('VITE_KORA_APP_BASE_URL')).toMatch(/^https:\/\/[^\s/]+$/)
    expect(exportedToBuild('VITE_KORA_APP_BASE_URL')).toBe(true)
  })

  test.each(['VITE_KORA_CLOUD_SIGNUP_URL', 'VITE_KORA_CLOUD_CATALOG_BASE_URL', 'VITE_KORA_APP_BASE_URL'])('%s is declared and exported to the build', (name) => {
    expect(argDefault(name)).toBeTruthy()
    expect(exportedToBuild(name)).toBe(true)
  })

  test('the app URL is a bare origin, as the code expects', () => {
    expect(argDefault('VITE_KORA_APP_BASE_URL')).not.toMatch(/\/$/)
  })
})
