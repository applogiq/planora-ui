import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Progress } from '../../components/ui/progress'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { Switch } from '../../components/ui/switch'
import { Separator } from '../../components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  Flag,
  MessageSquare,
  Paperclip,
  ChevronDown,
  ChevronRight,
  FileText,
  CheckSquare,
  Zap,
  Bug,
  Target,
  Users,
  Activity,
  Settings,
  PlayCircle,
  PauseCircle,
  ArrowRight,
  AlertTriangle,
  Eye,
  Edit3,
  Star,
  Copy,
  Trash2,
  GitBranch,
  BarChart3,
  Timer,
  Send,
  Layers,
  Grid3X3,
  List,
  SortAsc,
  CalendarDays,
  UserPlus,
  Tags,
  Move,
  ExternalLink,
  Rocket,
  BookOpen,
  Lightbulb,
  MapPin,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
// Planning components removed - module no longer available

// Enhanced sample data
const projects = [
  { id: 'PROJ-001', name: 'E-commerce Platform', color: '#28A745', status: 'Active' },
  { id: 'PROJ-002', name: 'Mobile Banking App', color: '#007BFF', status: 'Active' },
  { id: 'PROJ-003', name: 'CRM System', color: '#FFC107', status: 'Active' },
  { id: 'PROJ-004', name: 'Analytics Dashboard', color: '#DC3545', status: 'Planning' },
  { id: 'PROJ-005', name: 'Security Audit', color: '#6C757D', status: 'Completed' }
]

const teamMembers = [
  { id: 'USER-001', name: 'Rajesh Kumar', email: 'rajesh@planora.com', role: 'Developer', avatar: 'RK', status: 'Online' },
  { id: 'USER-002', name: 'Praveen Kumar', email: 'praveen@planora.com', role: 'QA Engineer', avatar: 'PK', status: 'Online' },
  { id: 'USER-003', name: 'Sarah Wilson', email: 'sarah@planora.com', role: 'Project Manager', avatar: 'SW', status: 'Away' },
  { id: 'USER-004', name: 'Mike Johnson', email: 'mike@planora.com', role: 'Senior Developer', avatar: 'MJ', status: 'Online' },
  { id: 'USER-005', name: 'Lisa Park', email: 'lisa@planora.com', role: 'UX Designer', avatar: 'LP', status: 'Offline' },
  { id: 'USER-006', name: 'Alex Chen', email: 'alex@planora.com', role: 'DevOps Engineer', avatar: 'AC', status: 'Online' },
  { id: 'USER-007', name: 'Emma Davis', email: 'emma@planora.com', role: 'Product Manager', avatar: 'ED', status: 'Online' }
]

const sprintData = [
  {
    id: 'SPRINT-001',
    name: 'Sprint 23 - User Authentication',
    status: 'Active',
    startDate: '2025-01-08',
    endDate: '2025-01-22',
    goal: 'Complete user authentication system with OAuth integration',
    totalPoints: 55,
    completedPoints: 32,
    totalTasks: 18,
    completedTasks: 11,
    velocity: 42,
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    scrumMasterId: 'USER-003',
    scrumMasterName: 'Sarah Wilson',
    teamSize: 6,
    burndownTrend: 'On Track'
  },
  {
    id: 'SPRINT-002',
    name: 'Sprint 24 - Dashboard & Reports',
    status: 'Planning',
    startDate: '2025-01-23',
    endDate: '2025-02-06',
    goal: 'Implement analytics dashboard with real-time reporting',
    totalPoints: 42,
    completedPoints: 0,
    totalTasks: 14,
    completedTasks: 0,
    velocity: 45,
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    scrumMasterId: 'USER-003',
    scrumMasterName: 'Sarah Wilson',
    teamSize: 6,
    burndownTrend: 'Not Started'
  },
  {
    id: 'SPRINT-003',
    name: 'Sprint 22 - Payment Integration',
    status: 'Completed',
    startDate: '2024-12-18',
    endDate: '2025-01-07',
    goal: 'Integrate payment gateway with multiple providers',
    totalPoints: 48,
    completedPoints: 48,
    totalTasks: 16,
    completedTasks: 16,
    velocity: 48,
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    scrumMasterId: 'USER-003',
    scrumMasterName: 'Sarah Wilson',
    teamSize: 6,
    burndownTrend: 'Completed'
  },
  {
    id: 'SPRINT-004',
    name: 'Sprint 15 - Core Banking Features',
    status: 'Active',
    startDate: '2025-01-10',
    endDate: '2025-01-24',
    goal: 'Implement core banking features with security',
    totalPoints: 67,
    completedPoints: 41,
    totalTasks: 22,
    completedTasks: 14,
    velocity: 52,
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    scrumMasterId: 'USER-007',
    scrumMasterName: 'Emma Davis',
    teamSize: 8,
    burndownTrend: 'Ahead'
  },
  {
    id: 'SPRINT-005',
    name: 'Sprint 16 - Mobile UI Enhancement',
    status: 'Planning',
    startDate: '2025-01-25',
    endDate: '2025-02-08',
    goal: 'Enhance mobile UI/UX with new design system',
    totalPoints: 38,
    completedPoints: 0,
    totalTasks: 12,
    completedTasks: 0,
    velocity: 50,
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    scrumMasterId: 'USER-007',
    scrumMasterName: 'Emma Davis',
    teamSize: 8,
    burndownTrend: 'Not Started'
  },
  {
    id: 'SPRINT-006',
    name: 'Sprint 08 - CRM Foundation',
    status: 'In Progress',
    startDate: '2025-01-12',
    endDate: '2025-01-26',
    goal: 'Build foundational CRM features and data models',
    totalPoints: 44,
    completedPoints: 28,
    totalTasks: 18,
    completedTasks: 11,
    velocity: 41,
    projectId: 'PROJ-003',
    projectName: 'CRM System',
    scrumMasterId: 'USER-001',
    scrumMasterName: 'Rajesh Kumar',
    teamSize: 5,
    burndownTrend: 'On Track'
  },
  {
    id: 'SPRINT-007',
    name: 'Sprint 09 - Lead Management',
    status: 'Planning',
    startDate: '2025-01-27',
    endDate: '2025-02-10',
    goal: 'Implement comprehensive lead tracking and conversion',
    totalPoints: 52,
    completedPoints: 0,
    totalTasks: 20,
    completedTasks: 0,
    velocity: 45,
    projectId: 'PROJ-003',
    projectName: 'CRM System',
    scrumMasterId: 'USER-001',
    scrumMasterName: 'Rajesh Kumar',
    teamSize: 5,
    burndownTrend: 'Not Started'
  },
  {
    id: 'SPRINT-008',
    name: 'Sprint 03 - Data Visualization Core',
    status: 'Backlog',
    startDate: '2025-02-15',
    endDate: '2025-03-01',
    goal: 'Build core data visualization engine and charts',
    totalPoints: 58,
    completedPoints: 0,
    totalTasks: 24,
    completedTasks: 0,
    velocity: 48,
    projectId: 'PROJ-004',
    projectName: 'Analytics Dashboard',
    scrumMasterId: 'USER-005',
    scrumMasterName: 'Lisa Park',
    teamSize: 4,
    burndownTrend: 'Not Started'
  },
  {
    id: 'SPRINT-009',
    name: 'Sprint 04 - Interactive Dashboards',
    status: 'Backlog',
    startDate: '2025-03-02',
    endDate: '2025-03-16',
    goal: 'Create interactive dashboard components with filters',
    totalPoints: 46,
    completedPoints: 0,
    totalTasks: 18,
    completedTasks: 0,
    velocity: 50,
    projectId: 'PROJ-004',
    projectName: 'Analytics Dashboard',
    scrumMasterId: 'USER-005',
    scrumMasterName: 'Lisa Park',
    teamSize: 4,
    burndownTrend: 'Not Started'
  },
  {
    id: 'SPRINT-010',
    name: 'Sprint 01 - Security Audit Phase 1',
    status: 'Active',
    startDate: '2025-01-14',
    endDate: '2025-01-28',
    goal: 'Conduct initial security assessment and vulnerability scan',
    totalPoints: 62,
    completedPoints: 35,
    totalTasks: 26,
    completedTasks: 15,
    velocity: 55,
    projectId: 'PROJ-005',
    projectName: 'Security Audit',
    scrumMasterId: 'USER-006',
    scrumMasterName: 'Alex Chen',
    teamSize: 3,
    burndownTrend: 'Behind'
  },
  {
    id: 'SPRINT-011',
    name: 'Sprint 02 - Security Hardening',
    status: 'Planning',
    startDate: '2025-01-29',
    endDate: '2025-02-12',
    goal: 'Implement security fixes and hardening measures',
    totalPoints: 74,
    completedPoints: 0,
    totalTasks: 31,
    completedTasks: 0,
    velocity: 60,
    projectId: 'PROJ-005',
    projectName: 'Security Audit',
    scrumMasterId: 'USER-006',
    scrumMasterName: 'Alex Chen',
    teamSize: 3,
    burndownTrend: 'Not Started'
  },
  {
    id: 'SPRINT-012',
    name: 'Sprint 21 - API Gateway Setup',
    status: 'Completed',
    startDate: '2024-12-04',
    endDate: '2024-12-17',
    goal: 'Setup API gateway infrastructure and basic routing',
    totalPoints: 39,
    completedPoints: 39,
    totalTasks: 15,
    completedTasks: 15,
    velocity: 39,
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    scrumMasterId: 'USER-004',
    scrumMasterName: 'Mike Johnson',
    teamSize: 6,
    burndownTrend: 'Completed'
  }
]

