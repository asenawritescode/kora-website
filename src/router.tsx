import { lazy, Suspense, type ComponentType } from 'react'
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import MarketingLayout from '@/components/landing/MarketingLayout'
import RedirectPage from '@/components/landing/RedirectPage'
import redirects from '../redirects.json'

type Loader = () => Promise<{ default: ComponentType }>

// Route-level code splitting: every page body is its own chunk, fetched when
// the route is first visited. Layouts shared by most pages (MarketingLayout)
// stay in the entry chunk so navigation and footer paint immediately.
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

const HomePage = inMarketing(() => import('@/routes/landing/home'))
const PricingPage = inMarketing(() => import('@/routes/landing/pricing'))
const ModulesPage = inMarketing(() => import('@/routes/landing/modules'))
const RoadmapPage = inMarketing(() => import('@/routes/landing/roadmap'))
const IndustriesPage = inMarketing(() => import('@/routes/landing/industries'))
const IndustryRetailPage = inMarketing(() => import('@/routes/landing/industry-retail'))
const HowAiPage = inMarketing(() => import('@/routes/landing/how-ai'))
const StartPage = page(() => import('@/routes/landing/start'))
const ContactPage = inMarketing(() => import('@/routes/landing/contact'))
const AboutPage = inMarketing(() => import('@/routes/landing/about'))
const PrivacyPage = inMarketing(() => import('@/routes/landing/privacy'))
const TermsPage = inMarketing(() => import('@/routes/landing/terms'))
const NotFoundPage = inMarketing(() => import('@/components/landing/NotFound'))

const rootRoute = createRootRoute()

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: PricingPage,
})

const modulesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/modules',
  component: ModulesPage,
})

const roadmapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roadmap',
  component: RoadmapPage,
})

const industriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/industries',
  component: IndustriesPage,
})

const industryRetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/industries/retail',
  component: IndustryRetailPage,
})

const howAiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how-ai',
  component: HowAiPage,
})

const startRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/start',
  validateSearch: (search: Record<string, unknown>): { for?: string } => (typeof search.for === 'string' ? { for: search.for } : {}),
  component: StartPage,
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
})

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
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

const routeTree = rootRoute.addChildren([
  ...redirectRoutes,
  pricingRoute,
  modulesRoute,
  roadmapRoute,
  industriesRoute,
  industryRetailRoute,
  howAiRoute,
  startRoute,
  contactRoute,
  aboutRoute,
  privacyRoute,
  termsRoute,
  homeRoute,
  notFoundRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
