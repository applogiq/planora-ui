import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Progress } from '../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Textarea } from '../../components/ui/textarea'
import { Calendar } from '../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  Calendar as CalendarIcon,
  Download,
  Filter,
  Search,
  Timer,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Settings,
  User,
  Users,
  TrendingUp,
  Activity,
  Target,
  Eye,
  Edit3,
  CoffeeIcon as Coffee,
  Zap,
  Award,
  TrendingDown,
  Calendar as CalendarCheck,
  Clock3,
  CheckSquare,
  AlertTriangle,
  BookOpen,
  Send,
  ArrowRight,
  MapPin,
  Smartphone,
  Laptop,
  Globe,
  Star,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

// Helper date formatting function
const formatDate = (date: Date | string, format: string = 'MMM dd, yyyy') => {
  const d = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'yyyy-MM-dd':
      return d.toISOString().split('T')[0]
    case 'MMM dd, yyyy':
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    case 'HH:mm':
      return d.toTimeString().slice(0, 5)
    case 'MMM dd':
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    case 'full':
      return d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    default:
      return d.toLocaleDateString()
  }
}

// Comprehensive sample data
const projects = [
  { 
    id: 'PROJ-001', 
    name: 'E-commerce Platform', 
    client: 'TechCorp Solutions', 
    budgetHours: 320, 
    spentHours: 248, 
    hourlyRate: 85,
    color: '#28A745',
    status: 'Active',
    deadline: '2025-02-15',
    team: ['USER-001', 'USER-002', 'USER-005']
  },
  { 
    id: 'PROJ-002', 
    name: 'Mobile Banking App', 
    client: 'FinanceFirst Bank', 
    budgetHours: 480, 
    spentHours: 312, 
    hourlyRate: 95,
    color: '#007BFF',
    status: 'Active',
    deadline: '2025-03-20',
    team: ['USER-001', 'USER-003', 'USER-004']
  },
  { 
    id: 'PROJ-003', 
    name: 'CRM Integration', 
    client: 'SalesForce Inc', 
    budgetHours: 240, 
    spentHours: 186, 
    hourlyRate: 90,
    color: '#FFC107',
    status: 'Active',
    deadline: '2025-01-30',
    team: ['USER-002', 'USER-004', 'USER-006']
  },
  { 
    id: 'PROJ-004', 
    name: 'Analytics Dashboard', 
    client: 'DataFlow Systems', 
    budgetHours: 160, 
    spentHours: 142, 
    hourlyRate: 80,
    color: '#DC3545',
    status: 'Completed',
    deadline: '2025-01-15',
    team: ['USER-001', 'USER-005']
  },
  { 
    id: 'PROJ-005', 
    name: 'Security Audit Platform', 
    client: 'CyberSafe Technologies', 
    budgetHours: 200, 
    spentHours: 89, 
    hourlyRate: 110,
    color: '#6C757D',
    status: 'Planning',
    deadline: '2025-04-10',
    team: ['USER-003', 'USER-006']
  }
]

const teamMembers = [
  { 
    id: 'USER-001', 
    name: 'Rajesh Kumar', 
    email: 'rajesh@planora.com', 
    role: 'Senior Developer', 
    avatar: 'RK',
    status: 'Online',
    hourlyRate: 85,
    department: 'Engineering',
    timezone: 'Asia/Kolkata',
    workingHours: '09:00-18:00'
  },
  { 
    id: 'USER-002', 
    name: 'Praveen Kumar', 
    email: 'praveen@planora.com', 
    role: 'QA Engineer', 
    avatar: 'PK',
    status: 'Online',
    hourlyRate: 70,
    department: 'Quality Assurance',
    timezone: 'Asia/Kolkata',
    workingHours: '10:00-19:00'
  },
  { 
    id: 'USER-003', 
    name: 'Sarah Wilson', 
    email: 'sarah@planora.com', 
    role: 'Project Manager', 
    avatar: 'SW',
    status: 'Away',
    hourlyRate: 95,
    department: 'Management',
    timezone: 'America/New_York',
    workingHours: '08:00-17:00'
  },
  { 
    id: 'USER-004', 
    name: 'Mike Johnson', 
    email: 'mike@planora.com', 
    role: 'DevOps Engineer', 
    avatar: 'MJ',
    status: 'Online',
    hourlyRate: 90,
    department: 'Infrastructure',
    timezone: 'America/Los_Angeles',
    workingHours: '09:00-18:00'
  },
  { 
    id: 'USER-005', 
    name: 'Lisa Park', 
    email: 'lisa@planora.com', 
    role: 'UX Designer', 
    avatar: 'LP',
    status: 'Offline',
    hourlyRate: 75,
    department: 'Design',
    timezone: 'America/New_York',
    workingHours: '09:00-17:00'
  },
  { 
    id: 'USER-006', 
    name: 'Alex Chen', 
    email: 'alex@planora.com', 
    role: 'Security Specialist', 
    avatar: 'AC',
    status: 'Online',
    hourlyRate: 110,
    department: 'Security',
    timezone: 'Asia/Singapore',
    workingHours: '09:00-18:00'
  }
]

