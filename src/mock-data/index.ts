// Central Mock Data Export

// Projects
export * from './projects';

// Tasks and Boards
export * from './tasks';

// Customers
export * from './customers';

// Users and Admin
export * from './users';

// Reports and Time Tracking
export * from './reports';

// Project-specific mock data
export * from './methodology';
export * from './activities';
export * from './project-files';
export * from './time-tracking';

// Common data types and utilities
export interface SearchResult {
  id: string;
  title: string;
  type: 'task' | 'project' | 'user' | 'customer';
  description?: string;
  url?: string;
}

export const mockSearchResults: SearchResult[] = [
  {
    id: 'TASK-001',
    title: 'Implement OAuth2 Social Login',
    type: 'task',
    description: 'Add Google, Facebook, and GitHub authentication options',
    url: '/boards/task/TASK-001'
  },
  {
    id: 'PROJ-001',
    title: 'Web App Redesign',
    type: 'project',
    description: 'Complete redesign of the main web application with new UI/UX',
    url: '/projects/PROJ-001'
  },
  {
    id: 'CUST-001',
    title: 'Acme Corporation',
    type: 'customer',
    description: 'Technology company - VP of Engineering: John Smith',
    url: '/customers/CUST-001'
  }
];

// Notification data
export interface Notification {
  id: string;
  type: 'mention' | 'assignment' | 'deadline' | 'comment' | 'milestone' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  fromUser?: string;
  relatedItem?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'NOTIF-001',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Sarah Wilson mentioned you in "Payment Gateway Integration"',
    timestamp: '2025-01-15T10:30:00Z',
    read: false,
    actionUrl: '/boards/task/TASK-012',
    priority: 'high',
    fromUser: 'Sarah Wilson',
    relatedItem: 'TASK-012'
  },
  {
    id: 'NOTIF-002',
    type: 'assignment',
    title: 'New task assigned',
    message: 'You have been assigned to "Database Performance Optimization"',
    timestamp: '2025-01-15T09:15:00Z',
    read: false,
    actionUrl: '/boards/task/TASK-005',
    priority: 'medium',
    fromUser: 'Project Manager',
    relatedItem: 'TASK-005'
  },
  {
    id: 'NOTIF-003',
    type: 'deadline',
    title: 'Upcoming deadline',
    message: 'Security Audit Report is due in 2 days',
    timestamp: '2025-01-15T08:00:00Z',
    read: true,
    actionUrl: '/boards/task/TASK-015',
    priority: 'high',
    relatedItem: 'TASK-015'
  }
];

// Quick create templates
export const quickCreateTemplates = {
  task: {
    priorities: ['Low', 'Medium', 'High', 'Critical'],
    statuses: ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'],
    defaultAssignees: ['Rajesh Kumar', 'Lisa Park', 'Mike Johnson', 'Alex Chen', 'David Wong', 'Sarah Wilson']
  },
  project: {
    types: ['Web Development', 'Mobile App', 'API Development', 'Design System', 'DevOps', 'Data Analytics'],
    priorities: ['Low', 'Medium', 'High', 'Critical'],
    statuses: ['Planning', 'Active', 'On Hold', 'Completed']
  }
};

export default {
  // Re-export everything for convenience
  projects: () => import('./projects'),
  tasks: () => import('./tasks'),
  customers: () => import('./customers'),
  users: () => import('./users'),
  reports: () => import('./reports'),
  methodology: () => import('./methodology'),
  activities: () => import('./activities'),
  projectFiles: () => import('./project-files'),
  timeTracking: () => import('./time-tracking')
};