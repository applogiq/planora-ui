import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Progress } from '../../components/ui/progress'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { 
  Plus, 
  Search, 
  Filter, 
  Target,
  Zap,
  BookOpen,
  Calendar,
  Clock,
  User,
  Flag,
  ArrowRight,
  Edit3,
  Trash2,
  MoreHorizontal,
  FileText,
  CheckSquare,
  Bug,
  Users,
  Activity,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { BacklogDialog } from '../Planning/Backlog/BacklogDialog'
import { EpicDialog } from '../Planning/Epic/EpicDialog'
import { SprintDialog } from '../Planning/Sprint/SprintDialog'
import { BacklogItemActions } from '../Planning/Backlog/BacklogItemActions'
import { useEpics } from '../../hooks/useEpics'
import { useActiveProjects } from '../../hooks/useActiveProjects'
import { useProjectMembers } from '../../hooks/useProjectMembers'
import { useProjectOwners } from '../../hooks/useProjectOwners'
import { CreateEpicRequest } from '../../services/epicApi'



interface TasksProps {
  user: any
}

export function Tasks({ user }: TasksProps) {
  // State for project filtering
  const [selectedProjectId, setSelectedProjectId] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('backlog')

  // Epic API integration
  const {
    data: epicsResponse,
    loading: epicsLoading,
    error: epicsError,
    createEpic,
    updateEpic,
    deleteEpic,
    refetch: refetchEpics
  } = useEpics(selectedProjectId !== 'all' ? selectedProjectId : undefined)

  // Active projects API integration
  const { projects, loading: projectsLoading } = useActiveProjects()

  // Project members API integration
  const { data: projectMembersData, loading: membersLoading } = useProjectMembers()
  const teamMembers = projectMembersData?.items || []

  // Project owners API integration
  const { data: projectOwnersData, loading: ownersLoading } = useProjectOwners()
  const projectOwners = projectOwnersData?.items || []

  // Data state
  const [backlogs, setBacklogs] = useState([
    {
      id: 'STORY-001',
      title: 'User Registration with Email Verification',
      description: 'As a new user, I want to register with my email address and receive a verification link so that I can securely create an account',
      type: 'User Story',
      priority: 'High',
      status: 'Ready',
      epicId: 'EPIC-001',
      epicTitle: 'User Management System',
      projectId: 'PROJ-001',
      projectName: 'E-commerce Platform',
      assigneeId: 'USER-003',
      assigneeName: 'Sarah Wilson',
      reporterId: 'USER-007',
      reporterName: 'Emma Davis',
      storyPoints: 8,
      businessValue: 'High',
      effort: 'Medium',
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
      epicId: 'EPIC-002',
      epicTitle: 'Mobile Banking Core Features',
      projectId: 'PROJ-002',
      projectName: 'Mobile Banking App',
      assigneeId: 'USER-004',
      assigneeName: 'Mike Johnson',
      reporterId: 'USER-007',
      reporterName: 'Emma Davis',
      storyPoints: 13,
      businessValue: 'Critical',
      effort: 'High',
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
      id: 'TASK-001',
      title: 'Setup CI/CD Pipeline',
      description: 'Configure automated deployment pipeline with testing and security scans',
      type: 'Task',
      priority: 'High',
      status: 'Ready',
      epicId: 'EPIC-009',
      epicTitle: 'API Gateway & Microservices',
      projectId: 'PROJ-001',
      projectName: 'E-commerce Platform',
      assigneeId: 'USER-006',
      assigneeName: 'Alex Chen',
      reporterId: 'USER-004',
      reporterName: 'Mike Johnson',
      storyPoints: 3,
      businessValue: 'Medium',
      effort: 'Low',
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
      epicId: 'EPIC-007',
      epicTitle: 'Data Visualization Engine',
      projectId: 'PROJ-004',
      projectName: 'Analytics Dashboard',
      assigneeId: 'USER-005',
      assigneeName: 'Lisa Park',
      reporterId: 'USER-002',
      reporterName: 'Praveen Kumar',
      storyPoints: 3,
      businessValue: 'High',
      effort: 'Medium',
      createdAt: '2025-01-09T14:20:00Z',
      updatedAt: '2025-01-22T13:55:00Z',
      labels: ['Bug', 'Performance', 'Memory'],
      acceptanceCriteria: [
        'Memory usage remains stable during chart data updates',
        'Browser performance is not degraded after extended use',
        'Chart cleanup properly disposes of event listeners',
        'Memory profiling shows no increasing heap usage patterns'
      ]
    }
  ])

  // Get epics from API response or fallback to empty array
  const epics = epicsResponse?.items || []

  const [sprints, setSprints] = useState([
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
    }
  ])

  // Dialog states
  const [showBacklogDialog, setShowBacklogDialog] = useState(false)
  const [showEpicDialog, setShowEpicDialog] = useState(false)
  const [showSprintDialog, setShowSprintDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Form states
  const [backlogItem, setBacklogItem] = useState({
    id: '',
    title: '',
    description: '',
    type: 'User Story',
    priority: 'Medium',
    status: 'Backlog',
    projectId: '',
    projectName: '',
    epicId: '',
    epicTitle: '',
    assigneeId: '',
    assigneeName: '',
    reporterId: user?.id || '',
    reporterName: user?.name || '',
    storyPoints: 0,
    businessValue: 'Medium',
    effort: 'Medium',
    labels: [],
    acceptanceCriteria: ['']
  })

  const [epic, setEpic] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Planning',
    project_id: '',
    assignee_id: '',
    due_date: '',
    labels: [],
    business_value: '',
    total_story_points: 0,
    completed_story_points: 0,
    total_tasks: 0,
    completed_tasks: 0
  })

  const [sprint, setSprint] = useState({
    id: '',
    name: '',
    status: 'Planning',
    startDate: '',
    endDate: '',
    goal: '',
    projectId: '',
    projectName: '',
    scrumMasterId: '',
    scrumMasterName: '',
    teamSize: 6,
    totalPoints: 0,
    completedPoints: 0,
    totalTasks: 0,
    completedTasks: 0,
    velocity: 0,
    burndownTrend: 'Not Started'
  })

  // Filter data based on selected project and search
  const filteredBacklogs = useMemo(() => {
    let filtered = backlogs
    
    if (selectedProjectId !== 'all') {
      filtered = filtered.filter(item => item.projectId === selectedProjectId)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.labels.some(label => label.toLowerCase().includes(query))
      )
    }
    
    return filtered
  }, [backlogs, selectedProjectId, searchQuery])

  const filteredEpics = useMemo(() => {
    let filtered = epics
    
    if (selectedProjectId !== 'all') {
      filtered = filtered.filter(item => item.projectId === selectedProjectId)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.labels.some(label => label.toLowerCase().includes(query))
      )
    }
    
    return filtered
  }, [epics, selectedProjectId, searchQuery])

  const filteredSprints = useMemo(() => {
    let filtered = sprints
    
    if (selectedProjectId !== 'all') {
      filtered = filtered.filter(item => item.projectId === selectedProjectId)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.goal.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [sprints, selectedProjectId, searchQuery])

  // Helper functions
  const resetBacklogForm = () => {
    setBacklogItem({
      id: '',
      title: '',
      description: '',
      type: 'User Story',
      priority: 'Medium',
      status: 'Backlog',
      projectId: selectedProjectId !== 'all' ? selectedProjectId : '',
      projectName: selectedProjectId !== 'all' ? projects.find(p => p.id === selectedProjectId)?.name || '' : '',
      epicId: '',
      epicTitle: '',
      assigneeId: '',
      assigneeName: '',
      reporterId: user?.id || '',
      reporterName: user?.name || '',
      storyPoints: 0,
      businessValue: 'Medium',
      effort: 'Medium',
      labels: [],
      acceptanceCriteria: ['']
    })
  }

  const resetEpicForm = () => {
    setEpic({
      id: '',
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Planning',
      project_id: selectedProjectId !== 'all' ? selectedProjectId : '',
      assignee_id: '',
      due_date: '',
      labels: [],
      business_value: '',
      total_story_points: 0,
      completed_story_points: 0,
      total_tasks: 0,
      completed_tasks: 0
    })
  }

  const resetSprintForm = () => {
    setSprint({
      id: '',
      name: '',
      status: 'Planning',
      startDate: '',
      endDate: '',
      goal: '',
      projectId: selectedProjectId !== 'all' ? selectedProjectId : '',
      projectName: selectedProjectId !== 'all' ? projects.find(p => p.id === selectedProjectId)?.name || '' : '',
      scrumMasterId: '',
      scrumMasterName: '',
      teamSize: 6,
      totalPoints: 0,
      completedPoints: 0,
      totalTasks: 0,
      completedTasks: 0,
      velocity: 0,
      burndownTrend: 'Not Started'
    })
  }

  // Event handlers
  const handleCreateBacklog = () => {
    resetBacklogForm()
    setEditingItem(null)
    setShowBacklogDialog(true)
  }

  const handleEditBacklog = (item: any) => {
    setBacklogItem({ ...item })
    setEditingItem(item)
    setShowBacklogDialog(true)
  }

  const handleSaveBacklog = () => {
    if (!backlogItem.title || !backlogItem.description || !backlogItem.projectId || !backlogItem.assigneeId) {
      toast.error('Please fill in all required fields')
      return
    }

    const newItem = {
      ...backlogItem,
      id: editingItem ? editingItem.id : `ITEM-${Date.now()}`,
      projectName: projects.find(p => p.id === backlogItem.projectId)?.name || '',
      assigneeName: teamMembers.find(m => m.id === backlogItem.assigneeId)?.name || '',
      reporterName: teamMembers.find(m => m.id === backlogItem.reporterId)?.name || '',
      epicTitle: backlogItem.epicId ? epics.find(e => e.id === backlogItem.epicId)?.title || '' : '',
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingItem) {
      setBacklogs(prev => prev.map(item => item.id === editingItem.id ? newItem : item))
      toast.success(`${backlogItem.type} updated successfully`)
    } else {
      setBacklogs(prev => [...prev, newItem])
      toast.success(`${backlogItem.type} created successfully`)
    }

    setShowBacklogDialog(false)
    resetBacklogForm()
    setEditingItem(null)
  }

  const handleDeleteBacklog = (itemId: string) => {
    const item = backlogs.find(b => b.id === itemId)
    setBacklogs(prev => prev.filter(b => b.id !== itemId))
    toast.success(`${item?.type || 'Item'} deleted successfully`)
  }

  const handleMoveToSprint = (itemId: string, sprintId: string) => {
    const item = backlogs.find(b => b.id === itemId)
    if (item) {
      setBacklogs(prev => prev.map(b => 
        b.id === itemId ? { ...b, status: 'In Sprint' } : b
      ))
    }
  }

  const handleDuplicateBacklog = (item: any) => {
    const duplicatedItem = {
      ...item,
      id: `ITEM-${Date.now()}`,
      title: `${item.title} (Copy)`,
      status: 'Backlog',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setBacklogs(prev => [...prev, duplicatedItem])
    toast.success(`${item.type} duplicated successfully`)
  }

  // Epic handlers
  const handleCreateEpic = () => {
    resetEpicForm()
    setEditingItem(null)
    setShowEpicDialog(true)
  }

  const handleEditEpic = (item: any) => {
    // Map API response fields to form fields
    setEpic({
      id: item.id,
      title: item.title,
      description: item.description,
      priority: item.priority,
      status: item.status,
      project_id: item.project_id,
      assignee_id: item.assignee_id,
      due_date: item.due_date,
      labels: item.labels || [],
      business_value: item.business_value,
      total_story_points: item.total_story_points,
      completed_story_points: item.completed_story_points,
      total_tasks: item.total_tasks,
      completed_tasks: item.completed_tasks
    })
    setEditingItem(item)
    setShowEpicDialog(true)
  }

  const handleSaveEpic = async () => {
    if (!epic.title || !epic.description || !epic.project_id) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const epicData: CreateEpicRequest = {
        title: epic.title,
        description: epic.description,
        priority: epic.priority,
        status: epic.status,
        project_id: epic.project_id,
        assignee_id: epic.assignee_id || null,
        due_date: epic.due_date || "",
        labels: epic.labels,
        business_value: epic.business_value,
        total_story_points: epic.total_story_points,
        completed_story_points: epic.completed_story_points,
        total_tasks: epic.total_tasks,
        completed_tasks: epic.completed_tasks
      }

      if (editingItem) {
        await updateEpic(editingItem.id, epicData)
        toast.success('Epic updated successfully')
      } else {
        await createEpic(epicData)
        toast.success('Epic created successfully')
      }

      setShowEpicDialog(false)
      resetEpicForm()
      setEditingItem(null)
    } catch (error) {
      toast.error(`Failed to save epic: ${error}`)
    }
  }

  const handleDeleteEpic = async (epicId: string) => {
    try {
      await deleteEpic(epicId)
      toast.success('Epic deleted successfully')
    } catch (error) {
      toast.error(`Failed to delete epic: ${error}`)
    }
  }

  // Sprint handlers
  const handleCreateSprint = () => {
    resetSprintForm()
    setEditingItem(null)
    setShowSprintDialog(true)
  }

  const handleEditSprint = (item: any) => {
    setSprint({ ...item })
    setEditingItem(item)
    setShowSprintDialog(true)
  }

  const handleSaveSprint = () => {
    if (!sprint.name || !sprint.goal || !sprint.projectId || !sprint.startDate || !sprint.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const newSprint = {
      ...sprint,
      id: editingItem ? editingItem.id : `SPRINT-${Date.now()}`,
      projectName: projects.find(p => p.id === sprint.projectId)?.name || '',
      scrumMasterName: teamMembers.find(m => m.id === sprint.scrumMasterId)?.name || ''
    }

    if (editingItem) {
      setSprints(prev => prev.map(item => item.id === editingItem.id ? newSprint : item))
      toast.success('Sprint updated successfully')
    } else {
      setSprints(prev => [...prev, newSprint])
      toast.success('Sprint created successfully')
    }

    setShowSprintDialog(false)
    resetSprintForm()
    setEditingItem(null)
  }

  const handleDeleteSprint = (sprintId: string) => {
    setSprints(prev => prev.filter(s => s.id !== sprintId))
    toast.success('Sprint deleted successfully')
  }

  // Acceptance criteria handlers
  const handleAddAcceptanceCriteria = () => {
    setBacklogItem(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, '']
    }))
  }

  const handleUpdateAcceptanceCriteria = (index: number, value: string) => {
    setBacklogItem(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map((criteria, i) => 
        i === index ? value : criteria
      )
    }))
  }

  const handleRemoveAcceptanceCriteria = (index: number) => {
    setBacklogItem(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }))
  }

  // Priority and status helpers
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Backlog': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'Ready': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'User Story': return <BookOpen className="w-4 h-4 text-blue-600" />
      case 'Task': return <CheckSquare className="w-4 h-4 text-green-600" />
      case 'Bug': return <Bug className="w-4 h-4 text-red-600" />
      default: return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Planning & Backlog Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage epics, sprints, and backlog items with full project alignment
          </p>
        </div>
      </div>

      {/* Project Filter and Search */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Label>Project Filter:</Label>
          </div>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span>All Projects</span>
                </div>
              </SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    <span>{project.name}</span>
                    <Badge variant="outline" className="text-xs ml-1">
                      {project.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-auto grid-cols-3">
            <TabsTrigger value="backlog" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Backlog ({filteredBacklogs.length})
            </TabsTrigger>
            <TabsTrigger value="epics" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Epics ({filteredEpics.length})
            </TabsTrigger>
            <TabsTrigger value="sprints" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Sprints ({filteredSprints.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {activeTab === 'backlog' && (
              <Button onClick={handleCreateBacklog} className="bg-[#28A745] hover:bg-[#218838] text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Backlog Item
              </Button>
            )}
            {activeTab === 'epics' && (
              <Button onClick={handleCreateEpic} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Epic
              </Button>
            )}
            {activeTab === 'sprints' && (
              <Button onClick={handleCreateSprint} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Sprint
              </Button>
            )}
          </div>
        </div>

        {/* Backlog Tab */}
        <TabsContent value="backlog" className="space-y-4">
          {filteredBacklogs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No backlog items found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {selectedProjectId === 'all' 
                    ? 'Create your first backlog item to get started'
                    : 'No backlog items found for the selected project'
                  }
                </p>
                <Button onClick={handleCreateBacklog} className="bg-[#28A745] hover:bg-[#218838] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Backlog Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBacklogs.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          {getTypeIcon(item.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{item.title}</h3>
                              <Badge className={getPriorityColor(item.priority)} variant="secondary">
                                {item.priority}
                              </Badge>
                              <Badge className={getStatusColor(item.status)} variant="secondary">
                                {item.status}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: projects.find(p => p.id === item.projectId)?.color }}
                                />
                                <span>{item.projectName}</span>
                              </div>
                              
                              {item.epicTitle && (
                                <div className="flex items-center gap-1 text-purple-600">
                                  <Target className="w-3 h-3" />
                                  <span>{item.epicTitle}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{item.assigneeName}</span>
                              </div>

                              {item.storyPoints > 0 && (
                                <Badge variant="outline">
                                  {item.storyPoints} pts
                                </Badge>
                              )}
                            </div>

                            {item.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {item.labels.map((label, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <BacklogItemActions
                        item={item}
                        sprints={sprints}
                        onEdit={handleEditBacklog}
                        onDelete={handleDeleteBacklog}
                        onMoveToSprint={handleMoveToSprint}
                        onDuplicate={handleDuplicateBacklog}
                        userRole={user?.role || 'developer'}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Epics Tab */}
        <TabsContent value="epics" className="space-y-4">
          {epicsError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="text-red-600 mb-2">Failed to load epics</div>
                <p className="text-red-500 text-sm mb-4">{epicsError}</p>
                <Button
                  onClick={() => refetchEpics()}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-100"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {epicsLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground">Loading epics...</p>
              </CardContent>
            </Card>
          )}

          {!epicsLoading && !epicsError && filteredEpics.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No epics found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {selectedProjectId === 'all' 
                    ? 'Create your first epic to group related stories and tasks'
                    : 'No epics found for the selected project'
                  }
                </p>
                <Button onClick={handleCreateEpic} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Epic
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEpics.map((epic) => (
                <Card key={epic.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <CardTitle className="text-lg">{epic.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getPriorityColor(epic.priority)} variant="secondary">
                            {epic.priority}
                          </Badge>
                          <Badge className={getStatusColor(epic.status)} variant="secondary">
                            {epic.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: projects.find(p => p.id === epic.project_id)?.color }}
                            />
                            <span>{epic.project_name}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {epic.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEpic(epic)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEpic(epic.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Progress</div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={epic.total_story_points > 0 ? (epic.completed_story_points / epic.total_story_points) * 100 : 0} 
                            className="flex-1"
                          />
                          <span className="text-sm font-medium">
                            {epic.total_story_points > 0 ? Math.round((epic.completed_story_points / epic.total_story_points) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Story Points</div>
                        <div className="text-lg font-medium">
                          {epic.completed_story_points} / {epic.total_story_points}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{epic.assignee_name || 'Unassigned'}</span>
                      </div>
                      {epic.due_date && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(epic.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {epic.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {epic.labels.map((label, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Sprints Tab */}
        <TabsContent value="sprints" className="space-y-4">
          {filteredSprints.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No sprints found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {selectedProjectId === 'all' 
                    ? 'Create your first sprint to start planning development iterations'
                    : 'No sprints found for the selected project'
                  }
                </p>
                <Button onClick={handleCreateSprint} className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Sprint
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSprints.map((sprint) => (
                <Card key={sprint.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-orange-600" />
                          <CardTitle className="text-lg">{sprint.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getStatusColor(sprint.status)} variant="secondary">
                            {sprint.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: projects.find(p => p.id === sprint.projectId)?.color }}
                            />
                            <span>{sprint.projectName}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {sprint.goal}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSprint(sprint)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSprint(sprint.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {sprint.completedPoints || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Points Done</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {sprint.completedTasks || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Tasks Done</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {sprint.velocity || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Velocity</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Sprint Progress</div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={sprint.totalPoints > 0 ? (sprint.completedPoints / sprint.totalPoints) * 100 : 0} 
                            className="flex-1"
                          />
                          <span className="text-sm font-medium">
                            {sprint.totalPoints > 0 ? Math.round((sprint.completedPoints / sprint.totalPoints) * 100) : 0}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{sprint.teamSize} members</span>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">Scrum Master: </span>
                        <span>{sprint.scrumMasterName || 'Unassigned'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <BacklogDialog
        open={showBacklogDialog}
        onClose={() => {
          setShowBacklogDialog(false)
          resetBacklogForm()
          setEditingItem(null)
        }}
        backlogItem={backlogItem}
        setBacklogItem={setBacklogItem}
        projects={projects}
        epicData={epics}
        teamMembers={teamMembers}
        onSave={handleSaveBacklog}
        onAddAcceptanceCriteria={handleAddAcceptanceCriteria}
        onUpdateAcceptanceCriteria={handleUpdateAcceptanceCriteria}
        onRemoveAcceptanceCriteria={handleRemoveAcceptanceCriteria}
        isEdit={!!editingItem}
      />

      <EpicDialog
        open={showEpicDialog}
        onClose={() => {
          setShowEpicDialog(false)
          resetEpicForm()
          setEditingItem(null)
        }}
        epic={epic}
        setEpic={setEpic}
        projects={projects}
        teamMembers={teamMembers}
        projectOwners={projectOwners}
        onSave={handleSaveEpic}
        isEdit={!!editingItem}
      />

      <SprintDialog
        open={showSprintDialog}
        onClose={() => {
          setShowSprintDialog(false)
          resetSprintForm()
          setEditingItem(null)
        }}
        sprint={sprint}
        setSprint={setSprint}
        projects={projects}
        teamMembers={teamMembers}
        projectOwners={projectOwners}
        onSave={handleSaveSprint}
        isEdit={!!editingItem}
      />
    </div>
  )
}