const tasks = [
  { 
    id: 'TASK-001', 
    title: 'OAuth Authentication Implementation', 
    projectId: 'PROJ-001', 
    project: 'E-commerce Platform',
    assigneeId: 'USER-001',
    estimatedHours: 16,
    loggedHours: 12.5,
    status: 'In Progress',
    priority: 'High'
  },
  { 
    id: 'TASK-002', 
    title: 'Payment Gateway Integration', 
    projectId: 'PROJ-001', 
    project: 'E-commerce Platform',
    assigneeId: 'USER-001',
    estimatedHours: 24,
    loggedHours: 18,
    status: 'In Progress',
    priority: 'High'
  },
  { 
    id: 'TASK-003', 
    title: 'Mobile App Security Testing', 
    projectId: 'PROJ-002', 
    project: 'Mobile Banking App',
    assigneeId: 'USER-002',
    estimatedHours: 20,
    loggedHours: 16,
    status: 'Testing',
    priority: 'Critical'
  },
  { 
    id: 'TASK-004', 
    title: 'Database Schema Optimization', 
    projectId: 'PROJ-002', 
    project: 'Mobile Banking App',
    assigneeId: 'USER-004',
    estimatedHours: 12,
    loggedHours: 8,
    status: 'In Progress',
    priority: 'Medium'
  },
  { 
    id: 'TASK-005', 
    title: 'CRM API Documentation', 
    projectId: 'PROJ-003', 
    project: 'CRM Integration',
    assigneeId: 'USER-002',
    estimatedHours: 8,
    loggedHours: 6,
    status: 'Review',
    priority: 'Low'
  },
  { 
    id: 'TASK-006', 
    title: 'Dashboard UI Wireframes', 
    projectId: 'PROJ-004', 
    project: 'Analytics Dashboard',
    assigneeId: 'USER-005',
    estimatedHours: 16,
    loggedHours: 16,
    status: 'Completed',
    priority: 'Medium'
  },
  { 
    id: 'TASK-007', 
    title: 'Security Vulnerability Assessment', 
    projectId: 'PROJ-005', 
    project: 'Security Audit Platform',
    assigneeId: 'USER-006',
    estimatedHours: 32,
    loggedHours: 24,
    status: 'In Progress',
    priority: 'Critical'
  }
]

