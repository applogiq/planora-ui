import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import {
  MoreHorizontal,
  Calendar,
  Target,
  GitBranch,
  TrendingUp,
  Edit,
  Trash2
} from 'lucide-react'

interface Epic {
  id: string
  title: string
  description: string
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  startDate: string
  endDate: string
  progress: number
  totalStoryPoints: number
  completedStoryPoints: number
  totalStories: number
  completedStories: number
  owner?: string
  project: string
  createdAt: string
  updatedAt: string
}

interface EpicCardProps {
  epic: Epic
  onEdit?: (epic: Epic) => void
  onDelete?: (epic: Epic) => void
  onViewDetails?: (epic: Epic) => void
}

export function EpicCard({ epic, onEdit, onDelete, onViewDetails }: EpicCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'on hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const calculateDaysRemaining = () => {
    const endDate = new Date(epic.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = calculateDaysRemaining()

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-600 cursor-pointer"
          onClick={() => onViewDetails?.(epic)}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getStatusColor(epic.status)}>
                {epic.status}
              </Badge>
              <Badge className={getPriorityColor(epic.priority)}>
                {epic.priority}
              </Badge>
              <span className="text-sm text-gray-500 font-mono">{epic.id}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {epic.title}
            </h3>
            <p className="text-gray-600 line-clamp-3">
              {epic.description}
            </p>
          </div>
          <div className="flex space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(epic)
              }}
              className="w-8 h-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(epic)
              }}
              className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{epic.progress}%</span>
          </div>
          <Progress value={epic.progress} className="h-3 mb-2" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-1 text-gray-500">
              <Target className="w-3 h-3" />
              <span>{epic.completedStoryPoints}/{epic.totalStoryPoints} points</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <GitBranch className="w-3 h-3" />
              <span>{epic.completedStories}/{epic.totalStories} stories</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(epic.startDate)}</span>
            </div>
            <span>→</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(epic.endDate)}</span>
            </div>
          </div>
          {daysRemaining >= 0 && epic.status !== 'Completed' && (
            <div className={`text-xs px-2 py-1 rounded ${
              daysRemaining <= 7 ? 'bg-red-100 text-red-800' :
              daysRemaining <= 30 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {daysRemaining === 0 ? 'Due today' :
               daysRemaining === 1 ? '1 day remaining' :
               `${daysRemaining} days remaining`}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Project:</span> {epic.project}
          </div>
          {epic.owner && (
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {epic.owner.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{epic.owner}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}