import React, { useState } from 'react'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

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

interface CalendarViewProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (taskId: string, updates: any) => void
}

export function CalendarView({ tasks, onTaskClick, onTaskUpdate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return tasks.filter(task => task.dueDate.startsWith(dateStr))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'testing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const today = new Date()
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()

    const days = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Header row with day names
    days.push(
      <div key="header" className="grid grid-cols-7 gap-px bg-border">
        {dayNames.map(day => (
          <div key={day} className="bg-muted p-3 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
    )

    // Empty cells for days before the first day of the month
    const cells = []
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="bg-card min-h-[120px] p-1">
        </div>
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayTasks = getTasksForDate(date)
      const isToday = isCurrentMonth && day === today.getDate()

      cells.push(
        <div key={day} className={`bg-card min-h-[120px] p-1 border-border ${
          isToday ? 'ring-2 ring-[#28A745]' : ''
        }`}>
          <div className={`text-sm font-medium mb-2 ${
            isToday ? 'text-[#28A745] font-bold' : ''
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayTasks.slice(0, 3).map(task => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task.id)}
                className="cursor-pointer group"
              >
                <div className={`text-xs p-1 rounded truncate transition-all group-hover:shadow-sm ${
                  getStatusColor(task.status)
                }`}>
                  <div className="flex items-center space-x-1">
                    <Badge className={`text-xs scale-75 origin-left ${getPriorityColor(task.priority)}`}>
                      {task.priority[0].toUpperCase()}
                    </Badge>
                    <span className="truncate font-medium">{task.title}</span>
                  </div>
                </div>
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="text-xs text-muted-foreground text-center py-1">
                +{dayTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      )
    }

    // Organize cells into weeks
    const weeks = []
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(
        <div key={`week-${i}`} className="grid grid-cols-7 gap-px bg-border">
          {cells.slice(i, i + 7)}
        </div>
      )
    }

    days.push(...weeks)
    return days
  }

  const getMonthStats = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const monthTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate >= monthStart && taskDate <= monthEnd
    })

    const statusCounts = monthTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: monthTasks.length,
      done: statusCounts.done || 0,
      in_progress: statusCounts.in_progress || 0,
      overdue: monthTasks.filter(task => 
        new Date(task.dueDate) < new Date() && task.status !== 'done'
      ).length
    }
  }

  const monthStats = getMonthStats()

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Month Statistics */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span>{monthStats.total} tasks this month</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>{monthStats.done} completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>{monthStats.in_progress} in progress</span>
          </div>
          {monthStats.overdue > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>{monthStats.overdue} overdue</span>
            </div>
          )}
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        <div className="space-y-px">
          {renderCalendarGrid()}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <Badge className="bg-red-500 text-white scale-75">C</Badge>
              <Badge className="bg-orange-500 text-white scale-75">H</Badge>
              <Badge className="bg-yellow-500 text-white scale-75">M</Badge>
              <Badge className="bg-green-500 text-white scale-75">L</Badge>
            </div>
            <span>Priority: Critical, High, Medium, Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-4 h-3 rounded bg-green-100 border"></div>
              <div className="w-4 h-3 rounded bg-blue-100 border"></div>
              <div className="w-4 h-3 rounded bg-purple-100 border"></div>
              <div className="w-4 h-3 rounded bg-gray-100 border"></div>
            </div>
            <span>Status: Done, In Progress, Testing, Other</span>
          </div>
        </div>
      </Card>
    </div>
  )
}