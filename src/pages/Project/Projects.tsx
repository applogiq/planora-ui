import { useState, useEffect } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Calendar as CalendarComponent } from '../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { Separator } from '../../components/ui/separator'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { cn } from '../../components/ui/utils'
import { format } from 'date-fns'
import { toast } from 'sonner@2.0.3'
import { ProjectTemplates } from './ProjectTemplates'
import { Project } from '../../mock-data/projects'
import {
  mockCustomers,
  mockTeamMembers
} from '../../mock-data/master'
import { useProjectMasters } from '../../hooks/useProjectMasters'
import { useProjectOwners } from '../../hooks/useProjectOwners'
import { useProjectMembers } from '../../hooks/useProjectMembers'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchProjects,
  createProject,
  setFilters,
  setPagination,
  clearError
} from '../../store/slices/projectSlice'
import { CreateProjectRequest } from '../../services/projectApi'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Target,
  Clock,
  MoreHorizontal,
  Folder,
  TrendingUp,
  AlertTriangle,
  GitBranch,
  Flag,
  Copy,
  Settings,
  FileText,
  Zap,
  BarChart3,
  Calendar as CalendarIcon,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  X,
  Trash2,
  Save,
  DollarSign,
  Calendar as CalendarDays,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe
} from 'lucide-react'

// Add computed properties for UI display
const addComputedProperties = (project: Project) => ({
  ...project,
  teamSize: (project.teamMembers?.length || 0) + 1, // +1 for team lead
  tasksTotal: 25, // Default value, could be calculated from tasks
  tasksCompleted: Math.floor((project.progress / 100) * 25),
  issuesOpen: Math.floor(Math.random() * 5) + 1,
  upcomingMilestones: 2,
  recentActivity: project.lastUpdated,
  epics: Math.floor(Math.random() * 5) + 1,
  stories: Math.floor(Math.random() * 20) + 10,
  currentSprint: `Sprint ${Math.floor(Math.random() * 5) + 20}`,
  nextMilestone: 'Release v1.0',
  milestoneDue: project.endDate,
  version: 'v1.0.0',
  dependencies: []
});

interface ProjectsProps {
  onProjectSelect?: (projectId: string) => void
  user?: any
}

