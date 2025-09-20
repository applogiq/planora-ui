// Methodology-specific Mock Data

// Agile Methodology Mock Data
export interface AgileSprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'active' | 'planning' | 'completed'
  goals: string[]
  velocity: number
  targetVelocity: number
  burndownData: number[]
  daysLeft: number
  totalDays: number
}

export interface AgileTask {
  id: number
  title: string
  status: 'Done' | 'In Progress' | 'To Do' | 'Review'
  points: number
  assignee: string
  priority: 'High' | 'Medium' | 'Low' | 'Critical'
  type?: 'Story' | 'Task' | 'Epic' | 'Bug'
}

export interface BacklogItem {
  id: number
  title: string
  points: number
  priority: 'High' | 'Medium' | 'Low' | 'Critical'
  type: 'Feature' | 'Technical' | 'Enhancement' | 'Bug'
  estimatedSprint?: string
}

export interface AgileCeremony {
  name: string
  time: string
  frequency: string
  nextDate: string
  duration?: string
}

export const mockAgileData = {
  currentSprint: {
    id: 'sprint-23',
    name: 'Sprint 23 - User Authentication & Dashboard',
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    status: 'active' as const,
    goals: [
      'Complete user authentication system',
      'Implement dashboard analytics',
      'Fix critical bugs from backlog'
    ],
    velocity: 42,
    targetVelocity: 45,
    burndownData: [45, 38, 32, 28, 22, 18, 12, 8, 4, 2],
    daysLeft: 4,
    totalDays: 14
  },
  sprintTasks: [
    { id: 1, title: 'User login API', status: 'Done' as const, points: 8, assignee: 'John Doe', priority: 'High' as const },
    { id: 2, title: 'Dashboard UI components', status: 'In Progress' as const, points: 13, assignee: 'Jane Smith', priority: 'Medium' as const },
    { id: 3, title: 'Authentication middleware', status: 'Done' as const, points: 5, assignee: 'Mike Johnson', priority: 'High' as const },
    { id: 4, title: 'User profile page', status: 'To Do' as const, points: 8, assignee: 'Sarah Wilson', priority: 'Low' as const },
    { id: 5, title: 'Password reset flow', status: 'In Progress' as const, points: 8, assignee: 'Tom Brown', priority: 'Medium' as const }
  ],
  backlogItems: [
    { id: 6, title: 'Advanced search functionality', points: 21, priority: 'Medium' as const, type: 'Feature' as const },
    { id: 7, title: 'Email notifications system', points: 13, priority: 'Low' as const, type: 'Feature' as const },
    { id: 8, title: 'Performance optimization', points: 8, priority: 'High' as const, type: 'Technical' as const },
    { id: 9, title: 'Mobile responsiveness', points: 13, priority: 'Medium' as const, type: 'Enhancement' as const }
  ],
  ceremonies: [
    { name: 'Daily Standup', time: '09:00 AM', frequency: 'Daily', nextDate: '2024-01-16' },
    { name: 'Sprint Planning', time: '10:00 AM', frequency: 'Every 2 weeks', nextDate: '2024-01-29' },
    { name: 'Sprint Review', time: '02:00 PM', frequency: 'Every 2 weeks', nextDate: '2024-01-29' },
    { name: 'Retrospective', time: '03:00 PM', frequency: 'Every 2 weeks', nextDate: '2024-01-29' }
  ]
}

