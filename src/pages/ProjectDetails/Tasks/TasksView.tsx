import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Target,
  AlertTriangle,
  Flag,
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react'
import { TaskModal } from './TaskModal'
import { taskApiService, Task, CreateTaskRequest } from '../../../services/taskApi'
import { toast } from 'sonner'
import { SessionStorageService } from '../../../utils/sessionStorage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'

interface TasksViewProps {
  projectId?: string
  user: any
  project?: any
}

// Mock tasks data with different methodologies in mind
const mockTasks = [
  {
    id: '1',
    title: 'Implement OAuth 2.0 Authentication',
    description: 'Set up OAuth 2.0 authentication with Google and GitHub providers',
    status: 'in-progress',
    priority: 'high',
    assignee: { name: 'Alice Johnson', avatar: 'AJ' },
    storyPoints: 8,
    type: 'story',
    epic: 'User Management',
    labels: ['frontend', 'authentication', 'security'],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05',
    estimatedHours: 16,
    loggedHours: 9
  },
  {
    id: '2',
    title: 'Design user profile UI',
    description: 'Create responsive user profile interface with edit capabilities',
    status: 'done',
    priority: 'medium',
    assignee: { name: 'Carol Davis', avatar: 'CD' },
    storyPoints: 5,
    type: 'story',
    epic: 'User Management',
    labels: ['ui', 'design', 'frontend'],
    createdAt: '2024-02-28',
    updatedAt: '2024-03-04',
    estimatedHours: 12,
    loggedHours: 11
  },
  {
    id: '3',
    title: 'Fix login validation bug',
    description: 'Login form not properly validating email format',
    status: 'todo',
    priority: 'high',
    assignee: { name: 'Bob Chen', avatar: 'BC' },
    storyPoints: 3,
    type: 'bug',
    epic: 'User Management',
    labels: ['bug', 'frontend', 'validation'],
    createdAt: '2024-03-03',
    updatedAt: '2024-03-03',
    estimatedHours: 6,
    loggedHours: 0
  },
  {
    id: '4',
    title: 'Setup password reset flow',
    description: 'Implement secure password reset with email verification',
    status: 'in-progress',
    priority: 'medium',
    assignee: { name: 'David Wilson', avatar: 'DW' },
    storyPoints: 5,
    type: 'story',
    epic: 'User Management',
    labels: ['backend', 'security', 'email'],
    createdAt: '2024-03-02',
    updatedAt: '2024-03-05',
    estimatedHours: 10,
    loggedHours: 4
  },
  {
    id: '5',
    title: 'User Management Epic',
    description: 'Complete user authentication and profile management system',
    status: 'in-progress',
    priority: 'high',
    assignee: { name: 'Alice Johnson', avatar: 'AJ' },
    storyPoints: 21,
    type: 'epic',
    epic: 'User Management',
    labels: ['epic', 'milestone'],
    createdAt: '2024-02-15',
    updatedAt: '2024-03-05',
    estimatedHours: 80,
    loggedHours: 45
  }
]

const statusColumns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 text-gray-800' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { id: 'review', title: 'In Review', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'done', title: 'Done', color: 'bg-green-100 text-green-800' }
]

