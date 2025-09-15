import React, { useCallback } from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { TaskCard } from './TaskCard'
import { Calendar, MessageSquare, Paperclip, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

const BOARD_COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'todo', title: 'To Do', color: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'in_review', title: 'In Review', color: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'testing', title: 'Testing', color: 'bg-orange-50 dark:bg-orange-900/20' },
  { id: 'done', title: 'Done', color: 'bg-green-50 dark:bg-green-900/20' }
]

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignee: string
  project: string
  sprint: string
  labels: string[]
  dueDate: string
  storyPoints: number
  comments: number
  attachments: number
}

interface BoardViewProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (taskId: string, updates: any) => void
}

interface DroppableColumnProps {
  column: { id: string; title: string; color: string }
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (taskId: string, updates: any) => void
  onTaskDrop: (taskId: string, newStatus: string) => void
}

// Droppable Column Component
function DroppableColumn({ column, tasks, onTaskClick, onTaskUpdate, onTaskDrop }: DroppableColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string; status: string }) => {
      if (item.status !== column.id) {
        onTaskDrop(item.id, column.id)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const getColumnTaskCount = () => tasks.length
  const getTotalStoryPoints = () => tasks.reduce((sum, task) => sum + task.storyPoints, 0)

  const taskCount = getColumnTaskCount()
  const storyPoints = getTotalStoryPoints()

  return (
    <div className="flex-shrink-0 w-80">
      {/* Column Header */}
      <div className={`${column.color} rounded-t-lg p-4 border-b`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">{column.title}</h3>
          <MoreHorizontal className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{storyPoints} SP</span>
        </div>
      </div>

      {/* Droppable Column Content */}
      <div 
        ref={drop}
        className={`min-h-[500px] bg-muted/20 rounded-b-lg p-3 space-y-2 transition-all duration-200 ${
          isOver && canDrop 
            ? 'bg-[#28A745]/10 border-2 border-dashed border-[#28A745] bg-opacity-50' 
            : isOver 
            ? 'bg-muted/30' 
            : ''
        }`}
      >
        {tasks.length === 0 ? (
          <div className={`text-center text-sm py-8 transition-all duration-200 ${
            isOver && canDrop 
              ? 'text-[#28A745] font-medium' 
              : 'text-muted-foreground'
          }`}>
            {isOver && canDrop 
              ? `Drop task here to move to ${column.title}` 
              : `No tasks in ${column.title.toLowerCase()}`
            }
          </div>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task.id)}
                onUpdate={(updates) => onTaskUpdate(task.id, updates)}
                isDraggable={true}
              />
            ))}
            {isOver && canDrop && (
              <div className="h-2 bg-[#28A745] bg-opacity-30 rounded-md border-2 border-dashed border-[#28A745] animate-pulse" />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export function BoardView({ tasks, onTaskClick, onTaskUpdate }: BoardViewProps) {
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const handleTaskDrop = useCallback((taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const statusLabels = {
      backlog: 'Backlog',
      todo: 'To Do',
      in_progress: 'In Progress',
      in_review: 'In Review',
      testing: 'Testing',
      done: 'Done'
    }

    const oldStatusLabel = statusLabels[task.status as keyof typeof statusLabels]
    const newStatusLabel = statusLabels[newStatus as keyof typeof statusLabels]

    onTaskUpdate(taskId, { status: newStatus })
    
    toast.success(
      `Task "${task.title}" moved from ${oldStatusLabel} to ${newStatusLabel}`,
      {
        description: `Task ID: ${taskId}`,
        duration: 3000,
      }
    )
  }, [tasks, onTaskUpdate])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {BOARD_COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id)

          return (
            <DroppableColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onTaskClick={onTaskClick}
              onTaskUpdate={onTaskUpdate}
              onTaskDrop={handleTaskDrop}
            />
          )
        })}
      </div>
    </DndProvider>
  )
}