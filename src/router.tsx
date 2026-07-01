import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import MarketingLayout from '@/components/landing/MarketingLayout'
import DocsLayout from '@/components/landing/DocsLayout'
import BlogLayout from '@/components/landing/BlogLayout'
import HomePage from '@/routes/landing/home'
import ExamplesPage from '@/routes/landing/examples'
import DocsPage from '@/routes/landing/docs'
import BlogPage from '@/routes/landing/blog'
import BlogPostPage from '@/routes/landing/blog-post'
import OnboardPage from '@/routes/landing/onboard'
import CloudPage from '@/routes/landing/cloud'
import BenefitsPage from '@/routes/landing/benefits'
import AIBuilderPage from '@/routes/landing/ai-builder'
import PricingPage from '@/routes/landing/pricing'
import NotFound from '@/components/landing/NotFound'

const rootRoute = createRootRoute()

const onboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboard',
  component: () => <MarketingLayout><OnboardPage /></MarketingLayout>,
})

const cloudRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cloud',
  component: () => <MarketingLayout><CloudPage /></MarketingLayout>,
})

const benefitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/benefits',
  component: () => <MarketingLayout><BenefitsPage /></MarketingLayout>,
})

const aiBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-builder',
  component: () => <MarketingLayout><AIBuilderPage /></MarketingLayout>,
})

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: () => <MarketingLayout><PricingPage /></MarketingLayout>,
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: () => <MarketingLayout><NotFound /></MarketingLayout>,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <MarketingLayout><HomePage /></MarketingLayout>,
})

const examplesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/examples',
  component: () => <MarketingLayout><ExamplesPage /></MarketingLayout>,
})

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs',
  component: () => <DocsLayout><DocsPage /></DocsLayout>,
})

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => <BlogLayout><BlogPage /></BlogLayout>,
})

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  component: () => <BlogLayout><BlogPostPage /></BlogLayout>,
})

const routeTree = rootRoute.addChildren([
  onboardRoute,
  cloudRoute,
  benefitsRoute,
  aiBuilderRoute,
  pricingRoute,
  homeRoute,
  examplesRoute,
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
