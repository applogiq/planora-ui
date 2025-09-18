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

export const projectStatuses = ['Active', 'On Hold', 'Completed', 'Planning'] as const;
export const projectPriorities = ['Low', 'Medium', 'High', 'Critical'] as const;
export const projectMethodologies = ['Agile', 'Waterfall', 'Scrum', 'Kanban', 'Lean', 'Hybrid'] as const;
export const projectTypes = ['Web Development', 'Mobile App', 'Desktop App', 'API Development', 'Data Analytics', 'E-commerce', 'CRM', 'ERP', 'DevOps', 'Machine Learning', 'Other'] as const;
