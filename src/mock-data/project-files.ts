// Project Files Mock Data

export interface ProjectFile {
  id: string
  name: string
  type: 'document' | 'image' | 'video' | 'archive' | 'code' | 'spreadsheet' | 'presentation' | 'other'
  size: string
  uploadedBy: string
  uploadedAt: string
  category: 'requirements' | 'design' | 'documentation' | 'assets' | 'reports' | 'contracts' | 'other'
  version?: string
  description?: string
  tags?: string[]
  url?: string
  thumbnail?: string
  isShared?: boolean
  sharedWith?: string[]
  lastModified?: string
  modifiedBy?: string
}

export const mockProjectFiles: ProjectFile[] = [
  // Requirements Documents
  {
    id: 'file-001',
    name: 'Project Requirements Document.pdf',
    type: 'document',
    size: '2.4 MB',
    uploadedBy: 'Sarah Wilson',
    uploadedAt: '2024-01-10T09:00:00Z',
    category: 'requirements',
    version: 'v1.2',
    description: 'Comprehensive project requirements and specifications',
    tags: ['requirements', 'specifications', 'approved'],
    isShared: true,
    sharedWith: ['All Team Members'],
    lastModified: '2024-01-12T14:30:00Z',
    modifiedBy: 'Product Owner'
  },
  {
    id: 'file-002',
    name: 'User Stories and Acceptance Criteria.docx',
    type: 'document',
    size: '892 KB',
    uploadedBy: 'Product Owner',
    uploadedAt: '2024-01-08T11:15:00Z',
    category: 'requirements',
    version: 'v2.0',
    description: 'Detailed user stories with acceptance criteria for all features',
    tags: ['user-stories', 'acceptance-criteria', 'agile'],
    isShared: true,
    sharedWith: ['Development Team', 'QA Team']
  },
  {
    id: 'file-003',
    name: 'API Specification.yaml',
    type: 'code',
    size: '156 KB',
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2024-01-15T16:45:00Z',
    category: 'documentation',
    version: 'v1.0',
    description: 'OpenAPI specification for REST API endpoints',
    tags: ['api', 'swagger', 'documentation'],
    isShared: true,
    sharedWith: ['Backend Team', 'Frontend Team']
  },

  // Design Assets
  {
    id: 'file-004',
    name: 'UI Mockups - Dashboard.fig',
    type: 'other',
    size: '15.2 MB',
    uploadedBy: 'Lisa Park',
    uploadedAt: '2024-01-12T10:30:00Z',
    category: 'design',
    version: 'v3.1',
    description: 'Figma design file for dashboard UI components',
    tags: ['ui', 'mockups', 'figma', 'dashboard'],
    isShared: true,
    sharedWith: ['Frontend Team', 'UX Team'],
    lastModified: '2024-01-14T09:20:00Z',
    modifiedBy: 'UX Designer'
  },
  {
    id: 'file-005',
    name: 'Brand Guidelines.pdf',
    type: 'document',
    size: '8.7 MB',
    uploadedBy: 'Design Team',
    uploadedAt: '2024-01-05T14:00:00Z',
    category: 'design',
    version: 'v1.0',
    description: 'Brand identity guidelines including colors, typography, and logos',
    tags: ['brand', 'guidelines', 'design-system'],
    isShared: true,
    sharedWith: ['All Team Members']
  },
  {
    id: 'file-006',
    name: 'Icon Library.zip',
    type: 'archive',
    size: '4.1 MB',
    uploadedBy: 'David Wong',
    uploadedAt: '2024-01-13T13:22:00Z',
    category: 'assets',
    description: 'SVG icon library for the application',
    tags: ['icons', 'svg', 'assets'],
    isShared: true,
    sharedWith: ['Frontend Team', 'Design Team']
  },

  // Documentation
  {
    id: 'file-007',
    name: 'Technical Architecture Diagram.png',
    type: 'image',
    size: '1.8 MB',
    uploadedBy: 'Alex Chen',
    uploadedAt: '2024-01-11T15:45:00Z',
    category: 'documentation',
    version: 'v2.0',
    description: 'System architecture overview showing microservices and data flow',
    tags: ['architecture', 'diagram', 'technical'],
    isShared: true,
    sharedWith: ['Backend Team', 'DevOps Team'],
    thumbnail: '/thumbnails/architecture-thumb.png'
  },
  {
    id: 'file-008',
    name: 'Database Schema Documentation.pdf',
    type: 'document',
    size: '1.2 MB',
    uploadedBy: 'Database Administrator',
    uploadedAt: '2024-01-09T12:00:00Z',
    category: 'documentation',
    version: 'v1.1',
    description: 'Complete database schema with table relationships and indexes',
    tags: ['database', 'schema', 'documentation'],
    isShared: true,
    sharedWith: ['Backend Team', 'DBA Team']
  },
  {
    id: 'file-009',
    name: 'Deployment Guide.md',
    type: 'document',
    size: '89 KB',
    uploadedBy: 'DevOps Engineer',
    uploadedAt: '2024-01-14T11:30:00Z',
    category: 'documentation',
    description: 'Step-by-step deployment instructions for staging and production',
    tags: ['deployment', 'devops', 'guide'],
    isShared: true,
    sharedWith: ['DevOps Team', 'Backend Team']
  },

  // Reports
  {
    id: 'file-010',
    name: 'Sprint 11 Retrospective Report.pptx',
    type: 'presentation',
    size: '5.4 MB',
    uploadedBy: 'Scrum Master',
    uploadedAt: '2024-01-08T17:00:00Z',
    category: 'reports',
    description: 'Sprint retrospective findings and action items',
    tags: ['retrospective', 'sprint', 'agile'],
    isShared: true,
    sharedWith: ['Development Team']
  },
  {
    id: 'file-011',
    name: 'Performance Test Results.xlsx',
    type: 'spreadsheet',
    size: '2.1 MB',
    uploadedBy: 'QA Engineer',
    uploadedAt: '2024-01-13T14:15:00Z',
    category: 'reports',
    version: 'v1.0',
    description: 'Load testing results and performance metrics analysis',
    tags: ['performance', 'testing', 'metrics'],
    isShared: true,
    sharedWith: ['QA Team', 'Backend Team']
  },
  {
    id: 'file-012',
    name: 'Security Audit Report.pdf',
    type: 'document',
    size: '3.8 MB',
    uploadedBy: 'Security Analyst',
    uploadedAt: '2024-01-07T16:30:00Z',
    category: 'reports',
    description: 'Security vulnerability assessment and recommendations',
    tags: ['security', 'audit', 'vulnerabilities'],
    isShared: false,
    sharedWith: ['Security Team', 'Tech Lead']
  },

  // Contracts and Legal
  {
    id: 'file-013',
    name: 'Software License Agreement.pdf',
    type: 'document',
    size: '678 KB',
    uploadedBy: 'Legal Team',
    uploadedAt: '2024-01-03T10:00:00Z',
    category: 'contracts',
    description: 'Third-party software licensing agreements',
    tags: ['legal', 'license', 'contracts'],
    isShared: false,
    sharedWith: ['Project Manager', 'Legal Team']
  },
  {
    id: 'file-014',
    name: 'Client Contract Amendment.docx',
    type: 'document',
    size: '234 KB',
    uploadedBy: 'Project Manager',
    uploadedAt: '2024-01-06T09:45:00Z',
    category: 'contracts',
    description: 'Contract amendment for scope and timeline changes',
    tags: ['contract', 'amendment', 'client'],
    isShared: false,
    sharedWith: ['Project Manager', 'Client']
  },

  // Training and Resources
  {
    id: 'file-015',
    name: 'React Best Practices Guide.pdf',
    type: 'document',
    size: '1.9 MB',
    uploadedBy: 'Senior Developer',
    uploadedAt: '2024-01-04T13:20:00Z',
    category: 'documentation',
    description: 'Development guidelines and best practices for React components',
    tags: ['react', 'best-practices', 'guidelines'],
    isShared: true,
    sharedWith: ['Frontend Team']
  },
  {
    id: 'file-016',
    name: 'Team Onboarding Video.mp4',
    type: 'video',
    size: '125 MB',
    uploadedBy: 'HR Team',
    uploadedAt: '2024-01-02T15:00:00Z',
    category: 'other',
    description: 'New team member onboarding and project overview',
    tags: ['onboarding', 'training', 'video'],
    isShared: true,
    sharedWith: ['All Team Members'],
    thumbnail: '/thumbnails/video-thumb.jpg'
  }
]

