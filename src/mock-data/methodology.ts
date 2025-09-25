// Methodology Mock Data

// Scrum Methodology Mock Data
export const mockScrumData = {
  currentSprint: {
    id: 'sprint-001',
    name: 'Sprint 23',
    startDate: '2024-01-15',
    endDate: '2024-01-28',
    duration: 14,
    status: 'active',
    capacity: 80,
    completed: 45,
    remaining: 35,
    burndownData: [
      { day: 1, remaining: 80, ideal: 77 },
      { day: 2, remaining: 75, ideal: 74 },
      { day: 3, remaining: 70, ideal: 71 },
      { day: 4, remaining: 65, ideal: 68 },
      { day: 5, remaining: 60, ideal: 65 },
      { day: 6, remaining: 55, ideal: 62 },
      { day: 7, remaining: 50, ideal: 59 },
      { day: 8, remaining: 45, ideal: 56 },
    ],
    velocity: [
      { sprint: 'Sprint 19', completed: 42, planned: 45 },
      { sprint: 'Sprint 20', completed: 38, planned: 40 },
      { sprint: 'Sprint 21', completed: 45, planned: 45 },
      { sprint: 'Sprint 22', completed: 43, planned: 45 },
    ],
  },
  ceremonies: [
    { name: 'Daily Scrum', time: '09:00 AM', frequency: 'Daily', nextDate: '2024-01-16', duration: '15 min' },
    { name: 'Sprint Planning', time: '10:00 AM', frequency: 'Bi-weekly', nextDate: '2024-01-29', duration: '4 hours' },
    { name: 'Sprint Review', time: '02:00 PM', frequency: 'Bi-weekly', nextDate: '2024-01-28', duration: '2 hours' },
    { name: 'Sprint Retrospective', time: '04:00 PM', frequency: 'Bi-weekly', nextDate: '2024-01-28', duration: '1 hour' },
    { name: 'Backlog Refinement', time: '11:00 AM', frequency: 'Weekly', nextDate: '2024-01-18', duration: '2 hours' },
  ],
  teamRoles: [
    { role: 'Scrum Master', name: 'Mike Johnson', responsibility: 'Facilitates ceremonies and removes impediments' },
    { role: 'Product Owner', name: 'Sarah Wilson', responsibility: 'Defines product vision and manages backlog' },
    { role: 'Tech Lead', name: 'Alex Chen', responsibility: 'Technical leadership and architecture decisions' },
    { role: 'Senior Developer', name: 'Emma Rodriguez', responsibility: 'Development and mentoring' },
    { role: 'Developer', name: 'Tom Anderson', responsibility: 'Feature development and testing' },
    { role: 'QA Engineer', name: 'Lisa Park', responsibility: 'Quality assurance and testing' },
  ],
  backlog: [
    {
      id: 'PBI-001',
      title: 'User Authentication System',
      description: 'Implement OAuth2 authentication with social providers',
      priority: 'High',
      storyPoints: 13,
      status: 'Ready',
      assignee: 'Sarah Wilson',
      tags: ['authentication', 'security']
    },
    {
      id: 'PBI-002',
      title: 'Payment Integration',
      description: 'Integrate Stripe payment processing',
      priority: 'High',
      storyPoints: 8,
      status: 'In Progress',
      assignee: 'Alex Chen',
      tags: ['payment', 'integration']
    },
    {
      id: 'PBI-003',
      title: 'Mobile Responsive Design',
      description: 'Make application responsive for mobile devices',
      priority: 'Medium',
      storyPoints: 5,
      status: 'Done',
      assignee: 'Emma Rodriguez',
      tags: ['ui', 'mobile', 'responsive']
    }
  ]
}

