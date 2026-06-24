import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import MarketingLayout from '@/components/landing/MarketingLayout'
import DocsLayout from '@/components/landing/DocsLayout'
import BlogLayout from '@/components/landing/BlogLayout'
import HomePage from '@/routes/landing/home'
import ExamplesPage from '@/routes/landing/examples'
import DocsPage from '@/routes/landing/docs'
import BlogPage from '@/routes/landing/blog'
import BlogPostPage from '@/routes/landing/blog-post'

const rootRoute = createRootRoute()

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
  homeRoute,
  examplesRoute,
  docsRoute,
  blogRoute,
  blogPostRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
