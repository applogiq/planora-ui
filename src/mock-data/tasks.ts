// Tasks and Boards Mock Data

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  project: string;
  sprint: string;
  labels: string[];
  dueDate: string;
  storyPoints: number;
  comments: number;
  attachments: number;
  createdAt?: string;
  updatedAt?: string;
}

export const BOARD_TASKS: Task[] = [
  // Backlog - 12 tasks
  { id: 'TASK-001', title: 'Implement OAuth2 Social Login', description: 'Add Google, Facebook, and GitHub authentication options', status: 'backlog', priority: 'high', assignee: 'Rajesh Kumar', project: 'E-commerce Platform', sprint: 'Sprint 24', labels: ['backend', 'security'], dueDate: '2025-02-15', storyPoints: 8, comments: 3, attachments: 2 },
  { id: 'TASK-002', title: 'Design Product Comparison Feature', description: 'Create UI for comparing multiple products side by side', status: 'backlog', priority: 'medium', assignee: 'Lisa Park', project: 'E-commerce Platform', sprint: 'Sprint 24', labels: ['frontend', 'design'], dueDate: '2025-02-20', storyPoints: 5, comments: 1, attachments: 0 },
  { id: 'TASK-003', title: 'Setup CI/CD Pipeline', description: 'Configure automated deployment pipeline with Docker', status: 'backlog', priority: 'high', assignee: 'Mike Johnson', project: 'DevOps Infrastructure', sprint: 'Sprint 25', labels: ['devops', 'automation'], dueDate: '2025-02-10', storyPoints: 13, comments: 0, attachments: 1 },
  { id: 'TASK-004', title: 'Mobile App Push Notifications', description: 'Implement push notification system for mobile users', status: 'backlog', priority: 'medium', assignee: 'Alex Chen', project: 'Mobile Banking App', sprint: 'Sprint 24', labels: ['mobile', 'notifications'], dueDate: '2025-02-25', storyPoints: 8, comments: 2, attachments: 0 },
  { id: 'TASK-005', title: 'Database Performance Optimization', description: 'Optimize slow queries and add proper indexing', status: 'backlog', priority: 'high', assignee: 'David Wong', project: 'CRM System', sprint: 'Sprint 25', labels: ['database', 'performance'], dueDate: '2025-02-12', storyPoints: 8, comments: 1, attachments: 3 },
  { id: 'TASK-006', title: 'User Onboarding Flow', description: 'Create step-by-step onboarding for new users', status: 'backlog', priority: 'medium', assignee: 'Sarah Wilson', project: 'Analytics Dashboard', sprint: 'Sprint 24', labels: ['frontend', 'ux'], dueDate: '2025-02-18', storyPoints: 5, comments: 0, attachments: 1 },
  { id: 'TASK-007', title: 'API Rate Limiting', description: 'Implement rate limiting for all public APIs', status: 'backlog', priority: 'high', assignee: 'Rajesh Kumar', project: 'API Gateway', sprint: 'Sprint 25', labels: ['backend', 'security'], dueDate: '2025-02-14', storyPoints: 5, comments: 2, attachments: 0 },
  { id: 'TASK-008', title: 'Real-time Chat System', description: 'Build WebSocket-based chat for customer support', status: 'backlog', priority: 'low', assignee: 'Lisa Park', project: 'Customer Portal', sprint: 'Sprint 26', labels: ['frontend', 'websocket'], dueDate: '2025-03-01', storyPoints: 13, comments: 1, attachments: 0 },
  { id: 'TASK-009', title: 'Email Template System', description: 'Create customizable email templates for notifications', status: 'backlog', priority: 'medium', assignee: 'Mike Johnson', project: 'Marketing Platform', sprint: 'Sprint 25', labels: ['backend', 'email'], dueDate: '2025-02-22', storyPoints: 5, comments: 0, attachments: 2 },
  { id: 'TASK-010', title: 'Advanced Search Filters', description: 'Add complex filtering options to search functionality', status: 'backlog', priority: 'medium', assignee: 'Alex Chen', project: 'E-commerce Platform', sprint: 'Sprint 24', labels: ['frontend', 'search'], dueDate: '2025-02-28', storyPoints: 8, comments: 3, attachments: 1 },
  { id: 'TASK-011', title: 'Multi-language Support', description: 'Implement i18n for Spanish and French', status: 'backlog', priority: 'low', assignee: 'David Wong', project: 'E-commerce Platform', sprint: 'Sprint 26', labels: ['frontend', 'i18n'], dueDate: '2025-03-05', storyPoints: 8, comments: 0, attachments: 0 },
  { id: 'TASK-012', title: 'Payment Gateway Integration', description: 'Integrate Stripe and PayPal payment methods', status: 'backlog', priority: 'high', assignee: 'Sarah Wilson', project: 'E-commerce Platform', sprint: 'Sprint 24', labels: ['backend', 'payments'], dueDate: '2025-02-16', storyPoints: 13, comments: 4, attachments: 3 },

  // Todo - 10 tasks
  { id: 'TASK-013', title: 'User Profile Dashboard', description: 'Create comprehensive user profile management page', status: 'todo', priority: 'high', assignee: 'Rajesh Kumar', project: 'User Management', sprint: 'Sprint 23', labels: ['frontend', 'profile'], dueDate: '2025-01-30', storyPoints: 8, comments: 2, attachments: 1 },
  { id: 'TASK-014', title: 'Inventory Management System', description: 'Build stock tracking and management features', status: 'todo', priority: 'high', assignee: 'Lisa Park', project: 'E-commerce Platform', sprint: 'Sprint 23', labels: ['backend', 'inventory'], dueDate: '2025-01-28', storyPoints: 13, comments: 1, attachments: 2 },
  { id: 'TASK-015', title: 'Security Audit Report', description: 'Comprehensive security review and documentation', status: 'todo', priority: 'critical', assignee: 'Mike Johnson', project: 'Security Assessment', sprint: 'Sprint 23', labels: ['security', 'audit'], dueDate: '2025-01-25', storyPoints: 8, comments: 0, attachments: 0 },
  { id: 'TASK-016', title: 'Mobile Responsive Design', description: 'Optimize all pages for mobile devices', status: 'todo', priority: 'medium', assignee: 'Alex Chen', project: 'Frontend Optimization', sprint: 'Sprint 23', labels: ['frontend', 'mobile'], dueDate: '2025-02-01', storyPoints: 8, comments: 3, attachments: 1 },
  { id: 'TASK-017', title: 'Data Export Functionality', description: 'Allow users to export data in various formats', status: 'todo', priority: 'medium', assignee: 'David Wong', project: 'Analytics Dashboard', sprint: 'Sprint 23', labels: ['backend', 'export'], dueDate: '2025-02-03', storyPoints: 5, comments: 1, attachments: 0 },
  { id: 'TASK-018', title: 'Error Logging System', description: 'Implement comprehensive error tracking and alerts', status: 'todo', priority: 'high', assignee: 'Sarah Wilson', project: 'Monitoring Tools', sprint: 'Sprint 23', labels: ['backend', 'monitoring'], dueDate: '2025-01-29', storyPoints: 8, comments: 2, attachments: 1 },
  { id: 'TASK-019', title: 'Social Media Integration', description: 'Connect with Facebook, Twitter, Instagram APIs', status: 'todo', priority: 'low', assignee: 'Rajesh Kumar', project: 'Marketing Platform', sprint: 'Sprint 24', labels: ['backend', 'social'], dueDate: '2025-02-08', storyPoints: 8, comments: 0, attachments: 0 },
  { id: 'TASK-020', title: 'File Upload Optimization', description: 'Improve file upload speed and add progress bars', status: 'todo', priority: 'medium', assignee: 'Lisa Park', project: 'File Management', sprint: 'Sprint 23', labels: ['frontend', 'files'], dueDate: '2025-02-02', storyPoints: 5, comments: 1, attachments: 2 },
  { id: 'TASK-021', title: 'Automated Backup System', description: 'Setup automated daily backups with rotation', status: 'todo', priority: 'high', assignee: 'Mike Johnson', project: 'DevOps Infrastructure', sprint: 'Sprint 23', labels: ['devops', 'backup'], dueDate: '2025-01-31', storyPoints: 8, comments: 0, attachments: 1 },
  { id: 'TASK-022', title: 'Customer Feedback Portal', description: 'Build portal for collecting and managing feedback', status: 'todo', priority: 'medium', assignee: 'Alex Chen', project: 'Customer Portal', sprint: 'Sprint 24', labels: ['frontend', 'feedback'], dueDate: '2025-02-05', storyPoints: 8, comments: 2, attachments: 0 },

  // In Progress - 8 tasks  
  { id: 'TASK-023', title: 'JWT Token Management', description: 'Implement secure JWT refresh token mechanism', status: 'in-progress', priority: 'critical', assignee: 'David Wong', project: 'Authentication Service', sprint: 'Sprint 23', labels: ['backend', 'security'], dueDate: '2025-01-27', storyPoints: 5, comments: 5, attachments: 1 },
  { id: 'TASK-024', title: 'Shopping Cart Persistence', description: 'Maintain cart state across browser sessions', status: 'in-progress', priority: 'high', assignee: 'Sarah Wilson', project: 'E-commerce Platform', sprint: 'Sprint 23', labels: ['frontend', 'persistence'], dueDate: '2025-01-29', storyPoints: 5, comments: 3, attachments: 0 },
  { id: 'TASK-025', title: 'Docker Containerization', description: 'Containerize all microservices with Docker', status: 'in-progress', priority: 'high', assignee: 'Rajesh Kumar', project: 'DevOps Infrastructure', sprint: 'Sprint 23', labels: ['devops', 'docker'], dueDate: '2025-01-26', storyPoints: 8, comments: 2, attachments: 3 },
  { id: 'TASK-026', title: 'Biometric Authentication', description: 'Add fingerprint and face recognition login', status: 'in-progress', priority: 'high', assignee: 'Lisa Park', project: 'Mobile Banking App', sprint: 'Sprint 23', labels: ['mobile', 'security'], dueDate: '2025-01-30', storyPoints: 13, comments: 4, attachments: 2 },
  { id: 'TASK-027', title: 'Revenue Analytics', description: 'Build comprehensive revenue tracking dashboard', status: 'in-progress', priority: 'medium', assignee: 'Mike Johnson', project: 'Analytics Dashboard', sprint: 'Sprint 23', labels: ['analytics', 'revenue'], dueDate: '2025-02-01', storyPoints: 8, comments: 1, attachments: 1 },
  { id: 'TASK-028', title: 'Video Call Integration', description: 'Integrate WebRTC for video calls in support', status: 'in-progress', priority: 'medium', assignee: 'Alex Chen', project: 'Customer Portal', sprint: 'Sprint 23', labels: ['frontend', 'webrtc'], dueDate: '2025-02-02', storyPoints: 13, comments: 6, attachments: 0 },
  { id: 'TASK-029', title: 'Automated Testing Suite', description: 'Setup comprehensive test automation framework', status: 'in-progress', priority: 'high', assignee: 'Emma Rodriguez', project: 'Quality Assurance', sprint: 'Sprint 23', labels: ['testing', 'automation'], dueDate: '2025-01-28', storyPoints: 8, comments: 2, attachments: 1 },
  { id: 'TASK-030', title: 'Load Balancer Configuration', description: 'Setup nginx load balancer with health checks', status: 'in-progress', priority: 'high', assignee: 'Tom Anderson', project: 'Infrastructure', sprint: 'Sprint 23', labels: ['infrastructure', 'nginx'], dueDate: '2025-01-29', storyPoints: 5, comments: 1, attachments: 2 }
];

