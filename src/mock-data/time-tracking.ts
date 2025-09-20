// Time Tracking Mock Data

export interface TimeEntry {
  id: string
  taskId?: string
  taskTitle?: string
  projectId: string
  projectName: string
  userId: string
  userName: string
  description: string
  startTime: string
  endTime?: string
  duration: number // in minutes
  date: string
  category: 'development' | 'design' | 'testing' | 'meeting' | 'research' | 'documentation' | 'review' | 'planning' | 'other'
  tags?: string[]
  billable: boolean
  approved: boolean
  approvedBy?: string
  approvedAt?: string
  rate?: number // hourly rate
  status: 'active' | 'stopped' | 'submitted' | 'approved' | 'rejected'
  screenshots?: string[]
  notes?: string
}

export interface TimeTrackingSummary {
  totalHours: number
  billableHours: number
  nonBillableHours: number
  todayHours: number
  weekHours: number
  monthHours: number
  targetHours: number
  efficiency: number
  topCategories: { category: string; hours: number; percentage: number }[]
  dailyBreakdown: { date: string; hours: number }[]
}

export const mockTimeEntries: TimeEntry[] = [
  // Today's entries
  {
    id: 'time-001',
    taskId: 'TASK-123',
    taskTitle: 'User Authentication API',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    userId: 'user-001',
    userName: 'Sarah Wilson',
    description: 'Implementing OAuth2 integration with Google and GitHub',
    startTime: '2024-01-15T09:00:00Z',
    endTime: '2024-01-15T11:30:00Z',
    duration: 150, // 2.5 hours
    date: '2024-01-15',
    category: 'development',
    tags: ['oauth', 'authentication', 'backend'],
    billable: true,
    approved: true,
    approvedBy: 'Project Manager',
    approvedAt: '2024-01-15T17:00:00Z',
    rate: 85,
    status: 'approved',
    notes: 'Successfully integrated OAuth providers, testing pending'
  },
  {
    id: 'time-002',
    taskId: 'TASK-124',
    taskTitle: 'Dashboard UI Components',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    userId: 'user-002',
    userName: 'Mike Johnson',
    description: 'Creating responsive dashboard components',
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T12:00:00Z',
    duration: 120, // 2 hours
    date: '2024-01-15',
    category: 'development',
    tags: ['react', 'ui', 'responsive'],
    billable: true,
    approved: false,
    rate: 75,
    status: 'submitted',
    notes: 'Completed main dashboard layout and navigation'
  },
  {
    id: 'time-003',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    userId: 'user-003',
    userName: 'Alex Chen',
    description: 'Daily standup meeting and sprint planning',
    startTime: '2024-01-15T09:00:00Z',
    endTime: '2024-01-15T10:00:00Z',
    duration: 60, // 1 hour
    date: '2024-01-15',
    category: 'meeting',
    tags: ['standup', 'planning', 'agile'],
    billable: false,
    approved: true,
    approvedBy: 'Scrum Master',
    rate: 0,
    status: 'approved'
  },
  {
    id: 'time-004',
    taskId: 'TASK-125',
    taskTitle: 'Payment Gateway Integration',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    userId: 'user-001',
    userName: 'Sarah Wilson',
    description: 'Testing payment flows and error handling',
    startTime: '2024-01-15T14:00:00Z',
    endTime: '2024-01-15T16:30:00Z',
    duration: 150, // 2.5 hours
    date: '2024-01-15',
    category: 'testing',
    tags: ['payment', 'testing', 'integration'],
    billable: true,
    approved: false,
    rate: 85,
    status: 'submitted',
    notes: 'Tested various payment scenarios, found minor issues'
  },

  // Yesterday's entries
  {
    id: 'time-005',
    taskId: 'TASK-122',
    taskTitle: 'Database Performance Optimization',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    userId: 'user-004',
    userName: 'Lisa Park',
    description: 'Optimizing database queries and indexes',
    startTime: '2024-01-14T09:30:00Z',
    endTime: '2024-01-14T17:00:00Z',
    duration: 450, // 7.5 hours
    date: '2024-01-14',
    category: 'development',
    tags: ['database', 'optimization', 'performance'],
    billable: true,
    approved: true,
    approvedBy: 'Technical Lead',
    approvedAt: '2024-01-14T18:00:00Z',
    rate: 90,
    status: 'approved',
    notes: 'Improved query performance by 40%, added proper indexes'
  },
  {
    id: 'time-006',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    userId: 'user-005',
    userName: 'David Wong',
    description: 'Code review and documentation update',
    startTime: '2024-01-14T11:00:00Z',
    endTime: '2024-01-14T13:00:00Z',
    duration: 120, // 2 hours
    date: '2024-01-14',
    category: 'review',
    tags: ['code-review', 'documentation'],
    billable: true,
    approved: true,
    rate: 70,
    status: 'approved'
  },

  // This week's entries
  {
    id: 'time-007',
    taskId: 'TASK-126',
    taskTitle: 'Mobile Responsive Design',
    projectId: 'PROJ-002',
    projectName: 'CRM Dashboard',
    userId: 'user-006',
    userName: 'Emma Thompson',
    description: 'Designing mobile-first responsive layouts',
    startTime: '2024-01-13T10:00:00Z',
    endTime: '2024-01-13T15:00:00Z',
    duration: 300, // 5 hours
    date: '2024-01-13',
    category: 'design',
    tags: ['mobile', 'responsive', 'ui-design'],
    billable: true,
    approved: true,
    rate: 80,
    status: 'approved'
  },
  {
    id: 'time-008',
    taskId: 'TASK-127',
    taskTitle: 'API Documentation',
    projectId: 'PROJ-002',
    projectName: 'CRM Dashboard',
    userId: 'user-007',
    userName: 'Rajesh Kumar',
    description: 'Writing comprehensive API documentation',
    startTime: '2024-01-12T09:00:00Z',
    endTime: '2024-01-12T17:00:00Z',
    duration: 480, // 8 hours
    date: '2024-01-12',
    category: 'documentation',
    tags: ['api', 'documentation', 'swagger'],
    billable: true,
    approved: true,
    rate: 75,
    status: 'approved'
  },
  {
    id: 'time-009',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    userId: 'user-008',
    userName: 'Jennifer Adams',
    description: 'Research on payment gateway alternatives',
    startTime: '2024-01-11T14:00:00Z',
    endTime: '2024-01-11T17:00:00Z',
    duration: 180, // 3 hours
    date: '2024-01-11',
    category: 'research',
    tags: ['research', 'payment-gateways', 'analysis'],
    billable: false,
    approved: true,
    rate: 0,
    status: 'approved'
  },
  {
    id: 'time-010',
    taskId: 'TASK-128',
    taskTitle: 'Unit Testing Implementation',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    userId: 'user-002',
    userName: 'Mike Johnson',
    description: 'Writing unit tests for authentication module',
    startTime: '2024-01-10T13:00:00Z',
    endTime: '2024-01-10T18:00:00Z',
    duration: 300, // 5 hours
    date: '2024-01-10',
    category: 'testing',
    tags: ['unit-testing', 'jest', 'authentication'],
    billable: true,
    approved: true,
    rate: 75,
    status: 'approved'
  }
]

