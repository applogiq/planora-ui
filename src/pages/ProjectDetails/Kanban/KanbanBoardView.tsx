import React, { useState, useCallback, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Label } from '../../../components/ui/label'
import { Slider } from '../../../components/ui/slider'
import { Switch } from '../../../components/ui/switch'
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
  Trash2,
  GripVertical
} from 'lucide-react'
import { storiesApiService, Story } from '../../../services/storiesApi'
import { toast } from 'sonner'

interface KanbanBoardViewProps {
  project: any
  user: any
  boardType?: 'sprint' | 'kanban' | 'wip'
}

interface KanbanTask extends Story {}

interface KanbanColumn {
  id: string
  title: string
  status: string
  color: string
  wipLimit?: number
  tasks: KanbanTask[]
}

const ItemTypes = {
  TASK: 'task'
}

interface DragItem {
  id: string
  type: string
  columnId: string
}

const TaskCard: React.FC<{
  task: KanbanTask
  columnId: string
  onEdit: (task: KanbanTask) => void
  onDelete: (taskId: string) => void
}> = ({ task, columnId, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: () => ({
      id: task.id,
      type: ItemTypes.TASK,
      columnId,
      title: task.title
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id, task.title, columnId])

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'story': return <Target className="w-4 h-4 text-blue-600" />
      case 'task': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'bug': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <Target className="w-4 h-4 text-blue-600" />
    }
  }

  return (
    <div
      ref={drag}
      className={`cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <Card className="mb-3 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              {getTypeIcon(task.story_type)}
              <h4 className="font-medium text-sm">{task.title}</h4>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              {task.story_points > 0 && (
                <Badge variant="outline" className="text-xs">
                  {task.story_points} pts
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {task.assignee_name && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {task.assignee_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>

          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.labels.slice(0, 3).map((label, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {label}
                </Badge>
              ))}
              {task.labels.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{task.labels.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const KanbanColumn: React.FC<{
  column: KanbanColumn
  onTaskMove: (taskId: string, targetColumnId: string) => void
  onTaskEdit: (task: KanbanTask) => void
  onTaskDelete: (taskId: string) => void
}> = ({ column, onTaskMove, onTaskEdit, onTaskDelete }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: DragItem) => {
      if (item.columnId !== column.id) {
        onTaskMove(item.id, column.id)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [column.id, onTaskMove])

  const isWipLimitExceeded = column.wipLimit && column.tasks.length >= column.wipLimit

  return (
    <div className="flex-1 min-w-72">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <CardTitle className="text-sm font-medium">
                {column.title}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {column.tasks.length}
              </Badge>
              {column.wipLimit && (
                <Badge
                  variant="outline"
                  className={`text-xs ${isWipLimitExceeded ? 'bg-red-100 text-red-800' : ''}`}
                >
                  WIP: {column.wipLimit}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent
          ref={drop}
          className={`min-h-96 transition-colors duration-200 ${
            isOver && canDrop ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
          } ${isWipLimitExceeded ? 'bg-red-50' : ''}`}
        >
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          ))}

          {column.tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Drop tasks here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function KanbanBoardView({ project, user, boardType = 'kanban' }: KanbanBoardViewProps) {
  const projectId = project?.id
  const [columns, setColumns] = useState<KanbanColumn[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showWipSettings, setShowWipSettings] = useState(false)
  const [wipLimitsEnabled, setWipLimitsEnabled] = useState(true)
  const [tasks, setTasks] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  // Load tasks from API
  useEffect(() => {
    const loadTasks = async () => {
      if (!projectId) return

      try {
        setLoading(true)
        const response = await storiesApiService.getStories(projectId, 1, 100)
        setTasks(response.items)
      } catch (error) {
        console.error('Failed to load tasks:', error)
        toast.error('Failed to load tasks')
        setTasks([])
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [projectId])

  // Initialize columns with tasks
  useEffect(() => {
    const defaultColumns: KanbanColumn[] = [
      {
        id: 'todo',
        title: 'To Do',
        status: 'todo',
        color: 'bg-gray-500',
        wipLimit: wipLimitsEnabled ? 5 : undefined,
        tasks: []
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        status: 'in-progress',
        color: 'bg-blue-500',
        wipLimit: wipLimitsEnabled ? 3 : undefined,
        tasks: []
      },
      {
        id: 'review',
        title: 'Review',
        status: 'review',
        color: 'bg-yellow-500',
        wipLimit: wipLimitsEnabled ? 2 : undefined,
        tasks: []
      },
      {
        id: 'done',
        title: 'Done',
        status: 'done',
        color: 'bg-green-500',
        tasks: []
      }
    ]

    // Distribute tasks into columns based on status
    const columnsWithTasks = defaultColumns.map(column => ({
      ...column,
      tasks: tasks.filter(task => {
        const taskStatus = task.status?.toLowerCase().replace(' ', '-') || 'todo'
        return taskStatus === column.status
      })
    }))

    setColumns(columnsWithTasks)
  }, [tasks, wipLimitsEnabled])

  const handleTaskMove = useCallback(async (taskId: string, targetColumnId: string) => {
    try {
      // Find target column to get the status
      const targetColumn = columns.find(col => col.id === targetColumnId)
      if (!targetColumn) return

      // Check WIP limits
      if (targetColumn.wipLimit && targetColumn.tasks.length >= targetColumn.wipLimit) {
        toast.error(`Cannot move task: WIP limit (${targetColumn.wipLimit}) exceeded for ${targetColumn.title}`)
        return
      }

      // Update task status via API
      await storiesApiService.updateStory(taskId, {
        status: targetColumn.status
      })

      // Update local state
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === targetColumnId) {
            // Add task to target column
            const taskToMove = prevColumns
              .flatMap(col => col.tasks)
              .find(task => task.id === taskId)

            if (taskToMove && !column.tasks.find(t => t.id === taskId)) {
              return {
                ...column,
                tasks: [...column.tasks, { ...taskToMove, status: targetColumn.status }]
              }
            }
          } else {
            // Remove task from other columns
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== taskId)
            }
          }
          return column
        })
      })

      toast.success('Task moved successfully')
    } catch (error) {
      console.error('Failed to move task:', error)
      toast.error('Failed to move task')
    }
  }, [columns])

  const handleTaskEdit = (task: KanbanTask) => {
    setSelectedTask(task)
    setShowTaskDialog(true)
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      await storiesApiService.deleteStory(taskId)

      // Update local state
      setColumns(prevColumns =>
        prevColumns.map(column => ({
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        }))
      )

      toast.success('Task deleted successfully')
    } catch (error) {
      console.error('Failed to delete task:', error)
      toast.error('Failed to delete task')
    }
  }

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task =>
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading kanban board...</span>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Kanban Board</h2>
            <p className="text-muted-foreground">Drag and drop tasks to update their status</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowWipSettings(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Board Statistics */}
        <div className="grid grid-cols-4 gap-4">
          {columns.map((column) => (
            <Card key={column.id}>
              <CardContent className="p-4 text-center">
                <div className={`w-3 h-3 rounded-full ${column.color} mx-auto mb-2`} />
                <div className="text-2xl font-semibold">{column.tasks.length}</div>
                <div className="text-xs text-muted-foreground">{column.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {filteredColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onTaskMove={handleTaskMove}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
            />
          ))}
        </div>

        {/* WIP Settings Dialog */}
        <Dialog open={showWipSettings} onOpenChange={setShowWipSettings}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Board Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable WIP Limits</Label>
                <Switch
                  checked={wipLimitsEnabled}
                  onCheckedChange={setWipLimitsEnabled}
                />
              </div>
              {wipLimitsEnabled && (
                <div className="space-y-4">
                  <Label>Column WIP Limits</Label>
                  {columns.map((column) => (
                    <div key={column.id} className="flex items-center justify-between">
                      <span className="text-sm">{column.title}</span>
                      <Input
                        type="number"
                        value={column.wipLimit || 0}
                        onChange={(e) => {
                          const newLimit = parseInt(e.target.value) || 0
                          setColumns(prevColumns =>
                            prevColumns.map(col =>
                              col.id === column.id ? { ...col, wipLimit: newLimit } : col
                            )
                          )
                        }}
                        className="w-20"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Task Detail Dialog */}
        <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <p className="font-medium">{selectedTask.title}</p>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-muted-foreground">{selectedTask.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Type</Label>
                    <p>{selectedTask.story_type}</p>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <p>{selectedTask.priority}</p>
                  </div>
                  <div>
                    <Label>Story Points</Label>
                    <p>{selectedTask.story_points}</p>
                  </div>
                </div>
                <div>
                  <Label>Assignee</Label>
                  <p>{selectedTask.assignee_name || 'Unassigned'}</p>
                </div>
                {selectedTask.labels && selectedTask.labels.length > 0 && (
                  <div>
                    <Label>Labels</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTask.labels.map((label, index) => (
                        <Badge key={index} variant="outline">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  )
}