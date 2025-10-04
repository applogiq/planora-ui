import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import {
  Search,
  Target,
  AlertTriangle,
  CheckCircle,
  GripVertical,
  Clock,
  AlertCircle,
  Calendar,
  Layers,
  Filter
} from 'lucide-react'
import { storiesApiService, Story } from '../../../services/storiesApi'
import { toast } from 'sonner'
import { TaskModal } from './Tasks/TaskModal'

interface NativeDragDropKanbanProps {
  project: any
  user: any
  masterData?: any
  masterLoading?: boolean
}

interface TaskCardProps {
  task: Story
  columnId: string
  onEdit: (task: Story) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, columnId, onEdit }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      taskId: task.id,
      sourceColumn: columnId,
      taskTitle: task.title
    }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = (e: React.DragEvent) => {
    console.log(`🏁 Drag ended for task: ${task.title}`)
    // Reset any visual states if needed
  }

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
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="cursor-move select-none"
    >
      <Card
        className="mb-3 hover:shadow-lg transition-all duration-200 bg-white cursor-pointer border border-gray-200 rounded-xl hover:border-blue-300 group"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          console.log('Card clicked:', task.task_id || task.id)
          onEdit(task)
        }}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header: Task ID and Story Type Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StoryIcon className={`w-3.5 h-3.5 ${storyTypeInfo.color}`} />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {task.task_id || task.id || 'N/A'}
              </span>
            </div>
            {/* Priority Badge */}
            {task.priority && (
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 h-5 ${priorityBadge.bg} ${priorityBadge.text} border ${priorityBadge.border} capitalize font-medium`}
              >
                {task.priority}
              </Badge>
            )}
          </div>

          {/* Task Title */}
          <h4 className={`font-semibold text-sm leading-tight line-clamp-2 ${isDone ? 'line-through text-gray-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
              {truncateDescription(task.description, 100)}
            </p>
          )}

          {/* Epic or Project Name - Only show one if exists */}
          {(task.epic_title || task.project_name) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Layers className="w-3 h-3 text-gray-400" />
              <span className="truncate">{task.epic_title || task.project_name}</span>
            </div>
          )}

          {/* Progress Bar */}
          {task.progress !== undefined && task.progress !== null && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium text-gray-700">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    task.progress === 100 ? 'bg-green-500' : task.progress >= 70 ? 'bg-blue-500' : task.progress >= 40 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 -mx-3 my-2"></div>

          {/* Footer: Due Date + Avatar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Due Date */}
              {task.end_date && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${isOverdue() ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <Clock className={`w-3 h-3 ${isOverdue() ? 'text-red-500' : 'text-gray-400'}`} />
                  <span className={`text-[11px] font-medium ${isOverdue() ? 'text-red-600' : 'text-gray-600'}`}>
                    {formatDueDate()}
                  </span>
                </div>
              )}
            </div>

            {/* Avatar */}
            {task.assignee && (
              <Avatar className="w-7 h-7 border-2 border-white shadow-sm ring-1 ring-gray-200">
                {task.assignee.user_profile && (
                  <AvatarImage
                    src={task.assignee.user_profile}
                    alt={task.assignee.name}
                  />
                )}
                <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
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

interface ColumnProps {
  title: string
  status: string
  tasks: Story[]
  onDrop: (taskId: string, newStatus: string) => void
  onEdit: (task: Story) => void
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, onDrop, onEdit }) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!isDragOver) {
      setIsDragOver(true)
      console.log(`👆 Hovering over ${title}`)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Check if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.sourceColumn !== status) {
        onDrop(data.taskId, status)
      }
    } catch (error) {
      console.error('Error parsing drop data:', error)
    }
  }

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-500'
      case 'in-progress': return 'bg-blue-500'
      case 'review': return 'bg-yellow-500'
      case 'done': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex-1 min-w-80">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getColumnColor(status)}`} />
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {tasks.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`min-h-96 transition-all duration-200 ${
            isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-400 shadow-inner' : ''
          }`}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={status}
              onEdit={onEdit}
            />
          ))}

          {tasks.length === 0 && (
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

export function NativeDragDropKanban({ project, user, masterData: propMasterData, masterLoading: propMasterLoading }: NativeDragDropKanbanProps) {
  const projectId = project?.id
  const [tasks, setTasks] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTask, setSelectedTask] = useState<Story | null>(null)
  const [showTaskDialog, setShowTaskDialog] = useState(false)

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterAssignee, setFilterAssignee] = useState<string>('all')

  // Use master data from props or fallback (for backwards compatibility)
  const masterData = propMasterData
  const masterLoading = propMasterLoading || false

  // Get team members from project object directly
  const projectTeamMembers = project?.team_members_detail || []
  const projectTeamLead = project?.team_lead_detail

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'review', title: 'Review', status: 'review' },
    { id: 'done', title: 'Done', status: 'done' }
  ]

  useEffect(() => {
    loadTasks()
  }, [projectId])

  const loadTasks = async () => {
    if (!projectId) return

    try {
      setLoading(true)
      const response = await storiesApiService.getStories(projectId, 1, 100)
      setTasks(response.items)
    } catch (error) {
      console.error('Failed to load tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskEdit = (task: Story) => {
    console.log('Opening modal for task:', task.task_id || task.id)
    setSelectedTask(task)
    setShowTaskDialog(true)
  }

  const handleTaskUpdate = async (updatedTask: any) => {
    try {
      await storiesApiService.updateStory(updatedTask.id, updatedTask)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        )
      )
      setShowTaskDialog(false)
      toast.success('Task updated successfully')
      loadTasks() // Reload to get fresh data
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Failed to update task')
    }
  }

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      // Update via API
      await storiesApiService.updateStory(taskId, { status: newStatus })

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      )
      toast.success('Task moved successfully')
    } catch (error) {
      console.error('❌ Failed to move task:', error)
      toast.error('Failed to move task')
    }
  }

  const getTasksForColumn = (status: string) => {
    return tasks.filter(task => {
      const taskStatus = task.status?.toLowerCase().replace(' ', '-') || 'todo'
      const matchesStatus = taskStatus === status
      const matchesSearch = !searchTerm ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by priority
      const matchesPriority = filterPriority === 'all' ||
        task.priority?.toLowerCase() === filterPriority.toLowerCase()

      // Filter by type
      const matchesType = filterType === 'all' ||
        task.story_type?.toLowerCase() === filterType.toLowerCase()

      // Filter by assignee
      const matchesAssignee = filterAssignee === 'all' ||
        (filterAssignee === 'unassigned' ? !task.assignee_id : task.assignee_id === filterAssignee)

      return matchesStatus && matchesSearch && matchesPriority && matchesType && matchesAssignee
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading kanban board...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Kanban Board</h2>
            <p className="text-muted-foreground">Drag and drop tasks to update their status</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {masterData?.priorities && masterData.priorities.length > 0 ? (
                  masterData.priorities.map((priority) => (
                    <SelectItem key={priority.id} value={priority.name.toLowerCase()}>
                      <div className="flex items-center space-x-2">
                        {priority.color && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: priority.color }}
                          />
                        )}
                        <span>{priority.name}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {projectTeamMembers && projectTeamMembers.length > 0 ? (
                  projectTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading" disabled>Loading members...</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Board Statistics */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTasks = getTasksForColumn(column.status)
          return (
            <Card key={column.id}>
              <CardContent className="p-4 text-center">
                <div className={`w-3 h-3 rounded-full ${column.status === 'todo' ? 'bg-gray-500' : column.status === 'in-progress' ? 'bg-blue-500' : column.status === 'review' ? 'bg-yellow-500' : 'bg-green-500'} mx-auto mb-2`} />
                <div className="text-2xl font-semibold">{columnTasks.length}</div>
                <div className="text-xs text-muted-foreground">{column.title}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            title={column.title}
            status={column.status}
            tasks={getTasksForColumn(column.status)}
            onDrop={handleTaskMove}
            onEdit={handleTaskEdit}
          />
        ))}
      </div>

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
  )
}