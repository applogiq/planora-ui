// Time Tracking Mock Data

export interface TimeEntry {
  id: string
  taskId?: string
  taskTitle?: string
  projectId: string
  userId: string
  userName: string
  description: string
  category: string
  date: string
  startTime: string
  endTime: string
  duration: number // in minutes
  billable: boolean
  approved: boolean
  approvedBy?: string
  approvedAt?: string
  createdAt: string
}

export interface TimeTrackingSummary {
  todayTotal: number
  weekTotal: number
  monthTotal: number
  billableHours: number
  nonBillableHours: number
  averageDaily: number
  totalTasks: number
  activeTask?: string
}

export const timeCategories = [
  'development',
  'testing',
  'design',
  'meeting',
  'documentation',
  'planning',
  'research',
  'bug-fixing',
  'deployment',
  'other'
]

export const mockTimeEntries: TimeEntry[] = [
  // Today's entries
  {
    id: 'time-001',
    taskId: 'TASK-123',
    taskTitle: 'User Authentication API',
    projectId: 'PROJ-001',
    userId: 'user-001',
    userName: 'Sarah Wilson',
    description: 'Implemented OAuth2 integration with Google and GitHub',
    category: 'development',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '12:00',
    duration: 180,
    billable: true,
    approved: true,
    approvedBy: 'Mike Johnson',
    approvedAt: '2024-01-15T13:00:00Z',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'time-002',
    taskId: 'TASK-124',
    taskTitle: 'Payment Integration',
    projectId: 'PROJ-001',
    userId: 'user-003',
    userName: 'Alex Chen',
    description: 'Stripe payment processing implementation',
    category: 'development',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    billable: true,
    approved: false,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'time-003',
    projectId: 'PROJ-001',
    userId: 'user-005',
    userName: 'David Wong',
    description: 'Sprint planning meeting',
    category: 'meeting',
    date: '2024-01-15',
    startTime: '14:00',
    endTime: '16:00',
    duration: 120,
    billable: false,
    approved: true,
    approvedBy: 'Scrum Master',
    approvedAt: '2024-01-15T16:30:00Z',
    createdAt: '2024-01-15T14:00:00Z'
  },
  {
    id: 'time-004',
    taskId: 'TASK-125',
    taskTitle: 'Database Schema Design',
    projectId: 'PROJ-001',
    userId: 'user-003',
    userName: 'Alex Chen',
    description: 'Designed user tables and relationships',
    category: 'design',
    date: '2024-01-15',
    startTime: '13:00',
    endTime: '15:30',
    duration: 150,
    billable: true,
    approved: true,
    approvedBy: 'Tech Lead',
    approvedAt: '2024-01-15T16:00:00Z',
    createdAt: '2024-01-15T13:00:00Z'
  },

  // Yesterday's entries
  {
    id: 'time-005',
    taskId: 'TASK-126',
    taskTitle: 'Mobile Responsive Design',
    projectId: 'PROJ-001',
    userId: 'user-006',
    userName: 'Emma Rodriguez',
    description: 'CSS media queries and responsive layouts',
    category: 'design',
    date: '2024-01-14',
    startTime: '09:30',
    endTime: '17:00',
    duration: 450,
    billable: true,
    approved: true,
    approvedBy: 'Project Manager',
    approvedAt: '2024-01-14T17:30:00Z',
    createdAt: '2024-01-14T09:30:00Z'
  },
  {
    id: 'time-006',
    taskId: 'TASK-127',
    taskTitle: 'User Registration Validation',
    projectId: 'PROJ-001',
    userId: 'user-003',
    userName: 'Alex Chen',
    description: 'Input validation and error handling',
    category: 'development',
    date: '2024-01-14',
    startTime: '11:00',
    endTime: '15:30',
    duration: 270,
    billable: true,
    approved: true,
    approvedBy: 'Tech Lead',
    approvedAt: '2024-01-14T16:00:00Z',
    createdAt: '2024-01-14T11:00:00Z'
  },
  {
    id: 'time-007',
    projectId: 'PROJ-001',
    userId: 'user-002',
    userName: 'Mike Johnson',
    description: 'Code review session',
    category: 'other',
    date: '2024-01-14',
    startTime: '16:00',
    endTime: '17:30',
    duration: 90,
    billable: false,
    approved: true,
    approvedBy: 'Self',
    approvedAt: '2024-01-14T17:30:00Z',
    createdAt: '2024-01-14T16:00:00Z'
  },

  // This week's entries
  {
    id: 'time-008',
    taskId: 'TASK-128',
    taskTitle: 'Bug: Login validation issue',
    projectId: 'PROJ-001',
    userId: 'user-008',
    userName: 'Jennifer Adams',
    description: 'Fixed social login validation errors',
    category: 'bug-fixing',
    date: '2024-01-13',
    startTime: '10:00',
    endTime: '13:00',
    duration: 180,
    billable: true,
    approved: true,
    approvedBy: 'Tech Lead',
    approvedAt: '2024-01-13T14:00:00Z',
    createdAt: '2024-01-13T10:00:00Z'
  },
  {
    id: 'time-009',
    taskId: 'TASK-129',
    taskTitle: 'Email Template System',
    projectId: 'PROJ-001',
    userId: 'user-002',
    userName: 'Mike Johnson',
    description: 'Customizable email templates for notifications',
    category: 'development',
    date: '2024-01-12',
    startTime: '09:00',
    endTime: '16:00',
    duration: 420,
    billable: true,
    approved: true,
    approvedBy: 'Product Owner',
    approvedAt: '2024-01-12T16:30:00Z',
    createdAt: '2024-01-12T09:00:00Z'
  },
  {
    id: 'time-010',
    projectId: 'PROJ-001',
    userId: 'user-005',
    userName: 'David Wong',
    description: 'Daily standup meetings',
    category: 'meeting',
    date: '2024-01-12',
    startTime: '09:00',
    endTime: '09:15',
    duration: 15,
    billable: false,
    approved: true,
    approvedBy: 'Scrum Master',
    approvedAt: '2024-01-12T09:30:00Z',
    createdAt: '2024-01-12T09:00:00Z'
  },
  {
    id: 'time-011',
    taskId: 'TASK-130',
    taskTitle: 'API Rate Limiting',
    projectId: 'PROJ-001',
    userId: 'user-001',
    userName: 'Sarah Wilson',
    description: 'Implemented rate limiting middleware',
    category: 'development',
    date: '2024-01-11',
    startTime: '13:00',
    endTime: '17:30',
    duration: 270,
    billable: true,
    approved: true,
    approvedBy: 'Tech Lead',
    approvedAt: '2024-01-11T18:00:00Z',
    createdAt: '2024-01-11T13:00:00Z'
  },
  {
    id: 'time-012',
    projectId: 'PROJ-001',
    userId: 'user-004',
    userName: 'Lisa Park',
    description: 'Performance testing and optimization',
    category: 'testing',
    date: '2024-01-10',
    startTime: '14:00',
    endTime: '18:00',
    duration: 240,
    billable: true,
    approved: true,
    approvedBy: 'QA Lead',
    approvedAt: '2024-01-10T18:30:00Z',
    createdAt: '2024-01-10T14:00:00Z'
  },
  {
    id: 'time-013',
    taskId: 'TASK-131',
    taskTitle: 'Dark mode support',
    projectId: 'PROJ-001',
    userId: 'user-004',
    userName: 'Lisa Park',
    description: 'CSS variables and theme switching',
    category: 'design',
    date: '2024-01-09',
    startTime: '10:00',
    endTime: '15:00',
    duration: 300,
    billable: true,
    approved: true,
    approvedBy: 'Design Lead',
    approvedAt: '2024-01-09T15:30:00Z',
    createdAt: '2024-01-09T10:00:00Z'
  },
  {
    id: 'time-014',
    projectId: 'PROJ-001',
    userId: 'user-007',
    userName: 'Tom Anderson',
    description: 'Documentation updates',
    category: 'documentation',
    date: '2024-01-08',
    startTime: '11:00',
    endTime: '13:00',
    duration: 120,
    billable: false,
    approved: true,
    approvedBy: 'Tech Writer',
    approvedAt: '2024-01-08T13:30:00Z',
    createdAt: '2024-01-08T11:00:00Z'
  },
  {
    id: 'time-015',
    taskId: 'TASK-132',
    taskTitle: 'User Profile Management',
    projectId: 'PROJ-001',
    userId: 'user-001',
    userName: 'Sarah Wilson',
    description: 'CRUD operations with validation',
    category: 'development',
    date: '2024-01-07',
    startTime: '09:00',
    endTime: '17:00',
    duration: 480,
    billable: true,
    approved: true,
    approvedBy: 'Tech Lead',
    approvedAt: '2024-01-07T17:30:00Z',
    createdAt: '2024-01-07T09:00:00Z'
  }
]

export const mockTimeTrackingSummary: TimeTrackingSummary = {
  todayTotal: 540, // 9 hours
  weekTotal: 2400, // 40 hours
  monthTotal: 9600, // 160 hours
  billableHours: 7680, // 128 hours
  nonBillableHours: 1920, // 32 hours
  averageDaily: 480, // 8 hours
  totalTasks: 12,
  activeTask: 'TASK-123'
}

export default { mockTimeEntries, mockTimeTrackingSummary, timeCategories }