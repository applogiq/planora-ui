import React, { useState, useCallback, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
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
  GripVertical,
  Calendar,
  Layers
} from 'lucide-react'
import { storiesApiService, Story } from '../../../services/storiesApi'
import { toast } from 'sonner'
import { projectApiService } from '../../../services/projectApi'
import { TaskModal } from './Tasks/TaskModal'

interface KanbanBoardViewProps {
  project: any
  user: any
  boardType?: 'sprint' | 'kanban' | 'wip'
  masterData?: any
  masterLoading?: boolean
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

  // Check if task is in done column
  const isDone = columnId === 'done' || task.status?.toLowerCase().includes('done') || task.status?.toLowerCase().includes('completed')

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.end_date) return false
    const dueDate = new Date(task.end_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today && !isDone
  }

  // Format due date - only date, no time
  const formatDueDate = () => {
    if (!task.end_date) return null
    const dueDate = new Date(task.end_date)
    return dueDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Truncate description to 100 characters
  const truncateDescription = (text: string | null | undefined, maxLength: number = 100) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  // Get priority color and badge style
  const getPriorityBadge = () => {
    switch (task.priority?.toLowerCase()) {
      case 'critical':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
      case 'high':
        return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' }
      case 'medium':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' }
      case 'low':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' }
    }
  }

  // Get story type icon and color
  const getStoryTypeIcon = () => {
    switch (task.story_type?.toLowerCase()) {
      case 'story':
        return { icon: Target, color: 'text-blue-600' }
      case 'bug':
        return { icon: AlertTriangle, color: 'text-red-600' }
      case 'task':
        return { icon: CheckCircle, color: 'text-green-600' }
      case 'epic':
        return { icon: Layers, color: 'text-purple-600' }
      default:
        return { icon: Target, color: 'text-gray-600' }
    }
  }

  const priorityBadge = getPriorityBadge()
  const storyTypeInfo = getStoryTypeIcon()
  const StoryIcon = storyTypeInfo.icon

  return (
    <div
      ref={drag}
      className={`transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <Card
        className="mb-3 hover:shadow-md transition-shadow bg-white cursor-pointer border border-gray-200 rounded-lg"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          console.log('Card clicked:', task.task_id || task.id)
          onEdit(task)
        }}
      >
        <CardContent className="p-4 space-y-3">
          {/* Task ID */}
          <div className="text-sm font-medium text-gray-600">
            {task.task_id || task.id || 'N/A'}
          </div>

          {/* Task Title */}
          <h4 className={`font-medium text-base ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {truncateDescription(task.description, 100)}
            </p>
          )}

          {/* Story Type and Priority */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StoryIcon className={`w-4 h-4 ${storyTypeInfo.color}`} />
              <span className={`text-xs ${storyTypeInfo.color} capitalize`}>
                {task.story_type || 'Task'}
              </span>
            </div>
            {task.priority && (
              <Badge
                variant="outline"
                className={`text-xs ${priorityBadge.bg} ${priorityBadge.text} border ${priorityBadge.border} capitalize`}
              >
                {task.priority}
              </Badge>
            )}
          </div>

          {/* Epic/Project */}
          {(task.epic_title || task.project_name) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Layers className="w-4 h-4" />
              <span className="truncate">{task.epic_title || task.project_name}</span>
            </div>
          )}

          {/* Footer: Due Date + Avatar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {task.end_date && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`text-xs ${isOverdue() ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                    {formatDueDate()}
                  </span>
                </div>
              )}
              {isOverdue() && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>

            {task.assignee && (
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                {task.assignee.user_profile && (
                  <AvatarImage
                    src={task.assignee.user_profile}
                    alt={task.assignee.name}
                  />
                )}
                <AvatarFallback className="text-xs bg-blue-500 text-white font-medium">
                  {task.assignee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
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
    <div className="flex-1 min-w-80">
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

export function KanbanBoardView({ project, user, boardType = 'kanban', masterData: propMasterData, masterLoading: propMasterLoading }: KanbanBoardViewProps) {
  const projectId = project?.id
  const [columns, setColumns] = useState<KanbanColumn[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showWipSettings, setShowWipSettings] = useState(false)
  const [wipLimitsEnabled, setWipLimitsEnabled] = useState(true)
  const [tasks, setTasks] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  // Use master data from props (passed from parent)
  const masterData = propMasterData
  const masterLoading = propMasterLoading || false
  const [projectTeamMembers, setProjectTeamMembers] = useState<any[]>([])
  const [projectTeamLead, setProjectTeamLead] = useState<any>(null)

  // Log master data usage
  useEffect(() => {
  }, [masterData])

  // Load project team members
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (!projectId) return

      try {
        const teamData = await projectApiService.getProjectTeamMembers(projectId)
        setProjectTeamMembers(teamData.team_members_detail || [])
        setProjectTeamLead(teamData.team_lead_detail || null)
      } catch (error) {
        console.error('❌ [Kanban] Failed to load team members:', error)
      }
    }

    loadTeamMembers()
  }, [projectId])

  // Load tasks from API
  useEffect(() => {
    const loadTasks = async () => {
      if (!projectId) return

      try {
        setLoading(true)
        const response = await storiesApiService.getStories(projectId, 1, 100)
        console.log('📋 [Kanban] Loaded tasks:', response.items)
        console.log('📋 [Kanban] Sample task data:', response.items[0])
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
    // Only create columns if master data is loaded
    if (!masterData || !masterData.statuses || masterData.statuses.length === 0) {
      console.warn('⚠️ [Kanban] Master data not available yet, skipping column initialization')
      return
    }
    // Create columns from master statuses
    const defaultColumns: KanbanColumn[] = masterData.statuses
      .filter((status: any) => status.is_active)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((status: any) => {
        const statusId = status.name.toLowerCase().replace(/\s+/g, '-')
        return {
          id: statusId,
          title: status.name,
          status: statusId,
          color: status.color ? `bg-[${status.color}]` : 'bg-gray-500',
          wipLimit: wipLimitsEnabled ? (status.name.toLowerCase().includes('done') || status.name.toLowerCase().includes('completed') ? undefined : 5) : undefined,
          tasks: []
        }
      })

    // Distribute tasks into columns based on status
    const columnsWithTasks = defaultColumns.map(column => ({
      ...column,
      tasks: tasks.filter(task => {
        const taskStatus = task.status?.toLowerCase().replace(/\s+/g, '-') || 'todo'
        return taskStatus === column.status
      })
    }))

   setColumns(columnsWithTasks)
  }, [tasks, wipLimitsEnabled, masterData])

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

  const handleTaskUpdate = async (updatedTask: any) => {
    try {
      // Update task via API
      await storiesApiService.updateStory(updatedTask.id, updatedTask)

      // Update local state
      setColumns(prevColumns =>
        prevColumns.map(column => ({
          ...column,
          tasks: column.tasks.map(task =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          )
        }))
      )

      // Update tasks state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        )
      )

      setShowTaskDialog(false)
      toast.success('Task updated successfully')
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Failed to update task')
    }
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

  if (loading || masterLoading) {
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

        {/* Task Edit Modal */}
        {selectedTask && (
          <TaskModal
            task={selectedTask}
            isOpen={showTaskDialog}
            onClose={() => setShowTaskDialog(false)}
            onUpdate={handleTaskUpdate}
            user={user}
            availableStatuses={masterData?.statuses}
            availablePriorities={masterData?.priorities}
            projectTeamMembers={projectTeamMembers}
            projectTeamLead={projectTeamLead}
            project={project}
          />
        )}
      </div>
    </DndProvider>
  )
}