export const PROJECTS = [
  { id: 'PROJ-001', name: 'E-commerce Platform', color: '#28A745' },
  { id: 'PROJ-002', name: 'Mobile Banking App', color: '#17A2B8' },
  { id: 'PROJ-003', name: 'Analytics Dashboard', color: '#FFC107' },
  { id: 'PROJ-004', name: 'Customer Portal', color: '#DC3545' },
  { id: 'PROJ-005', name: 'DevOps Infrastructure', color: '#6610F2' },
  { id: 'PROJ-006', name: 'Marketing Platform', color: '#E83E8C' },
  { id: 'PROJ-007', name: 'API Gateway', color: '#20C997' },
  { id: 'PROJ-008', name: 'CRM System', color: '#FD7E14' },
];

export const SPRINTS = [
  { id: 'SPRINT-23', name: 'Sprint 23', status: 'active', startDate: '2025-01-13', endDate: '2025-01-26' },
  { id: 'SPRINT-24', name: 'Sprint 24', status: 'planning', startDate: '2025-01-27', endDate: '2025-02-09' },
  { id: 'SPRINT-25', name: 'Sprint 25', status: 'future', startDate: '2025-02-10', endDate: '2025-02-23' },
  { id: 'SPRINT-26', name: 'Sprint 26', status: 'future', startDate: '2025-02-24', endDate: '2025-03-09' },
];

