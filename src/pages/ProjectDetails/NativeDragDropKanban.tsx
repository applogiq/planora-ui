import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Input } from '../../components/ui/input'
import {
  Search,
  Target,
  AlertTriangle,
  CheckCircle,
  GripVertical
} from 'lucide-react'
import { storiesApiService, Story } from '../../services/storiesApi'
import { toast } from 'sonner'

interface NativeDragDropKanbanProps {
  project: any
  user: any
}

interface TaskCardProps {
  task: Story
  columnId: string
}

const TaskCard: React.FC<TaskCardProps> = ({ task, columnId }) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log(`🖱️ Started dragging task: ${task.title} (${task.id})`)
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
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="cursor-move select-none"
    >
      <Card className="mb-3 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow hover:bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 mb-2">
            <GripVertical className="w-4 h-4 text-gray-400 mt-1" />
            {getTypeIcon(task.story_type)}
            <div className="flex-1">
              <h4 className="font-medium text-sm">{task.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            </div>
          </div>

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

            {task.assignee_name && (
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {task.assignee_name.split(' ').map(n => n[0]).join('')}
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
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, onDrop }) => {
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
      console.log(`📥 Dropped task ${data.taskId} (${data.taskTitle}) from ${data.sourceColumn} to ${status}`)

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
    <div className="flex-1 min-w-72">
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

export function NativeDragDropKanban({ project, user }: NativeDragDropKanbanProps) {
  const projectId = project?.id
  const [tasks, setTasks] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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
      console.log(`📊 Loaded ${response.items.length} tasks for project ${projectId}`)
    } catch (error) {
      console.error('Failed to load tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      console.log(`🔄 Moving task ${taskId} to ${newStatus}`)

      // Update via API
      await storiesApiService.updateStory(taskId, { status: newStatus })

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      )

      console.log(`✅ Task moved successfully`)
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
        task.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesStatus && matchesSearch
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Kanban Board (Native Drag & Drop)</h2>
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
          />
        ))}
      </div>
    </div>
  )
}