// Comprehensive time entries data
const timeEntriesData = [
  {
    id: 'TIME-001',
    userId: 'USER-001',
    userName: 'Rajesh Kumar',
    userAvatar: 'RK',
    taskId: 'TASK-001',
    taskTitle: 'OAuth Authentication Implementation',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    client: 'TechCorp Solutions',
    date: '2025-01-13',
    startTime: '09:00',
    endTime: '12:30',
    duration: 3.5,
    breakDuration: 0,
    description: 'Implemented OAuth2 flow with Google and GitHub providers. Added token refresh mechanism and error handling.',
    billable: true,
    status: 'approved',
    hourlyRate: 85,
    amount: 297.50,
    isOvertime: false,
    location: 'Office',
    device: 'Laptop',
    mood: 'productive',
    tags: ['development', 'authentication', 'backend'],
    screenshots: 2,
    activityLevel: 92,
    approvedBy: 'USER-003',
    approvedAt: '2025-01-13T18:00:00Z',
    submittedAt: '2025-01-13T12:30:00Z'
  },
  {
    id: 'TIME-002',
    userId: 'USER-001',
    userName: 'Rajesh Kumar',
    userAvatar: 'RK',
    taskId: 'TASK-002',
    taskTitle: 'Payment Gateway Integration',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    client: 'TechCorp Solutions',
    date: '2025-01-13',
    startTime: '14:00',
    endTime: '18:00',
    duration: 4.0,
    breakDuration: 0.5,
    description: 'Integrated Stripe payment gateway. Implemented webhook handling for payment confirmations and refunds.',
    billable: true,
    status: 'approved',
    hourlyRate: 85,
    amount: 340.00,
    isOvertime: false,
    location: 'Office',
    device: 'Laptop',
    mood: 'focused',
    tags: ['development', 'payments', 'integration'],
    screenshots: 3,
    activityLevel: 88,
    approvedBy: 'USER-003',
    approvedAt: '2025-01-13T20:00:00Z',
    submittedAt: '2025-01-13T18:00:00Z'
  },
  {
    id: 'TIME-003',
    userId: 'USER-002',
    userName: 'Praveen Kumar',
    userAvatar: 'PK',
    taskId: 'TASK-003',
    taskTitle: 'Mobile App Security Testing',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    client: 'FinanceFirst Bank',
    date: '2025-01-13',
    startTime: '10:00',
    endTime: '15:30',
    duration: 5.5,
    breakDuration: 1.0,
    description: 'Conducted penetration testing on mobile banking app. Found and documented 3 medium-risk vulnerabilities.',
    billable: true,
    status: 'submitted',
    hourlyRate: 70,
    amount: 385.00,
    isOvertime: false,
    location: 'Remote',
    device: 'Mobile + Laptop',
    mood: 'analytical',
    tags: ['testing', 'security', 'mobile'],
    screenshots: 5,
    activityLevel: 95,
    approvedBy: null,
    approvedAt: null,
    submittedAt: '2025-01-13T15:30:00Z'
  },
  {
    id: 'TIME-004',
    userId: 'USER-003',
    userName: 'Sarah Wilson',
    userAvatar: 'SW',
    taskId: 'TASK-999',
    taskTitle: 'Sprint Planning Meeting',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    client: 'TechCorp Solutions',
    date: '2025-01-12',
    startTime: '09:00',
    endTime: '11:00',
    duration: 2.0,
    breakDuration: 0,
    description: 'Facilitated sprint planning session with development team. Estimated user stories and assigned tasks.',
    billable: true,
    status: 'approved',
    hourlyRate: 95,
    amount: 190.00,
    isOvertime: false,
    location: 'Office',
    device: 'Laptop',
    mood: 'collaborative',
    tags: ['management', 'planning', 'meeting'],
    screenshots: 0,
    activityLevel: 85,
    approvedBy: 'USER-003',
    approvedAt: '2025-01-12T11:00:00Z',
    submittedAt: '2025-01-12T11:00:00Z'
  },
  {
    id: 'TIME-005',
    userId: 'USER-004',
    userName: 'Mike Johnson',
    userAvatar: 'MJ',
    taskId: 'TASK-004',
    taskTitle: 'Database Schema Optimization',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    client: 'FinanceFirst Bank',
    date: '2025-01-12',
    startTime: '13:00',
    endTime: '17:30',
    duration: 4.5,
    breakDuration: 0.5,
    description: 'Optimized database indices for transaction queries. Achieved 60% performance improvement.',
    billable: true,
    status: 'approved',
    hourlyRate: 90,
    amount: 405.00,
    isOvertime: false,
    location: 'Remote',
    device: 'Laptop',
    mood: 'problem-solving',
    tags: ['database', 'optimization', 'backend'],
    screenshots: 2,
    activityLevel: 91,
    approvedBy: 'USER-003',
    approvedAt: '2025-01-12T19:00:00Z',
    submittedAt: '2025-01-12T17:30:00Z'
  },
  {
    id: 'TIME-006',
    userId: 'USER-005',
    userName: 'Lisa Park',
    userAvatar: 'LP',
    taskId: 'TASK-006',
    taskTitle: 'Dashboard UI Wireframes',
    projectId: 'PROJ-004',
    projectName: 'Analytics Dashboard',
    client: 'DataFlow Systems',
    date: '2025-01-11',
    startTime: '09:30',
    endTime: '13:00',
    duration: 3.5,
    breakDuration: 0,
    description: 'Created high-fidelity wireframes for analytics dashboard. Included responsive breakpoints.',
    billable: true,
    status: 'approved',
    hourlyRate: 75,
    amount: 262.50,
    isOvertime: false,
    location: 'Office',
    device: 'Laptop + Tablet',
    mood: 'creative',
    tags: ['design', 'wireframes', 'ui'],
    screenshots: 4,
    activityLevel: 89,
    approvedBy: 'USER-003',
    approvedAt: '2025-01-11T15:00:00Z',
    submittedAt: '2025-01-11T13:00:00Z'
  },
  {
    id: 'TIME-007',
    userId: 'USER-006',
    userName: 'Alex Chen',
    userAvatar: 'AC',
    taskId: 'TASK-007',
    taskTitle: 'Security Vulnerability Assessment',
    projectId: 'PROJ-005',
    projectName: 'Security Audit Platform',
    client: 'CyberSafe Technologies',
    date: '2025-01-11',
    startTime: '08:00',
    endTime: '16:00',
    duration: 8.0,
    breakDuration: 1.0,
    description: 'Comprehensive security audit using OWASP methodology. Identified 12 vulnerabilities across different severity levels.',
    billable: true,
    status: 'approved',
    hourlyRate: 110,
    amount: 880.00,
    isOvertime: false,
    location: 'Office',
    device: 'Laptop',
    mood: 'thorough',
    tags: ['security', 'audit', 'analysis'],
    screenshots: 6,
    activityLevel: 96,
    approvedBy: 'USER-003',
    approvedAt: '2025-01-11T18:00:00Z',
    submittedAt: '2025-01-11T16:00:00Z'
  },
  {
    id: 'TIME-008',
    userId: 'USER-001',
    userName: 'Rajesh Kumar',
    userAvatar: 'RK',
    taskId: 'TASK-001',
    taskTitle: 'OAuth Authentication Implementation',
    projectId: 'PROJ-001',
    projectName: 'E-commerce Platform',
    client: 'TechCorp Solutions',
    date: '2025-01-14',
    startTime: '09:15',
    endTime: '12:00',
    duration: 2.75,
    breakDuration: 0,
    description: 'Fixed OAuth callback issues and added proper error handling for expired tokens.',
    billable: true,
    status: 'draft',
    hourlyRate: 85,
    amount: 233.75,
    isOvertime: false,
    location: 'Remote',
    device: 'Laptop',
    mood: 'debugging',
    tags: ['development', 'bugfix', 'authentication'],
    screenshots: 1,
    activityLevel: 87,
    approvedBy: null,
    approvedAt: null,
    submittedAt: null
  },
  {
    id: 'TIME-009',
    userId: 'USER-002',
    userName: 'Praveen Kumar',
    userAvatar: 'PK',
    taskId: 'TASK-005',
    taskTitle: 'CRM API Documentation',
    projectId: 'PROJ-003',
    projectName: 'CRM Integration',
    client: 'SalesForce Inc',
    date: '2025-01-14',
    startTime: '14:00',
    endTime: '18:30',
    duration: 4.5,
    breakDuration: 0.5,
    description: 'Updated API documentation with new endpoints and authentication methods. Added code examples.',
    billable: true,
    status: 'pending_approval',
    hourlyRate: 70,
    amount: 315.00,
    isOvertime: false,
    location: 'Office',
    device: 'Laptop',
    mood: 'detailed',
    tags: ['documentation', 'api', 'technical-writing'],
    screenshots: 2,
    activityLevel: 82,
    approvedBy: null,
    approvedAt: null,
    submittedAt: '2025-01-14T18:30:00Z'
  },
  {
    id: 'TIME-010',
    userId: 'USER-004',
    userName: 'Mike Johnson',
    userAvatar: 'MJ',
    taskId: 'TASK-004',
    taskTitle: 'Database Schema Optimization',
    projectId: 'PROJ-002',
    projectName: 'Mobile Banking App',
    client: 'FinanceFirst Bank',
    date: '2025-01-14',
    startTime: '20:00',
    endTime: '23:30',
    duration: 3.5,
    breakDuration: 0,
    description: 'Emergency database optimization during off-hours maintenance window. Fixed performance bottleneck.',
    billable: true,
    status: 'submitted',
    hourlyRate: 135, // Overtime rate (1.5x)
    amount: 472.50,
    isOvertime: true,
    location: 'Remote',
    device: 'Laptop',
    mood: 'urgent',
    tags: ['database', 'emergency', 'overtime'],
    screenshots: 1,
    activityLevel: 94,
    approvedBy: null,
    approvedAt: null,
    submittedAt: '2025-01-14T23:30:00Z'
  }
]

