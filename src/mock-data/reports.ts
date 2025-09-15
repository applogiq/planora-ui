// Reports Mock Data

export interface ReportData {
  id: string;
  name: string;
  type: 'project' | 'time' | 'revenue' | 'performance' | 'custom';
  description: string;
  createdAt: string;
  createdBy: string;
  lastUpdated: string;
  data: any;
  isPublic: boolean;
  tags: string[];
}

export const mockReports: ReportData[] = [
  {
    id: 'RPT-001',
    name: 'Monthly Project Progress',
    type: 'project',
    description: 'Overview of all active projects and their completion status',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'Project Manager',
    lastUpdated: '2025-01-15T09:00:00Z',
    data: {
      projects: [
        { name: 'Web App Redesign', progress: 75, status: 'On Track' },
        { name: 'Mobile Banking App', progress: 60, status: 'At Risk' },
        { name: 'E-commerce Platform', progress: 45, status: 'Behind Schedule' }
      ]
    },
    isPublic: true,
    tags: ['monthly', 'projects', 'progress']
  },
  {
    id: 'RPT-002',
    name: 'Team Performance Analytics',
    type: 'performance',
    description: 'Individual and team performance metrics',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'System Administrator',
    lastUpdated: '2025-01-14T16:30:00Z',
    data: {
      teamMetrics: [
        { member: 'Rajesh Kumar', tasksCompleted: 23, efficiency: 92 },
        { member: 'Lisa Park', tasksCompleted: 18, efficiency: 88 },
        { member: 'Mike Johnson', tasksCompleted: 15, efficiency: 85 }
      ]
    },
    isPublic: false,
    tags: ['performance', 'team', 'analytics']
  }
];

export interface TimeTrackingEntry {
  id: string;
  userId: string;
  userName: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  taskName?: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  date: string;
  billable: boolean;
  hourlyRate?: number;
}

export const mockTimeEntries: TimeTrackingEntry[] = [
  {
    id: 'TIME-001',
    userId: 'rajesh001',
    userName: 'Rajesh Kumar',
    projectId: 'PROJ-001',
    projectName: 'Web App Redesign',
    taskId: 'TASK-001',
    taskName: 'Implement OAuth2 Social Login',
    description: 'Working on Google OAuth integration',
    startTime: '2025-01-15T09:00:00Z',
    endTime: '2025-01-15T12:30:00Z',
    duration: 210,
    date: '2025-01-15',
    billable: true,
    hourlyRate: 85
  },
  {
    id: 'TIME-002',
    userId: 'lisa001',
    userName: 'Lisa Park',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    taskId: 'TASK-026',
    taskName: 'Biometric Authentication',
    description: 'UI design for fingerprint login',
    startTime: '2025-01-15T10:00:00Z',
    endTime: '2025-01-15T14:00:00Z',
    duration: 240,
    date: '2025-01-15',
    billable: true,
    hourlyRate: 75
  },
  {
    id: 'TIME-003',
    userId: 'dev101',
    userName: 'Senior Developer',
    projectId: 'PROJ-003',
    projectName: 'E-commerce Platform',
    description: 'Code review and testing',
    startTime: '2025-01-14T13:00:00Z',
    endTime: '2025-01-14T17:00:00Z',
    duration: 240,
    date: '2025-01-14',
    billable: true,
    hourlyRate: 90
  }
];

export const dashboardMetrics = {
  totalProjects: 8,
  activeProjects: 5,
  completedProjects: 2,
  onHoldProjects: 1,
  totalTasks: 147,
  completedTasks: 89,
  overdueTasks: 12,
  totalTeamMembers: 15,
  activeTeamMembers: 12,
  totalRevenue: 2480000,
  monthlyRevenue: 185000,
  utilizationRate: 87,
  customerSatisfaction: 4.8
};

// Utility functions
export const getReportsByType = (type: string) => mockReports.filter(report => report.type === type);
export const getPublicReports = () => mockReports.filter(report => report.isPublic);
export const getTimeEntriesByUser = (userId: string) => mockTimeEntries.filter(entry => entry.userId === userId);
export const getTimeEntriesByProject = (projectId: string) => mockTimeEntries.filter(entry => entry.projectId === projectId);
export const getTotalBillableHours = () => mockTimeEntries.reduce((total, entry) => entry.billable ? total + entry.duration : total, 0) / 60;