import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { toast } from 'sonner@2.0.3'
import { storiesApiService, Story } from '../../../services/storiesApi'
import { epicApiService } from '../../../services/epicApi'
import { BacklogDialog } from './BacklogDialog'
import {
  Plus,
  Search,
  GitBranch,
  AlertTriangle,
  Target,
  User,
  Calendar,
  ArrowUpDown,
  Grid,
  List,
  Filter
} from 'lucide-react'

interface BacklogListProps {
  projects?: any[]
  teamMembers?: any[]
  mastersData?: any
}

export function BacklogList({ projects = [], teamMembers = [], mastersData }: BacklogListProps) {
  const [backlogItems, setBacklogItems] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('backlog')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [epics, setEpics] = useState<any[]>([])
  const [newBacklogItem, setNewBacklogItem] = useState({
    title: '',
    description: '',
    type: 'User Story',
    priority: 'Medium',
    projectId: '',
    epicId: null,
    assigneeId: '',
    reporterId: '',
    storyPoints: 0,
    businessValue: 'Medium',
    effort: 'Medium',
    acceptanceCriteria: ['']
  })

  // Load backlog items from API
  useEffect(() => {
    const loadBacklogItems = async () => {
      try {
        setLoading(true)
        setError(null)

        const selectedProjectId = projectFilter !== 'all' ? projectFilter : undefined
        const response = await storiesApiService.getStories(1, 50, selectedProjectId)
        setBacklogItems(response.items)
      } catch (error) {
        console.error('Failed to load backlog items:', error)
        setError('Failed to load backlog items. Please try again.')
        setBacklogItems([])
      } finally {
        setLoading(false)
      }
    }

    loadBacklogItems()
  }, [projectFilter])

  // Load epics for dropdown
  useEffect(() => {
    const loadEpics = async () => {
      try {
        const response = await epicApiService.getEpics(1, 100) // Get more epics for dropdown
        setEpics(response.items)
      } catch (error) {
        console.error('Failed to load epics:', error)
        setEpics([])
      }
    }

    loadEpics()
  }, [])

  const handleCreateItem = () => {
    setNewBacklogItem({
      title: '',
      description: '',
      type: 'User Story',
      priority: 'Medium',
      projectId: projectFilter !== 'all' ? projectFilter : '',
      epicId: null,
      assigneeId: '',
      reporterId: '',
      storyPoints: 0,
      businessValue: 'Medium',
      effort: 'Medium',
      acceptanceCriteria: ['']
    })
    setShowCreateDialog(true)
  }

  const handleSaveItem = async () => {
    try {
      // Here you would typically call a stories API to create the new item
      // For now, we'll just add it to the local state
      const newItem = {
        id: `STORY-${Date.now()}`,
        title: newBacklogItem.title,
        description: newBacklogItem.description,
        status: 'Backlog',
        priority: newBacklogItem.priority,
        story_points: newBacklogItem.storyPoints,
        project_id: newBacklogItem.projectId,
        epic_id: newBacklogItem.epicId,
        assignee_id: newBacklogItem.assigneeId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setBacklogItems(prev => [newItem, ...prev])
      setShowCreateDialog(false)
      toast.success('Backlog item created successfully')
    } catch (error) {
      toast.error('Failed to create backlog item')
    }
  }

  const handleAddAcceptanceCriteria = () => {
    setNewBacklogItem(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, '']
    }))
  }

  const handleUpdateAcceptanceCriteria = (index: number, value: string) => {
    setNewBacklogItem(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map((criteria, i) =>
        i === index ? value : criteria
      )
    }))
  }

  const handleRemoveAcceptanceCriteria = (index: number) => {
    setNewBacklogItem(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }))
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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'user story': return 'bg-blue-100 text-blue-800'
      case 'bug': return 'bg-red-100 text-red-800'
      case 'task': return 'bg-purple-100 text-purple-800'
      case 'epic': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'backlog': return 'bg-gray-100 text-gray-800'
      case 'ready': return 'bg-blue-100 text-blue-800'
      case 'in progress': return 'bg-yellow-100 text-yellow-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredItems = backlogItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    // For now, treat all stories as "User Story" type - can be enhanced later
    const matchesType = typeFilter === 'all' || typeFilter === 'user story'
    const matchesPriority = priorityFilter === 'all' || item.priority.toLowerCase() === priorityFilter.toLowerCase()
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'backlog' && (item.status === 'Backlog' || item.status === 'To Do')) ||
                      (activeTab === 'ready' && item.status === 'Ready') ||
                      (activeTab === 'progress' && item.status === 'In Progress')

    return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesTab
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading backlog...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Backlog</h3>
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
            <GitBranch className="w-7 h-7 text-orange-600" />
            <span>Product Backlog</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage and prioritize your product backlog items</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="p-2"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleCreateItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-64 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search backlog items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Project Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-500">Project</label>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-40">
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

          {/* Priority Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-500">Priority</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {mastersData?.priorities?.filter((priority: any) => priority.is_active).map((priority: any) => (
                  <SelectItem key={priority.id} value={priority.name.toLowerCase()}>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: priority.color }}
                      />
                      <span>{priority.name}</span>
                    </div>
                  </SelectItem>
                )) || (
                  <>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-500">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {mastersData?.statuses?.filter((status: any) => status.is_active).map((status: any) => (
                  <SelectItem key={status.id} value={status.name.toLowerCase()}>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span>{status.name}</span>
                    </div>
                  </SelectItem>
                )) || (
                  <>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="backlog">Backlog ({backlogItems.filter(i => i.status === 'Backlog' || i.status === 'To Do').length})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({backlogItems.filter(i => i.status === 'Ready').length})</TabsTrigger>
          <TabsTrigger value="progress">In Progress ({backlogItems.filter(i => i.status === 'In Progress').length})</TabsTrigger>
          <TabsTrigger value="all">All Items ({backlogItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
              <p className="text-gray-600 mb-4">Start building your product backlog</p>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleCreateItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : viewMode === 'card' ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getTypeColor('User Story')}>
                          User Story
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{item.id}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{item.story_points || 0} points</span>
                        </div>
                        {item.assignee && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{item.assignee.name}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor('User Story')}>
                          User Story
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{item.story_points || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.assignee ? (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{item.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <ArrowUpDown className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* BacklogDialog */}
      <BacklogDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        backlogItem={newBacklogItem}
        setBacklogItem={setNewBacklogItem}
        projects={projects}
        epicData={epics}
        teamMembers={teamMembers}
        onSave={handleSaveItem}
        onAddAcceptanceCriteria={handleAddAcceptanceCriteria}
        onUpdateAcceptanceCriteria={handleUpdateAcceptanceCriteria}
        onRemoveAcceptanceCriteria={handleRemoveAcceptanceCriteria}
        isEdit={false}
      />
    </div>
  )
}