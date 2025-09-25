// Activities Mock Data

export interface Activity {
  id: string
  type: 'task_created' | 'task_updated' | 'task_completed' | 'comment' | 'file_upload' | 'sprint_start' | 'sprint_end' | 'meeting' | 'commit' | 'deployment' | 'time_logged'
  title: string
  description: string
  user: string
  userId: string
  timestamp: string
  taskId?: string
  projectId: string
  tags?: string[]
  metadata?: Record<string, any>
}

export const mockActivities: Activity[] = [
  // Today's activities
  {
    id: 'act-001',
    type: 'task_created',
    title: 'New task created: User Authentication API',
    description: 'Created a new user story for implementing OAuth2 authentication with social providers',
    user: 'Sarah Wilson',
    userId: 'user-001',
    timestamp: '2024-01-15T14:30:00Z',
    taskId: 'TASK-123',
    projectId: 'PROJ-001',
    tags: ['authentication', 'oauth', 'backend']
  },
  {
    id: 'act-002',
    type: 'comment',
    title: 'Commented on Payment Integration',
    description: 'We should consider adding support for Apple Pay and Google Pay in addition to Stripe. This would improve conversion rates for mobile users.',
    user: 'Mike Johnson',
    userId: 'user-002',
    timestamp: '2024-01-15T13:45:00Z',
    taskId: 'TASK-124',
    projectId: 'PROJ-001',
    tags: ['payment', 'mobile', 'ux']
  },
  {
    id: 'act-003',
    type: 'task_completed',
    title: 'Completed: Database Schema Design',
    description: 'Finished designing the complete database schema including user tables, authentication, and audit logs',
    user: 'Alex Chen',
    userId: 'user-003',
    timestamp: '2024-01-15T12:20:00Z',
    taskId: 'TASK-125',
    projectId: 'PROJ-001',
    tags: ['database', 'schema', 'backend']
  },
  {
    id: 'act-004',
    type: 'file_upload',
    title: 'Uploaded design mockups',
    description: 'Added high-fidelity mockups for the user dashboard and profile pages',
    user: 'Lisa Park',
    userId: 'user-004',
    timestamp: '2024-01-15T11:15:00Z',
    projectId: 'PROJ-001',
    tags: ['design', 'mockups', 'ui']
  },
  {
    id: 'act-005',
    type: 'sprint_start',
    title: 'Sprint 23 started',
    description: 'Started Sprint 23 with 8 user stories and a target of 45 story points',
    user: 'David Wong',
    userId: 'user-005',
    timestamp: '2024-01-15T09:00:00Z',
    projectId: 'PROJ-001',
    tags: ['sprint', 'planning']
  },
  {
    id: 'act-006',
    type: 'time_logged',
    title: 'Logged 3 hours on API development',
    description: 'Worked on implementing REST API endpoints for user authentication',
    user: 'Sarah Wilson',
    userId: 'user-001',
    timestamp: '2024-01-15T08:30:00Z',
    taskId: 'TASK-123',
    projectId: 'PROJ-001',
    tags: ['time-tracking', 'development']
  },

  // Yesterday's activities
  {
    id: 'act-007',
    type: 'meeting',
    title: 'Daily Standup Meeting',
    description: 'Team standup meeting - discussed blockers and sprint progress',
    user: 'David Wong',
    userId: 'user-005',
    timestamp: '2024-01-14T09:00:00Z',
    projectId: 'PROJ-001',
    tags: ['meeting', 'standup', 'scrum']
  },
  {
    id: 'act-008',
    type: 'task_updated',
    title: 'Updated: Mobile Responsive Design',
    description: 'Changed priority to High and assigned to Emma Rodriguez',
    user: 'Mike Johnson',
    userId: 'user-002',
    timestamp: '2024-01-14T16:45:00Z',
    taskId: 'TASK-126',
    projectId: 'PROJ-001',
    tags: ['mobile', 'responsive', 'priority']
  },
  {
    id: 'act-009',
    type: 'commit',
    title: 'Pushed code changes',
    description: 'Implemented user registration validation and error handling',
    user: 'Alex Chen',
    userId: 'user-003',
    timestamp: '2024-01-14T15:30:00Z',
    taskId: 'TASK-127',
    projectId: 'PROJ-001',
    tags: ['code', 'validation', 'backend']
  },
  {
    id: 'act-010',
    type: 'file_upload',
    title: 'Uploaded test documents',
    description: 'Added comprehensive test cases and API documentation',
    user: 'Emma Rodriguez',
    userId: 'user-006',
    timestamp: '2024-01-14T14:20:00Z',
    projectId: 'PROJ-001',
    tags: ['testing', 'documentation', 'api']
  },

  // This week's activities
  {
    id: 'act-011',
    type: 'deployment',
    title: 'Deployed to staging environment',
    description: 'Successfully deployed version 2.1.0 to staging for QA testing',
    user: 'Tom Anderson',
    userId: 'user-007',
    timestamp: '2024-01-13T17:00:00Z',
    projectId: 'PROJ-001',
    tags: ['deployment', 'staging', 'qa']
  },
  {
    id: 'act-012',
    type: 'task_created',
    title: 'New bug report: Login validation issue',
    description: 'Users reporting validation errors during social login process',
    user: 'Jennifer Adams',
    userId: 'user-008',
    timestamp: '2024-01-13T13:25:00Z',
    taskId: 'TASK-128',
    projectId: 'PROJ-001',
    tags: ['bug', 'validation', 'login']
  },
  {
    id: 'act-013',
    type: 'comment',
    title: 'Commented on Database Performance',
    description: 'Added indexing suggestions and query optimization recommendations',
    user: 'Lisa Park',
    userId: 'user-004',
    timestamp: '2024-01-12T16:10:00Z',
    taskId: 'TASK-125',
    projectId: 'PROJ-001',
    tags: ['database', 'performance', 'optimization']
  },
  {
    id: 'act-014',
    type: 'task_completed',
    title: 'Completed: Email Template System',
    description: 'Finished implementing customizable email templates for user notifications',
    user: 'Mike Johnson',
    userId: 'user-002',
    timestamp: '2024-01-12T11:45:00Z',
    taskId: 'TASK-129',
    projectId: 'PROJ-001',
    tags: ['email', 'templates', 'notifications']
  },
  {
    id: 'act-015',
    type: 'sprint_end',
    title: 'Sprint 22 completed',
    description: 'Completed Sprint 22 with 42 out of 45 planned story points',
    user: 'David Wong',
    userId: 'user-005',
    timestamp: '2024-01-11T17:00:00Z',
    projectId: 'PROJ-001',
    tags: ['sprint', 'completion', 'retrospective']
  },
  {
    id: 'act-016',
    type: 'meeting',
    title: 'Sprint Planning Session',
    description: 'Planned Sprint 23 activities and estimated story points',
    user: 'David Wong',
    userId: 'user-005',
    timestamp: '2024-01-11T10:00:00Z',
    projectId: 'PROJ-001',
    tags: ['meeting', 'planning', 'estimation']
  },
  {
    id: 'act-017',
    type: 'task_updated',
    title: 'Updated: API Rate Limiting',
    description: 'Added technical specifications and acceptance criteria',
    user: 'Sarah Wilson',
    userId: 'user-001',
    timestamp: '2024-01-10T14:30:00Z',
    taskId: 'TASK-130',
    projectId: 'PROJ-001',
    tags: ['api', 'rate-limiting', 'specifications']
  },
  {
    id: 'act-018',
    type: 'file_upload',
    title: 'Uploaded architecture diagrams',
    description: 'Added system architecture diagrams and component specifications',
    user: 'Alex Chen',
    userId: 'user-003',
    timestamp: '2024-01-10T09:15:00Z',
    projectId: 'PROJ-001',
    tags: ['architecture', 'diagrams', 'documentation']
  },
  {
    id: 'act-019',
    type: 'time_logged',
    title: 'Logged 6 hours on frontend development',
    description: 'Worked on responsive design implementation and component optimization',
    user: 'Emma Rodriguez',
    userId: 'user-006',
    timestamp: '2024-01-09T18:00:00Z',
    taskId: 'TASK-126',
    projectId: 'PROJ-001',
    tags: ['time-tracking', 'frontend', 'responsive']
  },
  {
    id: 'act-020',
    type: 'comment',
    title: 'Reviewed code changes',
    description: 'Provided feedback on authentication implementation and security considerations',
    user: 'Tom Anderson',
    userId: 'user-007',
    timestamp: '2024-01-09T15:20:00Z',
    taskId: 'TASK-123',
    projectId: 'PROJ-001',
    tags: ['code-review', 'security', 'authentication']
  },

  // Additional activities from previous week
  {
    id: 'act-021',
    type: 'deployment',
    title: 'Production deployment successful',
    description: 'Deployed version 2.0.5 to production with hotfixes',
    user: 'Tom Anderson',
    userId: 'user-007',
    timestamp: '2024-01-08T20:30:00Z',
    projectId: 'PROJ-001',
    tags: ['deployment', 'production', 'hotfix']
  },
  {
    id: 'act-022',
    type: 'meeting',
    title: 'Sprint Retrospective',
    description: 'Discussed what went well, what could be improved, and action items',
    user: 'David Wong',
    userId: 'user-005',
    timestamp: '2024-01-08T16:00:00Z',
    projectId: 'PROJ-001',
    tags: ['meeting', 'retrospective', 'improvement']
  },
  {
    id: 'act-023',
    type: 'task_created',
    title: 'New feature request: Dark mode support',
    description: 'Implement dark mode theme option for better user experience',
    user: 'Lisa Park',
    userId: 'user-004',
    timestamp: '2024-01-07T12:00:00Z',
    taskId: 'TASK-131',
    projectId: 'PROJ-001',
    tags: ['feature', 'dark-mode', 'ui', 'ux']
  },
  {
    id: 'act-024',
    type: 'file_upload',
    title: 'Uploaded performance benchmarks',
    description: 'Added performance test results and optimization recommendations',
    user: 'Jennifer Adams',
    userId: 'user-008',
    timestamp: '2024-01-06T14:45:00Z',
    projectId: 'PROJ-001',
    tags: ['performance', 'benchmarks', 'optimization']
  },
  {
    id: 'act-025',
    type: 'task_completed',
    title: 'Completed: User Profile Management',
    description: 'Implemented complete user profile CRUD operations with validation',
    user: 'Sarah Wilson',
    userId: 'user-001',
    timestamp: '2024-01-05T16:30:00Z',
    taskId: 'TASK-132',
    projectId: 'PROJ-001',
    tags: ['profile', 'crud', 'validation']
  }
]

export default mockActivities