// Analytics data
const weeklyProductivityData = [
  { week: 'Week 1', hours: 38.5, efficiency: 92, billable: 34.5, projects: 3 },
  { week: 'Week 2', hours: 42.0, efficiency: 88, billable: 38.0, projects: 4 },
  { week: 'Week 3', hours: 40.5, efficiency: 94, billable: 37.5, projects: 3 },
  { week: 'Week 4', hours: 45.0, efficiency: 90, billable: 41.0, projects: 5 },
  { week: 'Week 5', hours: 43.5, efficiency: 89, billable: 39.5, projects: 4 },
  { week: 'Week 6', hours: 41.0, efficiency: 95, billable: 38.0, projects: 3 }
]

const dailyActivityData = [
  { date: 'Jan 8', development: 6.5, testing: 2.0, meetings: 1.5, documentation: 1.0 },
  { date: 'Jan 9', development: 7.0, testing: 1.5, meetings: 2.0, documentation: 0.5 },
  { date: 'Jan 10', development: 5.5, testing: 3.0, meetings: 1.0, documentation: 2.0 },
  { date: 'Jan 11', development: 8.0, testing: 1.0, meetings: 1.5, documentation: 1.5 },
  { date: 'Jan 12', development: 6.0, testing: 2.5, meetings: 2.0, documentation: 1.0 },
  { date: 'Jan 13', development: 7.5, testing: 1.5, meetings: 1.0, documentation: 2.0 },
  { date: 'Jan 14', development: 5.0, testing: 3.5, meetings: 1.5, documentation: 2.0 }
]

const projectBurndownData = [
  { project: 'E-commerce Platform', budgeted: 320, spent: 248, remaining: 72, burnRate: 77.5 },
  { project: 'Mobile Banking App', budgeted: 480, spent: 312, remaining: 168, burnRate: 65.0 },
  { project: 'CRM Integration', budgeted: 240, spent: 186, remaining: 54, burnRate: 77.5 },
  { project: 'Analytics Dashboard', budgeted: 160, spent: 142, remaining: 18, burnRate: 88.8 },
  { project: 'Security Audit', budgeted: 200, spent: 89, remaining: 111, burnRate: 44.5 }
]

interface TimeTrackingProps {
  user?: any
}