export function TasksView({ projectId: propProjectId, user, project }: TasksViewProps) {
  // Get effective project ID from props or session storage
  const effectiveProjectId = SessionStorageService.getEffectiveProjectId(propProjectId)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'table'>('board')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createTaskData, setCreateTaskData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project_id: effectiveProjectId || '',
    assignee_id: null,
    start_date: '',
    due_date: '',
    progress: 0,
    tags: [],
    subtasks: [],
    comments: [],
    attachments: [],
    is_active: true
  })

  // Load tasks when component mounts or project changes
  useEffect(() => {
    if (effectiveProjectId) {
      fetchTasks()
    }
  }, [effectiveProjectId])

  const fetchTasks = async () => {
    if (!effectiveProjectId) {
      console.warn('No project ID available for fetching tasks')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await taskApiService.getTasks(effectiveProjectId)
      setTasks(response.items)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async () => {
    try {
      if (!createTaskData.title.trim()) {
        toast.error('Title is required')
        return
      }

      if (!effectiveProjectId) {
        toast.error('Project ID is required')
        return
      }

      const newTaskData = {
        ...createTaskData,
        project_id: effectiveProjectId
      }

      await taskApiService.createTask(newTaskData)
      toast.success('Task created successfully')
      setShowCreateModal(false)
      setCreateTaskData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project_id: effectiveProjectId || '',
        assignee_id: null,
        start_date: '',
        due_date: '',
        progress: 0,
        tags: [],
        subtasks: [],
        comments: [],
        attachments: [],
        is_active: true
      })
      fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    }
  }

  const handleUpdateTask = async (taskId: string, taskData: any) => {
    try {
      await taskApiService.updateTask(taskId, taskData)
      toast.success('Task updated successfully')
      setSelectedTask(null)
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApiService.deleteTask(taskId)
      toast.success('Task deleted successfully')
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'done': return 'bg-green-100 text-green-800 border-green-300'
      case 'blocked': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return <Target className="w-4 h-4 text-blue-600" />
      case 'bug': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'epic': return <Flag className="w-4 h-4 text-purple-600" />
      case 'task': return <CheckCircle className="w-4 h-4 text-green-600" />
      default: return <Target className="w-4 h-4 text-blue-600" />
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesAssignee = filterAssignee === 'all' || (task.assignee_name && task.assignee_name === filterAssignee)

    return matchesSearch && matchesStatus && matchesAssignee
  })

  const TaskCard = ({ task }: { task: Task }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow mb-3"
      onClick={() => setSelectedTask(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">#{task.id}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>

        <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className={getPriorityColor(task.priority)} style={{ fontSize: '10px' }}>
            {task.priority}
          </Badge>
          {task.progress > 0 && (
            <Badge variant="outline" className="text-xs">
              {task.progress}%
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-[#28A745] text-white text-xs">
              {task.assignee_name ? task.assignee_name.substring(0, 2).toUpperCase() : 'UN'}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{task.progress}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const BoardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statusColumns.map((column) => {
        const columnTasks = filteredTasks.filter(task => task.status === column.id)
        
        return (
          <div key={column.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{column.title}</h3>
              <Badge variant="outline" className="text-xs">
                {columnTasks.length}
              </Badge>
            </div>
            
            <div className="space-y-3 min-h-[400px]">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )

  const ListView = () => (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <Card
          key={task.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedTask(task)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">#{task.id}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 truncate">{task.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getStatusColor(task.status)} style={{ fontSize: '10px' }}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(task.priority)} style={{ fontSize: '10px' }}>
                    {task.priority}
                  </Badge>
                  {task.progress > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {task.progress}%
                    </Badge>
                  )}
                </div>

                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#28A745] text-white text-xs">
                    {task.assignee_name ? task.assignee_name.substring(0, 2).toUpperCase() : 'UN'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <p className="text-muted-foreground">Manage project tasks and user stories</p>
        </div>
        
        <Button
          className="bg-[#28A745] hover:bg-[#218838]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
              <SelectItem value="Bob Chen">Bob Chen</SelectItem>
              <SelectItem value="Carol Davis">Carol Davis</SelectItem>
              <SelectItem value="David Wilson">David Wilson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-[#007BFF] mr-2" />
            </div>
            <div className="text-2xl font-semibold text-[#007BFF]">{tasks.filter(t => t.status === 'todo').length}</div>
            <div className="text-xs text-muted-foreground">To Do</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-[#FFC107] mr-2" />
            </div>
            <div className="text-2xl font-semibold text-[#FFC107]">{tasks.filter(t => t.status === 'in-progress').length}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-[#28A745] mr-2" />
            </div>
            <div className="text-2xl font-semibold text-[#28A745]">{tasks.filter(t => t.status === 'done').length}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-5 h-5 text-[#DC3545] mr-2" />
            </div>
            <div className="text-2xl font-semibold text-[#DC3545]">{Math.round(tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / Math.max(tasks.length, 1))}%</div>
            <div className="text-xs text-muted-foreground">Avg Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Content */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#28A745] mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first task.
              </p>
              <Button
                className="bg-[#28A745] hover:bg-[#218838]"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'board' && <BoardView />}
            {viewMode === 'list' && <ListView />}
          </>
        )}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            if (selectedTask?.id) {
              handleUpdateTask(selectedTask.id, updatedTask)
            }
          }}
          user={user}
        />
      )}

      {/* Create Task Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={createTaskData.title}
                onChange={(e) => setCreateTaskData({ ...createTaskData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                rows={3}
                value={createTaskData.description}
                onChange={(e) => setCreateTaskData({ ...createTaskData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={createTaskData.status}
                  onValueChange={(value) => setCreateTaskData({ ...createTaskData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={createTaskData.priority}
                  onValueChange={(value) => setCreateTaskData({ ...createTaskData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={createTaskData.start_date}
                  onChange={(e) => setCreateTaskData({ ...createTaskData, start_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={createTaskData.due_date}
                  onChange={(e) => setCreateTaskData({ ...createTaskData, due_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={createTaskData.progress}
                onChange={(e) => setCreateTaskData({ ...createTaskData, progress: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#28A745] hover:bg-[#218838]"
                onClick={handleCreateTask}
                disabled={!createTaskData.title.trim()}
              >
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}