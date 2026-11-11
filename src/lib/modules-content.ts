// What the Modules and Roadmap pages say about each module. The states here are
// marketing copy and must match what Cloud's catalog publishes: update both
// together. Needs the exact wording the design uses; "To be confirmed" is
// honest for modules whose parts are not decided.
import type { Status } from '@/components/landing/ui'

export type ModuleInfo = {
  id: string
  name: string
  short?: string
  status: Status
  desc: string
  needs: string
  missing?: string
  // The catalog slug of the module's release, where one exists. Cloud's roadmap
  // link (release_slug) wins over this committed value when it answers.
  slug?: string
}

const TBC = 'To be confirmed'

export const MODULES: ModuleInfo[] = [
  { id: 'pos', name: 'Sales and point of sale', short: 'point of sale', status: 'available', desc: 'Sell, take cash or mobile money, and see every sale.', needs: 'Inventory and stock (each sale updates the count)', slug: 'erp-sell' },
  { id: 'inventory', name: 'Inventory and stock', short: 'inventory', status: 'available', desc: 'Know what you have and when to restock.', needs: 'Nothing else', slug: 'erp-stock' },
  { id: 'purchasing', name: 'Purchasing and suppliers', status: 'preview', desc: 'Track what you buy and what you owe suppliers.', needs: 'Inventory and stock', missing: 'Purchase orders and supplier bills.', slug: 'erp-buy' },
  { id: 'accounting', name: 'Accounting and tax', status: 'roadmap', desc: 'Track money in and out, and your tax figures.', needs: TBC, slug: 'erp-books' },
  { id: 'people', name: 'People, payroll and leave', status: 'roadmap', desc: 'Keep staff records, pay salaries and manage leave.', needs: TBC },
  { id: 'projects', name: 'Projects and tasks', status: 'roadmap', desc: 'Plan work and track tasks.', needs: TBC },
  { id: 'crm', name: 'Customers (CRM) and support', status: 'roadmap', desc: 'Keep customer details and answer questions.', needs: TBC },
  { id: 'documents', name: 'Documents and approvals', status: 'roadmap', desc: 'Store documents and get sign-off.', needs: TBC },
  { id: 'reports', name: 'Reports and owner dashboards', status: 'roadmap', desc: 'See the business on one screen.', needs: TBC },
  { id: 'assets', name: 'Assets and maintenance', status: 'roadmap', desc: 'Track equipment and plan repairs.', needs: TBC },
  { id: 'subscriptions', name: 'Subscriptions and recurring billing', status: 'roadmap', desc: 'Bill customers on a schedule.', needs: TBC },
  { id: 'manufacturing', name: 'Manufacturing and bills of materials', status: 'roadmap', desc: 'Turn materials into products with a recipe.', needs: TBC },
  { id: 'fleet', name: 'Fleet and delivery', status: 'roadmap', desc: 'Manage vehicles, drivers and deliveries.', needs: TBC },
  { id: 'integrations', name: 'Integrations and AI tools', status: 'roadmap', desc: 'Connect other tools. AI agents later.', needs: TBC },
]

export const countByStatus = (status: Status) => MODULES.filter((m) => m.status === status).length

export type RoadmapItem = { name: string; desc: string; feature?: boolean; missing?: string }
export type Lane = { title: string; status: Status; sub: string; items: RoadmapItem[] }

const fromModules = (ids: string[]): RoadmapItem[] =>
  ids.map((id) => {
    const m = MODULES.find((x) => x.id === id)!
    return { name: m.name, desc: m.desc, missing: m.missing?.replace(/^./, (c) => c.toLowerCase()) }
  })

export const LANES: Lane[] = [
  { title: 'Now', status: 'available', sub: 'Works today', items: fromModules(['pos', 'inventory']) },
  { title: 'Building', status: 'preview', sub: 'Visible, not selectable yet', items: fromModules(['purchasing']) },
  {
    title: 'Planned next',
    status: 'roadmap',
    sub: 'No dates promised',
    items: [
      { name: 'Card payments', desc: 'Take card payments at the till.', feature: true },
      { name: 'Receipt printers', desc: 'Print a receipt for each sale.', feature: true },
      { name: 'KRA eTIMS tax receipts', desc: 'Issue tax receipts that meet KRA rules.', feature: true },
      ...fromModules(['accounting', 'reports']),
    ],
  },
  {
    title: 'Planned later',
    status: 'roadmap',
    sub: 'No dates promised',
    items: fromModules(['crm', 'people', 'projects', 'documents', 'assets', 'subscriptions', 'manufacturing', 'fleet', 'integrations']),
  },
]
