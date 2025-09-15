import React, { useState } from 'react'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Calendar, MessageSquare, Paperclip, ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react'

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

interface ListViewProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (taskId: string, updates: any) => void
}

type SortField = 'title' | 'status' | 'priority' | 'assignee' | 'project' | 'sprint' | 'dueDate' | 'storyPoints'
type SortDirection = 'asc' | 'desc' | null

export function ListView({ tasks, onTaskClick, onTaskUpdate }: ListViewProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedTasks = React.useMemo(() => {
    if (!sortField || !sortDirection) return tasks

    return [...tasks].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle special cases
      if (sortField === 'dueDate') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortField === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[aValue as keyof typeof priorityOrder] || 0
        bValue = priorityOrder[bValue as keyof typeof priorityOrder] || 0
      } else if (sortField === 'status') {
        const statusOrder = { backlog: 1, todo: 2, in_progress: 3, in_review: 4, testing: 5, done: 6 }
        aValue = statusOrder[aValue as keyof typeof statusOrder] || 0
        bValue = statusOrder[bValue as keyof typeof statusOrder] || 0
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [tasks, sortField, sortDirection])

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
      case 'backlog': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'todo': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'in_review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      case 'testing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'done'
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4" />
    if (sortDirection === 'desc') return <ArrowDown className="w-4 h-4" />
    return <ArrowUpDown className="w-4 h-4" />
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('title')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Task ID & Title
                  {getSortIcon('title')}
                </Button>
              </TableHead>
              <TableHead className="w-32">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('status')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Status
                  {getSortIcon('status')}
                </Button>
              </TableHead>
              <TableHead className="w-24">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('priority')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Priority
                  {getSortIcon('priority')}
                </Button>
              </TableHead>
              <TableHead className="w-40">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('assignee')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Assignee
                  {getSortIcon('assignee')}
                </Button>
              </TableHead>
              <TableHead className="w-40">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('project')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Project
                  {getSortIcon('project')}
                </Button>
              </TableHead>
              <TableHead className="w-32">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('sprint')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Sprint
                  {getSortIcon('sprint')}
                </Button>
              </TableHead>
              <TableHead className="w-32">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('dueDate')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Due Date
                  {getSortIcon('dueDate')}
                </Button>
              </TableHead>
              <TableHead className="w-24">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('storyPoints')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Story Points
                  {getSortIcon('storyPoints')}
                </Button>
              </TableHead>
              <TableHead className="w-32">Activity</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-muted-foreground">{task.id}</div>
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {task.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                    {formatStatus(task.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                        {getAvatarInitials(task.assignee)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate">{task.assignee}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm truncate" title={task.project}>
                    {task.project}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {task.sprint}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className={`text-sm flex items-center space-x-1 ${
                    isOverdue(task.dueDate, task.status) ? 'text-red-600 dark:text-red-400' : ''
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(task.dueDate)}</span>
                    {isOverdue(task.dueDate, task.status) && (
                      <span className="text-xs">(Overdue)</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <span className="font-medium">{task.storyPoints}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    {task.comments > 0 && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{task.comments}</span>
                      </div>
                    )}
                    {task.attachments > 0 && (
                      <div className="flex items-center space-x-1">
                        <Paperclip className="w-3 h-3" />
                        <span>{task.attachments}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onTaskClick(task.id)}
                    className="h-auto p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found matching the current filters.</p>
        </div>
      )}
    </Card>
  )
}