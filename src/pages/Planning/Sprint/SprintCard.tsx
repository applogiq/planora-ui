import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Separator } from '../../../components/ui/separator'
import { format } from 'date-fns'
import {
  Calendar,
  Users,
  TrendingUp,
  MoreHorizontal,
  CheckCircle2,
  PlayCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { Sprint } from '../../../services/sprintApi'

interface SprintCardProps {
  sprint: Sprint
  onEdit: (sprint: Sprint) => void
}

export function SprintCard({ sprint, onEdit }: SprintCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning': return 'bg-gray-100 text-gray-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'in progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning': return <Clock className="w-3 h-3" />
      case 'active': return <PlayCircle className="w-3 h-3" />
      case 'in progress': return <PlayCircle className="w-3 h-3" />
      case 'completed': return <CheckCircle2 className="w-3 h-3" />
      case 'cancelled': return <XCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const getBurndownTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'on track': return 'text-green-600'
      case 'behind': return 'text-red-600'
      case 'ahead': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const calculateProgress = () => {
    if (sprint.total_points === 0) return 0
    return Math.round((sprint.completed_points / sprint.total_points) * 100)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{sprint.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{sprint.goal}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(sprint)}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Status and Project */}
        <div className="flex items-center justify-between mb-4">
          <Badge className={`${getStatusColor(sprint.status)} flex items-center space-x-1`}>
            {getStatusIcon(sprint.status)}
            <span>{sprint.status}</span>
          </Badge>
          <div className="text-sm text-gray-600">
            {sprint.project_name}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{sprint.completed_points}/{sprint.total_points} points</span>
            <span>{sprint.completed_tasks}/{sprint.total_tasks} tasks</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(sprint.start_date)}</span>
          </div>
          <span>→</span>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(sprint.end_date)}</span>
          </div>
        </div>

        {/* Team & Metrics */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-gray-400" />
              <span>{sprint.team_size}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-gray-400" />
              <span>{sprint.velocity}</span>
            </div>
          </div>
          <div className={`text-xs font-medium ${getBurndownTrendColor(sprint.burndown_trend)}`}>
            {sprint.burndown_trend}
          </div>
        </div>

        {/* Scrum Master */}
        <Separator className="my-3" />
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs">
              {sprint.scrum_master_name?.charAt(0) || 'SM'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            {sprint.scrum_master_name || 'Unassigned'}
          </span>
        </div>
      </div>
    </Card>
  )
}