export const mockTimeTrackingSummary: TimeTrackingSummary = {
  totalHours: 42.5,
  billableHours: 35.0,
  nonBillableHours: 7.5,
  todayHours: 6.0,
  weekHours: 42.5,
  monthHours: 168.0,
  targetHours: 40.0,
  efficiency: 85.2,
  topCategories: [
    { category: 'development', hours: 18.5, percentage: 43.5 },
    { category: 'testing', hours: 7.5, percentage: 17.6 },
    { category: 'design', hours: 5.0, percentage: 11.8 },
    { category: 'documentation', hours: 4.0, percentage: 9.4 },
    { category: 'meeting', hours: 3.5, percentage: 8.2 },
    { category: 'review', hours: 2.0, percentage: 4.7 },
    { category: 'research', hours: 2.0, percentage: 4.7 }
  ],
  dailyBreakdown: [
    { date: '2024-01-15', hours: 6.0 },
    { date: '2024-01-14', hours: 9.5 },
    { date: '2024-01-13', hours: 5.0 },
    { date: '2024-01-12', hours: 8.0 },
    { date: '2024-01-11', hours: 3.0 },
    { date: '2024-01-10', hours: 5.0 },
    { date: '2024-01-09', hours: 6.0 }
  ]
}

// Time tracking categories
export const timeCategories = [
  { value: 'development', label: 'Development', color: 'bg-blue-500', icon: 'Code' },
  { value: 'design', label: 'Design', color: 'bg-purple-500', icon: 'Palette' },
  { value: 'testing', label: 'Testing', color: 'bg-green-500', icon: 'CheckCircle' },
  { value: 'meeting', label: 'Meeting', color: 'bg-orange-500', icon: 'Users' },
  { value: 'research', label: 'Research', color: 'bg-indigo-500', icon: 'Search' },
  { value: 'documentation', label: 'Documentation', color: 'bg-gray-500', icon: 'FileText' },
  { value: 'review', label: 'Review', color: 'bg-yellow-500', icon: 'Eye' },
  { value: 'planning', label: 'Planning', color: 'bg-pink-500', icon: 'Calendar' },
  { value: 'other', label: 'Other', color: 'bg-gray-400', icon: 'MoreHorizontal' }
]

