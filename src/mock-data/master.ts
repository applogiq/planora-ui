// Master Mock Data for Project Management System
// Centralized location for all mock data used across the application

// ====== CUSTOMERS ======
export const mockCustomers = [
  { id: 'CUST-001', name: 'Internal', type: 'Internal', email: 'internal@planora.com' },
  { id: 'CUST-002', name: 'TechCorp Inc', type: 'Enterprise', email: 'contact@techcorp.com' },
  { id: 'CUST-003', name: 'StartupXYZ', type: 'Startup', email: 'hello@startupxyz.io' },
  { id: 'CUST-004', name: 'MegaSoft Solutions', type: 'Enterprise', email: 'projects@megasoft.com' },
  { id: 'CUST-005', name: 'Acme Corporation', type: 'Enterprise', email: 'contact@acme.com' },
  { id: 'CUST-006', name: 'Global Bank Corp', type: 'Financial', email: 'projects@globalbank.com' },
  { id: 'CUST-007', name: 'Retail Solutions Inc', type: 'Retail', email: 'dev@retailsolutions.com' },
  { id: 'CUST-008', name: 'Data Insights Ltd', type: 'Analytics', email: 'info@datainsights.com' },
  { id: 'CUST-009', name: 'Sales Force Pro', type: 'Enterprise', email: 'support@salesforcepro.com' }
]

// ====== TEAM MEMBERS ======
export const mockTeamMembers = [
  { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'JD', email: 'john@planora.com', department: 'Management' },
  { id: 2, name: 'Jane Smith', role: 'UX Designer', avatar: 'JS', email: 'jane@planora.com', department: 'Design' },
  { id: 3, name: 'Mike Johnson', role: 'Frontend Developer', avatar: 'MJ', email: 'mike@planora.com', department: 'Development' },
  { id: 4, name: 'Sarah Wilson', role: 'Backend Developer', avatar: 'SW', email: 'sarah@planora.com', department: 'Development' },
  { id: 5, name: 'Alex Chen', role: 'QA Engineer', avatar: 'AC', email: 'alex@planora.com', department: 'Quality Assurance' },
  { id: 6, name: 'Lisa Brown', role: 'DevOps Engineer', avatar: 'LB', email: 'lisa@planora.com', department: 'Operations' },
  { id: 7, name: 'Tom Davis', role: 'Technical Writer', avatar: 'TD', email: 'tom@planora.com', department: 'Documentation' },
  { id: 8, name: 'Emma Wilson', role: 'Business Analyst', avatar: 'EW', email: 'emma@planora.com', department: 'Analysis' },
  { id: 9, name: 'Rajesh Kumar', role: 'Full Stack Developer', avatar: 'RK', email: 'rajesh@planora.com', department: 'Development' },
  { id: 10, name: 'Lisa Park', role: 'UI/UX Designer', avatar: 'LP', email: 'lisa.park@planora.com', department: 'Design' },
  { id: 11, name: 'David Wong', role: 'Data Scientist', avatar: 'DW', email: 'david@planora.com', department: 'Analytics' },
  { id: 12, name: 'Emma Rodriguez', role: 'Product Manager', avatar: 'ER', email: 'emma.rodriguez@planora.com', department: 'Product' },
  { id: 13, name: 'Tom Anderson', role: 'Security Engineer', avatar: 'TA', email: 'tom.anderson@planora.com', department: 'Security' }
]

// ====== PROJECT PRIORITIES ======
export const priorities = [
  { value: 'Low', color: 'bg-[#28A745] text-white' },
  { value: 'Medium', color: 'bg-[#FFC107] text-white' },
  { value: 'High', color: 'bg-[#DC3545] text-white' },
  { value: 'Critical', color: 'bg-[#6F42C1] text-white' }
]

// ====== PROJECT STATUSES ======
export const statuses = [
  { value: 'Planning', color: 'bg-gray-500 text-white' },
  { value: 'Active', color: 'bg-[#28A745] text-white' },
  { value: 'On Hold', color: 'bg-[#FFC107] text-white' },
  { value: 'Completed', color: 'bg-[#007BFF] text-white' },
  { value: 'Cancelled', color: 'bg-[#DC3545] text-white' }
]

// ====== PROJECT METHODOLOGIES ======
export const methodologies = [
  'Agile',
  'Waterfall',
  'Scrum',
  'Kanban',
  'Lean',
  'Hybrid'
]

// ====== PROJECT TYPES ======
export const projectTypes = [
  'Web Development',
  'Mobile App',
  'Desktop App',
  'API Development',
  'Data Analytics',
  'E-commerce',
  'CRM',
  'ERP',
  'DevOps',
  'Machine Learning',
  'Other'
]

// ====== DEPARTMENTS ======
export const departments = [
  'Management',
  'Design',
  'Development',
  'Quality Assurance',
  'Operations',
  'Documentation',
  'Analysis',
  'Analytics',
  'Product',
  'Security'
]

// ====== ROLES ======
export const roles = [
  'Project Manager',
  'UX Designer',
  'UI Designer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'QA Engineer',
  'DevOps Engineer',
  'Technical Writer',
  'Business Analyst',
  'Data Scientist',
  'Product Manager',
  'Security Engineer'
]

// ====== TAGS ======
export const commonTags = [
  'frontend',
  'backend',
  'design',
  'react',
  'vue',
  'angular',
  'node.js',
  'python',
  'java',
  'mobile',
  'ios',
  'android',
  'security',
  'fintech',
  'e-commerce',
  'inventory',
  'payments',
  'analytics',
  'dashboard',
  'reporting',
  'crm',
  'sales',
  'customer-management',
  'api',
  'microservices',
  'cloud',
  'aws',
  'azure',
  'docker',
  'kubernetes',
  'ci/cd',
  'testing',
  'automation',
  'machine-learning',
  'ai',
  'data-science',
  'big-data'
]

// ====== HELPER FUNCTIONS ======
export const getTeamMemberById = (id: number) => {
  return mockTeamMembers.find(member => member.id === id)
}

export const getCustomerById = (id: string) => {
  return mockCustomers.find(customer => customer.id === id)
}

export const getTeamMembersByDepartment = (department: string) => {
  return mockTeamMembers.filter(member => member.department === department)
}

export const getTeamMembersByRole = (role: string) => {
  return mockTeamMembers.filter(member => member.role === role)
}

export const getPriorityConfig = (priority: string) => {
  return priorities.find(p => p.value === priority)
}

export const getStatusConfig = (status: string) => {
  return statuses.find(s => s.value === status)
}

// ====== EXPORTS FOR BACKWARD COMPATIBILITY ======
export const editableProjectTypes = Array.from(projectTypes)
export const editableMethodologies = Array.from(methodologies)