const epicData = [
  {
    id: 'EPIC-001',
    title: 'User Management System',
    description: 'Complete user authentication, authorization, and profile management system with advanced security features',
    priority: 'High',
    status: 'In Progress',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    assigneeId: 'USER-003',
    assigneeName: 'Sarah Wilson',
    createdAt: '2025-01-01T09:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    totalStoryPoints: 89,
    completedStoryPoints: 45,
    totalTasks: 24,
    completedTasks: 12,
    labels: ['Authentication', 'Security', 'Core Feature'],
    businessValue: 'High - Foundation for all user interactions'
  },
  {
    id: 'EPIC-002',
    title: 'Mobile Banking Core Features',
    description: 'Essential mobile banking features including account management, transactions, and security',
    priority: 'Critical',
    status: 'Planning',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    assigneeId: 'USER-007',
    assigneeName: 'Emma Davis',
    createdAt: '2025-01-05T10:00:00Z',
    dueDate: '2025-03-20T17:00:00Z',
    totalStoryPoints: 144,
    completedStoryPoints: 23,
    totalTasks: 38,
    completedTasks: 8,
    labels: ['Mobile', 'Banking', 'Security', 'Core Feature'],
    businessValue: 'Critical - Core revenue generating features'
  },
  {
    id: 'EPIC-003',
    title: 'Advanced Analytics & Reporting',
    description: 'Comprehensive analytics dashboard with real-time data visualization and custom reporting',
    priority: 'Medium',
    status: 'Backlog',
    projectId: 'PROJ-004',
    projectName: 'Analytics Dashboard',
    assigneeId: 'USER-005',
    assigneeName: 'Lisa Park',
    createdAt: '2025-01-10T14:00:00Z',
    dueDate: '2025-04-30T17:00:00Z',
    totalStoryPoints: 76,
    completedStoryPoints: 0,
    totalTasks: 19,
    completedTasks: 0,
    labels: ['Analytics', 'Reporting', 'Visualization'],
    businessValue: 'Medium - Valuable insights for business decisions'
  },
  {
    id: 'EPIC-004',
    title: 'Payment Gateway Integration',
    description: 'Integrate multiple payment providers with secure transaction processing and fraud detection',
    priority: 'High',
    status: 'In Progress',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    assigneeId: 'USER-004',
    assigneeName: 'Mike Johnson',
    createdAt: '2025-01-12T11:00:00Z',
    dueDate: '2025-03-01T17:00:00Z',
    totalStoryPoints: 112,
    completedStoryPoints: 67,
    totalTasks: 28,
    completedTasks: 16,
    labels: ['Payment', 'Integration', 'Security'],
    businessValue: 'High - Essential for revenue generation'
  },
  {
    id: 'EPIC-005',
    title: 'Mobile App Push Notifications',
    description: 'Real-time push notification system for mobile apps with personalization and scheduling',
    priority: 'Medium',
    status: 'Planning',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    assigneeId: 'USER-006',
    assigneeName: 'Alex Chen',
    createdAt: '2025-01-15T08:30:00Z',
    dueDate: '2025-04-15T17:00:00Z',
    totalStoryPoints: 55,
    completedStoryPoints: 12,
    totalTasks: 15,
    completedTasks: 3,
    labels: ['Mobile', 'Notifications', 'Real-time'],
    businessValue: 'Medium - Improves user engagement'
  },
  {
    id: 'EPIC-006',
    title: 'CRM Contact Management',
    description: 'Comprehensive contact management system with lead tracking and customer relationship tools',
    priority: 'High',
    status: 'Active',
    projectId: 'PROJ-003',
    projectName: 'CRM System',
    assigneeId: 'USER-001',
    assigneeName: 'Rajesh Kumar',
    createdAt: '2025-01-18T13:15:00Z',
    dueDate: '2025-05-30T17:00:00Z',
    totalStoryPoints: 98,
    completedStoryPoints: 32,
    totalTasks: 31,
    completedTasks: 10,
    labels: ['CRM', 'Contacts', 'Lead Management'],
    businessValue: 'High - Core CRM functionality'
  },
  {
    id: 'EPIC-007',
    title: 'Data Visualization Engine',
    description: 'Advanced charting and visualization engine with interactive dashboards and custom widgets',
    priority: 'Medium',
    status: 'Backlog',
    projectId: 'PROJ-004',
    projectName: 'Analytics Dashboard',
    assigneeId: 'USER-005',
    assigneeName: 'Lisa Park',
    createdAt: '2025-01-20T09:45:00Z',
    dueDate: '2025-06-15T17:00:00Z',
    totalStoryPoints: 87,
    completedStoryPoints: 0,
    totalTasks: 22,
    completedTasks: 0,
    labels: ['Visualization', 'Charts', 'Dashboard'],
    businessValue: 'Medium - Enhanced data insights'
  },
  {
    id: 'EPIC-008',
    title: 'Security Audit & Compliance',
    description: 'Comprehensive security audit with GDPR compliance, data encryption, and access control improvements',
    priority: 'Critical',
    status: 'Planning',
    projectId: 'PROJ-005',
    projectName: 'Security Audit',
    assigneeId: 'USER-006',
    assigneeName: 'Alex Chen',
    createdAt: '2025-01-22T16:20:00Z',
    dueDate: '2025-03-31T17:00:00Z',
    totalStoryPoints: 134,
    completedStoryPoints: 25,
    totalTasks: 42,
    completedTasks: 8,
    labels: ['Security', 'Compliance', 'GDPR'],
    businessValue: 'Critical - Legal and security requirements'
  },
  {
    id: 'EPIC-009',
    title: 'API Gateway & Microservices',
    description: 'Implement API gateway with microservices architecture, rate limiting, and service discovery',
    priority: 'High',
    status: 'In Progress',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    assigneeId: 'USER-004',
    assigneeName: 'Mike Johnson',
    createdAt: '2025-01-25T10:10:00Z',
    dueDate: '2025-04-10T17:00:00Z',
    totalStoryPoints: 156,
    completedStoryPoints: 78,
    totalTasks: 35,
    completedTasks: 18,
    labels: ['API', 'Microservices', 'Architecture'],
    businessValue: 'High - Scalability and performance'
  },
  {
    id: 'EPIC-010',
    title: 'Customer Support Portal',
    description: 'Self-service customer support portal with ticket management, knowledge base, and live chat',
    priority: 'Medium',
    status: 'Backlog',
    projectId: 'PROJ-003',
    projectName: 'CRM System',
    assigneeId: 'USER-002',
    assigneeName: 'Praveen Kumar',
    createdAt: '2025-01-28T14:30:00Z',
    dueDate: '2025-07-20T17:00:00Z',
    totalStoryPoints: 92,
    completedStoryPoints: 0,
    totalTasks: 26,
    completedTasks: 0,
    labels: ['Support', 'Portal', 'Knowledge Base'],
    businessValue: 'Medium - Customer satisfaction'
  },
  {
    id: 'EPIC-011',
    title: 'Machine Learning Analytics',
    description: 'ML-powered analytics for predictive insights, user behavior analysis, and automated reporting',
    priority: 'Low',
    status: 'Backlog',
    projectId: 'PROJ-004',
    projectName: 'Analytics Dashboard',
    assigneeId: 'USER-005',
    assigneeName: 'Lisa Park',
    createdAt: '2025-01-30T11:45:00Z',
    dueDate: '2025-08-15T17:00:00Z',
    totalStoryPoints: 178,
    completedStoryPoints: 0,
    totalTasks: 45,
    completedTasks: 0,
    labels: ['ML', 'Predictive', 'Analytics'],
    businessValue: 'Low - Future enhancement'
  },
  {
    id: 'EPIC-012',
    title: 'Mobile Banking Fraud Detection',
    description: 'Advanced fraud detection system with real-time monitoring and machine learning algorithms',
    priority: 'Critical',
    status: 'Active',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    assigneeId: 'USER-007',
    assigneeName: 'Emma Davis',
    createdAt: '2025-02-02T08:15:00Z',
    dueDate: '2025-05-01T17:00:00Z',
    totalStoryPoints: 165,
    completedStoryPoints: 41,
    totalTasks: 38,
    completedTasks: 9,
    labels: ['Fraud Detection', 'ML', 'Security'],
    businessValue: 'Critical - Risk mitigation'
  }
]

