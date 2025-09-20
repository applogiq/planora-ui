// Project Activity Mock Data

export interface ProjectActivity {
  id: number
  user: string | { name: string; avatar?: string }
  action: string
  target?: string
  type: 'task' | 'comment' | 'file' | 'commit' | 'milestone' | 'team' | 'project' | 'meeting' | 'deployment' | 'approval'
  timestamp: string
  description?: string
  metadata?: {
    taskId?: string
    fileSize?: string
    commitHash?: string
    branchName?: string
    buildNumber?: string
    reviewers?: string[]
    priority?: string
    status?: string
    oldValue?: string
    newValue?: string
    duration?: string
    participants?: string[]
  }
}

export const mockProjectActivities: ProjectActivity[] = [
  // Task activities
  {
    id: 1,
    user: 'Sarah Wilson',
    action: 'completed task',
    target: 'User Authentication API',
    type: 'task',
    timestamp: '2 hours ago',
    description: 'Implemented OAuth2 integration with Google and GitHub providers',
    metadata: {
      taskId: 'TASK-123',
      priority: 'High',
      oldValue: 'In Progress',
      newValue: 'Completed'
    }
  },
  {
    id: 2,
    user: 'Mike Johnson',
    action: 'created task',
    target: 'Database Performance Optimization',
    type: 'task',
    timestamp: '4 hours ago',
    description: 'Added new task to address slow query performance issues',
    metadata: {
      taskId: 'TASK-124',
      priority: 'Medium',
      status: 'To Do'
    }
  },
  {
    id: 3,
    user: 'Alex Chen',
    action: 'moved task',
    target: 'Payment Gateway Integration',
    type: 'task',
    timestamp: '6 hours ago',
    description: 'Moved from In Progress to Code Review',
    metadata: {
      taskId: 'TASK-122',
      oldValue: 'In Progress',
      newValue: 'Code Review'
    }
  },
  {
    id: 4,
    user: 'Lisa Park',
    action: 'assigned task',
    target: 'Mobile UI Responsive Design',
    type: 'task',
    timestamp: '8 hours ago',
    description: 'Assigned to David Wong for frontend implementation',
    metadata: {
      taskId: 'TASK-125',
      oldValue: 'Unassigned',
      newValue: 'David Wong'
    }
  },

  // Comment activities
  {
    id: 5,
    user: 'David Wong',
    action: 'commented on',
    target: 'User Authentication API',
    type: 'comment',
    timestamp: '3 hours ago',
    description: 'Great work on the OAuth implementation! The error handling looks solid.',
    metadata: {
      taskId: 'TASK-123'
    }
  },
  {
    id: 6,
    user: 'Emma Thompson',
    action: 'replied to comment on',
    target: 'Payment Gateway Integration',
    type: 'comment',
    timestamp: '5 hours ago',
    description: 'I think we should also consider adding webhook support for real-time updates.',
    metadata: {
      taskId: 'TASK-122'
    }
  },

  // File activities
  {
    id: 7,
    user: 'Rajesh Kumar',
    action: 'uploaded file',
    target: 'API Documentation v2.1.pdf',
    type: 'file',
    timestamp: '1 hour ago',
    description: 'Updated API documentation with new authentication endpoints',
    metadata: {
      fileSize: '2.3 MB'
    }
  },
  {
    id: 8,
    user: 'Jennifer Adams',
    action: 'updated file',
    target: 'Database Schema Diagram.png',
    type: 'file',
    timestamp: '7 hours ago',
    description: 'Added new tables for user preferences and activity logs',
    metadata: {
      fileSize: '856 KB'
    }
  },

  // Git commit activities
  {
    id: 9,
    user: 'Tom Rodriguez',
    action: 'pushed commit',
    target: 'feat: implement user role management',
    type: 'commit',
    timestamp: '2 hours ago',
    description: 'Added role-based access control with admin, manager, and user roles',
    metadata: {
      commitHash: 'a7b3c4d',
      branchName: 'feature/user-roles'
    }
  },
  {
    id: 10,
    user: 'Sophie Martin',
    action: 'merged pull request',
    target: 'fix: resolve authentication timeout issues',
    type: 'commit',
    timestamp: '5 hours ago',
    description: 'Merged PR #245 after successful code review',
    metadata: {
      commitHash: 'e8f9a2b',
      branchName: 'bugfix/auth-timeout',
      reviewers: ['Mike Johnson', 'Sarah Wilson']
    }
  },

  // Milestone activities
  {
    id: 11,
    user: 'Project Manager',
    action: 'completed milestone',
    target: 'Alpha Release v1.0',
    type: 'milestone',
    timestamp: '1 day ago',
    description: 'Successfully deployed alpha version with core authentication features',
    metadata: {
      buildNumber: 'build-156'
    }
  },
  {
    id: 12,
    user: 'Sarah Wilson',
    action: 'created milestone',
    target: 'Beta Release v1.1',
    type: 'milestone',
    timestamp: '2 days ago',
    description: 'Set up milestone for beta release with enhanced UI features',
    metadata: {}
  },

  // Team activities
  {
    id: 13,
    user: 'Team Lead',
    action: 'added member',
    target: 'Jessica Brown joined the team',
    type: 'team',
    timestamp: '3 days ago',
    description: 'Jessica Brown joined as Senior Frontend Developer',
    metadata: {}
  },
  {
    id: 14,
    user: 'HR Manager',
    action: 'updated role',
    target: 'Alex Chen promoted to Technical Lead',
    type: 'team',
    timestamp: '1 week ago',
    description: 'Alex Chen promoted from Senior Developer to Technical Lead',
    metadata: {
      oldValue: 'Senior Developer',
      newValue: 'Technical Lead'
    }
  },

  // Project configuration activities
  {
    id: 15,
    user: 'Project Manager',
    action: 'updated project settings',
    target: 'Sprint duration changed to 2 weeks',
    type: 'project',
    timestamp: '4 days ago',
    description: 'Modified sprint duration from 1 week to 2 weeks based on team feedback',
    metadata: {
      oldValue: '1 week',
      newValue: '2 weeks'
    }
  },
  {
    id: 16,
    user: 'Admin',
    action: 'changed methodology',
    target: 'Switched from Waterfall to Agile',
    type: 'project',
    timestamp: '1 week ago',
    description: 'Project methodology updated to better support iterative development',
    metadata: {
      oldValue: 'Waterfall',
      newValue: 'Agile'
    }
  },

  // Meeting activities
  {
    id: 17,
    user: 'Scrum Master',
    action: 'conducted meeting',
    target: 'Sprint Planning Session',
    type: 'meeting',
    timestamp: '2 days ago',
    description: 'Sprint planning for Sprint 12 with story point estimation',
    metadata: {
      duration: '2 hours',
      participants: ['Sarah Wilson', 'Mike Johnson', 'Alex Chen', 'Lisa Park', 'David Wong']
    }
  },
  {
    id: 18,
    user: 'Team Lead',
    action: 'scheduled meeting',
    target: 'Code Review Session',
    type: 'meeting',
    timestamp: '5 days ago',
    description: 'Weekly code review session to discuss best practices',
    metadata: {
      duration: '1 hour',
      participants: ['All Developers']
    }
  },

  // Deployment activities
  {
    id: 19,
    user: 'DevOps Engineer',
    action: 'deployed to staging',
    target: 'Version 1.2.0-beta',
    type: 'deployment',
    timestamp: '6 hours ago',
    description: 'Successfully deployed beta version to staging environment',
    metadata: {
      buildNumber: 'build-167',
      branchName: 'release/1.2.0'
    }
  },
  {
    id: 20,
    user: 'DevOps Engineer',
    action: 'deployed to production',
    target: 'Version 1.1.5',
    type: 'deployment',
    timestamp: '3 days ago',
    description: 'Production deployment with security patches and bug fixes',
    metadata: {
      buildNumber: 'build-162',
      branchName: 'hotfix/security-patches'
    }
  },

  // Approval activities
  {
    id: 21,
    user: 'Product Owner',
    action: 'approved requirements',
    target: 'User Management Module Specifications',
    type: 'approval',
    timestamp: '1 week ago',
    description: 'Approved detailed requirements for user management functionality',
    metadata: {}
  },
  {
    id: 22,
    user: 'Security Team',
    action: 'approved security review',
    target: 'Authentication System Security Audit',
    type: 'approval',
    timestamp: '5 days ago',
    description: 'Security audit completed with recommendations implemented',
    metadata: {
      reviewers: ['Security Specialist', 'Lead Architect']
    }
  }
]

