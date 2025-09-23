import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { toast } from 'sonner@2.0.3'
import { getAssetUrl } from '../../../config/api'
import { epicApiService } from '../../../services/epicApi'
import {
  Plus,
  Search,
  Target,
  AlertTriangle,
  Calendar,
  Users,
  GitBranch,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react'

interface Epic {
  id: string
  title: string
  description: string
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  startDate: string
  endDate: string
  progress: number
  totalStoryPoints: number
  completedStoryPoints: number
  totalStories: number
  completedStories: number
  owner?: {
    id: string
    email: string
    name: string
    role_id: string
    user_profile: string
    is_active: boolean
    department: string
    skills: string[]
    phone: string
    timezone: string
    last_login: string
    created_at: string
    updated_at: string
    role: {
      name: string
      description: string
      permissions: string[]
      is_active: boolean
      id: string
      created_at: string
      updated_at: string
    }
  }
  project: string
  createdAt: string
  updatedAt: string
}

interface EpicListProps {
  projects?: any[]
  teamMembers?: any[]
  projectOwners?: any[]
  masters?: any
  filters?: {
    project: string
    status: string
    priority: string
    methodology: string
    type: string
  }
}

export function EpicList({ projects = [], teamMembers = [], projectOwners = [], masters, filters }: EpicListProps) {
  const [epics, setEpics] = useState<Epic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')

  // Load epics from API - only when this component is active
  const loadEpics = async () => {
    try {
      setLoading(true)
      setError(null)

      const selectedProjectId = projectFilter !== 'all' ? projectFilter : undefined
      const response = await epicApiService.getEpics(1, 50, selectedProjectId)

      // Transform API response to match component interface
      const transformedEpics = response.items.map((epic: any) => ({
        id: epic.id,
        title: epic.title,
        description: epic.description,
        status: epic.status,
        priority: epic.priority,
        startDate: epic.created_at,
        endDate: epic.due_date,
        progress: epic.completion_percentage || 0,
        totalStoryPoints: epic.total_story_points || 0,
        completedStoryPoints: epic.completed_story_points || 0,
        totalStories: epic.total_tasks || 0,
        completedStories: epic.completed_tasks || 0,
        owner: epic.assignee || projectOwners.find(owner => owner.id === epic.assignee_id),
        project: epic.project_name || epic.project?.name || 'Unknown Project',
        createdAt: epic.created_at,
        updatedAt: epic.updated_at
      }))

      setEpics(transformedEpics)
    } catch (error) {
      console.error('Failed to load epics:', error)
      setError('Failed to load epics. Please try again.')
      setEpics([])
    } finally {
      setLoading(false)
    }
  }

  // Load epics when component mounts or project filter changes
  useEffect(() => {
    loadEpics()
  }, [projectFilter, projectOwners])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning': return 'bg-gray-100 text-gray-800'
      case 'in progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'on hold': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const filteredEpics = epics.filter(epic => {
    const matchesSearch = epic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         epic.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || epic.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === 'all' || epic.priority.toLowerCase() === priorityFilter.toLowerCase()

    // Project filtering is handled by the API call, so we don't need additional local filtering
    // All epics returned by the API already match the selected project
    const matchesProject = true

    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading epics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Epics</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <Target className="w-7 h-7 text-orange-600" />
            <span>Epic Management</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage large features and initiatives across multiple sprints</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Epic
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search epics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {masters?.statuses?.filter((status: any) => status.is_active).map((status: any) => (
                <SelectItem key={status.id} value={status.name.toLowerCase()}>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span>{status.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {masters?.priorities?.filter((priority: any) => priority.is_active).map((priority: any) => (
                <SelectItem key={priority.id} value={priority.name.toLowerCase()}>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: priority.color }}
                    />
                    <span>{priority.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project: any) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center space-x-2">
                    {project.color && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    )}
                    <span className="truncate">{project.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Epic Grid */}
      {filteredEpics.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Epics Found</h3>
          <p className="text-gray-600 mb-4">Create your first epic to organize large features</p>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Epic
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEpics.map((epic) => (
            <Card key={epic.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{epic.title}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-4">{epic.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Status and Priority */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <Badge className={getStatusColor(epic.status)}>
                    {epic.status}
                  </Badge>
                  <Badge className={getPriorityColor(epic.priority)}>
                    {epic.priority}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500 font-mono">{epic.id}</span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{epic.progress}%</span>
                </div>
                <Progress value={epic.progress} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{epic.completedStoryPoints}/{epic.totalStoryPoints} story points</span>
                  <span>{epic.completedStories}/{epic.totalStories} stories</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(epic.startDate)}</span>
                </div>
                <span>→</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(epic.endDate)}</span>
                </div>
              </div>

              {/* Project and Owner */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Project:</span> {epic.project}
                </div>
                {epic.owner && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      {epic.owner.user_profile && epic.owner.user_profile !== '/public/user-profile/default.png' ? (
                        <img
                          src={getAssetUrl(epic.owner.user_profile)}
                          alt={epic.owner.name}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                        {epic.owner.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">{epic.owner.name}</span>
                      {epic.owner.role?.name && (
                        <span className="text-xs text-gray-400">{epic.owner.role.name}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}