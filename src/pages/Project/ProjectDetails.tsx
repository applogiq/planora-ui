import { useState, useEffect } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Separator } from '../../components/ui/separator'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { 
  ArrowLeft, 
  Edit,
  Share2,
  MoreHorizontal,
  Calendar,
  Users,
  Target,
  Clock,
  DollarSign,
  GitBranch,
  Flag,
  CheckCircle,
  PlayCircle,
  Zap,
  BarChart3,
  AlertTriangle,
  Settings,
  FileText,
  MessageSquare,
  Activity,
  TrendingUp,
  PieChart,
  Plus,
  Search,
  Filter,
  SortAsc,
  List,
  Kanban,
  CalendarDays,
  Upload,
  Download,
  Eye,
  Timer,
  BookOpen,
  Star,
  Paperclip,
  ChevronDown,
  ChevronRight,
  Hash,
  User
} from 'lucide-react'
import { ProjectDashboard } from './ProjectDashboard'
import { TasksView } from './TasksView'
import { FilesView } from './FilesView'
import { TimeTrackingView } from './TimeTrackingView'
import { ActivityView } from './ActivityView'
import { TaskModal } from './TaskModal'
import { ProjectEditModal } from './ProjectEditModal'
import { ProjectSettings } from './ProjectSettings'

interface ProjectDetailsProps {
  projectId: string
  onBack: () => void
  user?: any
}

