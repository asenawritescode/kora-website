// Starting points by kind of business: which modules each preset holds. A preset
// is not a separate product. Whether a module is ready is read from the module list, so a
// module that becomes Available updates every preset at once.
import type { ModuleInfo } from './live-catalog'
import type { Status } from '@/components/landing/ui'

export type Industry = { name: string; icon: string; preset: string[] }

// The name in a link: "Retail and general shops" is retail-and-general-shops.
export const industrySlug = (industry: Industry) => industry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const INDUSTRIES: Industry[] = [
  { name: 'Retail and general shops', icon: 'shop', preset: ['pos', 'inventory', 'purchasing', 'accounting', 'reports'] },
  { name: 'Wholesale and distribution', icon: 'box', preset: ['inventory', 'pos', 'purchasing', 'accounting', 'fleet', 'crm'] },
  { name: 'Restaurants and cafes', icon: 'cup', preset: ['pos', 'inventory', 'purchasing', 'people', 'reports'] },
  { name: 'Pharmacies and clinics', icon: 'plus', preset: ['pos', 'inventory', 'purchasing', 'crm', 'accounting'] },
  { name: 'Agribusiness and cooperatives', icon: 'leaf', preset: ['inventory', 'purchasing', 'accounting', 'crm', 'reports'] },
  { name: 'Manufacturing', icon: 'gear', preset: ['manufacturing', 'inventory', 'purchasing', 'pos', 'accounting'] },
  { name: 'Construction and hardware', icon: 'hammer', preset: ['pos', 'inventory', 'purchasing', 'projects', 'accounting'] },
  { name: 'Schools and training', icon: 'cap', preset: ['subscriptions', 'crm', 'people', 'accounting', 'documents'] },
  { name: 'Logistics and transport', icon: 'truck', preset: ['fleet', 'crm', 'accounting', 'people', 'assets'] },
  { name: 'Real estate and property', icon: 'home', preset: ['subscriptions', 'crm', 'assets', 'accounting', 'documents'] },
  { name: 'Professional services', icon: 'brief', preset: ['projects', 'crm', 'accounting', 'documents', 'subscriptions'] },
  { name: 'Salons and wellness', icon: 'scissors', preset: ['pos', 'inventory', 'crm', 'people', 'reports'] },
  { name: 'Garages and workshops', icon: 'wrench', preset: ['pos', 'inventory', 'projects', 'crm', 'assets'] },
  { name: 'SACCOs and microfinance', icon: 'coins', preset: ['accounting', 'crm', 'documents', 'reports', 'people'] },
  { name: 'NGOs and projects', icon: 'heart', preset: ['projects', 'accounting', 'documents', 'people', 'reports'] },
  { name: 'Hotels and hospitality', icon: 'bed', preset: ['pos', 'inventory', 'crm', 'people', 'reports'] },
]

export const ICONS: Record<string, string> = {
  shop: 'M3 8l1.5-4h11L17 8 M3 8h14v9H3z M8 17v-5h4v5', box: 'M3 6l7-3 7 3v8l-7 3-7-3z M3 6l7 3 7-3 M10 9v8',
  cup: 'M4 6h10v5a5 5 0 0 1-10 0z M14 7h1.5a2 2 0 0 1 0 4H14 M6 2.5v2 M9 2.5v2', plus: 'M10 3v14 M3 10h14',
  leaf: 'M4 16c0-7 4-12 12-12 0 8-5 12-12 12z M4 16l6-6', gear: 'M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M10 2v3 M10 15v3 M2 10h3 M15 10h3',
  hammer: 'M11 5l4 4-2 2-4-4z M9 7l-6 6 2 2 6-6', cap: 'M2 8l8-4 8 4-8 4z M5 9.5V14c3 2 7 2 10 0V9.5',
  truck: 'M2 5h10v9H2z M12 8h3l3 3v3h-6z M5 16.5a1.5 1.5 0 1 0 0-.01 M15 16.5a1.5 1.5 0 1 0 0-.01', home: 'M3 9l7-6 7 6v8H3z M8 17v-5h4v5',
  brief: 'M3 6h14v10H3z M7 6V4h6v2 M3 10h14', scissors: 'M6 6a2 2 0 1 0 0-.01 M6 14a2 2 0 1 0 0-.01 M8 7l9 7 M8 13l9-7',
  wrench: 'M13 3a4 4 0 0 0-3.5 5.5L3 15l2 2 6.5-6.5A4 4 0 0 0 17 7l-2.5 2.5-2-2L15 5a4 4 0 0 0-2-2z',
  coins: 'M10 6a6 2.5 0 1 0 0-.01 M4 6v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6 M4 10v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4',
  heart: 'M10 16s-6-3.6-6-8a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 16 8c0 4.4-6 8-6 8z', bed: 'M2 15V6 M2 11h16v4 M18 15v-2 M6 11V9h5v2',
}

// `modules` is what the page got from the catalog hook, so a preset's "ready" count
// follows the live status. A preset id Cloud's roadmap does not list is skipped.
export function presetModules(industry: Industry, modules: ModuleInfo[]): ModuleInfo[] {
  return industry.preset.flatMap((id) => modules.find((m) => m.id === id) ?? [])
}

export const readyModules = (industry: Industry, modules: ModuleInfo[]) => presetModules(industry, modules).filter((m) => m.status === 'available')

export const RETAIL = {
  slug: 'retail',
  intro: 'For dukas, minimarts and general shops: sell, track stock and see today’s sales.',
  words: [['Item', 'Product'], ['Session', 'Till shift'], ['Vendor', 'Supplier']],
  day: [
    ['Open the till', 'Start a shift and count your starting cash.'],
    ['Sell', 'Add products by name. Stock goes down as you sell.'],
    ['Take payment', 'Cash, or mobile money with the code typed in.'],
    ['Restock', 'Add new stock. Supplier orders are in Preview.'],
    ['Close the till', 'Count cash, check sales and close.'],
  ] as [string, string][],
  note(status: Status, name: string): string {
    if (status === 'available') return name === 'Sales and point of sale' ? 'Ticked. Includes Inventory and stock.' : 'Ticked.'
    return status === 'preview' ? 'Not finished: purchase orders and supplier bills.' : 'Planned. No dates promised.'
  },
}
