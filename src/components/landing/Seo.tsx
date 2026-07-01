import { useEffect } from 'react'

const DEFAULT_SITE_URL = 'https://kora.mradiafrica.com'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

type SeoProps = {
  title: string
  description: string
  path?: string
  canonical?: string
  noindex?: boolean
  jsonLd?: JsonValue | JsonValue[]
}

function getSiteUrl() {
  return (import.meta.env.VITE_KORA_SITE_URL as string | undefined)?.replace(/\/$/, '') || DEFAULT_SITE_URL
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value)
  }
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertJsonLd(id: string, data?: JsonValue | JsonValue[]) {
  const existing = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`)
  if (!data) {
    existing?.remove()
    return
  }
  const el = existing ?? document.createElement('script')
  el.type = 'application/ld+json'
  el.dataset.seoId = id
  el.textContent = JSON.stringify(data)
  if (!existing) document.head.appendChild(el)
}

export function Seo({ title, description, path, canonical, noindex, jsonLd }: SeoProps) {
  useEffect(() => {
    const siteUrl = getSiteUrl()
    const url = canonical || (path ? `${siteUrl}${path.startsWith('/') ? path : `/${path}`}` : siteUrl)

    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: path?.startsWith('/blog/') ? 'article' : 'website' })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertLink('canonical', url)

    if (noindex) {
      upsertMeta('meta[name="robots"]', { name: 'robots', content: 'noindex,nofollow' })
    } else {
      upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' })
    }

    upsertJsonLd('primary', jsonLd)
  }, [canonical, description, jsonLd, noindex, path, title])

  return null
}