export function TimeTracking({ user }: TimeTrackingProps) {
  const [activeTimer, setActiveTimer] = useState<any>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timeEntries, setTimeEntries] = useState(timeEntriesData)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [showEditEntry, setShowEditEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    project: 'all',
    user: 'all',
    billable: 'all',
    dateRange: '7d'
  })
  
  const [newEntry, setNewEntry] = useState({
    taskId: '',
    date: formatDate(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    description: '',
    billable: true,
    location: 'Office',
    tags: [] as string[]
  })

  // Get current user data
  const currentUser = teamMembers.find(member => member.name === user?.name) || teamMembers[0]
  const userRole = user?.role || 'developer'
  const isAdmin = ['admin', 'super_admin', 'project_manager'].includes(userRole)
  const isDeveloper = ['developer', 'tester'].includes(userRole)

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTimer])

  // Get available tasks for current user
  const getAvailableTasks = () => {
    if (isAdmin) {
      return tasks // Admins can track time for any task
    } else {
      return tasks.filter(task => task.assigneeId === currentUser.id)
    }
  }

  // Filter time entries based on permissions and filters
  const getFilteredTimeEntries = () => {
    let entries = timeEntries

    // Role-based filtering
    if (isDeveloper && !isAdmin) {
      entries = entries.filter(entry => entry.userId === currentUser.id)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      entries = entries.filter(entry =>
        entry.taskTitle.toLowerCase().includes(term) ||
        entry.projectName.toLowerCase().includes(term) ||
        entry.description.toLowerCase().includes(term) ||
        entry.client.toLowerCase().includes(term)
      )
    }

    // Apply other filters
    if (filters.status !== 'all') {
      entries = entries.filter(entry => entry.status === filters.status)
    }
    if (filters.project !== 'all') {
      entries = entries.filter(entry => entry.projectId === filters.project)
    }
    if (filters.user !== 'all') {
      entries = entries.filter(entry => entry.userId === filters.user)
    }
    if (filters.billable !== 'all') {
      entries = entries.filter(entry => 
        filters.billable === 'billable' ? entry.billable : !entry.billable
      )
    }

    // Apply date range filter
    const now = new Date()
    const startDate = new Date()
    
    switch (filters.dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setFullYear(now.getFullYear() - 1)
    }

    entries = entries.filter(entry => new Date(entry.date) >= startDate)

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const filteredEntries = getFilteredTimeEntries()

  // Calculate statistics
  const getStatistics = () => {
    const entries = filteredEntries
    const myEntries = entries.filter(entry => entry.userId === currentUser.id)
    
    const totalHours = myEntries.reduce((sum, entry) => sum + entry.duration, 0)
    const billableHours = myEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.duration, 0)
    const totalAmount = myEntries.reduce((sum, entry) => sum + entry.amount, 0)
    const overtimeHours = myEntries.filter(e => e.isOvertime).reduce((sum, entry) => sum + entry.duration, 0)
    const pendingAmount = myEntries
      .filter(e => e.status === 'draft' || e.status === 'submitted' || e.status === 'pending_approval')
      .reduce((sum, entry) => sum + entry.amount, 0)
    
    const approvedAmount = myEntries
      .filter(e => e.status === 'approved')
      .reduce((sum, entry) => sum + entry.amount, 0)

    const efficiency = myEntries.length > 0 ? 
      myEntries.reduce((sum, entry) => sum + entry.activityLevel, 0) / myEntries.length : 0

    const uniqueProjects = new Set(myEntries.map(e => e.projectId)).size

    return {
      totalHours,
      billableHours,
      totalAmount,
      overtimeHours,
      pendingAmount,
      approvedAmount,
      efficiency,
      uniqueProjects,
      totalEntries: myEntries.length,
      avgHoursPerDay: totalHours / 7 // Assuming 7 day period
    }
  }

  const stats = getStatistics()

  // Timer functions
  const startTimer = (taskId: string) => {
    const task = getAvailableTasks().find(t => t.id === taskId)
    if (!task) return

    setActiveTimer({
      taskId,
      startTime: new Date(),
      task
    })
    setTimerSeconds(0)
    toast.success(`Timer started for ${task.title}`)
  }

  const stopTimer = () => {
    if (!activeTimer) return

    const duration = timerSeconds / 3600 // Convert to hours
    const task = activeTimer.task
    const project = projects.find(p => p.id === task.projectId)
    
    const entry = {
      id: `TIME-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      taskId: activeTimer.taskId,
      taskTitle: task.title,
      projectId: task.projectId,
      projectName: task.project,
      client: project?.client || '',
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      startTime: formatDate(activeTimer.startTime, 'HH:mm'),
      endTime: formatDate(new Date(), 'HH:mm'),
      duration: Math.round(duration * 100) / 100,
      breakDuration: 0,
      description: 'Timer session - work in progress',
      billable: true,
      status: 'draft',
      hourlyRate: currentUser.hourlyRate,
      amount: Math.round(duration * currentUser.hourlyRate * 100) / 100,
      isOvertime: false,
      location: 'Office',
      device: 'Laptop',
      mood: 'productive',
      tags: ['development'],
      screenshots: 0,
      activityLevel: 90,
      approvedBy: null,
      approvedAt: null,
      submittedAt: null
    }
    
    setTimeEntries(prev => [entry, ...prev])
    setActiveTimer(null)
    setTimerSeconds(0)
    toast.success('Timer stopped and entry saved as draft')
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Entry management functions
  const handleAddEntry = () => {
    if (!newEntry.taskId || !newEntry.startTime || !newEntry.endTime) {
      toast.error('Please fill in all required fields')
      return
    }

    const task = getAvailableTasks().find(t => t.id === newEntry.taskId)
    if (!task) {
      toast.error('Invalid task selected')
      return
    }

    const project = projects.find(p => p.id === task.projectId)
    const startTime = new Date(`${newEntry.date}T${newEntry.startTime}`)
    const endTime = new Date(`${newEntry.date}T${newEntry.endTime}`)
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    
    if (duration <= 0) {
      toast.error('End time must be after start time')
      return
    }

    const isOvertime = endTime.getHours() >= 18 || duration > 8
    const hourlyRate = isOvertime ? currentUser.hourlyRate * 1.5 : currentUser.hourlyRate

    const entry = {
      id: `TIME-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      taskId: newEntry.taskId,
      taskTitle: task.title,
      projectId: task.projectId,
      projectName: task.project,
      client: project?.client || '',
      date: newEntry.date,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      duration: Math.round(duration * 100) / 100,
      breakDuration: 0,
      description: newEntry.description,
      billable: newEntry.billable,
      status: 'draft',
      hourlyRate: newEntry.billable ? hourlyRate : 0,
      amount: newEntry.billable ? Math.round(duration * hourlyRate * 100) / 100 : 0,
      isOvertime,
      location: newEntry.location,
      device: 'Laptop',
      mood: 'productive',
      tags: newEntry.tags,
      screenshots: 0,
      activityLevel: 90,
      approvedBy: null,
      approvedAt: null,
      submittedAt: null
    }

    setTimeEntries(prev => [entry, ...prev])
    setNewEntry({
      taskId: '',
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      startTime: '',
      endTime: '',
      description: '',
      billable: true,
      location: 'Office',
      tags: []
    })
    setShowAddEntry(false)
    toast.success('Time entry added successfully')
  }

  const updateEntryStatus = (entryId: string, status: string) => {
    const entry = timeEntries.find(e => e.id === entryId)
    if (!entry) return

    // Permission checks
    if (isDeveloper && entry.userId !== currentUser.id && status !== 'submitted') {
      toast.error('You can only submit your own entries')
      return
    }

    if (!isAdmin && (status === 'approved' || status === 'rejected')) {
      toast.error('Only managers can approve or reject entries')
      return
    }

    const updatedEntry = {
      ...entry,
      status,
      ...(status === 'submitted' && { submittedAt: new Date().toISOString() }),
      ...(status === 'approved' && { 
        approvedBy: currentUser.id, 
        approvedAt: new Date().toISOString() 
      })
    }

    setTimeEntries(prev => prev.map(e => 
      e.id === entryId ? updatedEntry : e
    ))
    
    toast.success(`Entry ${status.replace('_', ' ')}`)
  }

  const deleteEntry = (entryId: string) => {
    const entry = timeEntries.find(e => e.id === entryId)
    if (!entry) return

    if (!isAdmin && entry.userId !== currentUser.id) {
      toast.error('You can only delete your own entries')
      return
    }

    if (entry.status === 'approved' && !isAdmin) {
      toast.error('Cannot delete approved entries')
      return
    }

    setTimeEntries(prev => prev.filter(e => e.id !== entryId))
    toast.success('Entry deleted successfully')
  }

  const exportTimesheet = (format: 'csv' | 'pdf') => {
    const entries = getFilteredTimeEntries()
    
    if (format === 'csv') {
      const headers = [
        'Date', 'User', 'Project', 'Client', 'Task', 'Start Time', 'End Time', 
        'Duration', 'Billable', 'Rate', 'Amount', 'Status', 'Description'
      ]
      
      const rows = entries.map(entry => [
        entry.date,
        entry.userName,
        entry.projectName,
        entry.client,
        entry.taskTitle,
        entry.startTime,
        entry.endTime,
        entry.duration.toString(),
        entry.billable ? 'Yes' : 'No',
        entry.hourlyRate ? `$${entry.hourlyRate}` : '$0',
        entry.amount ? `$${entry.amount.toFixed(2)}` : '$0.00',
        entry.status,
        entry.description.replace(/,/g, ';') // Remove commas to avoid CSV issues
      ])
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `timesheet_${formatDate(new Date(), 'yyyy-MM-dd')}.csv`
      a.click()
      URL.revokeObjectURL(url)
      
      toast.success('Timesheet exported as CSV')
    } else {
      toast.info('PDF export would be implemented with a PDF library like jsPDF')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500 text-white'
      case 'submitted': return 'bg-blue-500 text-white'
      case 'pending_approval': return 'bg-yellow-500 text-white'
      case 'approved': return 'bg-green-500 text-white'
      case 'rejected': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'productive': return <Zap className="w-4 h-4 text-green-500" />
      case 'focused': return <Target className="w-4 h-4 text-blue-500" />
      case 'creative': return <Star className="w-4 h-4 text-purple-500" />
      case 'collaborative': return <Users className="w-4 h-4 text-orange-500" />
      case 'analytical': return <BarChart3 className="w-4 h-4 text-cyan-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Time Tracking</h1>
          <p className="text-muted-foreground">
            {isDeveloper 
              ? 'Track your time, manage entries, and view productivity insights'
              : 'Monitor team time, approve entries, and generate comprehensive reports'
            }
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isAdmin && (
            <>
              <Button variant="outline" size="sm" onClick={() => exportTimesheet('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportTimesheet('pdf')}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </>
          )}
          <Button 
            size="sm" 
            className="bg-[#28A745] hover:bg-[#218838] text-white"
            onClick={() => setShowAddEntry(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Time
          </Button>
        </div>
      </div>

      {/* Quick Timer Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Timer className="w-5 h-5 text-[#28A745]" />
              <div>
                <CardTitle>Quick Timer</CardTitle>
                <CardDescription>Track time in real-time for your tasks</CardDescription>
              </div>
            </div>
            {activeTimer && (
              <div className="text-right">
                <p className="text-2xl font-mono text-[#28A745] font-semibold">
                  {formatTime(timerSeconds)}
                </p>
                <p className="text-sm text-muted-foreground">Active Session</p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeTimer ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#28A745]/10 border border-[#28A745]/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#28A745] rounded-full">
                    <Play className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{activeTimer.task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activeTimer.task.project} • Started at {formatDate(activeTimer.startTime, 'HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Estimated</p>
                    <p className="font-medium">${(timerSeconds / 3600 * currentUser.hourlyRate).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button onClick={stopTimer} className="bg-[#DC3545] hover:bg-[#C82333] text-white">
                  <Square className="w-4 h-4 mr-2" />
                  Stop & Save
                </Button>
                <Button variant="outline" onClick={() => {
                  setActiveTimer(null)
                  setTimerSeconds(0)
                  toast.info('Timer cancelled')
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Select onValueChange={startTimer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a task to start timing" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTasks().map((task) => {
                    const project = projects.find(p => p.id === task.projectId)
                    return (
                      <SelectItem key={task.id} value={task.id}>
                        <div className="flex items-center space-x-3 py-1">
                          <Play className="w-4 h-4 text-[#28A745]" />
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {task.project} • {task.loggedHours}h/{task.estimatedHours}h logged
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              
              {getAvailableTasks().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks assigned to you</p>
                  <p className="text-sm">Contact your project manager to get tasks assigned</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-semibold">{stats.totalHours.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.avgHoursPerDay.toFixed(1)}h avg/day
                </p>
              </div>
              <div className="p-3 bg-[#007BFF]/10 rounded-full">
                <Clock className="w-6 h-6 text-[#007BFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Billable Hours</p>
                <p className="text-2xl font-semibold">{stats.billableHours.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.billableHours / stats.totalHours) * 100).toFixed(0)}% of total
                </p>
              </div>
              <div className="p-3 bg-[#28A745]/10 rounded-full">
                <DollarSign className="w-6 h-6 text-[#28A745]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-semibold">${stats.totalAmount.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${stats.pendingAmount.toFixed(0)} pending
                </p>
              </div>
              <div className="p-3 bg-[#FFC107]/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-[#FFC107]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-semibold">{stats.efficiency.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.uniqueProjects} projects
                </p>
              </div>
              <div className="p-3 bg-[#DC3545]/10 rounded-full">
                <Activity className="w-6 h-6 text-[#DC3545]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue={isDeveloper ? "entries" : "overview"} className="space-y-6">
        <TabsList>
          {isDeveloper ? (
            <>
              <TabsTrigger value="entries">My Time Entries</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="overview">Team Overview</TabsTrigger>
              <TabsTrigger value="entries">All Entries</TabsTrigger>
              <TabsTrigger value="approvals">
                Approvals ({timeEntries.filter(e => e.status === 'submitted' || e.status === 'pending_approval').length})
              </TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Time Entries Tab */}
        <TabsContent value="entries" className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setFilters({
                    status: 'all',
                    project: 'all',
                    user: 'all',
                    billable: 'all',
                    dateRange: '7d'
                  })
                  setSearchTerm('')
                }}
              >
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="pending_approval">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Project</Label>
                <Select value={filters.project} onValueChange={(value) => setFilters(prev => ({ ...prev, project: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isAdmin && (
                <div className="space-y-2">
                  <Label>User</Label>
                  <Select value={filters.user} onValueChange={(value) => setFilters(prev => ({ ...prev, user: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Billable</Label>
                <Select value={filters.billable} onValueChange={(value) => setFilters(prev => ({ ...prev, billable: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="billable">Billable</SelectItem>
                    <SelectItem value="non-billable">Non-Billable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 3 months</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Time Entries List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Time Entries</CardTitle>
                <Badge variant="outline">
                  {filteredEntries.length} entries
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEntries.map((entry) => {
                  const project = projects.find(p => p.id === entry.projectId)
                  const canEdit = isDeveloper ? entry.userId === currentUser.id && entry.status === 'draft' : isAdmin
                  const canApprove = isAdmin && (entry.status === 'submitted' || entry.status === 'pending_approval')
                  
                  return (
                    <div key={entry.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Header */}
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-500 text-white text-xs">
                                {entry.userAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{entry.taskTitle}</h4>
                                <Badge className={getStatusColor(entry.status)}>
                                  {entry.status.replace('_', ' ')}
                                </Badge>
                                {entry.isOvertime && (
                                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                                    Overtime
                                  </Badge>
                                )}
                                {entry.billable && (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    Billable
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <span>{entry.projectName}</span>
                                <span>•</span>
                                <span>{entry.client}</span>
                                <span>•</span>
                                <span>{formatDate(entry.date)}</span>
                                {isAdmin && (
                                  <>
                                    <span>•</span>
                                    <span>{entry.userName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Time and Amount */}
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-mono">
                                {entry.startTime} - {entry.endTime} ({entry.duration}h)
                              </span>
                            </div>
                            {entry.billable && (
                              <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  ${entry.amount.toFixed(2)} @ ${entry.hourlyRate}/h
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{entry.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getMoodIcon(entry.mood)}
                              <span className="text-sm capitalize">{entry.mood}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground">{entry.description}</p>

                          {/* Tags and Metadata */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {entry.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {entry.activityLevel && (
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Activity className="w-3 h-3" />
                                  <span>{entry.activityLevel}%</span>
                                </div>
                              )}
                            </div>
                            
                            {(entry.approvedBy || entry.submittedAt) && (
                              <div className="text-xs text-muted-foreground">
                                {entry.status === 'approved' && entry.approvedBy && (
                                  <span>Approved by {teamMembers.find(m => m.id === entry.approvedBy)?.name}</span>
                                )}
                                {entry.status === 'submitted' && entry.submittedAt && (
                                  <span>Submitted {formatDate(entry.submittedAt)}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {canEdit && (
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {entry.status === 'draft' && entry.userId === currentUser.id && (
                            <Button 
                              size="sm" 
                              onClick={() => updateEntryStatus(entry.id, 'submitted')}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Submit
                            </Button>
                          )}
                          
                          {canApprove && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-[#28A745] hover:bg-[#218838] text-white"
                                onClick={() => updateEntryStatus(entry.id, 'approved')}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-[#DC3545] border-[#DC3545] hover:bg-[#DC3545] hover:text-white"
                                onClick={() => updateEntryStatus(entry.id, 'rejected')}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                          
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredEntries.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No time entries found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || filters.status !== 'all' 
                        ? 'Try adjusting your filters or search terms'
                        : 'Start tracking time to see your entries here'
                      }
                    </p>
                    <Button onClick={() => setShowAddEntry(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Time Entry
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Productivity Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Weekly Productivity</h3>
                  <p className="text-sm text-muted-foreground">Hours logged and efficiency over time</p>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProductivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" stroke="#28A745" strokeWidth={2} name="Hours" />
                    <Line type="monotone" dataKey="efficiency" stroke="#007BFF" strokeWidth={2} name="Efficiency %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Daily Activity Breakdown */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Daily Activity</h3>
                  <p className="text-sm text-muted-foreground">Time distribution by activity type</p>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="development" stackId="1" stroke="#28A745" fill="#28A745" />
                    <Area type="monotone" dataKey="testing" stackId="1" stroke="#FFC107" fill="#FFC107" />
                    <Area type="monotone" dataKey="meetings" stackId="1" stroke="#007BFF" fill="#007BFF" />
                    <Area type="monotone" dataKey="documentation" stackId="1" stroke="#DC3545" fill="#DC3545" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Project Burndown */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Project Budget Utilization</h3>
                <p className="text-sm text-muted-foreground">Hours spent vs budgeted across all projects</p>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectBurndownData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="project" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="spent" fill="#28A745" name="Hours Spent" />
                  <Bar dataKey="remaining" fill="#E9ECEF" name="Hours Remaining" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Team Overview Tab (Admin only) */}
        {isAdmin && (
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Team Hours</p>
                      <p className="text-2xl font-semibold">
                        {timeEntries.reduce((sum, entry) => sum + entry.duration, 0).toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">This week</p>
                    </div>
                    <div className="p-3 bg-[#007BFF]/10 rounded-full">
                      <Users className="w-6 h-6 text-[#007BFF]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-semibold">
                        ${timeEntries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Approved entries</p>
                    </div>
                    <div className="p-3 bg-[#28A745]/10 rounded-full">
                      <DollarSign className="w-6 h-6 text-[#28A745]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                      <p className="text-2xl font-semibold">
                        {timeEntries.filter(e => e.status === 'submitted' || e.status === 'pending_approval').length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Entries waiting</p>
                    </div>
                    <div className="p-3 bg-[#FFC107]/10 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-[#FFC107]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Team Efficiency</p>
                      <p className="text-2xl font-semibold">
                        {(timeEntries.reduce((sum, entry) => sum + entry.activityLevel, 0) / timeEntries.length).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Average activity</p>
                    </div>
                    <div className="p-3 bg-[#DC3545]/10 rounded-full">
                      <TrendingUp className="w-6 h-6 text-[#DC3545]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Individual team member statistics and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team Member</TableHead>
                        <TableHead>Hours This Week</TableHead>
                        <TableHead>Billable %</TableHead>
                        <TableHead>Efficiency</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => {
                        const memberEntries = timeEntries.filter(e => e.userId === member.id)
                        const totalHours = memberEntries.reduce((sum, e) => sum + e.duration, 0)
                        const billableHours = memberEntries.filter(e => e.billable).reduce((sum, e) => sum + e.duration, 0)
                        const billablePercentage = totalHours > 0 ? (billableHours / totalHours) * 100 : 0
                        const avgEfficiency = memberEntries.length > 0 
                          ? memberEntries.reduce((sum, e) => sum + e.activityLevel, 0) / memberEntries.length 
                          : 0
                        const uniqueProjects = new Set(memberEntries.map(e => e.projectId)).size
                        const revenue = memberEntries.reduce((sum, e) => sum + e.amount, 0)

                        return (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                                    {member.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-sm text-muted-foreground">{member.role}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">{totalHours.toFixed(1)}h</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={billablePercentage} className="w-16 h-2" />
                                <span className="text-sm">{billablePercentage.toFixed(0)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={avgEfficiency >= 90 ? 'default' : avgEfficiency >= 80 ? 'secondary' : 'outline'}>
                                {avgEfficiency.toFixed(0)}%
                              </Badge>
                            </TableCell>
                            <TableCell>{uniqueProjects}</TableCell>
                            <TableCell className="font-mono">${revenue.toFixed(0)}</TableCell>
                            <TableCell>
                              <Badge variant={member.status === 'Online' ? 'default' : 'outline'}>
                                {member.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Approvals Tab (Admin only) */}
        {isAdmin && (
          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve team time entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeEntries
                    .filter(entry => entry.status === 'submitted' || entry.status === 'pending_approval')
                    .map((entry) => (
                      <div key={entry.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-blue-500 text-white text-xs">
                                  {entry.userAvatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{entry.taskTitle}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {entry.userName} • {entry.projectName} • {formatDate(entry.date)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-medium">{entry.duration}h ({entry.startTime} - {entry.endTime})</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-medium">${entry.amount.toFixed(2)} @ ${entry.hourlyRate}/h</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Activity</p>
                                <p className="font-medium">{entry.activityLevel}% efficiency</p>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
                            
                            <div className="flex items-center space-x-2">
                              {entry.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button 
                              size="sm" 
                              className="bg-[#28A745] hover:bg-[#218838] text-white"
                              onClick={() => updateEntryStatus(entry.id, 'approved')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-[#DC3545] border-[#DC3545] hover:bg-[#DC3545] hover:text-white"
                              onClick={() => updateEntryStatus(entry.id, 'rejected')}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                  {timeEntries.filter(e => e.status === 'submitted' || e.status === 'pending_approval').length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                      <p className="text-muted-foreground">No time entries pending approval</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Add Time Entry Dialog */}
      <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Time Entry</DialogTitle>
            <DialogDescription>
              Log time for your tasks with detailed information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task">Task</Label>
              <Select value={newEntry.taskId} onValueChange={(value) => setNewEntry(prev => ({ ...prev, taskId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTasks().map((task) => {
                    const project = projects.find(p => p.id === task.projectId)
                    return (
                      <SelectItem key={task.id} value={task.id}>
                        <div className="flex flex-col py-1">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {task.project} • {task.loggedHours}h/{task.estimatedHours}h logged
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What did you work on? Be specific about accomplishments..."
                value={newEntry.description}
                onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={newEntry.location} onValueChange={(value) => setNewEntry(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Client Site">Client Site</SelectItem>
                    <SelectItem value="Co-working">Co-working Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="billable"
                  checked={newEntry.billable}
                  onCheckedChange={(checked) => setNewEntry(prev => ({ ...prev, billable: checked }))}
                />
                <Label htmlFor="billable">Billable Time</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddEntry(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddEntry} 
              className="bg-[#28A745] hover:bg-[#218838] text-white"
            >
              Add Entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}