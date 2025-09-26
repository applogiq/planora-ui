import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Slider } from '../../components/ui/slider'
import { Switch } from '../../components/ui/switch'
import { 
  Plus, 
  Search, 
  Settings,
  MoreVertical,
  Target,
  AlertTriangle,
  Flag,
  CheckCircle,
  Clock,
  Users,
  AlertCircle,
  TrendingUp,
  Edit,
  Trash2
} from 'lucide-react'

interface KanbanBoardViewProps {
  projectId: string
  user: any
  boardType: 'sprint' | 'kanban' | 'wip'
}

// Mock kanban data
const mockColumns = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'bg-gray-100',
    wipLimit: 0,
    tasks: [
      {
        id: 'TASK-001',
        title: 'Setup CI/CD Pipeline',
        description: 'Configure automated build and deployment',
        type: 'task',
        priority: 'medium',
        storyPoints: 8,
        assignee: { name: 'Alex Chen', avatar: 'AC' },
        labels: ['devops', 'automation']
      },
      {
        id: 'TASK-002',
        title: 'Database Migration Script',
        description: 'Create migration for user preferences',
        type: 'task',
        priority: 'low',
        storyPoints: 5,
        assignee: { name: 'Jennifer Wong', avatar: 'JW' },
        labels: ['database', 'migration']
      }
    ]
  },
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-blue-100',
    wipLimit: 5,
    tasks: [
      {
        id: 'STORY-001',
        title: 'User Profile Settings',
        description: 'Allow users to customize their profile settings',
        type: 'story',
        priority: 'high',
        storyPoints: 8,
        assignee: { name: 'Carol Davis', avatar: 'CD' },
        labels: ['frontend', 'ui']
      },
      {
        id: 'BUG-001',
        title: 'Login Form Validation',
        description: 'Fix email validation on login form',
        type: 'bug',
        priority: 'high',
        storyPoints: 3,
        assignee: { name: 'Bob Chen', avatar: 'BC' },
        labels: ['bug', 'frontend', 'validation']
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-yellow-100',
    wipLimit: 3,
    tasks: [
      {
        id: 'STORY-002',
        title: 'OAuth Integration',
        description: 'Implement OAuth 2.0 with Google and GitHub',
        type: 'story',
        priority: 'high',
        storyPoints: 13,
        assignee: { name: 'Alice Johnson', avatar: 'AJ' },
        labels: ['backend', 'authentication']
      },
      {
        id: 'TASK-003',
        title: 'API Documentation',
        description: 'Document authentication endpoints',
        type: 'task',
        priority: 'medium',
        storyPoints: 5,
        assignee: { name: 'David Wilson', avatar: 'DW' },
        labels: ['documentation', 'api']
      },
      {
        id: 'STORY-003',
        title: 'Password Reset Flow',
        description: 'Secure password reset with email verification',
        type: 'story',
        priority: 'medium',
        storyPoints: 8,
        assignee: { name: 'Emma Rodriguez', avatar: 'ER' },
        labels: ['backend', 'security']
      }
    ]
  },
  {
    id: 'review',
    title: 'In Review',
    color: 'bg-purple-100',
    wipLimit: 2,
    tasks: [
      {
        id: 'STORY-004',
        title: 'Dashboard Widgets',
        description: 'Create customizable dashboard widgets',
        type: 'story',
        priority: 'medium',
        storyPoints: 13,
        assignee: { name: 'Frank Miller', avatar: 'FM' },
        labels: ['frontend', 'dashboard']
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-100',
    wipLimit: 0,
    tasks: [
      {
        id: 'STORY-005',
        title: 'Login Interface',
        description: 'Modern login form with validation',
        type: 'story',
        priority: 'high',
        storyPoints: 5,
        assignee: { name: 'Grace Kim', avatar: 'GK' },
        labels: ['frontend', 'ui', 'authentication']
      },
      {
        id: 'TASK-004',
        title: 'Environment Setup',
        description: 'Configure development environment',
        type: 'task',
        priority: 'high',
        storyPoints: 3,
        assignee: { name: 'John Smith', avatar: 'JS' },
        labels: ['setup', 'devops']
      }
    ]
  }
]

export function KanbanBoardView({ projectId, user, boardType }: KanbanBoardViewProps) {
  const [columns, setColumns] = useState(mockColumns)
  const [searchTerm, setSearchTerm] = useState('')
  const [showWipSettings, setShowWipSettings] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [wipLimitsEnabled, setWipLimitsEnabled] = useState(true)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return <Target className="w-4 h-4 text-blue-600" />
      case 'bug': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'epic': return <Flag className="w-4 h-4 text-purple-600" />
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

  const isOverWipLimit = (column: any) => {
    return wipLimitsEnabled && column.wipLimit > 0 && column.tasks.length > column.wipLimit
  }

  const TaskCard = ({ task, columnId }: { task: any, columnId: string }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow mb-3"
      onClick={() => setSelectedTask(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getTypeIcon(task.type)}
            <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>
        
        <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className={getPriorityColor(task.priority)} style={{ fontSize: '10px' }}>
            {task.priority}
          </Badge>
          {task.storyPoints > 0 && (
            <Badge variant="outline" className="text-xs">
              {task.storyPoints} pts
            </Badge>
          )}
          {task.labels.slice(0, 2).map((label: string) => (
            <Badge key={label} variant="outline" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-[#28A745] text-white text-xs">
              {task.assignee.avatar}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>2d</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const KanbanColumn = ({ column }: { column: any }) => {
    const isOverLimit = isOverWipLimit(column)
    
    return (
      <div className="flex-1 min-w-[300px]">
        <div className={`p-4 rounded-t-lg ${column.color} border-b-2 ${
          isOverLimit ? 'border-red-500' : 'border-transparent'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{column.title}</h3>
            <div className="flex items-center space-x-2">
              {column.wipLimit > 0 && wipLimitsEnabled && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${isOverLimit ? 'bg-red-100 text-red-800 border-red-300' : ''}`}
                >
                  {column.tasks.length}/{column.wipLimit}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {column.tasks.length}
              </Badge>
            </div>
          </div>
          
          {isOverLimit && (
            <div className="flex items-center space-x-1 text-xs text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="w-3 h-3" />
              <span>WIP limit exceeded</span>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-[500px] max-h-[600px] overflow-y-auto">
          {column.tasks.map((task: any) => (
            <TaskCard key={task.id} task={task} columnId={column.id} />
          ))}
          
          <Button 
            variant="ghost" 
            className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
    )
  }

  const getBoardTitle = () => {
    switch (boardType) {
      case 'sprint': return 'Sprint Board'
      case 'kanban': return 'Kanban Board'
      case 'wip': return 'WIP Limits'
      default: return 'Board'
    }
  }

  const getBoardDescription = () => {
    switch (boardType) {
      case 'sprint': return 'Track sprint progress and task completion'
      case 'kanban': return 'Visualize work flow and manage tasks'
      case 'wip': return 'Manage work-in-progress limits and flow efficiency'
      default: return 'Manage project tasks'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{getBoardTitle()}</h2>
          <p className="text-muted-foreground">{getBoardDescription()}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {boardType === 'wip' && (
            <Button 
              variant="outline"
              onClick={() => setShowWipSettings(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              WIP Settings
            </Button>
          )}
          <Button className="bg-[#28A745] hover:bg-[#218838]">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
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
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={wipLimitsEnabled}
              onCheckedChange={setWipLimitsEnabled}
            />
            <Label className="text-sm">Show WIP Limits</Label>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span>Over Limit</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
            <span>At Limit</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Under Limit</span>
          </div>
        </div>
      </div>

      {/* Board Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {columns.map((column) => (
          <Card key={column.id}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-semibold ${
                column.id === 'backlog' ? 'text-[#6C757D]' :
                column.id === 'todo' ? 'text-[#007BFF]' :
                column.id === 'in-progress' ? 'text-[#FFC107]' :
                column.id === 'review' ? 'text-[#6F42C1]' :
                'text-[#28A745]'
              }`}>
                {column.tasks.length}
              </div>
              <div className="text-xs text-muted-foreground">{column.title}</div>
              {column.wipLimit > 0 && wipLimitsEnabled && (
                <div className="text-xs text-muted-foreground mt-1">
                  Limit: {column.wipLimit}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <Card>
        <CardContent className="p-0">
          <div className="flex overflow-x-auto space-x-0">
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WIP Settings Modal */}
      <Dialog open={showWipSettings} onOpenChange={setShowWipSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>WIP Limit Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Enable WIP Limits</Label>
              <Switch 
                checked={wipLimitsEnabled}
                onCheckedChange={setWipLimitsEnabled}
              />
            </div>
            
            {wipLimitsEnabled && (
              <div className="space-y-4">
                {columns.filter(col => col.id !== 'backlog' && col.id !== 'done').map((column) => (
                  <div key={column.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>{column.title}</Label>
                      <span className="text-sm text-muted-foreground">
                        Current: {column.tasks.length} | Limit: {column.wipLimit}
                      </span>
                    </div>
                    <Slider
                      value={[column.wipLimit]}
                      onValueChange={(value) => {
                        setColumns(prev => prev.map(col => 
                          col.id === column.id ? { ...col, wipLimit: value[0] } : col
                        ))
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                      {column.wipLimit === 1 ? '1 task' : `${column.wipLimit} tasks`}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">About WIP Limits</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Work-in-Progress (WIP) limits help teams focus on completing work before starting new tasks. 
                This improves flow efficiency and reduces context switching.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowWipSettings(false)}>
                Cancel
              </Button>
              <Button className="bg-[#28A745] hover:bg-[#218838]">
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}