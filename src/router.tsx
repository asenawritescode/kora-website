import { lazy, Suspense, type ComponentType } from 'react'
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import MarketingLayout from '@/components/landing/MarketingLayout'
import RedirectPage from '@/components/landing/RedirectPage'
import redirects from '../redirects.json'

type Loader = () => Promise<{ default: ComponentType }>

// Route-level code splitting: every page body is its own chunk, fetched when
// the route is first visited. Layouts shared by most pages (MarketingLayout)
// stay in the entry chunk so navigation and footer paint immediately.
// Docs and blog layouts load together with their page in a single request.
const fallback = <div className="min-h-[60vh]" aria-hidden="true" />

function page(load: Loader) {
  const Page = lazy(load)
  return () => (
    <Suspense fallback={fallback}>
      <Page />
    </Suspense>
  )
}

function inMarketing(load: Loader) {
  const Page = page(load)
  return () => (
    <MarketingLayout>
      <Page />
    </MarketingLayout>
  )
}

function withLayout(loadLayout: () => Promise<{ default: ComponentType<{ children: React.ReactNode }> }>, load: Loader) {
  return page(async () => {
    const [{ default: Layout }, { default: Body }] = await Promise.all([loadLayout(), load()])
    return { default: () => <Layout><Body /></Layout> }
  })
}

const HomePage = inMarketing(() => import('@/routes/landing/home'))
const ExamplesPage = inMarketing(() => import('@/routes/landing/examples'))
const TemplateDetailPage = inMarketing(() => import('@/routes/landing/template-detail'))
const OnboardPage = inMarketing(() => import('@/routes/landing/onboard'))
const CloudPage = inMarketing(() => import('@/routes/landing/cloud'))
const PricingPage = inMarketing(() => import('@/routes/landing/pricing'))
const OpenSourcePage = inMarketing(() => import('@/routes/landing/open-source'))
const NotFoundPage = inMarketing(() => import('@/components/landing/NotFound'))
const DocsPage = withLayout(() => import('@/components/landing/DocsLayout'), () => import('@/routes/landing/docs'))
const BlogPage = withLayout(() => import('@/components/landing/BlogLayout'), () => import('@/routes/landing/blog'))
const BlogPostPage = withLayout(() => import('@/components/landing/BlogLayout'), () => import('@/routes/landing/blog-post'))

const rootRoute = createRootRoute()

const onboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboard',
  component: OnboardPage,
})

const cloudRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cloud',
  component: CloudPage,
})

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: PricingPage,
})

const openSourceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/open-source',
  component: OpenSourcePage,
})

// Pages that were removed. Same table as the 301s in nginx.conf; a test keeps them equal.
const redirectRoutes = Object.entries(redirects).map(([from, to]) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: from,
    component: () => <RedirectPage to={to} />,
  }),
)

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: NotFoundPage,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const examplesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/examples',
  component: ExamplesPage,
})

const templateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates/$slug',
  component: TemplateDetailPage,
})

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs',
  component: DocsPage,
})

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage,
})

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  component: BlogPostPage,
})

const routeTree = rootRoute.addChildren([
  onboardRoute,
  cloudRoute,
  ...redirectRoutes,
  pricingRoute,
  openSourceRoute,
  homeRoute,
  examplesRoute,
  templateDetailRoute,
  docsRoute,
  blogRoute,
  blogPostRoute,
  notFoundRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
