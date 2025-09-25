// Project Files Mock Data

export interface ProjectFile {
  id: string
  name: string
  description?: string
  type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other'
  category: 'sprint' | 'design' | 'documentation' | 'testing' | 'meeting' | 'other'
  size: number // in bytes
  uploadedBy: string
  uploadedAt: string
  modified: string
  created: string
  projectId: string
  taskId?: string
  version: string
  url?: string
  thumbnailUrl?: string
  tags?: string[]
  shared: boolean
  permissions: {
    canView: string[]
    canEdit: string[]
    canDelete: string[]
  }
}

export const mockProjectFiles: ProjectFile[] = [
  // Design Files
  {
    id: 'file-001',
    name: 'User Dashboard Mockup v2.1.figma',
    description: 'High-fidelity mockups for the main user dashboard interface',
    type: 'other',
    category: 'design',
    size: 2048576, // 2MB
    uploadedBy: 'Lisa Park',
    uploadedAt: '2024-01-15T10:30:00Z',
    modified: '2024-01-15T10:30:00Z',
    created: '2024-01-12T14:20:00Z',
    projectId: 'PROJ-001',
    taskId: 'TASK-124',
    version: '2.1',
    tags: ['dashboard', 'ui', 'mockup'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['design-team'],
      canDelete: ['lisa.park', 'project-manager']
    }
  },
  {
    id: 'file-002',
    name: 'Mobile Wireframes.sketch',
    description: 'Mobile responsive wireframes for iOS and Android',
    type: 'other',
    category: 'design',
    size: 1536000, // 1.5MB
    uploadedBy: 'Emma Rodriguez',
    uploadedAt: '2024-01-14T16:45:00Z',
    modified: '2024-01-14T16:45:00Z',
    created: '2024-01-14T16:45:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['mobile', 'wireframes', 'responsive'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['design-team', 'frontend-team'],
      canDelete: ['emma.rodriguez']
    }
  },
  {
    id: 'file-003',
    name: 'Brand Guidelines 2024.pdf',
    description: 'Updated brand guidelines including logos, colors, and typography',
    type: 'document',
    category: 'design',
    size: 3072000, // 3MB
    uploadedBy: 'Lisa Park',
    uploadedAt: '2024-01-10T09:15:00Z',
    modified: '2024-01-10T09:15:00Z',
    created: '2024-01-10T09:15:00Z',
    projectId: 'PROJ-001',
    version: '2024.1',
    tags: ['brand', 'guidelines', 'style'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['design-team'],
      canDelete: ['lisa.park']
    }
  },

  // Documentation Files
  {
    id: 'file-004',
    name: 'API Documentation v3.2.docx',
    description: 'Complete API documentation with endpoints, parameters, and examples',
    type: 'document',
    category: 'documentation',
    size: 1024000, // 1MB
    uploadedBy: 'Sarah Wilson',
    uploadedAt: '2024-01-13T11:20:00Z',
    modified: '2024-01-15T14:30:00Z',
    created: '2024-01-08T10:00:00Z',
    projectId: 'PROJ-001',
    version: '3.2',
    tags: ['api', 'documentation', 'endpoints'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['backend-team', 'tech-lead'],
      canDelete: ['sarah.wilson']
    }
  },
  {
    id: 'file-005',
    name: 'Database Schema Diagram.png',
    description: 'Visual representation of the complete database schema',
    type: 'image',
    category: 'documentation',
    size: 512000, // 512KB
    uploadedBy: 'Alex Chen',
    uploadedAt: '2024-01-12T15:45:00Z',
    modified: '2024-01-12T15:45:00Z',
    created: '2024-01-12T15:45:00Z',
    projectId: 'PROJ-001',
    taskId: 'TASK-125',
    version: '1.0',
    tags: ['database', 'schema', 'diagram'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['backend-team'],
      canDelete: ['alex.chen']
    }
  },
  {
    id: 'file-006',
    name: 'System Architecture Overview.pdf',
    description: 'High-level system architecture and component interactions',
    type: 'document',
    category: 'documentation',
    size: 2560000, // 2.5MB
    uploadedBy: 'Tom Anderson',
    uploadedAt: '2024-01-11T13:30:00Z',
    modified: '2024-01-11T13:30:00Z',
    created: '2024-01-11T13:30:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['architecture', 'system', 'overview'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['tech-lead', 'senior-devs'],
      canDelete: ['tom.anderson']
    }
  },

  // Sprint Files
  {
    id: 'file-007',
    name: 'Sprint 23 Planning Notes.md',
    description: 'Planning session notes, decisions, and action items',
    type: 'document',
    category: 'sprint',
    size: 25600, // 25KB
    uploadedBy: 'David Wong',
    uploadedAt: '2024-01-15T09:00:00Z',
    modified: '2024-01-15T09:00:00Z',
    created: '2024-01-15T09:00:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['sprint', 'planning', 'notes'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['scrum-master', 'product-owner'],
      canDelete: ['david.wong']
    }
  },
  {
    id: 'file-008',
    name: 'Sprint 22 Retrospective Summary.pdf',
    description: 'Retrospective meeting summary with improvement actions',
    type: 'document',
    category: 'sprint',
    size: 204800, // 200KB
    uploadedBy: 'David Wong',
    uploadedAt: '2024-01-08T16:30:00Z',
    modified: '2024-01-08T16:30:00Z',
    created: '2024-01-08T16:30:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['retrospective', 'improvements', 'sprint'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['scrum-master'],
      canDelete: ['david.wong']
    }
  },

  // Testing Files
  {
    id: 'file-009',
    name: 'Test Cases - Authentication Module.xlsx',
    description: 'Comprehensive test cases for user authentication features',
    type: 'document',
    category: 'testing',
    size: 307200, // 300KB
    uploadedBy: 'Emma Rodriguez',
    uploadedAt: '2024-01-14T14:20:00Z',
    modified: '2024-01-14T14:20:00Z',
    created: '2024-01-14T14:20:00Z',
    projectId: 'PROJ-001',
    taskId: 'TASK-123',
    version: '1.0',
    tags: ['testing', 'authentication', 'test-cases'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['qa-team', 'backend-team'],
      canDelete: ['emma.rodriguez']
    }
  },
  {
    id: 'file-010',
    name: 'Performance Test Results.json',
    description: 'Load testing results and performance benchmarks',
    type: 'other',
    category: 'testing',
    size: 153600, // 150KB
    uploadedBy: 'Jennifer Adams',
    uploadedAt: '2024-01-06T14:45:00Z',
    modified: '2024-01-06T14:45:00Z',
    created: '2024-01-06T14:45:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['performance', 'benchmarks', 'load-testing'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['qa-team', 'performance-team'],
      canDelete: ['jennifer.adams']
    }
  },

  // Meeting Files
  {
    id: 'file-011',
    name: 'Stakeholder Meeting Recording.mp4',
    description: 'Recording of stakeholder review meeting',
    type: 'video',
    category: 'meeting',
    size: 52428800, // 50MB
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2024-01-09T17:00:00Z',
    modified: '2024-01-09T17:00:00Z',
    created: '2024-01-09T17:00:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['meeting', 'stakeholders', 'recording'],
    shared: false,
    permissions: {
      canView: ['stakeholders', 'project-manager', 'tech-lead'],
      canEdit: ['project-manager'],
      canDelete: ['mike.johnson']
    }
  },
  {
    id: 'file-012',
    name: 'Daily Standup Notes - Week 3.txt',
    description: 'Summary of daily standup meetings for the week',
    type: 'document',
    category: 'meeting',
    size: 12800, // 12.5KB
    uploadedBy: 'David Wong',
    uploadedAt: '2024-01-12T09:30:00Z',
    modified: '2024-01-12T09:30:00Z',
    created: '2024-01-12T09:30:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['standup', 'notes', 'weekly'],
    shared: true,
    permissions: {
      canView: ['team'],
      canEdit: ['scrum-master'],
      canDelete: ['david.wong']
    }
  },

  // Archive Files
  {
    id: 'file-013',
    name: 'Code Review Archive Q4.zip',
    description: 'Archived code review documents from Q4 2023',
    type: 'archive',
    category: 'other',
    size: 10485760, // 10MB
    uploadedBy: 'Alex Chen',
    uploadedAt: '2024-01-05T16:30:00Z',
    modified: '2024-01-05T16:30:00Z',
    created: '2024-01-05T16:30:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['archive', 'code-review', 'q4'],
    shared: false,
    permissions: {
      canView: ['senior-devs', 'tech-lead'],
      canEdit: [],
      canDelete: ['alex.chen']
    }
  },

  // Recent uploads
  {
    id: 'file-014',
    name: 'User Feedback Compilation.pdf',
    description: 'Compiled user feedback from beta testing phase',
    type: 'document',
    category: 'other',
    size: 768000, // 750KB
    uploadedBy: 'Jennifer Adams',
    uploadedAt: '2024-01-15T13:15:00Z',
    modified: '2024-01-15T13:15:00Z',
    created: '2024-01-15T13:15:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['feedback', 'users', 'beta'],
    shared: true,
    permissions: {
      canView: ['all'],
      canEdit: ['product-team', 'ux-team'],
      canDelete: ['jennifer.adams']
    }
  },
  {
    id: 'file-015',
    name: 'Security Audit Report.docx',
    description: 'Third-party security audit findings and recommendations',
    type: 'document',
    category: 'documentation',
    size: 1433600, // 1.4MB
    uploadedBy: 'Tom Anderson',
    uploadedAt: '2024-01-14T11:45:00Z',
    modified: '2024-01-14T11:45:00Z',
    created: '2024-01-14T11:45:00Z',
    projectId: 'PROJ-001',
    version: '1.0',
    tags: ['security', 'audit', 'compliance'],
    shared: false,
    permissions: {
      canView: ['security-team', 'tech-lead', 'project-manager'],
      canEdit: ['security-team'],
      canDelete: ['tom.anderson']
    }
  }
]

export default mockProjectFiles