export function Projects({ onProjectSelect, user }: ProjectsProps) {
  const dispatch = useAppDispatch()
  const {
    projects: reduxProjects,
    loading,
    error,
    filters,
    total
  } = useAppSelector((state) => state.projects)

  const {
    data: projectMasters,
    loading: mastersLoading,
    error: mastersError,
    retry: retryMasters
  } = useProjectMasters()

  const {
    data: projectOwners,
    loading: ownersLoading,
    error: ownersError,
    retry: retryOwners
  } = useProjectOwners()

  const {
    data: projectMembers,
    loading: membersLoading,
    error: membersError,
    retry: retryMembers
  } = useProjectMembers()

  const userRole = user?.role || 'developer'
  const isAdmin = userRole === 'admin'
  const isProjectManager = userRole === 'project_manager'
  const isDeveloperOrTester = userRole === 'developer' || userRole === 'tester'

  // Add computed properties to projects from Redux
  const projects = reduxProjects.map(addComputedProperties)

  // Filter projects based on user role
  const getFilteredProjects = () => {
    if (isAdmin || isProjectManager) {
      return projects // Admins and PMs see all projects
    } else if (isDeveloperOrTester) {
      // Developers and testers only see projects they're assigned to
      return projects.filter(project =>
        (project.teamMembers?.includes(user?.name)) || project.teamLead === user?.name
      )
    }
    return projects
  }

  const roleFilteredProjects = getFilteredProjects()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState({
    status: 'all',
    priority: 'all',
    methodology: 'all',
    type: 'all'
  })
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    methodology: 'Scrum',
    type: 'Software Development',
    startDate: new Date(),
    dueDate: new Date(),
    budget: 0,
    customer: 'Internal',
    owner: '',
    team: [] as any[],
    isPublic: true,
    notifications: true,
    autoArchive: false,
    version: 'v1.0.0',
    tags: [] as string[],
    customFields: {} as Record<string, any>,
    customerId: '',
    teamLead: ''
  })

  const [activeTab, setActiveTab] = useState('general')
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Helper functions to process API data
  const getApiStatuses = () => {
    if (!projectMasters?.statuses) return []
    return projectMasters.statuses
      .filter(status => status.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(status => ({
        value: status.name,
        color: `bg-[${status.color}] text-white`
      }))
  }

  const getApiPriorities = () => {
    if (!projectMasters?.priorities) return []
    return projectMasters.priorities
      .filter(priority => priority.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(priority => ({
        value: priority.name,
        color: `bg-[${priority.color}] text-white`
      }))
  }

  const getApiMethodologies = () => {
    if (!projectMasters?.methodologies) return []
    return projectMasters.methodologies
      .filter(methodology => methodology.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(methodology => methodology.name)
  }

  const getApiProjectTypes = () => {
    if (!projectMasters?.types) return []
    return projectMasters.types
      .filter(type => type.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(type => type.name)
  }

  // Use API data if available, fallback to mock data
  const statuses = getApiStatuses().length > 0 ? getApiStatuses() : [
    { value: 'Planning', color: 'bg-gray-500 text-white' },
    { value: 'Active', color: 'bg-[#28A745] text-white' },
    { value: 'On Hold', color: 'bg-[#FFC107] text-white' },
    { value: 'Completed', color: 'bg-[#007BFF] text-white' }
  ]

  const priorities = getApiPriorities().length > 0 ? getApiPriorities() : [
    { value: 'Low', color: 'bg-[#28A745] text-white' },
    { value: 'Medium', color: 'bg-[#FFC107] text-white' },
    { value: 'High', color: 'bg-[#DC3545] text-white' },
    { value: 'Critical', color: 'bg-[#6F42C1] text-white' }
  ]

  const editableMethodologies = getApiMethodologies().length > 0 ? getApiMethodologies() : [
    'Agile', 'Waterfall', 'Scrum', 'Kanban', 'Lean', 'Hybrid'
  ]

  const editableProjectTypes = getApiProjectTypes().length > 0 ? getApiProjectTypes() : [
    'Web Development', 'Mobile App', 'Desktop App', 'API Development', 'Data Analytics', 'E-commerce', 'CRM', 'ERP', 'DevOps', 'Machine Learning', 'Other'
  ]

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  // Update filters in Redux when local filters change
  useEffect(() => {
    dispatch(setFilters({
      search: searchQuery,
      status: filterBy.status === 'all' ? '' : filterBy.status,
      priority: filterBy.priority === 'all' ? '' : filterBy.priority,
      methodology: filterBy.methodology === 'all' ? '' : filterBy.methodology,
      projectType: filterBy.type === 'all' ? '' : filterBy.type
    }))
  }, [dispatch, searchQuery, filterBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-[#28A745]'
      case 'In Progress': return 'text-[#FFC107]'
      case 'Completed': return 'text-[#007BFF]'
      case 'On Hold': return 'text-[#DC3545]'
      default: return 'text-muted-foreground'
    }
  }

  const filteredProjects = roleFilteredProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.customer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterBy.status === 'all' || project.status === filterBy.status
    const matchesPriority = filterBy.priority === 'all' || project.priority === filterBy.priority
    const matchesMethodology = filterBy.methodology === 'all' || project.methodology === filterBy.methodology
    const matchesType = filterBy.type === 'all' || project.type === filterBy.type
    
    return matchesSearch && matchesStatus && matchesPriority && matchesMethodology && matchesType
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-[#DC3545] text-white'
      case 'Medium': return 'bg-[#FFC107] text-white'
      case 'Low': return 'bg-[#28A745] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100
    if (percentage > 90) return { color: 'text-[#DC3545]', status: 'Over Budget' }
    if (percentage > 75) return { color: 'text-[#FFC107]', status: 'At Risk' }
    return { color: 'text-[#28A745]', status: 'On Track' }
  }

  const handleInputChange = (field: string, value: any) => {
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTeamMember = (member: any) => {
    if (!newProject.team.find(m => m.id === member.id)) {
      setNewProject(prev => ({
        ...prev,
        team: [...prev.team, member]
      }))
    }
  }

  const handleRemoveTeamMember = (memberId: number) => {
    setNewProject(prev => ({
      ...prev,
      team: prev.team.filter(m => m.id !== memberId)
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !newProject.tags.includes(newTag.trim())) {
      setNewProject(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewProject(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleCreateProject = async () => {
    setIsLoading(true)

    // Enhanced validation (same as edit modal)
    if (!newProject.name.trim()) {
      toast.error('Project name is required')
      setIsLoading(false)
      return
    }

    if (!newProject.description.trim()) {
      toast.error('Project description is required')
      setIsLoading(false)
      return
    }

    if (newProject.dueDate <= newProject.startDate) {
      toast.error('Due date must be after start date')
      setIsLoading(false)
      return
    }

    if (newProject.budget < 0) {
      toast.error('Budget must be a positive number')
      setIsLoading(false)
      return
    }

    try {
      const projectData: CreateProjectRequest = {
        name: newProject.name,
        description: newProject.description,
        status: newProject.status,
        startDate: newProject.startDate.toISOString().split('T')[0],
        endDate: newProject.dueDate.toISOString().split('T')[0],
        budget: newProject.budget,
        customerId: newProject.customerId || 'default-customer',
        priority: newProject.priority,
        teamLead: newProject.teamLead || newProject.owner || 'default-lead',
        teamMembers: newProject.team.map(member => member.name),
        tags: newProject.tags,
        methodology: newProject.methodology,
        projectType: newProject.type
      }

      await dispatch(createProject(projectData)).unwrap()
      toast.success('Project created successfully!')
      setShowCreateProject(false)

      // Reset form to initial state
      setNewProject({
        name: '',
        description: '',
        status: 'Planning',
        priority: 'Medium',
        methodology: 'Scrum',
        type: 'Software Development',
        startDate: new Date(),
        dueDate: new Date(),
        budget: 0,
        customer: 'Internal',
        owner: '',
        team: [] as any[],
        isPublic: true,
        notifications: true,
        autoArchive: false,
        version: 'v1.0.0',
        tags: [] as string[],
        customFields: {} as Record<string, any>,
        customerId: '',
        teamLead: ''
      })
      setActiveTab('general')
    } catch (error) {
      toast.error(`Failed to create project: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseTemplate = (template: any) => {
    setNewProject({
      ...newProject,
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      description: template.description,
      methodology: template.methodology,
      type: template.type
    })
    setShowTemplateModal(false)
    setShowCreateProject(true)
  }

  // Get available team members from API data, fallback to mock data
  const getAvailableMembers = () => {
    const apiMembers = projectMembers?.items?.filter(member => member.is_active) || []
    const mockMembers = mockTeamMembers

    // Use API data if available, otherwise fallback to mock data
    const allMembers = apiMembers.length > 0 ? apiMembers.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role.name,
      avatar: member.avatar || member.name.charAt(0).toUpperCase(),
      email: member.email,
      department: member.department
    })) : mockMembers

    return allMembers.filter(
      availableMember => !newProject.team.find(teamMember => teamMember.id === availableMember.id)
    )
  }

  const availableMembers = getAvailableMembers()

  const getMethodologyIcon = (methodology: string) => {
    switch (methodology) {
      case 'Scrum': return <Zap className="w-4 h-4" />
      case 'Kanban': return <BarChart3 className="w-4 h-4" />
      case 'Waterfall': return <GitBranch className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  // Show error if there's one
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Show error for masters API
  useEffect(() => {
    if (mastersError) {
      toast.error(`Failed to load project configuration: ${mastersError}`)
    }
  }, [mastersError])

  // Show error for owners API
  useEffect(() => {
    if (ownersError) {
      toast.error(`Failed to load project owners: ${ownersError}`)
    }
  }, [ownersError])

  // Show error for members API
  useEffect(() => {
    if (membersError) {
      toast.error(`Failed to load project members: ${membersError}`)
    }
  }, [membersError])

  return (
    <div className="space-y-6">
      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading projects...</div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {isAdmin ? 'All Projects' : 
             isProjectManager ? 'Managed Projects' : 
             'My Projects'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'End-to-end project lifecycle management with Agile, Waterfall & Hybrid workflows' :
             isProjectManager ? 'Projects under your management and team collaboration' :
             'Your assigned projects and contributions'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          {/* Filter Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Filter Projects</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select value={filterBy.status} onValueChange={(value) => setFilterBy({...filterBy, status: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Priority</label>
                    <Select value={filterBy.priority} onValueChange={(value) => setFilterBy({...filterBy, priority: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Methodology</label>
                    <Select value={filterBy.methodology} onValueChange={(value) => setFilterBy({...filterBy, methodology: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="Scrum">Scrum</SelectItem>
                        <SelectItem value="Kanban">Kanban</SelectItem>
                        <SelectItem value="Waterfall">Waterfall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <Select value={filterBy.type} onValueChange={(value) => setFilterBy({...filterBy, type: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Software Development">Software Dev</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setFilterBy({status: 'all', priority: 'all', methodology: 'all', type: 'all'})}
                >
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="sm" onClick={() => setShowTemplateModal(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button
            size="sm"
            className="bg-[#28A745] hover:bg-[#218838] text-white"
            onClick={() => setShowCreateProject(true)}
            disabled={mastersLoading || ownersLoading || membersLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            {(mastersLoading || ownersLoading || membersLoading) ? 'Loading...' : 'New Project'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview ({roleFilteredProjects.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({roleFilteredProjects.filter(p => p.status === 'Active').length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({roleFilteredProjects.filter(p => p.status === 'In Progress').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({roleFilteredProjects.filter(p => p.status === 'Completed').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-semibold">{roleFilteredProjects.length}</p>
                </div>
                <div className="p-3 bg-[#007BFF]/10 rounded-full">
                  <Folder className="w-6 h-6 text-[#007BFF]" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-semibold">{roleFilteredProjects.filter(p => p.status === 'Active').length}</p>
                </div>
                <div className="p-3 bg-[#28A745]/10 rounded-full">
                  <TrendingUp className="w-6 h-6 text-[#28A745]" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                  <p className="text-2xl font-semibold">1</p>
                </div>
                <div className="p-3 bg-[#FFC107]/10 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-[#FFC107]" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-semibold">$160k</p>
                </div>
                <div className="p-3 bg-[#DC3545]/10 rounded-full">
                  <Target className="w-6 h-6 text-[#DC3545]" />
                </div>
              </div>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const budgetStatus = getBudgetStatus(project.spent, project.budget)
              
              return (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onProjectSelect?.(project.id)}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{project.name}</h3>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            {getMethodologyIcon(project.methodology)}
                            <span>{project.methodology}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {project.type}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Backlog Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Epics</p>
                        <p className="text-sm font-semibold">{project.epics}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Stories</p>
                        <p className="text-sm font-semibold">{project.stories}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Tasks</p>
                        <p className="text-sm font-semibold">{project.tasksCompleted}/{project.totalTasks}</p>
                      </div>
                    </div>

                    {/* Status & Budget */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`text-xs ${budgetStatus.color}`}>
                        ${(project.spent/1000).toFixed(0)}k / ${(project.budget/1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.filter(p => p.status === 'Active').map((project) => {
              const budgetStatus = getBudgetStatus(project.spent, project.budget)
              
              return (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onProjectSelect?.(project.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{project.name}</h3>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.filter(p => p.status === 'In Progress').map((project) => {
              const budgetStatus = getBudgetStatus(project.spent, project.budget)
              
              return (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onProjectSelect?.(project.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{project.name}</h3>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.filter(p => p.status === 'Completed').map((project) => {
              const budgetStatus = getBudgetStatus(project.spent, project.budget)
              
              return (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onProjectSelect?.(project.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{project.name}</h3>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Template Modal - 1200px width */}
      <ProjectTemplates 
        isOpen={showTemplateModal} 
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleUseTemplate}
      />

      {/* Create Project Dialog - Enhanced with tabs like edit modal */}
      <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
        <DialogContent className="w-[1200px] max-w-[1200px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create New Project</span>
            </DialogTitle>
            <DialogDescription>
              Set up your project with comprehensive details, manage team members, set timeline and budget, and configure project settings.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Team</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center space-x-2">
                <CalendarDays className="w-4 h-4" />
                <span>Timeline & Budget</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter project name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter project description"
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select value={newProject.customer} onValueChange={(value) => handleInputChange('customer', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.name}>
                            <div className="flex items-center space-x-2">
                              <span>{customer.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {customer.type}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={newProject.version}
                      onChange={(e) => handleInputChange('version', e.target.value)}
                      placeholder="e.g., v1.0.0"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newProject.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${status.color.split(' ')[0]}`} />
                              <span>{status.value}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newProject.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${priority.color.split(' ')[0]}`} />
                              <span>{priority.value}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="methodology">Methodology</Label>
                    <Select value={newProject.methodology} onValueChange={(value) => handleInputChange('methodology', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select methodology" />
                      </SelectTrigger>
                      <SelectContent>
                        {editableMethodologies.map((methodology) => (
                          <SelectItem key={methodology} value={methodology}>
                            {methodology}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type">Project Type</Label>
                    <Select value={newProject.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {editableProjectTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="owner">Project Owner</Label>
                    <Select value={newProject.owner} onValueChange={(value) => handleInputChange('owner', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select project owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {ownersLoading ? (
                          <SelectItem value="" disabled>
                            Loading owners...
                          </SelectItem>
                        ) : projectOwners?.items?.length ? (
                          projectOwners.items
                            .filter(owner => owner.is_active)
                            .map((owner) => (
                              <SelectItem key={owner.id} value={owner.name}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full bg-[#007BFF] text-white text-xs flex items-center justify-center">
                                    {owner.avatar || owner.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-medium">{owner.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {owner.role.name} • {owner.department}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem value="" disabled>
                            No owners available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {newProject.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-medium mb-4 flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Current Team ({newProject.team.length})</span>
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {newProject.team.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No team members assigned</p>
                    ) : (
                      newProject.team.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-[#007BFF] text-white text-sm">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTeamMember(member.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-4 flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Available Team Members</span>
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {membersLoading ? (
                      <p className="text-muted-foreground text-sm">Loading team members...</p>
                    ) : availableMembers.length === 0 ? (
                      <p className="text-muted-foreground text-sm">All team members are already assigned</p>
                    ) : (
                      availableMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-[#28A745] text-white text-sm">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                              <p className="text-xs text-muted-foreground">{member.department}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTeamMember(member)}
                            className="text-[#28A745] hover:text-[#28A745] hover:bg-[#28A745]/10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-medium mb-4 flex items-center space-x-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>Timeline</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Start Date</Label>
                      <Popover open={showStartDatePicker} onOpenChange={setShowStartDatePicker}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !newProject.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newProject.startDate ? format(newProject.startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={newProject.startDate}
                            onSelect={(date) => {
                              if (date) {
                                handleInputChange('startDate', date)
                                setShowStartDatePicker(false)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Due Date</Label>
                      <Popover open={showDueDatePicker} onOpenChange={setShowDueDatePicker}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !newProject.dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newProject.dueDate ? format(newProject.dueDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={newProject.dueDate}
                            onSelect={(date) => {
                              if (date) {
                                handleInputChange('dueDate', date)
                                setShowDueDatePicker(false)
                              }
                            }}
                            initialFocus
                            disabled={(date) => date <= newProject.startDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="pt-2">
                      <Label className="text-muted-foreground">Duration</Label>
                      <p className="text-sm font-medium mt-1">
                        {Math.ceil((newProject.dueDate.getTime() - newProject.startDate.getTime()) / (1000 * 3600 * 24))} days
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-4 flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Budget</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="budget">Total Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newProject.budget}
                        onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                        placeholder="Enter budget amount"
                        className="mt-1"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="p-4">
                <h3 className="font-medium mb-4 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Project Settings</span>
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Public Project</Label>
                      <p className="text-sm text-muted-foreground">Allow all team members to view this project</p>
                    </div>
                    <Switch
                      checked={newProject.isPublic}
                      onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send email updates for project activities</p>
                    </div>
                    <Switch
                      checked={newProject.notifications}
                      onCheckedChange={(checked) => handleInputChange('notifications', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Auto Archive</Label>
                      <p className="text-sm text-muted-foreground">Automatically archive completed projects after 30 days</p>
                    </div>
                    <Switch
                      checked={newProject.autoArchive}
                      onCheckedChange={(checked) => handleInputChange('autoArchive', checked)}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setShowCreateProject(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={isLoading} className="bg-[#28A745] hover:bg-[#218838]">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}