// Activity filters and utilities
export const activityTypes = [
  { value: 'all', label: 'All Activities' },
  { value: 'task', label: 'Tasks' },
  { value: 'comment', label: 'Comments' },
  { value: 'file', label: 'Files' },
  { value: 'commit', label: 'Code Changes' },
  { value: 'milestone', label: 'Milestones' },
  { value: 'team', label: 'Team Changes' },
  { value: 'project', label: 'Project Updates' },
  { value: 'meeting', label: 'Meetings' },
  { value: 'deployment', label: 'Deployments' },
  { value: 'approval', label: 'Approvals' }
]

export const activityUsers = [
  'Sarah Wilson',
  'Mike Johnson',
  'Alex Chen',
  'Lisa Park',
  'David Wong',
  'Emma Thompson',
  'Rajesh Kumar',
  'Jennifer Adams',
  'Tom Rodriguez',
  'Sophie Martin',
  'Jessica Brown',
  'Project Manager',
  'Team Lead',
  'Scrum Master',
  'DevOps Engineer',
  'Product Owner',
  'Security Team',
  'HR Manager',
  'Admin'
]

// Activity icon mapping
export const activityIcons = {
  task: 'CheckCircle',
  comment: 'MessageSquare',
  file: 'FileText',
  commit: 'GitCommit',
  milestone: 'Flag',
  team: 'Users',
  project: 'Settings',
  meeting: 'Calendar',
  deployment: 'Upload',
  approval: 'Star'
}

// Activity color mapping
export const activityColors = {
  task: 'text-blue-600',
  comment: 'text-green-600',
  file: 'text-purple-600',
  commit: 'text-orange-600',
  milestone: 'text-red-600',
  team: 'text-indigo-600',
  project: 'text-gray-600',
  meeting: 'text-yellow-600',
  deployment: 'text-pink-600',
  approval: 'text-emerald-600'
}

export default {
  activities: mockProjectActivities,
  types: activityTypes,
  users: activityUsers,
  icons: activityIcons,
  colors: activityColors
}