// Time tracking status options
export const timeStatusOptions = [
  { value: 'active', label: 'Active', color: 'text-green-600 bg-green-50' },
  { value: 'stopped', label: 'Stopped', color: 'text-gray-600 bg-gray-50' },
  { value: 'submitted', label: 'Submitted', color: 'text-blue-600 bg-blue-50' },
  { value: 'approved', label: 'Approved', color: 'text-emerald-600 bg-emerald-50' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-600 bg-red-50' }
]

// Recent time tracking activities
export const recentTimeActivities = [
  {
    id: 1,
    user: 'Sarah Wilson',
    action: 'logged 2.5 hours',
    project: 'E-commerce Platform',
    task: 'User Authentication API',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    user: 'Mike Johnson',
    action: 'submitted timesheet',
    project: 'E-commerce Platform',
    timestamp: '4 hours ago'
  },
  {
    id: 3,
    user: 'Project Manager',
    action: 'approved 40 hours',
    project: 'CRM Dashboard',
    timestamp: '1 day ago'
  },
  {
    id: 4,
    user: 'Lisa Park',
    action: 'started timer',
    project: 'E-commerce Platform',
    task: 'Database Optimization',
    timestamp: '2 days ago'
  }
]

// Time tracking settings
export const timeTrackingSettings = {
  defaultCategory: 'development',
  autoStopAfterInactivity: 60, // minutes
  requireTaskSelection: true,
  allowManualEntry: true,
  requireApproval: true,
  screenshotInterval: 10, // minutes
  reminderInterval: 30, // minutes
  weeklyTargetHours: 40,
  overtimeThreshold: 8, // daily hours
  roundingInterval: 15 // minutes
}

// Project time allocation
export const projectTimeAllocation = [
  { projectId: 'PROJ-001', projectName: 'E-commerce Platform', hours: 28.5, percentage: 67.1 },
  { projectId: 'PROJ-002', projectName: 'CRM Dashboard', hours: 9.0, percentage: 21.2 },
  { projectId: 'PROJ-003', projectName: 'Mobile App', hours: 3.0, percentage: 7.1 },
  { projectId: 'PROJ-004', projectName: 'Analytics Dashboard', hours: 2.0, percentage: 4.7 }
]

export default {
  entries: mockTimeEntries,
  summary: mockTimeTrackingSummary,
  categories: timeCategories,
  statusOptions: timeStatusOptions,
  recentActivities: recentTimeActivities,
  settings: timeTrackingSettings,
  projectAllocation: projectTimeAllocation
}