const backlogData = [
  {
    id: 'STORY-001',
    title: 'User Registration with Email Verification',
    description: 'As a new user, I want to register with my email address and receive a verification link so that I can securely create an account',
    type: 'User Story',
    priority: 'High',
    status: 'Ready',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    assigneeId: 'USER-003',
    assigneeName: 'Sarah Wilson',
    reporterId: 'USER-007',
    reporterName: 'Emma Davis',
    storyPoints: 8,
    businessValue: 'High',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
    labels: ['Authentication', 'Email', 'Security'],
    acceptanceCriteria: [
      'User can enter email and password on registration form',
      'System sends verification email to provided address',
      'User can click verification link to activate account',
      'Account remains inactive until email is verified'
    ]
  },
  {
    id: 'STORY-002',
    title: 'Mobile Payment Processing',
    description: 'As a mobile banking user, I want to make payments through the app so that I can transfer money conveniently',
    type: 'User Story',
    priority: 'Critical',
    status: 'In Progress',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    assigneeId: 'USER-004',
    assigneeName: 'Mike Johnson',
    reporterId: 'USER-007',
    reporterName: 'Emma Davis',
    storyPoints: 13,
    businessValue: 'Critical',
    createdAt: '2025-01-10T11:15:00Z',
    updatedAt: '2025-01-22T16:45:00Z',
    labels: ['Payment', 'Mobile', 'Banking'],
    acceptanceCriteria: [
      'User can select recipient from contacts or enter details',
      'User can specify payment amount and add notes',
      'Payment requires biometric or PIN authentication',
      'Transaction confirmation is displayed with receipt option'
    ]
  },
  {
    id: 'STORY-003',
    title: 'Interactive Dashboard Charts',
    description: 'As a business analyst, I want interactive charts on the dashboard so that I can drill down into data insights',
    type: 'User Story',
    priority: 'Medium',
    status: 'Backlog',
    projectId: 'PROJ-004',
    projectName: 'Analytics Dashboard',
    assigneeId: 'USER-005',
    assigneeName: 'Lisa Park',
    reporterId: 'USER-001',
    reporterName: 'Rajesh Kumar',
    storyPoints: 5,
    businessValue: 'Medium',
    createdAt: '2025-01-12T13:20:00Z',
    updatedAt: '2025-01-18T10:15:00Z',
    labels: ['Analytics', 'Charts', 'Interactive'],
    acceptanceCriteria: [
      'Charts are clickable and show detailed data on interaction',
      'Users can filter data by date range and categories',
      'Charts update in real-time when filters are applied',
      'Hover states show detailed tooltips with context'
    ]
  },
  {
    id: 'STORY-004',
    title: 'OAuth Social Login Integration',
    description: 'As a user, I want to login with Google/Facebook/LinkedIn so that I can access the platform quickly without creating new credentials',
    type: 'User Story',
    priority: 'Medium',
    status: 'Ready',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    assigneeId: 'USER-006',
    assigneeName: 'Alex Chen',
    reporterId: 'USER-003',
    reporterName: 'Sarah Wilson',
    storyPoints: 8,
    businessValue: 'Medium',
    createdAt: '2025-01-08T15:30:00Z',
    updatedAt: '2025-01-21T09:20:00Z',
    labels: ['OAuth', 'Social Login', 'Integration'],
    acceptanceCriteria: [
      'Login page shows Google, Facebook, and LinkedIn options',
      'OAuth flow redirects properly and handles errors gracefully',
      'User profile is populated with social media data',
      'Existing users can link social accounts to their profiles'
    ]
  },
  {
    id: 'STORY-005',
    title: 'Contact Import from CSV',
    description: 'As a sales manager, I want to import contacts from CSV files so that I can quickly add multiple leads to the CRM',
    type: 'User Story',
    priority: 'High',
    status: 'In Progress',
    projectId: 'PROJ-003',
    projectName: 'CRM System',
    assigneeId: 'USER-001',
    assigneeName: 'Rajesh Kumar',
    reporterId: 'USER-007',
    reporterName: 'Emma Davis',
    storyPoints: 5,
    businessValue: 'High',
    createdAt: '2025-01-14T10:45:00Z',
    updatedAt: '2025-01-23T14:10:00Z',
    labels: ['CRM', 'Import', 'CSV'],
    acceptanceCriteria: [
      'User can upload CSV file with contact information',
      'System validates CSV format and shows preview',
      'User can map CSV columns to contact fields',
      'Bulk import creates contacts with proper validation'
    ]
  },
  {
    id: 'STORY-006',
    title: 'Real-time Push Notifications',
    description: 'As a mobile user, I want to receive push notifications for important updates so that I stay informed about my account activity',
    type: 'User Story',
    priority: 'Medium',
    status: 'Backlog',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    assigneeId: 'USER-006',
    assigneeName: 'Alex Chen',
    reporterId: 'USER-007',
    reporterName: 'Emma Davis',
    storyPoints: 8,
    businessValue: 'Medium',
    createdAt: '2025-01-16T12:00:00Z',
    updatedAt: '2025-01-19T16:30:00Z',
    labels: ['Push Notifications', 'Real-time', 'Mobile'],
    acceptanceCriteria: [
      'Users receive notifications for transactions and security alerts',
      'Notification preferences can be managed in settings',
      'Notifications include deep links to relevant app sections',
      'Notification delivery is tracked and logged for debugging'
    ]
  },
  {
    id: 'TASK-001',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure automated deployment pipeline with testing and security scans',
    type: 'Task',
    priority: 'High',
    status: 'Ready',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    assigneeId: 'USER-006',
    assigneeName: 'Alex Chen',
    reporterId: 'USER-004',
    reporterName: 'Mike Johnson',
    storyPoints: 3,
    businessValue: 'Medium',
    createdAt: '2025-01-11T08:15:00Z',
    updatedAt: '2025-01-20T11:45:00Z',
    labels: ['DevOps', 'CI/CD', 'Infrastructure'],
    acceptanceCriteria: [
      'Pipeline runs automated tests on every commit',
      'Security scans are integrated into the pipeline',
      'Deployments are automated to staging and production',
      'Rollback mechanism is available for failed deployments'
    ]
  },
  {
    id: 'BUG-001',
    title: 'Fix Memory Leak in Dashboard Charts',
    description: 'Dashboard charts are causing memory leaks when data is refreshed frequently, leading to browser slowdown',
    type: 'Bug',
    priority: 'High',
    status: 'In Progress',
    projectId: 'PROJ-004',
    projectName: 'Analytics Dashboard',
    assigneeId: 'USER-005',
    assigneeName: 'Lisa Park',
    reporterId: 'USER-002',
    reporterName: 'Praveen Kumar',
    storyPoints: 3,
    businessValue: 'High',
    createdAt: '2025-01-09T14:20:00Z',
    updatedAt: '2025-01-22T13:55:00Z',
    labels: ['Bug', 'Performance', 'Memory'],
    acceptanceCriteria: [
      'Memory usage remains stable during chart data updates',
      'Browser performance is not degraded after extended use',
      'Chart cleanup properly disposes of event listeners',
      'Memory profiling shows no increasing heap usage patterns'
    ]
  },
  {
    id: 'STORY-007',
    title: 'Multi-factor Authentication Setup',
    description: 'As a security-conscious user, I want to enable MFA on my account so that I have an additional layer of protection',
    type: 'User Story',
    priority: 'High',
    status: 'Ready',
    projectId: 'PROJ-005',
    projectName: 'Security Audit',
    assigneeId: 'USER-006',
    assigneeName: 'Alex Chen',
    reporterId: 'USER-003',
    reporterName: 'Sarah Wilson',
    storyPoints: 5,
    businessValue: 'High',
    createdAt: '2025-01-13T11:30:00Z',
    updatedAt: '2025-01-21T15:20:00Z',
    labels: ['Security', 'MFA', 'Authentication'],
    acceptanceCriteria: [
      'User can enable MFA using authenticator apps (Google, Authy)',
      'Backup codes are generated and displayed to user',
      'MFA is required for sensitive operations like password changes',
      'User can disable MFA using backup codes if device is lost'
    ]
  },
  {
    id: 'STORY-008',
    title: 'Advanced Search and Filtering',
    description: 'As a CRM user, I want advanced search capabilities so that I can quickly find specific contacts and leads',
    type: 'User Story',
    priority: 'Medium',
    status: 'Backlog',
    projectId: 'PROJ-003',
    projectName: 'CRM System',
    assigneeId: 'USER-001',
    assigneeName: 'Rajesh Kumar',
    reporterId: 'USER-007',
    reporterName: 'Emma Davis',
    storyPoints: 8,
    businessValue: 'Medium',
    createdAt: '2025-01-17T09:45:00Z',
    updatedAt: '2025-01-20T12:30:00Z',
    labels: ['Search', 'Filtering', 'CRM'],
    acceptanceCriteria: [
      'Users can search by name, email, company, or phone number',
      'Advanced filters include date ranges, lead status, and tags',
      'Search results are paginated and sortable',
      'Saved search queries can be bookmarked for reuse'
    ]
  },
  {
    id: 'STORY-009',
    title: 'Fraud Detection Alerts',
    description: 'As a banking customer, I want to receive immediate alerts for suspicious account activity so that I can respond quickly to potential fraud',
    type: 'User Story',
    priority: 'Critical',
    status: 'Ready',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    assigneeId: 'USER-007',
    assigneeName: 'Emma Davis',
    reporterId: 'USER-004',
    reporterName: 'Mike Johnson',
    storyPoints: 13,
    businessValue: 'Critical',
    createdAt: '2025-01-19T16:15:00Z',
    updatedAt: '2025-01-23T10:40:00Z',
    labels: ['Fraud Detection', 'Alerts', 'Security'],
    acceptanceCriteria: [
      'System detects unusual transaction patterns automatically',
      'Alerts are sent via SMS, email, and push notifications',
      'Users can confirm or deny suspicious transactions',
      'Account is temporarily frozen for high-risk activities'
    ]
  },
  {
    id: 'STORY-010',
    title: 'Custom Report Builder',
    description: 'As a business analyst, I want to create custom reports with drag-and-drop interface so that I can generate insights specific to my needs',
    type: 'User Story',
    priority: 'Low',
    status: 'Backlog',
    projectId: 'PROJ-004',
    projectName: 'Analytics Dashboard',
    assigneeId: 'USER-005',
    assigneeName: 'Lisa Park',
    reporterId: 'USER-001',
    reporterName: 'Rajesh Kumar',
    storyPoints: 13,
    businessValue: 'Medium',
    createdAt: '2025-01-18T13:50:00Z',
    updatedAt: '2025-01-22T09:25:00Z',
    labels: ['Reports', 'Custom', 'Drag and Drop'],
    acceptanceCriteria: [
      'Drag-and-drop interface for selecting data fields',
      'Multiple chart types available (bar, line, pie, table)',
      'Reports can be saved and shared with team members',
      'Scheduled report generation and email delivery'
    ]
  }
]

