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
import { cn } from '../../components/ui/utils'
import { format } from 'date-fns'
import { toast } from 'sonner@2.0.3'
import { ProjectTemplates } from './ProjectTemplates'
import { Project, projectStatuses, projectPriorities, projectMethodologies, projectTypes } from '../../mock-data/projects'
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
  PauseCircle
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
    methodology: '',
    type: '',
    priority: '',
    startDate: undefined as Date | undefined,
    dueDate: undefined as Date | undefined,
    budget: '',
    owner: '',
    customer: '',
    customerId: '',
    teamLead: '',
    tags: [] as string[]
  })

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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name.trim()) {
      toast.error('Project name is required')
      return
    }

    try {
      const projectData: CreateProjectRequest = {
        name: newProject.name,
        description: newProject.description,
        status: 'Planning' as const,
        startDate: newProject.startDate ? newProject.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: newProject.dueDate ? newProject.dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        budget: parseInt(newProject.budget) || 0,
        customerId: newProject.customerId || 'default-customer',
        priority: (newProject.priority as 'Low' | 'Medium' | 'High' | 'Critical') || 'Medium',
        teamLead: newProject.teamLead || newProject.owner || 'default-lead',
        teamMembers: [],
        tags: newProject.tags,
        methodology: (newProject.methodology as 'Agile' | 'Waterfall' | 'Scrum' | 'Kanban' | 'Lean' | 'Hybrid') || 'Agile',
        projectType: (newProject.type as 'Web Development' | 'Mobile App' | 'Desktop App' | 'API Development' | 'Data Analytics' | 'E-commerce' | 'CRM' | 'ERP' | 'DevOps' | 'Machine Learning' | 'Other') || 'Other'
      }

      await dispatch(createProject(projectData)).unwrap()
      toast.success('Project created successfully!')
      setShowCreateProject(false)
      setNewProject({
        name: '', description: '', methodology: '', type: '', priority: '',
        startDate: undefined, dueDate: undefined, budget: '', owner: '', customer: '',
        customerId: '', teamLead: '', tags: []
      })
    } catch (error) {
      toast.error(`Failed to create project: ${error}`)
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
          <Button size="sm" className="bg-[#28A745] hover:bg-[#218838] text-white" onClick={() => setShowCreateProject(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
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

      {/* Create Project Dialog - Updated width to 1200px */}
      <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
        <DialogContent className="w-[1200px] max-w-[1200px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up your project with all the necessary details and configurations
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateProject} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name *</label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer/Client</label>
                <Input
                  value={newProject.customer}
                  onChange={(e) => setNewProject(prev => ({ ...prev, customer: e.target.value, customerId: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  placeholder="Enter customer name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the project goals and objectives"
                rows={3}
              />
            </div>
            
            {/* Project Configuration */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Methodology</label>
                <Select value={newProject.methodology} onValueChange={(value) => setNewProject(prev => ({ ...prev, methodology: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select methodology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scrum">Scrum</SelectItem>
                    <SelectItem value="Kanban">Kanban</SelectItem>
                    <SelectItem value="Waterfall">Waterfall</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Type</label>
                <Select value={newProject.type} onValueChange={(value) => setNewProject(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="Desktop App">Desktop App</SelectItem>
                    <SelectItem value="API Development">API Development</SelectItem>
                    <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="CRM">CRM</SelectItem>
                    <SelectItem value="ERP">ERP</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={newProject.priority} onValueChange={(value) => setNewProject(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
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
            
            {/* Timeline & Budget */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newProject.startDate ? format(newProject.startDate, 'MMM dd, yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newProject.startDate}
                      onSelect={(date: Date | undefined) => setNewProject(prev => ({ ...prev, startDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newProject.dueDate ? format(newProject.dueDate, 'MMM dd, yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newProject.dueDate}
                      onSelect={(date: Date | undefined) => setNewProject(prev => ({ ...prev, dueDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget ($)</label>
                <Input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Owner</label>
                <Input
                  value={newProject.owner}
                  onChange={(e) => setNewProject(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="Enter project owner name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Team Lead</label>
                <Input
                  value={newProject.teamLead}
                  onChange={(e) => setNewProject(prev => ({ ...prev, teamLead: e.target.value }))}
                  placeholder="Enter team lead name"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowCreateProject(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#28A745] hover:bg-[#218838]">
                Create Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}