// Kanban Methodology Mock Data
export const mockKanbanData = {
  columns: [
    {
      id: 'backlog',
      title: 'Backlog',
      limit: null,
      cards: [
        {
          id: 'card-001',
          title: 'API Rate Limiting',
          description: 'Implement rate limiting for API endpoints',
          priority: 'Medium',
          assignee: 'Alex Chen',
          tags: ['backend', 'security'],
          createdAt: '2024-01-10',
          dueDate: '2024-01-25'
        },
        {
          id: 'card-002',
          title: 'Dark Mode Support',
          description: 'Add dark mode theme toggle',
          priority: 'Low',
          assignee: 'Emma Rodriguez',
          tags: ['ui', 'theme'],
          createdAt: '2024-01-12',
          dueDate: '2024-01-30'
        }
      ]
    },
    {
      id: 'ready',
      title: 'Ready',
      limit: 5,
      cards: [
        {
          id: 'card-003',
          title: 'Database Migration',
          description: 'Migrate user data to new schema',
          priority: 'High',
          assignee: 'Tom Anderson',
          tags: ['database', 'migration'],
          createdAt: '2024-01-08',
          dueDate: '2024-01-20'
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      limit: 3,
      cards: [
        {
          id: 'card-004',
          title: 'User Dashboard',
          description: 'Build comprehensive user dashboard',
          priority: 'High',
          assignee: 'Sarah Wilson',
          tags: ['frontend', 'dashboard'],
          createdAt: '2024-01-05',
          dueDate: '2024-01-18'
        },
        {
          id: 'card-005',
          title: 'Email Notifications',
          description: 'Implement email notification system',
          priority: 'Medium',
          assignee: 'Mike Johnson',
          tags: ['backend', 'notifications'],
          createdAt: '2024-01-07',
          dueDate: '2024-01-22'
        }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      limit: 2,
      cards: [
        {
          id: 'card-006',
          title: 'Search Functionality',
          description: 'Add advanced search with filters',
          priority: 'Medium',
          assignee: 'Lisa Park',
          tags: ['search', 'frontend'],
          createdAt: '2024-01-03',
          dueDate: '2024-01-16'
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      limit: null,
      cards: [
        {
          id: 'card-007',
          title: 'Login System',
          description: 'Basic authentication system',
          priority: 'High',
          assignee: 'Alex Chen',
          tags: ['auth', 'backend'],
          createdAt: '2023-12-20',
          dueDate: '2024-01-05',
          completedAt: '2024-01-04'
        },
        {
          id: 'card-008',
          title: 'Project Setup',
          description: 'Initial project configuration',
          priority: 'High',
          assignee: 'Tom Anderson',
          tags: ['setup', 'config'],
          createdAt: '2023-12-15',
          dueDate: '2023-12-22',
          completedAt: '2023-12-21'
        }
      ]
    }
  ],
  metrics: {
    cycleTime: 5.2, // average days
    leadTime: 8.7, // average days
    throughput: 12, // cards per week
    wip: 6, // current work in progress
    wipLimit: 10
  },
  cumulativeFlowData: [
    { date: '2024-01-01', backlog: 15, ready: 3, inProgress: 2, review: 1, done: 5 },
    { date: '2024-01-02', backlog: 14, ready: 4, inProgress: 3, review: 1, done: 6 },
    { date: '2024-01-03', backlog: 13, ready: 4, inProgress: 3, review: 2, done: 6 },
    { date: '2024-01-04', backlog: 12, ready: 5, inProgress: 2, review: 2, done: 7 },
    { date: '2024-01-05', backlog: 11, ready: 5, inProgress: 3, review: 1, done: 8 },
  ]
}

// Waterfall Methodology Mock Data
export const mockWaterfallData = {
  phases: [
    {
      id: 'requirements',
      name: 'Requirements Analysis',
      description: 'Gather and analyze project requirements',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      duration: 14,
      deliverables: [
        'Requirements Document',
        'Functional Specifications',
        'Non-functional Requirements',
        'Acceptance Criteria'
      ],
      tasks: [
        { id: 'req-001', name: 'Stakeholder Interviews', status: 'completed', assignee: 'Sarah Wilson' },
        { id: 'req-002', name: 'Requirements Documentation', status: 'completed', assignee: 'Mike Johnson' },
        { id: 'req-003', name: 'Requirements Review', status: 'completed', assignee: 'Alex Chen' }
      ]
    },
    {
      id: 'design',
      name: 'System Design',
      description: 'Create system architecture and detailed design',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-16',
      endDate: '2024-02-05',
      duration: 20,
      deliverables: [
        'System Architecture Document',
        'Database Design',
        'UI/UX Mockups',
        'Technical Specifications'
      ],
      tasks: [
        { id: 'des-001', name: 'Architecture Design', status: 'completed', assignee: 'Alex Chen' },
        { id: 'des-002', name: 'Database Schema', status: 'completed', assignee: 'Tom Anderson' },
        { id: 'des-003', name: 'UI Design', status: 'completed', assignee: 'Emma Rodriguez' }
      ]
    },
    {
      id: 'implementation',
      name: 'Implementation',
      description: 'Develop the system according to design specifications',
      status: 'in-progress',
      progress: 65,
      startDate: '2024-02-06',
      endDate: '2024-03-20',
      duration: 43,
      deliverables: [
        'Source Code',
        'Unit Tests',
        'Integration Tests',
        'Code Documentation'
      ],
      tasks: [
        { id: 'imp-001', name: 'Backend Development', status: 'in-progress', assignee: 'Alex Chen' },
        { id: 'imp-002', name: 'Frontend Development', status: 'in-progress', assignee: 'Emma Rodriguez' },
        { id: 'imp-003', name: 'Database Implementation', status: 'completed', assignee: 'Tom Anderson' },
        { id: 'imp-004', name: 'API Development', status: 'in-progress', assignee: 'Sarah Wilson' }
      ]
    },
    {
      id: 'testing',
      name: 'Testing',
      description: 'Comprehensive testing of the implemented system',
      status: 'pending',
      progress: 0,
      startDate: '2024-03-21',
      endDate: '2024-04-10',
      duration: 20,
      deliverables: [
        'Test Plans',
        'Test Cases',
        'Test Reports',
        'Bug Reports'
      ],
      tasks: [
        { id: 'test-001', name: 'Unit Testing', status: 'pending', assignee: 'Lisa Park' },
        { id: 'test-002', name: 'Integration Testing', status: 'pending', assignee: 'Mike Johnson' },
        { id: 'test-003', name: 'User Acceptance Testing', status: 'pending', assignee: 'Sarah Wilson' }
      ]
    },
    {
      id: 'deployment',
      name: 'Deployment',
      description: 'Deploy the system to production environment',
      status: 'pending',
      progress: 0,
      startDate: '2024-04-11',
      endDate: '2024-04-20',
      duration: 9,
      deliverables: [
        'Deployment Guide',
        'Production Environment',
        'User Manual',
        'Training Materials'
      ],
      tasks: [
        { id: 'dep-001', name: 'Production Setup', status: 'pending', assignee: 'Tom Anderson' },
        { id: 'dep-002', name: 'Data Migration', status: 'pending', assignee: 'Alex Chen' },
        { id: 'dep-003', name: 'User Training', status: 'pending', assignee: 'Sarah Wilson' }
      ]
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Ongoing maintenance and support',
      status: 'pending',
      progress: 0,
      startDate: '2024-04-21',
      endDate: '2024-10-21',
      duration: 183,
      deliverables: [
        'Maintenance Plan',
        'Support Documentation',
        'Performance Reports',
        'Enhancement Requests'
      ],
      tasks: [
        { id: 'main-001', name: 'Performance Monitoring', status: 'pending', assignee: 'Tom Anderson' },
        { id: 'main-002', name: 'Bug Fixes', status: 'pending', assignee: 'Alex Chen' },
        { id: 'main-003', name: 'User Support', status: 'pending', assignee: 'Mike Johnson' }
      ]
    }
  ],
  milestones: [
    { name: 'Requirements Approved', date: '2024-01-15', status: 'completed' },
    { name: 'Design Sign-off', date: '2024-02-05', status: 'completed' },
    { name: 'Alpha Release', date: '2024-03-01', status: 'completed' },
    { name: 'Beta Release', date: '2024-03-20', status: 'at-risk' },
    { name: 'Production Release', date: '2024-04-20', status: 'pending' },
  ],
  risks: [
    {
      id: 'risk-001',
      description: 'Integration complexity with third-party services',
      impact: 'High',
      probability: 'Medium',
      mitigation: 'Early proof of concept development',
      status: 'active'
    },
    {
      id: 'risk-002',
      description: 'Resource availability during peak periods',
      impact: 'Medium',
      probability: 'High',
      mitigation: 'Cross-training team members',
      status: 'active'
    }
  ]
}

export type MethodologyType = 'Scrum' | 'Kanban' | 'Waterfall'

export const methodologyData = {
  scrum: mockScrumData,
  kanban: mockKanbanData,
  waterfall: mockWaterfallData
}

export default methodologyData