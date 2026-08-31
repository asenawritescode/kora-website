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
  image?: string
}

function getSiteUrl() {
  return (import.meta.env.VITE_KORA_SITE_URL as string | undefined)?.replace(/\/$/, '') || DEFAULT_SITE_URL
}

function resolveUrl(siteUrl: string, value?: string) {
  if (!value) return undefined
  try {
    return new URL(value, siteUrl).toString()
  } catch {
    return undefined
  }
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

function removeMeta(selector: string) {
  document.head.querySelector<HTMLMetaElement>(selector)?.remove()
}

export function Seo({ title, description, path, canonical, noindex, jsonLd, image }: SeoProps) {
  useEffect(() => {
    const siteUrl = getSiteUrl()
    const url = canonical || (path ? `${siteUrl}${path.startsWith('/') ? path : `/${path}`}` : siteUrl)
    const imageUrl = resolveUrl(siteUrl, image)

    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: path?.startsWith('/blog/') ? 'article' : 'website' })
    if (imageUrl) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
      upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: title })
    } else {
      removeMeta('meta[property="og:image"]')
      removeMeta('meta[property="og:image:alt"]')
    }
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    if (imageUrl) {
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })
    } else {
      removeMeta('meta[name="twitter:image"]')
    }
    upsertLink('canonical', url)

    if (noindex) {
      upsertMeta('meta[name="robots"]', { name: 'robots', content: 'noindex,nofollow' })
    } else {
      upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' })
    }

    upsertJsonLd('primary', jsonLd)
  }, [canonical, description, image, jsonLd, noindex, path, title])

  return null
}
