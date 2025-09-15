import React from 'react'
import { useDrag } from 'react-dnd'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Calendar, MessageSquare, Paperclip, Clock, AlertTriangle, GripVertical } from 'lucide-react'

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

interface TaskCardProps {
  task: Task
  onClick: () => void
  onUpdate: (updates: any) => void
  isDraggable?: boolean
}

export function TaskCard({ task, onClick, onUpdate, isDraggable = false }: TaskCardProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isDraggable,
  })
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getLabelColor = (label: string) => {
    const colors = {
      'frontend': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'backend': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'security': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'database': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'devops': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'mobile': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'testing': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      'design': 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
      'api': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300'
    }
    return colors[label as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const isOverdue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    return due < today && task.status !== 'done'
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onClick()
    }
  }

  return (
    <div ref={dragPreview}>
      <div 
        ref={isDraggable ? drag : null}
        onClick={handleCardClick}
        className={`transition-all duration-200 ${isDragging ? 'opacity-50 transform rotate-2 scale-105' : 'opacity-100'}`}
      >
        <Card 
          className={`p-2.5 cursor-pointer hover:shadow-md transition-all duration-200 bg-white dark:bg-card border border-border max-h-[150px] overflow-hidden ${
            isDraggable 
              ? 'hover:shadow-lg hover:scale-102 hover:border-[#28A745]/50' 
              : ''
          }`}
        >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
            <Badge className={`text-xs px-1.5 py-0.5 ${getPriorityColor(task.priority)}`}>
              {task.priority[0].toUpperCase()}
            </Badge>
          </div>
          <h4 className="font-medium text-sm leading-tight line-clamp-2 mb-1">
            {task.title}
          </h4>
        </div>
        {isDraggable && (
          <div className="flex-shrink-0 ml-2 opacity-30 hover:opacity-60 transition-opacity">
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Task Description */}
      <p className="text-xs text-muted-foreground mb-1.5 line-clamp-1 leading-tight">
        {task.description}
      </p>

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1.5">
          {task.labels.slice(0, 2).map((label) => (
            <Badge key={label} variant="outline" className={`text-xs px-1.5 py-0.5 ${getLabelColor(label)}`}>
              {label}
            </Badge>
          ))}
          {task.labels.length > 2 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              +{task.labels.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Project and Sprint - Compact */}
      <div className="text-xs text-muted-foreground mb-1.5 leading-tight">
        <div className="truncate">📁 {task.project}</div>
        <div className="truncate">🏃‍♂️ {task.sprint}</div>
      </div>

      {/* Bottom Section - Due Date, Metadata, and Assignee */}
      <div className="space-y-1">
        {/* Due Date and Story Points */}
        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center space-x-1 ${
            isOverdue(task.dueDate) ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
          }`}>
            {isOverdue(task.dueDate) && <AlertTriangle className="w-3 h-3" />}
            <Calendar className="w-3 h-3" />
            <span>{formatDueDate(task.dueDate)}</span>
            {!isOverdue(task.dueDate) && getDaysUntilDue(task.dueDate) <= 3 && (
              <span className="text-orange-600 dark:text-orange-400">
                ({getDaysUntilDue(task.dueDate)}d)
              </span>
            )}
            {isOverdue(task.dueDate) && (
              <span className="text-red-600 dark:text-red-400 font-medium">
                Overdue
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <span className="font-medium">{task.storyPoints}</span>
            <span>SP</span>
          </div>
        </div>

        {/* Assignee and Activity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                {getAvatarInitials(task.assignee)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
              {task.assignee.split(' ')[0]}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {task.comments > 0 && (
              <div className="flex items-center space-x-0.5">
                <MessageSquare className="w-3 h-3" />
                <span>{task.comments}</span>
              </div>
            )}
            {task.attachments > 0 && (
              <div className="flex items-center space-x-0.5">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachments}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Drag Indicator */}
      {isDraggable && isDragging && (
        <div className="absolute inset-0 bg-[#28A745]/20 border-2 border-dashed border-[#28A745] rounded-lg pointer-events-none" />
      )}
        </Card>
      </div>
    </div>
  )
}