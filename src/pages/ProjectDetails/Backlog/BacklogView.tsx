import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Label } from '../../../components/ui/label'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  GripVertical,
  Edit,
  Trash2,
  Archive,
  FileText,
  MessageSquare,
  Paperclip,
  X
} from 'lucide-react'
import { storiesApiService, Story, CreateStoryRequest, SubTask } from '../../../services/storiesApi'
import { ProjectMemberDetail } from '../../../services/projectApi'
import { StoryDetailModal } from './StoryDetailModal'
import { SessionStorageService } from '../../../utils/sessionStorage'
import { toast } from 'sonner'

interface BacklogViewProps {
  projectId?: string
  user: any
  project?: any
}


export function BacklogView({ projectId: propProjectId, user, project }: BacklogViewProps) {
  // Get effective project ID from props or session storage
  const effectiveProjectId = SessionStorageService.getEffectiveProjectId(propProjectId)

  // Early return if no project ID is available
  if (!effectiveProjectId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Product Backlog</h2>
            <p className="text-muted-foreground">Manage and prioritize product backlog items</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Project Not Available</h3>
            <p className="text-muted-foreground">
              Unable to load project information. Please navigate back to projects and select a project.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Story | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [projectTeamMembers, setProjectTeamMembers] = useState<ProjectMemberDetail[]>([])
  const [projectTeamLead, setProjectTeamLead] = useState<ProjectMemberDetail | null>(null)
  const [createStoryData, setCreateStoryData] = useState<CreateStoryRequest>({
    title: '',
    description: '',
    story_type: 'story',
    priority: 'medium',
    status: 'todo',
    project_id: effectiveProjectId || '',
    acceptance_criteria: [''],
    assignee_id: '',
    reporter_id: '',
    start_date: '',
    end_date: '',
    subtasks: []
  })

  useEffect(() => {
    if (effectiveProjectId) {
      fetchStories()
    }
  }, [effectiveProjectId])

  // Load team members from project data when available
  useEffect(() => {
    if (project?.team_members_detail && project?.team_lead_detail) {
      setProjectTeamMembers(project.team_members_detail)
      setProjectTeamLead(project.team_lead_detail)
    }
  }, [project])

  // Update createStoryData when effectiveProjectId changes
  useEffect(() => {
    if (effectiveProjectId) {
      setCreateStoryData(prev => ({
        ...prev,
        project_id: effectiveProjectId
      }))
    }
  }, [effectiveProjectId])


  const fetchStories = async () => {
    if (!effectiveProjectId) {
      console.warn('No project ID available for fetching stories')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await storiesApiService.getStories(effectiveProjectId)
      setStories(response.items)
    } catch (error) {
      console.error('Error fetching stories:', error)
      toast.error('Failed to fetch stories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStory = async () => {
    try {
      if (!createStoryData.title.trim()) {
        toast.error('Title is required')
        return
      }

      // Clean data before sending to API
      const cleanedStoryData = {
        ...createStoryData,
        acceptance_criteria: createStoryData.acceptance_criteria?.filter(criteria => criteria.trim()) || [],
        // Remove empty assignee and reporter fields or ensure they're properly set
        assignee_id: createStoryData.assignee_id?.trim() || undefined,
        assignee_name: createStoryData.assignee_name?.trim() || undefined,
        reporter_id: createStoryData.reporter_id?.trim() || undefined,
        reporter_name: createStoryData.reporter_name?.trim() || undefined,
        // Clean other optional fields
        epic_id: createStoryData.epic_id?.trim() || undefined,
        epic_title: createStoryData.epic_title?.trim() || undefined,
        sprint_id: createStoryData.sprint_id?.trim() || undefined,
        business_value: createStoryData.business_value?.trim() || undefined,
        // Clean labels array
        labels: createStoryData.labels?.filter(label => label.trim()) || [],
        // Clean subtasks array
        subtasks: createStoryData.subtasks?.filter(subtask =>
          subtask.task_name?.trim() || subtask.description?.trim()
        ) || []
      }

      console.log('Creating story with data:', cleanedStoryData)
      console.log('Assignee details:', {
        assignee_id: cleanedStoryData.assignee_id,
        assignee_name: cleanedStoryData.assignee_name,
        reporter_id: cleanedStoryData.reporter_id,
        reporter_name: cleanedStoryData.reporter_name
      })

      await storiesApiService.createStory(cleanedStoryData)
      toast.success('Story created successfully')
      setShowCreateModal(false)
      setCreateStoryData({
        title: '',
        description: '',
        story_type: 'story',
        priority: 'medium',
        status: 'todo',
        project_id: effectiveProjectId || '',
        acceptance_criteria: [''],
        assignee_id: '',
        reporter_id: '',
        start_date: '',
        end_date: '',
        subtasks: []
      })
      fetchStories()
    } catch (error) {
      console.error('Error creating story:', error)
      toast.error('Failed to create story')
    }
  }

  const handleDeleteStory = async (storyId: string) => {
    try {
      await storiesApiService.deleteStory(storyId)
      toast.success('Story deleted successfully')
      fetchStories()
    } catch (error) {
      console.error('Error deleting story:', error)
      toast.error('Failed to delete story')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return <Target className="w-4 h-4 text-blue-600" />
      case 'bug': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'task': return <CheckCircle className="w-4 h-4 text-green-600" />
      default: return <Target className="w-4 h-4 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300'
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'done': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredItems = stories.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.story_type === filterType
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority

    return matchesSearch && matchesType && matchesPriority
  })

  const BacklogItemCard = ({ item }: { item: Story }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
            {getTypeIcon(item.story_type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{item.epic_title || 'No Epic'}</span>
                <Badge variant="outline" className={getPriorityColor(item.priority)} style={{ fontSize: '10px' }}>
                  {item.priority}
                </Badge>
                {item.story_points && (
                  <Badge variant="outline" className="text-xs">
                    {item.story_points} pts
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedItem(item)
                    setShowDetailModal(true)
                  }}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteStory(item.epic_id)
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <h4 className="font-medium mb-1 line-clamp-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-[#28A745] text-white text-xs">
                    {item.assignee_name ? item.assignee_name.substring(0, 2).toUpperCase() : 'UN'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{item.assignee_name || 'Unassigned'}</span>
              </div>

              <div className="flex items-center space-x-2">
                {item.business_value && (
                  <Badge variant="outline" className="text-xs">
                    Value: {item.business_value}
                  </Badge>
                )}
                <Badge variant="outline" className={getStatusColor(item.status)} style={{ fontSize: '10px' }}>
                  {item.status.replace('-', ' ')}
                </Badge>
              </div>
            </div>

            {/* Additional info badges */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {item.comments && item.comments.length > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{item.comments.length}</span>
                </div>
              )}
              {item.attached_files && item.attached_files.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="w-3 h-3" />
                  <span>{item.attached_files.length}</span>
                </div>
              )}
              {item.subtasks && item.subtasks.length > 0 && (
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>{item.subtasks.length} subtasks</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Product Backlog</h2>
          <p className="text-muted-foreground">Manage and prioritize product backlog items</p>
        </div>

        <Button
          className="bg-[#28A745] hover:bg-[#218838]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Item
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search backlog items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Backlog Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#007BFF]">{stories.filter(i => i.story_type === 'story').length}</div>
            <div className="text-xs text-muted-foreground">Stories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#DC3545]">{stories.filter(i => i.story_type === 'bug').length}</div>
            <div className="text-xs text-muted-foreground">Bugs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#28A745]">{stories.reduce((sum, i) => sum + (i.story_points || 0), 0)}</div>
            <div className="text-xs text-muted-foreground">Story Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#FFC107]">{stories.filter(i => i.status === 'todo').length}</div>
            <div className="text-xs text-muted-foreground">Todo Items</div>
          </CardContent>
        </Card>
      </div>

      {/* Backlog Items */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#28A745] mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading stories...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No stories found</h3>
              <p className="text-muted-foreground mb-4">
                {stories.length === 0
                  ? "Get started by creating your first story."
                  : "No stories match your current filters."
                }
              </p>
              <Button
                className="bg-[#28A745] hover:bg-[#218838]"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Story
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.epic_id}
              onClick={() => {
                setSelectedItem(item)
                setShowDetailModal(true)
              }}
            >
              <BacklogItemCard item={item} />
            </div>
          ))
        )}
      </div>

      {/* Story Detail Modal */}
      <StoryDetailModal
        story={selectedItem}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedItem(null)
        }}
        onUpdate={fetchStories}
        projectId={effectiveProjectId || ''}
        project={project}
      />

      {/* Create Item Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Story</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Story Type</Label>
                <Select
                  value={createStoryData.story_type}
                  onValueChange={(value) => setCreateStoryData({ ...createStoryData, story_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={createStoryData.priority}
                  onValueChange={(value) => setCreateStoryData({ ...createStoryData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                placeholder="Enter story title"
                value={createStoryData.title}
                onChange={(e) => setCreateStoryData({ ...createStoryData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Enter story description"
                rows={3}
                value={createStoryData.description}
                onChange={(e) => setCreateStoryData({ ...createStoryData, description: e.target.value })}
              />
            </div>

            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storyPoints">Story Points</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={createStoryData.story_points || ''}
                    onChange={(e) => setCreateStoryData({ ...createStoryData, story_points: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={createStoryData.status}
                    onValueChange={(value) => setCreateStoryData({ ...createStoryData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={createStoryData.assignee_id || 'unassigned'}
                  onValueChange={(value) => {
                    if (value === 'unassigned') {
                      setCreateStoryData({
                        ...createStoryData,
                        assignee_id: '',
                        assignee_name: ''
                      })
                    } else {
                      const selectedMember = projectTeamMembers.find(member => member.id === value)
                      setCreateStoryData({
                        ...createStoryData,
                        assignee_id: value,
                        assignee_name: selectedMember?.name || ''
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {projectTeamMembers.length > 0 ? projectTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.role_name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="loading" disabled>Loading team members...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reporter">Reporter</Label>
                <Select
                  value={createStoryData.reporter_id || 'no-reporter'}
                  onValueChange={(value) => {
                    if (value === 'no-reporter') {
                      setCreateStoryData({
                        ...createStoryData,
                        reporter_id: '',
                        reporter_name: ''
                      })
                    } else if (value === projectTeamLead?.id) {
                      setCreateStoryData({
                        ...createStoryData,
                        reporter_id: value,
                        reporter_name: projectTeamLead?.name || ''
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reporter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-reporter">No reporter</SelectItem>
                    {projectTeamLead ? (
                      <SelectItem value={projectTeamLead.id}>
                        {projectTeamLead.name} - {projectTeamLead.role_name}
                      </SelectItem>
                    ) : (
                      <SelectItem value="loading" disabled>Loading team lead...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  value={createStoryData.start_date || ''}
                  onChange={(e) => setCreateStoryData({ ...createStoryData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  value={createStoryData.end_date || ''}
                  onChange={(e) => setCreateStoryData({ ...createStoryData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessValue">Business Value</Label>
              <Textarea
                placeholder="Describe the business value and rationale for this story..."
                rows={3}
                value={createStoryData.business_value || ''}
                onChange={(e) => setCreateStoryData({ ...createStoryData, business_value: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="acceptanceCriteria">Acceptance Criteria</Label>
              <div className="space-y-2">
                {Array.isArray(createStoryData.acceptance_criteria) ? createStoryData.acceptance_criteria.map((criteria, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Enter acceptance criteria"
                      value={criteria}
                      onChange={(e) => {
                        const newCriteria = [...(createStoryData.acceptance_criteria || [])]
                        newCriteria[index] = e.target.value
                        setCreateStoryData({ ...createStoryData, acceptance_criteria: newCriteria })
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newCriteria = createStoryData.acceptance_criteria?.filter((_, i) => i !== index) || []
                        setCreateStoryData({ ...createStoryData, acceptance_criteria: newCriteria })
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )) : (
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Enter acceptance criteria"
                      value=""
                      onChange={(e) => {
                        setCreateStoryData({ ...createStoryData, acceptance_criteria: [e.target.value] })
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCreateStoryData({ ...createStoryData, acceptance_criteria: [] })
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCriteria = [...(createStoryData.acceptance_criteria || []), '']
                    setCreateStoryData({ ...createStoryData, acceptance_criteria: newCriteria })
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Acceptance Criteria
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="labels">Labels (comma-separated)</Label>
              <Input
                placeholder="frontend, ui, enhancement"
                value={createStoryData.labels?.join(', ') || ''}
                onChange={(e) => setCreateStoryData({
                  ...createStoryData,
                  labels: e.target.value.split(',').map(label => label.trim()).filter(label => label)
                })}
              />
            </div>

            <div>
              <Label htmlFor="subtasks">Subtasks</Label>
              <div className="space-y-2">
                {(createStoryData.subtasks || []).map((subtask, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <Input
                        placeholder="Task name"
                        value={subtask.task_name}
                        onChange={(e) => {
                          const newSubtasks = [...(createStoryData.subtasks || [])]
                          newSubtasks[index] = { ...newSubtasks[index], task_name: e.target.value }
                          setCreateStoryData({ ...createStoryData, subtasks: newSubtasks })
                        }}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Description"
                        value={subtask.description}
                        onChange={(e) => {
                          const newSubtasks = [...(createStoryData.subtasks || [])]
                          newSubtasks[index] = { ...newSubtasks[index], description: e.target.value }
                          setCreateStoryData({ ...createStoryData, subtasks: newSubtasks })
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Assignee"
                        value={subtask.assignee}
                        onChange={(e) => {
                          const newSubtasks = [...(createStoryData.subtasks || [])]
                          newSubtasks[index] = { ...newSubtasks[index], assignee: e.target.value }
                          setCreateStoryData({ ...createStoryData, subtasks: newSubtasks })
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="date"
                        value={subtask.due_date}
                        onChange={(e) => {
                          const newSubtasks = [...(createStoryData.subtasks || [])]
                          newSubtasks[index] = { ...newSubtasks[index], due_date: e.target.value }
                          setCreateStoryData({ ...createStoryData, subtasks: newSubtasks })
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSubtasks = createStoryData.subtasks?.filter((_, i) => i !== index) || []
                          setCreateStoryData({ ...createStoryData, subtasks: newSubtasks })
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newSubtask: SubTask = {
                      task_name: '',
                      description: '',
                      assignee: '',
                      priority: 'medium',
                      due_date: ''
                    }
                    const newSubtasks = [...(createStoryData.subtasks || []), newSubtask]
                    setCreateStoryData({ ...createStoryData, subtasks: newSubtasks })
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subtask
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#28A745] hover:bg-[#218838]"
                onClick={handleCreateStory}
                disabled={!createStoryData.title.trim()}
              >
                Create Story
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}