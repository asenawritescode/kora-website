export interface Template {
  slug: string
  name: string
  description: string
  icon: string
  category: string
  features: { iconType: string; label: string }[]
}

export const TEMPLATES: Template[] = [
  {
    slug: 'kiosk-pos',
    name: 'Kiosk POS',
    description: 'A streamlined point-of-sale system for rapid retail environments.',
    icon: 'Store',
    category: 'Retail',
    features: [
      { iconType: 'Database', label: 'Products, Orders, Inventory' },
      { iconType: 'Layout', label: 'Quick Checkout Form' },
      { iconType: 'RefreshCw', label: 'Daily Sales Reconciliation' },
    ],
  },
  {
    slug: 'b2b-crm',
    name: 'B2B CRM',
    description: 'Manage high-value sales pipelines and account relationships.',
    icon: 'Users',
    category: 'Operations',
    features: [
      { iconType: 'Database', label: 'Accounts, Deals, Contacts' },
      { iconType: 'Layout', label: 'Lead Qualification Form' },
      { iconType: 'RefreshCw', label: 'Stage Progression Logic' },
    ],
  },
  {
    slug: 'clinic-admin',
    name: 'Clinic Admin',
    description: 'Patient scheduling, electronic records, and billing infrastructure.',
    icon: 'HeartPulse',
    category: 'Operations',
    features: [
      { iconType: 'Database', label: 'Patients and Appointments' },
      { iconType: 'Layout', label: 'Clinical Notes' },
      { iconType: 'RefreshCw', label: 'Clinic Invoices' },
    ],
  },
  {
    slug: 'school-admin',
    name: 'School Admin',
    description: 'Manage students, classes, attendance, and assessments.',
    icon: 'GraduationCap',
    category: 'Education',
    features: [
      { iconType: 'Database', label: 'Students and Classes' },
      { iconType: 'Layout', label: 'Attendance Records' },
      { iconType: 'RefreshCw', label: 'Assessment Tracking' },
    ],
  },
  {
    slug: 'property-management',
    name: 'Property Mgmt',
    description: 'Lease tracking, maintenance requests, and rent collection.',
    icon: 'Building2',
    category: 'Operations',
    features: [
      { iconType: 'Database', label: 'Units, Tenants, Leases' },
      { iconType: 'Layout', label: 'Maintenance Ticket Form' },
      { iconType: 'RefreshCw', label: 'Invoice Generation' },
    ],
  },
  {
    slug: 'sacco-core',
    name: 'SACCO Core',
    description: 'Savings and credit cooperative member, deposit, and loan tracking.',
    icon: 'Landmark',
    category: 'Finance',
    features: [
      { iconType: 'Database', label: 'Members and Deposits' },
      { iconType: 'Layout', label: 'Loan Register' },
      { iconType: 'RefreshCw', label: 'Repayment Tracking' },
    ],
  },
  {
    slug: 'logistics-fleet',
    name: 'Logistics Fleet',
    description: 'Vehicle tracking, maintenance jobs, and dispatch records.',
    icon: 'Truck',
    category: 'Operations',
    features: [
      { iconType: 'Database', label: 'Vehicles and Drivers' },
      { iconType: 'Layout', label: 'Dispatch Records' },
      { iconType: 'RefreshCw', label: 'Maintenance Jobs' },
    ],
  },
  {
    slug: 'event-ticketing',
    name: 'Event Ticketing',
    description: 'Manage events, ticket tiers, and attendee scanning.',
    icon: 'Calendar',
    category: 'Operations',
    features: [
      { iconType: 'Database', label: 'Events, Tickets, Attendees' },
      { iconType: 'Layout', label: 'Ticket Purchase Flow' },
      { iconType: 'RefreshCw', label: 'QR Validation Webhook' },
    ],
  },
]