// Mock project data - in a real app, this would be fetched based on projectId
const getProjectDetails = (projectId: string) => {
  const projects: { [key: string]: any } = {
    'PROJ-001': {
      id: 'PROJ-001',
      name: 'Web App Redesign',
      description: 'Complete redesign of the main web application with new UI/UX framework, improved user experience, and modern design patterns. This project includes user research, wireframing, prototyping, and full implementation.',
      status: 'Active',
      priority: 'High',
      progress: 75,
      methodology: 'Scrum',
      type: 'Software Development',
      startDate: '2025-08-01',
      dueDate: '2025-10-15',
      budget: 50000,
      spent: 37500,
      owner: 'John Doe',
      customer: 'Internal',
      team: [
        { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'JD', status: 'Active', email: 'john@planora.com' },
        { id: 2, name: 'Jane Smith', role: 'UX Designer', avatar: 'JS', status: 'Active', email: 'jane@planora.com' },
        { id: 3, name: 'Mike Johnson', role: 'Frontend Developer', avatar: 'MJ', status: 'Active', email: 'mike@planora.com' },
        { id: 4, name: 'Sarah Wilson', role: 'Backend Developer', avatar: 'SW', status: 'Active', email: 'sarah@planora.com' },
        { id: 5, name: 'Alex Chen', role: 'QA Engineer', avatar: 'AC', status: 'Active', email: 'alex@planora.com' }
      ],
      tasksCompleted: 18,
      totalTasks: 24,
      epics: 3,
      stories: 12,
      currentSprint: 'Sprint 15',
      nextMilestone: 'Beta Release',
      milestoneDue: '2025-09-30',
      version: 'v2.0.0',
      dependencies: ['PROJ-003'],
      milestones: [
        { name: 'Project Kickoff', date: '2025-08-01', status: 'Completed' },
        { name: 'Design Phase Complete', date: '2025-08-15', status: 'Completed' },
        { name: 'Alpha Release', date: '2025-09-01', status: 'Completed' },
        { name: 'Beta Release', date: '2025-09-30', status: 'In Progress' },
        { name: 'Final Release', date: '2025-10-15', status: 'Upcoming' }
      ],
      recentActivity: [
        { 
          id: 1, 
          user: 'Jane Smith', 
          action: 'completed task', 
          target: 'User interface mockups', 
          timestamp: '2 hours ago',
          type: 'task'
        },
        { 
          id: 2, 
          user: 'Mike Johnson', 
          action: 'pushed commit', 
          target: 'Frontend component updates', 
          timestamp: '4 hours ago',
          type: 'code'
        },
        { 
          id: 3, 
          user: 'John Doe', 
          action: 'updated milestone', 
          target: 'Beta Release timeline', 
          timestamp: '1 day ago',
          type: 'milestone'
        }
      ],
      tasks: [
        {
          id: 'TASK-001',
          title: 'Design user authentication flow',
          description: 'Create wireframes and mockups for the new authentication system',
          status: 'In Progress',
          priority: 'High',
          assignee: { name: 'Jane Smith', avatar: 'JS' },
          startDate: '2025-09-01',
          dueDate: '2025-09-15',
          tags: ['design', 'auth', 'ux'],
          timeTracked: '12h 30m',
          progress: 60,
          subtasks: [
            { id: 'ST-001', title: 'Research current auth patterns', completed: true },
            { id: 'ST-002', title: 'Create wireframes', completed: true },
            { id: 'ST-003', title: 'Design mockups', completed: false },
            { id: 'ST-004', title: 'User testing', completed: false }
          ],
          attachments: [
            { name: 'auth-wireframes.figma', size: '2.4 MB', type: 'figma' },
            { name: 'user-flow.pdf', size: '1.8 MB', type: 'pdf' }
          ],
          comments: [
            { id: 1, user: 'John Doe', text: 'Looking good so far! Can we add social login options?', timestamp: '2 hours ago' },
            { id: 2, user: 'Jane Smith', text: 'Absolutely! I\'ll include Google and GitHub options.', timestamp: '1 hour ago' }
          ]
        },
        {
          id: 'TASK-002',
          title: 'Implement responsive navigation',
          description: 'Build mobile-first navigation component with accessibility features',
          status: 'To Do',
          priority: 'Medium',
          assignee: { name: 'Mike Johnson', avatar: 'MJ' },
          startDate: '2025-09-10',
          dueDate: '2025-09-20',
          tags: ['frontend', 'responsive', 'a11y'],
          timeTracked: '0h',
          progress: 0,
          subtasks: [],
          attachments: [],
          comments: []
        },
        {
          id: 'TASK-003',
          title: 'Set up API authentication middleware',
          description: 'Configure JWT authentication and role-based access control',
          status: 'Completed',
          priority: 'High',
          assignee: { name: 'Sarah Wilson', avatar: 'SW' },
          startDate: '2025-08-15',
          dueDate: '2025-08-30',
          tags: ['backend', 'auth', 'security'],
          timeTracked: '18h 45m',
          progress: 100,
          subtasks: [
            { id: 'ST-005', title: 'JWT implementation', completed: true },
            { id: 'ST-006', title: 'Role-based permissions', completed: true },
            { id: 'ST-007', title: 'Security testing', completed: true }
          ],
          attachments: [],
          comments: []
        }
      ],
      files: [
        {
          id: 'FILE-001',
          name: 'Project Requirements.pdf',
          size: '2.4 MB',
          type: 'pdf',
          uploadedBy: 'John Doe',
          uploadedAt: '2025-08-01',
          category: 'Documentation'
        },
        {
          id: 'FILE-002',
          name: 'UI Mockups.figma',
          size: '15.2 MB',
          type: 'figma',
          uploadedBy: 'Jane Smith',
          uploadedAt: '2025-08-15',
          category: 'Design'
        },
        {
          id: 'FILE-003',
          name: 'API Documentation.md',
          size: '0.8 MB',
          type: 'markdown',
          uploadedBy: 'Sarah Wilson',
          uploadedAt: '2025-08-20',
          category: 'Documentation'
        }
      ],
      timeEntries: [
        {
          id: 'TIME-001',
          user: 'Jane Smith',
          task: 'TASK-001',
          description: 'Working on authentication wireframes',
          duration: '4h 30m',
          date: '2025-09-13',
          billable: true
        },
        {
          id: 'TIME-002',
          user: 'Mike Johnson',
          task: 'TASK-002',
          description: 'Research mobile navigation patterns',
          duration: '2h 15m',
          date: '2025-09-13',
          billable: true
        },
        {
          id: 'TIME-003',
          user: 'Sarah Wilson',
          task: 'TASK-003',
          description: 'JWT middleware implementation',
          duration: '6h 00m',
          date: '2025-09-12',
          billable: true
        }
      ]
    }
  }
  
  return projects[projectId] || projects['PROJ-001'] // Fallback to default project
}

