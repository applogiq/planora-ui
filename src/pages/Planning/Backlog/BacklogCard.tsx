import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Separator } from '../../../components/ui/separator'
import {
  MoreHorizontal,
  Target,
  User,
  Calendar,
  ArrowUpDown,
  Edit,
  Trash2
} from 'lucide-react'

interface BacklogItem {
  id: string
  title: string
  description: string
  type: 'User Story' | 'Bug' | 'Task' | 'Epic'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Backlog' | 'Ready' | 'In Progress' | 'Done'
  storyPoints: number
  assignee?: string
  sprint?: string
  createdAt: string
  updatedAt: string
}

interface BacklogCardProps {
  item: BacklogItem
  onEdit?: (item: BacklogItem) => void
  onDelete?: (item: BacklogItem) => void
  onMove?: (item: BacklogItem, direction: 'up' | 'down') => void
}

export function BacklogCard({ item, onEdit, onDelete, onMove }: BacklogCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'user story': return 'bg-blue-100 text-blue-800'
      case 'bug': return 'bg-red-100 text-red-800'
      case 'task': return 'bg-purple-100 text-purple-800'
      case 'epic': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'backlog': return 'bg-gray-100 text-gray-800'
      case 'ready': return 'bg-blue-100 text-blue-800'
      case 'in progress': return 'bg-yellow-100 text-yellow-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-orange-600">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with badges */}
          <div className="flex items-center space-x-3 mb-3">
            <Badge className={getTypeColor(item.type)}>
              {item.type}
            </Badge>
            <Badge className={getPriorityColor(item.priority)}>
              {item.priority}
            </Badge>
            <Badge className={getStatusColor(item.status)}>
              {item.status}
            </Badge>
            <span className="text-sm text-gray-500 font-mono">{item.id}</span>
          </div>

          {/* Title and Description */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {item.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{item.storyPoints} points</span>
            </div>
            {item.assignee && (
              <div className="flex items-center space-x-2">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-xs">
                    {item.assignee.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span>{item.assignee}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Sprint Assignment */}
          {item.sprint && (
            <>
              <Separator className="my-3" />
              <div className="text-sm text-gray-600">
                <span className="font-medium">Sprint:</span> {item.sprint}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMove?.(item, 'up')}
            className="w-8 h-8 p-0"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(item)}
            className="w-8 h-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(item)}
            className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}