// File categories and their properties
export const fileCategories = [
  { value: 'all', label: 'All Files', icon: 'FileText' },
  { value: 'requirements', label: 'Requirements', icon: 'Target' },
  { value: 'design', label: 'Design', icon: 'Palette' },
  { value: 'documentation', label: 'Documentation', icon: 'BookOpen' },
  { value: 'assets', label: 'Assets', icon: 'Image' },
  { value: 'reports', label: 'Reports', icon: 'BarChart3' },
  { value: 'contracts', label: 'Contracts', icon: 'FileCheck' },
  { value: 'other', label: 'Other', icon: 'Folder' }
]

// File type icons and colors
export const fileTypeConfig = {
  document: { icon: 'FileText', color: 'text-red-600', bgColor: 'bg-red-50' },
  image: { icon: 'Image', color: 'text-green-600', bgColor: 'bg-green-50' },
  video: { icon: 'Play', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  archive: { icon: 'Archive', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  code: { icon: 'Code', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  spreadsheet: { icon: 'Table', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  presentation: { icon: 'Presentation', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  other: { icon: 'File', color: 'text-gray-600', bgColor: 'bg-gray-50' }
}

// File sharing permissions
export const sharingOptions = [
  { value: 'all', label: 'All Team Members' },
  { value: 'developers', label: 'Development Team' },
  { value: 'designers', label: 'Design Team' },
  { value: 'qa', label: 'QA Team' },
  { value: 'managers', label: 'Project Managers' },
  { value: 'custom', label: 'Custom Selection' }
]

// Recent file activities
export const recentFileActivities = [
  {
    id: 1,
    action: 'uploaded',
    fileName: 'API Specification.yaml',
    user: 'Mike Johnson',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    action: 'updated',
    fileName: 'UI Mockups - Dashboard.fig',
    user: 'Lisa Park',
    timestamp: '4 hours ago'
  },
  {
    id: 3,
    action: 'shared',
    fileName: 'Performance Test Results.xlsx',
    user: 'QA Engineer',
    timestamp: '1 day ago'
  },
  {
    id: 4,
    action: 'commented on',
    fileName: 'Technical Architecture Diagram.png',
    user: 'Alex Chen',
    timestamp: '2 days ago'
  }
]

export default {
  files: mockProjectFiles,
  categories: fileCategories,
  typeConfig: fileTypeConfig,
  sharingOptions: sharingOptions,
  recentActivities: recentFileActivities
}