interface TasksProps {
  user?: any
}

export function Tasks({ user }: TasksProps) {
  const [activeView, setActiveView] = useState<'board' | 'list' | 'sprint' | 'backlog'>('board')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [selectedSprint, setSelectedSprint] = useState<string>('SPRINT-001')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateSprint, setShowCreateSprint] = useState(false)
  const [showCreateEpic, setShowCreateEpic] = useState(false)
  const [showSprintPlanning, setShowSprintPlanning] = useState(false)
  const [showBacklogGrooming, setShowBacklogGrooming] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Pagination state for epics, sprints, and backlog
  const [currentEpicPage, setCurrentEpicPage] = useState(1)
  const [currentSprintPage, setCurrentSprintPage] = useState(1)
  const [currentBacklogPage, setCurrentBacklogPage] = useState(1)
  const [activeTab, setActiveTab] = useState('backlog')
  const [showCreateBacklogItem, setShowCreateBacklogItem] = useState(false)
  const itemsPerPage = 10

  // New Sprint form data
  const [newSprint, setNewSprint] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    projectId: '',
    capacity: 40,
    velocity: 0
  })

  // New Epic form data
  const [newEpic, setNewEpic] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    projectId: '',
    assigneeId: '',
    dueDate: '',
    businessValue: '',
    acceptanceCriteria: [''],
    labels: [] as string[]
  })

  // New Backlog Item form data
  const [newBacklogItem, setNewBacklogItem] = useState({
    title: '',
    description: '',
    type: 'User Story',
    priority: 'Medium',
    projectId: '',
    assigneeId: '',
    reporterId: '',
    storyPoints: 0,
    businessValue: 'Medium',
    labels: [] as string[],
    acceptanceCriteria: ['']
  })

  const userRole = user?.role || 'developer'
  const isAdmin = ['admin', 'super_admin', 'project_manager'].includes(userRole)
  const currentUser = teamMembers.find(member => member.name === user?.name) || teamMembers[0]

  // Pagination logic for epics
  const totalEpicPages = Math.ceil(epicData.length / itemsPerPage)
  const epicStartIndex = (currentEpicPage - 1) * itemsPerPage
  const epicEndIndex = epicStartIndex + itemsPerPage
  const currentEpics = epicData.slice(epicStartIndex, epicEndIndex)

  // Pagination logic for sprints
  const totalSprintPages = Math.ceil(sprintData.length / itemsPerPage)
  const sprintStartIndex = (currentSprintPage - 1) * itemsPerPage
  const sprintEndIndex = sprintStartIndex + itemsPerPage
  const currentSprints = sprintData.slice(sprintStartIndex, sprintEndIndex)

  // Pagination logic for backlog
  const totalBacklogPages = Math.ceil(backlogData.length / itemsPerPage)
  const backlogStartIndex = (currentBacklogPage - 1) * itemsPerPage
  const backlogEndIndex = backlogStartIndex + itemsPerPage
  const currentBacklogItems = backlogData.slice(backlogStartIndex, backlogEndIndex)

  const handleEpicPageChange = (page: number) => {
    setCurrentEpicPage(page)
  }

  const handleSprintPageChange = (page: number) => {
    setCurrentSprintPage(page)
  }

  const handleBacklogPageChange = (page: number) => {
    setCurrentBacklogPage(page)
  }

  const handleCreateSprint = () => {
    if (!newSprint.name || !newSprint.goal || !newSprint.startDate || !newSprint.endDate || !newSprint.projectId) {
      toast.error('Please fill in all required fields')
      return
    }

    // Calculate sprint duration and validate dates
    const start = new Date(newSprint.startDate)
    const end = new Date(newSprint.endDate)
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (durationDays < 1) {
      toast.error('End date must be after start date')
      return
    }

    if (durationDays > 28) {
      toast.error('Sprint duration should not exceed 4 weeks')
      return
    }

    // Create sprint logic here
    const sprint = {
      id: `SPRINT-${Date.now()}`,
      ...newSprint,
      status: 'Planning',
      totalPoints: 0,
      completedPoints: 0,
      totalTasks: 0,
      completedTasks: 0,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    }

    toast.success(`Sprint "${newSprint.name}" created successfully`)
    
    // Reset form
    setNewSprint({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
      projectId: '',
      capacity: 40,
      velocity: 0
    })
    setShowCreateSprint(false)
  }

  const handleCreateEpic = () => {
    if (!newEpic.title || !newEpic.description || !newEpic.projectId || !newEpic.assigneeId) {
      toast.error('Please fill in all required fields')
      return
    }

    // Create epic logic here
    const epic = {
      id: `EPIC-${Date.now()}`,
      ...newEpic,
      status: 'Backlog',
      totalStoryPoints: 0,
      completedStoryPoints: 0,
      totalTasks: 0,
      completedTasks: 0,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      projectName: projects.find(p => p.id === newEpic.projectId)?.name || '',
      assigneeName: teamMembers.find(m => m.id === newEpic.assigneeId)?.name || ''
    }

    toast.success(`Epic "${newEpic.title}" created successfully`)
    
    // Reset form
    setNewEpic({
      title: '',
      description: '',
      priority: 'Medium',
      projectId: '',
      assigneeId: '',
      dueDate: '',
      businessValue: '',
      acceptanceCriteria: [''],
      labels: []
    })
    setShowCreateEpic(false)
  }

  const addAcceptanceCriteria = () => {
    setNewEpic(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, '']
    }))
  }

  const updateAcceptanceCriteria = (index: number, value: string) => {
    setNewEpic(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map((criteria, i) => 
        i === index ? value : criteria
      )
    }))
  }

  const removeAcceptanceCriteria = (index: number) => {
    setNewEpic(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }))
  }

  const handleCreateBacklogItem = () => {
    if (!newBacklogItem.title || !newBacklogItem.description || !newBacklogItem.projectId || !newBacklogItem.assigneeId) {
      toast.error('Please fill in all required fields')
      return
    }

    // Create backlog item logic here
    const backlogItem = {
      id: `${newBacklogItem.type.toUpperCase().replace(' ', '-')}-${Date.now()}`,
      ...newBacklogItem,
      status: 'Backlog',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.id,
      projectName: projects.find(p => p.id === newBacklogItem.projectId)?.name || '',
      assigneeName: teamMembers.find(m => m.id === newBacklogItem.assigneeId)?.name || '',
      reporterName: teamMembers.find(m => m.id === newBacklogItem.reporterId)?.name || ''
    }

    toast.success(`${newBacklogItem.type} "${newBacklogItem.title}" created successfully`)
    
    // Reset form
    setNewBacklogItem({
      title: '',
      description: '',
      type: 'User Story',
      priority: 'Medium',
      projectId: '',
        assigneeId: '',
      reporterId: '',
      storyPoints: 0,
      businessValue: 'Medium',
        labels: [],
      acceptanceCriteria: ['']
    })
    setShowCreateBacklogItem(false)
  }

  // Backlog item acceptance criteria handlers
  const addBacklogAcceptanceCriteria = () => {
    setNewBacklogItem(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, '']
    }))
  }

  const updateBacklogAcceptanceCriteria = (index: number, value: string) => {
    setNewBacklogItem(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map((criteria, i) => 
        i === index ? value : criteria
      )
    }))
  }

  const removeBacklogAcceptanceCriteria = (index: number) => {
    setNewBacklogItem(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Planning</h1>
          <p className="text-muted-foreground">
            Manage tasks, sprints, epics and collaborate with your team using agile methodologies
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSprintPlanning(true)}
              >
                <Target className="w-4 h-4 mr-2" />
                Sprint Planning
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBacklogGrooming(true)}
              >
                <Layers className="w-4 h-4 mr-2" />
                Backlog Grooming
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateSprint(true)}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Create Sprint
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateEpic(true)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Create Epic
              </Button>
              <Button
                size="sm"
                className="bg-[#28A745] hover:bg-[#218838] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Planning Management - Tabbed Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Layers className="w-5 h-5 text-[#007BFF]" />
              <CardTitle>Planning Management</CardTitle>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowCreateBacklogItem(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  New Story
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowCreateEpic(true)}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  New Epic
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowCreateSprint(true)}>
                  <Rocket className="w-4 h-4 mr-2" />
                  New Sprint
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="backlog" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Backlog ({backlogData.length})</span>
              </TabsTrigger>
              <TabsTrigger value="epics" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Epics ({epicData.length})</span>
              </TabsTrigger>
              <TabsTrigger value="sprints" className="flex items-center space-x-2">
                <Rocket className="w-4 h-4" />
                <span>Sprints ({sprintData.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Backlog Tab */}
            <TabsContent value="backlog" className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[320px]">Story/Task</TableHead>
                      <TableHead className="w-[120px]">Type</TableHead>
                      <TableHead className="w-[150px]">Epic</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px]">Priority</TableHead>
                      <TableHead className="w-[80px]">Points</TableHead>
                      <TableHead className="w-[150px]">Assignee</TableHead>
                      <TableHead className="w-[120px]">Updated</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBacklogItems.map((item) => {
                      const project = projects.find(p => p.id === item.projectId)
                      const assignee = teamMembers.find(m => m.id === item.assigneeId)
                      
                      return (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-1 h-8 rounded-full" 
                                  style={{ backgroundColor: project?.color }}
                                />
                                <div>
                                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 ml-3">
                                {item.labels.slice(0, 2).map((label) => (
                                  <Badge key={label} variant="outline" className="text-xs px-1.5 py-0.5">
                                    {label}
                                  </Badge>
                                ))}
                                {item.labels.length > 2 && (
                                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                    +{item.labels.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              item.type === 'User Story' ? 'default' :
                              item.type === 'Task' ? 'secondary' :
                              item.type === 'Bug' ? 'destructive' :
                              'outline'
                            } className="text-xs">
                              {item.type === 'User Story' ? '📖 Story' :
                               item.type === 'Task' ? '⚙️ Task' :
                               item.type === 'Bug' ? '🐛 Bug' : item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {epic ? (
                              <div className="flex items-center space-x-1">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: project?.color }}
                                />
                                <span className="text-sm truncate">{epic.title}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">No Epic</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              item.status === 'Ready' ? 'default' :
                              item.status === 'In Progress' ? 'secondary' :
                              'outline'
                            } className="text-xs">
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${
                              item.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                              item.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                              item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                              'bg-green-100 text-green-700 border-green-200'
                            }`} variant="outline">
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="text-sm font-medium">{item.storyPoints}</div>
                              <div className="text-xs text-muted-foreground">SP</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                                  {assignee?.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm truncate">{item.assigneeName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(item.updatedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Backlog Pagination */}
              {totalBacklogPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {backlogStartIndex + 1} to {Math.min(backlogEndIndex, backlogData.length)} of {backlogData.length} backlog items
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentBacklogPage > 1) handleBacklogPageChange(currentBacklogPage - 1)
                          }}
                          className={currentBacklogPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalBacklogPages)].map((_, index) => {
                        const page = index + 1
                        const showPage = page === 1 || page === totalBacklogPages || 
                                       (page >= currentBacklogPage - 1 && page <= currentBacklogPage + 1)
                        
                        if (!showPage && page === 2 && currentBacklogPage > 4) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        
                        if (!showPage && page === totalBacklogPages - 1 && currentBacklogPage < totalBacklogPages - 3) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        
                        if (!showPage) return null
                        
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                handleBacklogPageChange(page)
                              }}
                              isActive={currentBacklogPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentBacklogPage < totalBacklogPages) handleBacklogPageChange(currentBacklogPage + 1)
                          }}
                          className={currentBacklogPage === totalBacklogPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>

            {/* Epics Tab */}
            <TabsContent value="epics" className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Epic</TableHead>
                      <TableHead className="w-[150px]">Project</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px]">Priority</TableHead>
                      <TableHead className="w-[120px]">Progress</TableHead>
                      <TableHead className="w-[150px]">Assignee</TableHead>
                      <TableHead className="w-[120px]">Due Date</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentEpics.map((epic) => {
                      const progress = epic.totalStoryPoints > 0 ? (epic.completedStoryPoints / epic.totalStoryPoints) * 100 : 0
                      const project = projects.find(p => p.id === epic.projectId)
                      const assignee = teamMembers.find(m => m.id === epic.assigneeId)
                      
                      return (
                        <TableRow key={epic.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-1 h-8 rounded-full" 
                                  style={{ backgroundColor: project?.color }}
                                />
                                <div>
                                  <h4 className="font-medium text-sm line-clamp-1">{epic.title}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{epic.description}</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 ml-3">
                                {epic.labels.slice(0, 2).map((label) => (
                                  <Badge key={label} variant="outline" className="text-xs px-1.5 py-0.5">
                                    {label}
                                  </Badge>
                                ))}
                                {epic.labels.length > 2 && (
                                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                    +{epic.labels.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: project?.color }}
                              />
                              <span className="text-sm">{epic.projectName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              epic.status === 'Active' || epic.status === 'In Progress' ? 'default' :
                              epic.status === 'Planning' ? 'secondary' :
                              'outline'
                            } className="text-xs">
                              {epic.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${
                              epic.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                              epic.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                              epic.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                              'bg-green-100 text-green-700 border-green-200'
                            }`} variant="outline">
                              {epic.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>{Math.round(progress)}%</span>
                                <span className="text-muted-foreground">{epic.completedStoryPoints}/{epic.totalStoryPoints} SP</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                              <div className="text-xs text-muted-foreground">
                                {epic.completedTasks}/{epic.totalTasks} tasks
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                                  {assignee?.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm truncate">{epic.assigneeName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(epic.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Epics Pagination */}
              {totalEpicPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {epicStartIndex + 1} to {Math.min(epicEndIndex, epicData.length)} of {epicData.length} epics
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentEpicPage > 1) handleEpicPageChange(currentEpicPage - 1)
                          }}
                          className={currentEpicPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalEpicPages)].map((_, index) => {
                        const page = index + 1
                        const showPage = page === 1 || page === totalEpicPages || 
                                       (page >= currentEpicPage - 1 && page <= currentEpicPage + 1)
                        
                        if (!showPage && page === 2 && currentEpicPage > 4) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        
                        if (!showPage && page === totalEpicPages - 1 && currentEpicPage < totalEpicPages - 3) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        
                        if (!showPage) return null
                        
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                handleEpicPageChange(page)
                              }}
                              isActive={currentEpicPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentEpicPage < totalEpicPages) handleEpicPageChange(currentEpicPage + 1)
                          }}
                          className={currentEpicPage === totalEpicPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>

            {/* Sprints Tab */}
            <TabsContent value="sprints" className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[280px]">Sprint</TableHead>
                      <TableHead className="w-[150px]">Project</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[120px]">Progress</TableHead>
                      <TableHead className="w-[100px]">Velocity</TableHead>
                      <TableHead className="w-[120px]">Timeline</TableHead>
                      <TableHead className="w-[150px]">Scrum Master</TableHead>
                      <TableHead className="w-[100px]">Trend</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSprints.map((sprint) => {
                      const progress = sprint.totalPoints > 0 ? (sprint.completedPoints / sprint.totalPoints) * 100 : 0
                      const project = projects.find(p => p.id === sprint.projectId)
                      const scrumMaster = teamMembers.find(m => m.id === sprint.scrumMasterId)
                      const startDate = new Date(sprint.startDate)
                      const endDate = new Date(sprint.endDate)
                      const today = new Date()
                      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                      const passedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                      const daysRemaining = Math.max(0, totalDays - passedDays)
                      
                      return (
                        <TableRow key={sprint.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-1 h-8 rounded-full" 
                                  style={{ backgroundColor: project?.color }}
                                />
                                <div>
                                  <h4 className="font-medium text-sm line-clamp-1">{sprint.name}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{sprint.goal}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 ml-3 text-xs text-muted-foreground">
                                <span>👥 {sprint.teamSize} members</span>
                                <span>📊 {sprint.totalTasks} tasks</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: project?.color }}
                              />
                              <span className="text-sm">{sprint.projectName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              sprint.status === 'Active' ? 'default' :
                              sprint.status === 'Planning' || sprint.status === 'Backlog' ? 'secondary' :
                              sprint.status === 'Completed' ? 'outline' :
                              'default'
                            } className="text-xs">
                              {sprint.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>{Math.round(progress)}%</span>
                                <span className="text-muted-foreground">{sprint.completedPoints}/{sprint.totalPoints} SP</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                              <div className="text-xs text-muted-foreground">
                                {sprint.completedTasks}/{sprint.totalTasks} tasks
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="text-sm font-medium">{sprint.velocity}</div>
                              <div className="text-xs text-muted-foreground">SP/sprint</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-xs">
                                {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              {sprint.status === 'Active' && (
                                <div className="text-xs text-muted-foreground">
                                  {daysRemaining > 0 ? `${daysRemaining} days left` : 'Sprint ended'}
                                </div>
                              )}
                              {sprint.status === 'Planning' && (
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  Starts in {Math.max(0, Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))} days
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-[#28A745] text-white">
                                  {scrumMaster?.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm truncate">{sprint.scrumMasterName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${
                              sprint.burndownTrend === 'Ahead' ? 'bg-green-100 text-green-700 border-green-200' :
                              sprint.burndownTrend === 'On Track' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              sprint.burndownTrend === 'Behind' ? 'bg-red-100 text-red-700 border-red-200' :
                              sprint.burndownTrend === 'Completed' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                              'bg-gray-100 text-gray-700 border-gray-200'
                            }`} variant="outline">
                              {sprint.burndownTrend}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Sprints Pagination */}
              {totalSprintPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {sprintStartIndex + 1} to {Math.min(sprintEndIndex, sprintData.length)} of {sprintData.length} sprints
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentSprintPage > 1) handleSprintPageChange(currentSprintPage - 1)
                          }}
                          className={currentSprintPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalSprintPages)].map((_, index) => {
                        const page = index + 1
                        const showPage = page === 1 || page === totalSprintPages || 
                                       (page >= currentSprintPage - 1 && page <= currentSprintPage + 1)
                        
                        if (!showPage && page === 2 && currentSprintPage > 4) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        
                        if (!showPage && page === totalSprintPages - 1 && currentSprintPage < totalSprintPages - 3) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        
                        if (!showPage) return null
                        
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                handleSprintPageChange(page)
                              }}
                              isActive={currentSprintPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentSprintPage < totalSprintPages) handleSprintPageChange(currentSprintPage + 1)
                          }}
                          className={currentSprintPage === totalSprintPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>



      {/* Create Sprint Dialog */}
      <Dialog open={showCreateSprint} onOpenChange={setShowCreateSprint}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-[#28A745]" />
              <span>Create New Sprint</span>
            </DialogTitle>
            <DialogDescription>
              Set up a new sprint with goals, timeline, and team capacity
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sprintName">Sprint Name *</Label>
                <Input
                  id="sprintName"
                  placeholder="e.g., Sprint 25 - Payment Integration"
                  value={newSprint.name}
                  onChange={(e) => setNewSprint(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sprintProject">Project *</Label>
                <Select value={newSprint.projectId} onValueChange={(value) => setNewSprint(prev => ({ ...prev, projectId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: project.color }}
                          />
                          <span>{project.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sprintGoal">Sprint Goal *</Label>
              <Textarea
                id="sprintGoal"
                placeholder="What do you want to achieve in this sprint?"
                value={newSprint.goal}
                onChange={(e) => setNewSprint(prev => ({ ...prev, goal: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newSprint.startDate}
                  onChange={(e) => setNewSprint(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newSprint.endDate}
                  onChange={(e) => setNewSprint(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Team Capacity (hours)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="200"
                  value={newSprint.capacity}
                  onChange={(e) => setNewSprint(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                />
                <p className="text-xs text-muted-foreground">
                  Total available team hours for this sprint
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="velocity">Expected Velocity</Label>
                <Input
                  id="velocity"
                  type="number"
                  min="0"
                  max="100"
                  value={newSprint.velocity}
                  onChange={(e) => setNewSprint(prev => ({ ...prev, velocity: parseInt(e.target.value) || 0 }))}
                />
                <p className="text-xs text-muted-foreground">
                  Story points expected to complete (based on team history)
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Sprint Planning Tips</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Keep sprints between 1-4 weeks for optimal productivity</li>
                    <li>• Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)</li>
                    <li>• Consider team holidays and availability when setting capacity</li>
                    <li>• Use historical velocity data to set realistic expectations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateSprint(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSprint}
              className="bg-[#28A745] hover:bg-[#218838] text-white"
            >
              Create Sprint
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Epic Dialog */}
      <Dialog open={showCreateEpic} onOpenChange={setShowCreateEpic}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#007BFF]" />
              <span>Create New Epic</span>
            </DialogTitle>
            <DialogDescription>
              Define a large feature or initiative that spans multiple sprints
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="epicTitle">Epic Title *</Label>
                <Input
                  id="epicTitle"
                  placeholder="e.g., Advanced User Authentication System"
                  value={newEpic.title}
                  onChange={(e) => setNewEpic(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="epicPriority">Priority</Label>
                <Select value={newEpic.priority} onValueChange={(value) => setNewEpic(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="epicDescription">Description *</Label>
              <Textarea
                id="epicDescription"
                placeholder="Describe the epic, its purpose, and expected outcomes..."
                value={newEpic.description}
                onChange={(e) => setNewEpic(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="epicProject">Project *</Label>
                <Select value={newEpic.projectId} onValueChange={(value) => setNewEpic(prev => ({ ...prev, projectId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: project.color }}
                          />
                          <span>{project.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="epicAssignee">Epic Owner *</Label>
                <Select value={newEpic.assigneeId} onValueChange={(value) => setNewEpic(prev => ({ ...prev, assigneeId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-4 h-4">
                            <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                          <span className="text-xs text-muted-foreground">({member.role})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="epicDueDate">Target Date</Label>
                <Input
                  id="epicDueDate"
                  type="date"
                  value={newEpic.dueDate}
                  onChange={(e) => setNewEpic(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessValue">Business Value</Label>
              <Textarea
                id="businessValue"
                placeholder="Explain the business value and impact of this epic..."
                value={newEpic.businessValue}
                onChange={(e) => setNewEpic(prev => ({ ...prev, businessValue: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Acceptance Criteria</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAcceptanceCriteria}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Criteria
                </Button>
              </div>
              
              {newEpic.acceptanceCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckSquare className="w-4 h-4 mt-3 text-muted-foreground" />
                  <div className="flex-1">
                    <Textarea
                      placeholder={`Acceptance criteria ${index + 1}...`}
                      value={criteria}
                      onChange={(e) => updateAcceptanceCriteria(index, e.target.value)}
                      rows={2}
                    />
                  </div>
                  {newEpic.acceptanceCriteria.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAcceptanceCriteria(index)}
                      className="mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Epic Best Practices</h4>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Focus on user value and business outcomes</li>
                    <li>• Keep epics large enough to span 2-6 sprints</li>
                    <li>• Write clear acceptance criteria for definition of done</li>
                    <li>• Assign an epic owner responsible for delivery</li>
                    <li>• Break down into user stories before sprint planning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateEpic(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateEpic}
              className="bg-[#007BFF] hover:bg-[#0056B3] text-white"
            >
              Create Epic
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sprint Planning Dialog */}
      <Dialog open={showSprintPlanning} onOpenChange={setShowSprintPlanning}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-[#28A745]" />
              <span>Sprint Planning Session</span>
            </DialogTitle>
            <DialogDescription>
              Plan your next sprint by selecting tasks from the backlog and estimating capacity
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Backlog</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Drag items to the sprint to add them
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {epicData.slice(0, 2).map((epic) => (
                      <Card key={epic.id} className="p-3 cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{epic.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {epic.totalStoryPoints} SP • {epic.totalTasks} tasks
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-xs ${
                              epic.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                              epic.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {epic.priority}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sprint 25 (Planning)</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    0/45 story points • 0% capacity used
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drop backlog items here to add to sprint
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Capacity</span>
                        <span>0/45 SP</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Velocity & Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#28A745]">42</p>
                    <p className="text-sm text-muted-foreground">Last Sprint Velocity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#007BFF]">38</p>
                    <p className="text-sm text-muted-foreground">3-Sprint Average</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#FFC107]">45</p>
                    <p className="text-sm text-muted-foreground">Recommended Capacity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#6C757D]">7</p>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowSprintPlanning(false)}>
              Close
            </Button>
            <Button className="bg-[#28A745] hover:bg-[#218838] text-white">
              Start Sprint
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Backlog Grooming Dialog */}
      <Dialog open={showBacklogGrooming} onOpenChange={setShowBacklogGrooming}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#007BFF]" />
              <span>Backlog Grooming Session</span>
            </DialogTitle>
            <DialogDescription>
              Refine, estimate, and prioritize backlog items for upcoming sprints
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Backlog Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#28A745]">156</p>
                    <p className="text-sm text-muted-foreground">Ready Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#FFC107]">23</p>
                    <p className="text-sm text-muted-foreground">Need Estimation</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#DC3545]">8</p>
                    <p className="text-sm text-muted-foreground">Blocked Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#007BFF]">3</p>
                    <p className="text-sm text-muted-foreground">Sprints Ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Items Needing Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {epicData.map((epic, index) => (
                    <div key={epic.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-mono text-muted-foreground">#{index + 1}</span>
                            <BookOpen className="w-4 h-4 text-[#007BFF]" />
                          </div>
                          <div>
                            <h4 className="font-medium">{epic.title}</h4>
                            <p className="text-sm text-muted-foreground">{epic.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={`text-xs ${
                          epic.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          epic.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {epic.priority}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {epic.totalStoryPoints || '?'} SP
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Refine
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowBacklogGrooming(false)}>
              Close Session
            </Button>
            <Button className="bg-[#007BFF] hover:bg-[#0056B3] text-white">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}