// Scrum Methodology Mock Data
export const mockScrumData = {
  currentSprint: {
    id: 'sprint-12',
    name: 'Sprint 12 - Core Features',
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    status: 'active' as const,
    goals: [
      'Complete user management module',
      'Implement reporting dashboard',
      'Resolve critical performance issues'
    ],
    velocity: 38,
    targetVelocity: 40,
    burndownData: [40, 35, 30, 25, 18, 15, 10, 6, 3, 1],
    daysLeft: 3,
    totalDays: 14,
    completedStoryPoints: 37,
    totalStoryPoints: 40
  },
  sprintBacklog: [
    { id: 1, title: 'User registration form', status: 'Done' as const, points: 5, assignee: 'Alice Johnson', priority: 'High' as const, type: 'Story' as const },
    { id: 2, title: 'Dashboard widgets', status: 'In Progress' as const, points: 8, assignee: 'Bob Smith', priority: 'Medium' as const, type: 'Story' as const },
    { id: 3, title: 'API authentication', status: 'Done' as const, points: 3, assignee: 'Charlie Brown', priority: 'High' as const, type: 'Task' as const },
    { id: 4, title: 'User profile editor', status: 'Review' as const, points: 5, assignee: 'Diana Prince', priority: 'Medium' as const, type: 'Story' as const },
    { id: 5, title: 'Database optimization', status: 'To Do' as const, points: 13, assignee: 'Eve Wilson', priority: 'Low' as const, type: 'Epic' as const }
  ],
  productBacklog: [
    { id: 6, title: 'Advanced reporting system', points: 21, priority: 'High' as const, type: 'Epic' as const, estimatedSprint: 'Sprint 13' },
    { id: 7, title: 'Mobile app integration', points: 34, priority: 'Medium' as const, type: 'Epic' as const, estimatedSprint: 'Sprint 14-15' },
    { id: 8, title: 'Real-time notifications', points: 8, priority: 'Medium' as const, type: 'Feature' as const, estimatedSprint: 'Sprint 13' },
    { id: 9, title: 'Data export functionality', points: 13, priority: 'Low' as const, type: 'Feature' as const, estimatedSprint: 'Sprint 16' }
  ],
  scrumEvents: [
    { name: 'Daily Scrum', time: '09:00 AM', frequency: 'Daily', nextDate: '2024-01-16', duration: '15 min' },
    { name: 'Sprint Planning', time: '10:00 AM', frequency: 'Every 2 weeks', nextDate: '2024-01-29', duration: '4 hours' },
    { name: 'Sprint Review', time: '02:00 PM', frequency: 'Every 2 weeks', nextDate: '2024-01-29', duration: '2 hours' },
    { name: 'Sprint Retrospective', time: '04:00 PM', frequency: 'Every 2 weeks', nextDate: '2024-01-29', duration: '1.5 hours' }
  ],
  scrumRoles: [
    { role: 'Product Owner', name: 'Sarah Miller', responsibility: 'Manages product backlog and stakeholder requirements' },
    { role: 'Scrum Master', name: 'Mike Johnson', responsibility: 'Facilitates ceremonies and removes impediments' },
    { role: 'Development Team', count: 6, responsibility: 'Develops and delivers product increments' }
  ]
}

// Waterfall Methodology Mock Data
export interface WaterfallPhase {
  id: number
  name: string
  description: string
  status: 'Completed' | 'In Progress' | 'Pending' | 'At Risk'
  startDate: string
  endDate: string
  duration: number
  progress: number
  tasks: number
  completedTasks: number
  deliverables: string[]
  dependencies: string[]
}

export interface WaterfallMilestone {
  name: string
  date: string
  status: 'Completed' | 'At Risk' | 'Pending'
  phase: string
}

export const mockWaterfallData = {
  phases: [
    {
      id: 1,
      name: 'Requirements Analysis',
      description: 'Gather and document all project requirements',
      status: 'Completed' as const,
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      duration: 14,
      progress: 100,
      tasks: 12,
      completedTasks: 12,
      deliverables: ['Requirements Document', 'Use Cases', 'Acceptance Criteria'],
      dependencies: []
    },
    {
      id: 2,
      name: 'System Design',
      description: 'Create system architecture and detailed design',
      status: 'Completed' as const,
      startDate: '2024-01-16',
      endDate: '2024-02-05',
      duration: 20,
      progress: 100,
      tasks: 18,
      completedTasks: 18,
      deliverables: ['System Architecture', 'Database Design', 'UI/UX Mockups'],
      dependencies: ['Requirements Analysis']
    },
    {
      id: 3,
      name: 'Implementation',
      description: 'Develop the system based on design specifications',
      status: 'In Progress' as const,
      startDate: '2024-02-06',
      endDate: '2024-03-20',
      duration: 43,
      progress: 65,
      tasks: 45,
      completedTasks: 29,
      deliverables: ['Source Code', 'Technical Documentation', 'Build Scripts'],
      dependencies: ['System Design']
    }
  ],
  milestones: [
    { name: 'Requirements Approved', date: '2024-01-15', status: 'Completed' as const, phase: 'Requirements Analysis' },
    { name: 'Design Review Complete', date: '2024-02-05', status: 'Completed' as const, phase: 'System Design' },
    { name: 'Alpha Release', date: '2024-02-28', status: 'Completed' as const, phase: 'Implementation' },
    { name: 'Beta Release', date: '2024-03-15', status: 'At Risk' as const, phase: 'Implementation' }
  ],
  riskAssessment: [
    {
      category: 'Requirements Changes',
      level: 'High' as const,
      impact: 'Project delays and scope creep',
      mitigation: 'Strict change control process implemented'
    },
    {
      category: 'Technical Complexity',
      level: 'Medium' as const,
      impact: 'Implementation challenges',
      mitigation: 'Technical proof of concepts completed'
    }
  ]
}

// Kanban Methodology Mock Data
export interface KanbanColumn {
  id: string
  name: string
  wipLimit: number | null
  color: string
  items: KanbanItem[]
}

export interface KanbanItem {
  id: number
  title: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  type: 'Feature' | 'Bug' | 'Enhancement' | 'Technical'
  assignee: string
  estimate: string
  tags: string[]
}

