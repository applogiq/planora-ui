// Project Management Mock Data

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Planning';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  customer: string;
  customerId: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  teamLead: string;
  teamMembers: string[];
  tags: string[];
  tasks: any[];
  color: string;
  lastUpdated: string;
  methodology: 'Agile' | 'Waterfall' | 'Scrum' | 'Kanban' | 'Lean' | 'Hybrid';
  projectType: 'Web Development' | 'Mobile App' | 'Desktop App' | 'API Development' | 'Data Analytics' | 'E-commerce' | 'CRM' | 'ERP' | 'DevOps' | 'Machine Learning' | 'Other';
}

export const projects: Project[] = [
  // Active Projects
  {
    id: 'PROJ-001',
    name: 'Web App Redesign',
    description: 'Complete redesign of the main web application with new UI/UX',
    status: 'Active',
    progress: 75,
    startDate: '2024-10-01',
    endDate: '2025-02-28',
    budget: 150000,
    spent: 112500,
    customer: 'Acme Corporation',
    customerId: 'CUST-001',
    priority: 'High',
    teamLead: 'Sarah Wilson',
    teamMembers: ['Rajesh Kumar', 'Lisa Park', 'Mike Johnson'],
    tags: ['frontend', 'design', 'react'],
    tasks: [],
    color: '#28A745',
    lastUpdated: '2025-01-15',
    methodology: 'Agile',
    projectType: 'Web Development'
  },
  {
    id: 'PROJ-002',
    name: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication',
    status: 'Active',
    progress: 60,
    startDate: '2024-11-15',
    endDate: '2025-04-15',
    budget: 200000,
    spent: 120000,
    customer: 'Global Bank Corp',
    customerId: 'CUST-002',
    priority: 'Critical',
    teamLead: 'Alex Chen',
    teamMembers: ['David Wong', 'Emma Rodriguez', 'Tom Anderson'],
    tags: ['mobile', 'security', 'fintech'],
    tasks: [],
    color: '#17A2B8',
    lastUpdated: '2025-01-14',
    methodology: 'Scrum',
    projectType: 'Mobile App'
  },
  {
    id: 'PROJ-003',
    name: 'E-commerce Platform',
    description: 'Full-featured e-commerce solution with inventory management',
    status: 'Active',
    progress: 45,
    startDate: '2024-12-01',
    endDate: '2025-06-30',
    budget: 300000,
    spent: 135000,
    customer: 'Retail Solutions Inc',
    customerId: 'CUST-003',
    priority: 'High',
    teamLead: 'Lisa Park',
    teamMembers: ['Rajesh Kumar', 'Mike Johnson', 'Sarah Wilson', 'Alex Chen'],
    tags: ['e-commerce', 'inventory', 'payments'],
    tasks: [],
    color: '#FFC107',
    lastUpdated: '2025-01-13',
    methodology: 'Hybrid',
    projectType: 'E-commerce'
  },
  // On Hold Projects
  {
    id: 'PROJ-004',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard',
    status: 'On Hold',
    progress: 30,
    startDate: '2024-09-01',
    endDate: '2025-03-31',
    budget: 120000,
    spent: 36000,
    customer: 'Data Insights Ltd',
    customerId: 'CUST-004',
    priority: 'Medium',
    teamLead: 'David Wong',
    teamMembers: ['Emma Rodriguez', 'Tom Anderson'],
    tags: ['analytics', 'dashboard', 'reporting'],
    tasks: [],
    color: '#FD7E14',
    lastUpdated: '2024-12-20',
    methodology: 'Kanban',
    projectType: 'Data Analytics'
  },
  // Completed Projects
  {
    id: 'PROJ-005',
    name: 'CRM System',
    description: 'Customer relationship management system',
    status: 'Completed',
    progress: 100,
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    budget: 180000,
    spent: 175000,
    customer: 'Sales Force Pro',
    customerId: 'CUST-005',
    priority: 'High',
    teamLead: 'Emma Rodriguez',
    teamMembers: ['Tom Anderson', 'Sarah Wilson', 'David Wong'],
    tags: ['crm', 'sales', 'customer-management'],
    tasks: [],
    color: '#28A745',
    lastUpdated: '2024-11-30',
    methodology: 'Waterfall',
    projectType: 'CRM'
  }
];

export const projectStatuses = ['Active', 'On Hold', 'Completed', 'Planning'] as const;
export const projectPriorities = ['Low', 'Medium', 'High', 'Critical'] as const;
export const projectMethodologies = ['Agile', 'Waterfall', 'Scrum', 'Kanban', 'Lean', 'Hybrid'] as const;
export const projectTypes = ['Web Development', 'Mobile App', 'Desktop App', 'API Development', 'Data Analytics', 'E-commerce', 'CRM', 'ERP', 'DevOps', 'Machine Learning', 'Other'] as const;

export const getProjectsByStatus = (status: string) => 
  projects.filter(project => project.status === status);

export const getActiveProjects = () => getProjectsByStatus('Active');
export const getCompletedProjects = () => getProjectsByStatus('Completed');
export const getOnHoldProjects = () => getProjectsByStatus('On Hold');
export const getPlanningProjects = () => getProjectsByStatus('Planning');