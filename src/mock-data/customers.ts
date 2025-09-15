// Customers Mock Data

export interface Customer {
  id: string;
  name: string;
  industry: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: 'Active' | 'Inactive' | 'Prospective';
  joinDate: string;
  lastActivity: string;
  totalRevenue: number;
  projectIds: string[];
  priority: 'Low' | 'Medium' | 'High';
  notes?: string;
}

export const customers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Acme Corporation',
    industry: 'Technology',
    contact: {
      name: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+1 (555) 123-4567',
      title: 'VP of Engineering'
    },
    website: 'www.acme.com',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    status: 'Active',
    joinDate: '2023-03-15',
    lastActivity: '2025-01-14',
    totalRevenue: 485000,
    projectIds: ['PROJ-001', 'PROJ-008'],
    priority: 'High',
    notes: 'Long-term strategic partner'
  },
  {
    id: 'CUST-002',
    name: 'Global Bank Corp',
    industry: 'Financial Services',
    contact: {
      name: 'Maria Garcia',
      email: 'maria.garcia@globalbank.com',
      phone: '+1 (555) 234-5678',
      title: 'Chief Technology Officer'
    },
    website: 'www.globalbank.com',
    address: {
      street: '456 Financial Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    status: 'Active',
    joinDate: '2023-07-22',
    lastActivity: '2025-01-13',
    totalRevenue: 750000,
    projectIds: ['PROJ-002'],
    priority: 'High',
    notes: 'Requires highest security standards'
  },
  {
    id: 'CUST-003',
    name: 'Retail Solutions Inc',
    industry: 'Retail',
    contact: {
      name: 'Robert Chen',
      email: 'robert.chen@retailsolutions.com',
      phone: '+1 (555) 345-6789',
      title: 'Director of Digital Innovation'
    },
    website: 'www.retailsolutions.com',
    address: {
      street: '789 Commerce Blvd',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    status: 'Active',
    joinDate: '2023-11-10',
    lastActivity: '2025-01-12',
    totalRevenue: 320000,
    projectIds: ['PROJ-003'],
    priority: 'Medium',
    notes: 'Growing e-commerce focus'
  },
  {
    id: 'CUST-004',
    name: 'Data Insights Ltd',
    industry: 'Analytics',
    contact: {
      name: 'Jennifer Taylor',
      email: 'jennifer.taylor@datainsights.com',
      phone: '+1 (555) 456-7890',
      title: 'Head of Product'
    },
    website: 'www.datainsights.com',
    address: {
      street: '321 Analytics Way',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'USA'
    },
    status: 'Inactive',
    joinDate: '2023-05-18',
    lastActivity: '2024-12-20',
    totalRevenue: 180000,
    projectIds: ['PROJ-004'],
    priority: 'Low',
    notes: 'Project on hold due to budget constraints'
  },
  {
    id: 'CUST-005',
    name: 'Sales Force Pro',
    industry: 'Sales & CRM',
    contact: {
      name: 'Michael Brown',
      email: 'michael.brown@salesforcepro.com',
      phone: '+1 (555) 567-8901',
      title: 'CEO'
    },
    website: 'www.salesforcepro.com',
    address: {
      street: '654 Sales Street',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
      country: 'USA'
    },
    status: 'Active',
    joinDate: '2023-01-08',
    lastActivity: '2025-01-11',
    totalRevenue: 425000,
    projectIds: ['PROJ-005'],
    priority: 'High',
    notes: 'Completed successful CRM implementation'
  },
  {
    id: 'CUST-006',
    name: 'Healthcare Plus',
    industry: 'Healthcare',
    contact: {
      name: 'Dr. Sarah Davis',
      email: 'sarah.davis@healthcareplus.com',
      phone: '+1 (555) 678-9012',
      title: 'Chief Medical Officer'
    },
    website: 'www.healthcareplus.com',
    address: {
      street: '987 Medical Center Dr',
      city: 'Boston',
      state: 'MA',
      zip: '02101',
      country: 'USA'
    },
    status: 'Prospective',
    joinDate: '2024-12-01',
    lastActivity: '2025-01-10',
    totalRevenue: 0,
    projectIds: [],
    priority: 'Medium',
    notes: 'Evaluating patient management system'
  }
];

export interface CustomerProject {
  id: string;
  name: string;
  customerId: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
}

export const customerProjects: CustomerProject[] = [
  {
    id: 'PROJ-001',
    name: 'Web App Redesign',
    customerId: 'CUST-001',
    status: 'Active',
    progress: 75,
    startDate: '2024-10-01',
    endDate: '2025-02-28',
    budget: 150000,
    spent: 112500
  },
  {
    id: 'PROJ-002',
    name: 'Mobile Banking App',
    customerId: 'CUST-002',
    status: 'Active',
    progress: 60,
    startDate: '2024-11-15',
    endDate: '2025-04-15',
    budget: 200000,
    spent: 120000
  },
  {
    id: 'PROJ-003',
    name: 'E-commerce Platform',
    customerId: 'CUST-003',
    status: 'Active',
    progress: 45,
    startDate: '2024-12-01',
    endDate: '2025-06-30',
    budget: 300000,
    spent: 135000
  },
  {
    id: 'PROJ-004',
    name: 'Analytics Dashboard',
    customerId: 'CUST-004',
    status: 'On Hold',
    progress: 30,
    startDate: '2024-09-01',
    endDate: '2025-03-31',
    budget: 120000,
    spent: 36000
  },
  {
    id: 'PROJ-005',
    name: 'CRM System',
    customerId: 'CUST-005',
    status: 'Completed',
    progress: 100,
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    budget: 180000,
    spent: 175000
  },
  {
    id: 'PROJ-008',
    name: 'Legacy System Migration',
    customerId: 'CUST-001',
    status: 'Active',
    progress: 25,
    startDate: '2024-12-15',
    endDate: '2025-05-15',
    budget: 250000,
    spent: 62500
  }
];

// Utility functions
export const getActiveCustomers = () => customers.filter(customer => customer.status === 'Active');
export const getProspectiveCustomers = () => customers.filter(customer => customer.status === 'Prospective');
export const getCustomersByIndustry = (industry: string) => customers.filter(customer => customer.industry === industry);
export const getCustomerProjects = (customerId: string) => customerProjects.filter(project => project.customerId === customerId);
export const getCustomerById = (customerId: string) => customers.find(customer => customer.id === customerId);