export const mockKanbanData = {
  columns: [
    {
      id: 'backlog',
      name: 'Backlog',
      wipLimit: null,
      color: 'bg-gray-100',
      items: [
        { id: 1, title: 'User profile enhancement', priority: 'Medium' as const, type: 'Feature' as const, assignee: 'Alice', estimate: '5h', tags: ['frontend'] },
        { id: 2, title: 'API rate limiting', priority: 'Low' as const, type: 'Technical' as const, assignee: 'Bob', estimate: '8h', tags: ['backend'] }
      ]
    },
    {
      id: 'doing',
      name: 'Doing',
      wipLimit: 3,
      color: 'bg-yellow-50',
      items: [
        { id: 6, title: 'Payment gateway integration', priority: 'High' as const, type: 'Feature' as const, assignee: 'Frank', estimate: '21h', tags: ['payments', 'integration'] }
      ]
    }
  ],
  metrics: {
    throughput: { weekly: 12, monthly: 48, trend: '+15%' },
    cycleTime: { average: 4.2, trend: '+0.3' },
    wipLimits: { violations: 0, efficiency: 92 },
    leadTime: { average: 6.8, p95: 12.4 }
  }
}

// DevOps Methodology Mock Data
export const mockDevOpsData = {
  cicdPipeline: {
    stages: [
      { name: 'Build', status: 'success' as const, duration: '2m 15s', lastRun: '10 min ago' },
      { name: 'Test', status: 'success' as const, duration: '5m 42s', lastRun: '8 min ago' },
      { name: 'Security Scan', status: 'warning' as const, duration: '3m 30s', lastRun: '6 min ago' },
      { name: 'Deploy to Staging', status: 'success' as const, duration: '1m 20s', lastRun: '4 min ago' },
      { name: 'Integration Tests', status: 'running' as const, duration: '4m 15s', lastRun: 'Running' },
      { name: 'Deploy to Production', status: 'pending' as const, duration: '-', lastRun: 'Pending' }
    ],
    metrics: {
      successRate: 94,
      avgBuildTime: '12m 30s',
      deploymentFrequency: '3.2/day',
      leadTime: '4.5 hours',
      mttr: '23 minutes',
      changeFailureRate: '2.1%'
    }
  },
  infrastructure: {
    environments: [
      {
        name: 'Development',
        status: 'healthy' as const,
        uptime: '99.8%',
        lastDeploy: '2 hours ago',
        version: 'v2.3.1-dev',
        resources: { cpu: 45, memory: 62, disk: 34 }
      },
      {
        name: 'Production',
        status: 'warning' as const,
        uptime: '99.7%',
        lastDeploy: '3 days ago',
        version: 'v2.2.8',
        resources: { cpu: 78, memory: 82, disk: 45 }
      }
    ]
  },
  monitoring: {
    alerts: [
      { level: 'critical' as const, message: 'High CPU usage on Production', service: 'User Service', time: '5 min ago' },
      { level: 'warning' as const, message: 'Slow response times detected', service: 'API Gateway', time: '15 min ago' }
    ],
    metrics: {
      availability: 99.7,
      responseTime: 245,
      errorRate: 0.12,
      throughput: 1250
    }
  }
}

// Lean Methodology Mock Data
export const mockLeanData = {
  valueStreamMapping: {
    steps: [
      {
        name: 'Requirement Analysis',
        type: 'value-add' as const,
        duration: 2,
        waitTime: 1,
        efficiency: 67,
        improvements: ['Standardize requirement templates', 'Reduce review cycles']
      },
      {
        name: 'Development',
        type: 'value-add' as const,
        duration: 8,
        waitTime: 0.5,
        efficiency: 94,
        improvements: ['Pair programming', 'Automated testing']
      }
    ],
    metrics: {
      totalLeadTime: 19,
      totalValueAddTime: 13.5,
      totalWasteTime: 8,
      processEfficiency: 71
    }
  },
  wasteIdentification: {
    categories: [
      {
        type: 'Waiting',
        description: 'Delays between process steps',
        instances: 12,
        impact: 'High' as const,
        cost: 8400,
        examples: ['Code review bottlenecks', 'Environment provisioning delays']
      },
      {
        type: 'Defects',
        description: 'Bugs and rework requirements',
        instances: 8,
        impact: 'Medium' as const,
        cost: 5600,
        examples: ['Integration failures', 'UI inconsistencies']
      }
    ],
    totalWasteCost: 32300,
    wasteReduction: 18
  },
  continuousImprovement: {
    kaizen: [
      {
        id: 'K001',
        title: 'Reduce code review time',
        status: 'In Progress' as const,
        impact: 'High' as const,
        owner: 'Development Team',
        startDate: '2024-01-10',
        expectedCompletion: '2024-01-25',
        progress: 60
      }
    ]
  }
}

// Common methodology types and utilities
export type MethodologyType = 'Agile' | 'Scrum' | 'Waterfall' | 'Kanban' | 'DevOps' | 'Lean'

export const methodologyMockData = {
  agile: mockAgileData,
  scrum: mockScrumData,
  waterfall: mockWaterfallData,
  kanban: mockKanbanData,
  devops: mockDevOpsData,
  lean: mockLeanData
}

export default methodologyMockData