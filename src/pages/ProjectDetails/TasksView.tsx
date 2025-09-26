import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
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

interface TasksViewProps {
  projectId: string
  user: any
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

export function TasksView({ projectId, user }: TasksViewProps) {
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'table'>('board')

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

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesAssignee = filterAssignee === 'all' || task.assignee.name === filterAssignee
    
    return matchesSearch && matchesStatus && matchesAssignee
  })

  const TaskCard = ({ task }: { task: any }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow mb-3"
      onClick={() => setSelectedTask(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getTypeIcon(task.type)}
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
          {task.storyPoints > 0 && (
            <Badge variant="outline" className="text-xs">
              {task.storyPoints} pts
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-[#28A745] text-white text-xs">
              {task.assignee.avatar}
            </AvatarFallback>
          </Avatar>
          
          {task.loggedHours > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{task.loggedHours}h</span>
            </div>
          )}
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
                  {getTypeIcon(task.type)}
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
                  {task.storyPoints > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {task.storyPoints} pts
                    </Badge>
                  )}
                </div>
                
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#28A745] text-white text-xs">
                    {task.assignee.avatar}
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
        
        <Button className="bg-[#28A745] hover:bg-[#218838]">
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
            <div className="text-2xl font-semibold text-[#007BFF]">{mockTasks.filter(t => t.status === 'todo').length}</div>
            <div className="text-xs text-muted-foreground">To Do</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#FFC107]">{mockTasks.filter(t => t.status === 'in-progress').length}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#28A745]">{mockTasks.filter(t => t.status === 'done').length}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#DC3545]">{mockTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)}</div>
            <div className="text-xs text-muted-foreground">Story Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#6F42C1]">{mockTasks.reduce((sum, t) => sum + (t.loggedHours || 0), 0)}h</div>
            <div className="text-xs text-muted-foreground">Time Logged</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Content */}
      <div>
        {viewMode === 'board' && <BoardView />}
        {viewMode === 'list' && <ListView />}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            console.log('Task updated:', updatedTask)
            setSelectedTask(null)
          }}
          user={user}
        />
      )}
    </div>
  )
}