export function ProjectDetails({ projectId, onBack, user }: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskModalMode, setTaskModalMode] = useState<'create' | 'edit' | 'view'>('view')
  const [showProjectEditModal, setShowProjectEditModal] = useState(false)
  const [currentProject, setCurrentProject] = useState<any>(null)
  
  const project = currentProject || getProjectDetails(projectId)
  
  // Initialize current project
  useEffect(() => {
    setCurrentProject(getProjectDetails(projectId))
  }, [projectId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-[#28A745]'
      case 'In Progress': return 'text-[#FFC107]'
      case 'Completed': return 'text-[#007BFF]'
      case 'On Hold': return 'text-[#DC3545]'
      default: return 'text-muted-foreground'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-[#DC3545] text-white'
      case 'Medium': return 'bg-[#FFC107] text-white'
      case 'Low': return 'bg-[#28A745] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  const handleTaskCreate = () => {
    setSelectedTask(null)
    setTaskModalMode('create')
    setShowTaskModal(true)
  }

  const handleTaskEdit = (task: any) => {
    setSelectedTask(task)
    setTaskModalMode('edit')
    setShowTaskModal(true)
  }

  const handleTaskView = (task: any) => {
    setSelectedTask(task)
    setTaskModalMode('view')
    setShowTaskModal(true)
  }

  const handleTaskSave = (taskData: any) => {
    console.log('Saving task:', taskData)
    setShowTaskModal(false)
    // In a real app, this would save to the backend
  }

  const handleProjectEdit = () => {
    setShowProjectEditModal(true)
  }

  const handleProjectSave = (updatedProjectData: any) => {
    console.log('Saving project:', updatedProjectData)
    setCurrentProject(updatedProjectData)
    setShowProjectEditModal(false)
    // In a real app, this would save to the backend
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
              <Badge className={getPriorityColor(project.priority)}>
                {project.priority}
              </Badge>
              <Badge variant="outline">{project.id}</Badge>
            </div>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>{project.methodology}</span>
              </div>
              <span>•</span>
              <span>{project.type}</span>
              <span>•</span>
              <span>Owner: {project.owner}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleProjectEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <p className="text-2xl font-semibold">{project.progress}%</p>
            </div>
            <div className="p-3 bg-[#007BFF]/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-[#007BFF]" />
            </div>
          </div>
          <Progress value={project.progress} className="h-2 mt-4" />
          <p className="text-xs text-muted-foreground mt-2">
            {project.tasksCompleted} of {project.totalTasks} tasks completed
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Budget</p>
              <p className="text-2xl font-semibold">${(project.spent / 1000).toFixed(0)}k</p>
            </div>
            <div className="p-3 bg-[#28A745]/10 rounded-full">
              <DollarSign className="w-6 h-6 text-[#28A745]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">of ${(project.budget / 1000).toFixed(0)}k</span>
              <span className="text-[#28A745] font-medium">On Track</span>
            </div>
            <Progress value={(project.spent / project.budget) * 100} className="h-2 mt-1" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Size</p>
              <p className="text-2xl font-semibold">{project.team.length}</p>
            </div>
            <div className="p-3 bg-[#FFC107]/10 rounded-full">
              <Users className="w-6 h-6 text-[#FFC107]" />
            </div>
          </div>
          <div className="flex -space-x-1 mt-3">
            {project.team.slice(0, 4).map((member: any, index: number) => (
              <Avatar key={index} className="w-6 h-6 border-2 border-background">
                <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.team.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs">+{project.team.length - 4}</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Days Left</p>
              <p className="text-2xl font-semibold">
                {Math.ceil((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))}
              </p>
            </div>
            <div className="p-3 bg-[#DC3545]/10 rounded-full">
              <Clock className="w-6 h-6 text-[#DC3545]" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Due: {new Date(project.dueDate).toLocaleDateString()}
          </p>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Files</span>
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span>Time Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProjectDashboard project={project} onTaskView={handleTaskView} />
        </TabsContent>

        <TabsContent value="tasks">
          <TasksView 
            project={project} 
            onTaskCreate={handleTaskCreate}
            onTaskEdit={handleTaskEdit}
            onTaskView={handleTaskView}
          />
        </TabsContent>

        <TabsContent value="files">
          <FilesView project={project} />
        </TabsContent>

        <TabsContent value="time">
          <TimeTrackingView project={project} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityView project={project} />
        </TabsContent>

        <TabsContent value="settings">
          <ProjectSettings 
            project={project} 
            onUpdate={handleProjectSave}
            user={user}
          />
        </TabsContent>
      </Tabs>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          task={selectedTask}
          mode={taskModalMode}
          project={project}
          onSave={handleTaskSave}
        />
      )}

      {/* Project Edit Modal */}
      {showProjectEditModal && (
        <ProjectEditModal
          isOpen={showProjectEditModal}
          onClose={() => setShowProjectEditModal(false)}
          project={project}
          onSave={handleProjectSave}
          user={user}
        />
      )}
    </div>
  )
}