export const TEAM_MEMBERS = [
  { id: 'TM-001', name: 'Rajesh Kumar', role: 'Senior Developer', avatar: 'RK', email: 'rajesh@example.com' },
  { id: 'TM-002', name: 'Lisa Park', role: 'UI/UX Designer', avatar: 'LP', email: 'lisa@example.com' },
  { id: 'TM-003', name: 'Mike Johnson', role: 'DevOps Engineer', avatar: 'MJ', email: 'mike@example.com' },
  { id: 'TM-004', name: 'Alex Chen', role: 'Frontend Developer', avatar: 'AC', email: 'alex@example.com' },
  { id: 'TM-005', name: 'David Wong', role: 'Backend Developer', avatar: 'DW', email: 'david@example.com' },
  { id: 'TM-006', name: 'Sarah Wilson', role: 'Full Stack Developer', avatar: 'SW', email: 'sarah@example.com' },
  { id: 'TM-007', name: 'Emma Rodriguez', role: 'QA Engineer', avatar: 'ER', email: 'emma@example.com' },
  { id: 'TM-008', name: 'Tom Anderson', role: 'System Administrator', avatar: 'TA', email: 'tom@example.com' },
];

export const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export const STATUSES = ['backlog', 'todo', 'in-progress', 'review', 'done'] as const;

// Utility functions
export const getTasksByStatus = (status: string) => BOARD_TASKS.filter(task => task.status === status);
export const getTasksByProject = (projectName: string) => BOARD_TASKS.filter(task => task.project === projectName);
export const getTasksByAssignee = (assignee: string) => BOARD_TASKS.filter(task => task.assignee === assignee);