import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { 
  Clock, 
  GitCommit, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Calendar,
  Filter,
  RefreshCw,
  Flag
} from 'lucide-react'

interface ActivityViewProps {
  projectId: string
  user: any
}

// Mock activity data
const mockActivities = [
  {
    id: '1',
    type: 'task_completed',
    user: { name: 'Alice Johnson', avatar: 'AJ' },
    title: 'completed task',
    description: 'OAuth 2.0 Authentication Implementation',
    timestamp: '2024-03-05T14:30:00Z',
    details: {
      taskId: 'T-123',
      storyPoints: 8
    }
  },
  {
    id: '2',
    type: 'comment_added',
    user: { name: 'Bob Chen', avatar: 'BC' },
    title: 'added a comment on',
    description: 'Password Reset Flow Setup',
    timestamp: '2024-03-05T13:15:00Z',
    details: {
      comment: 'Working on the email template integration. Should be ready for review by EOD.'
    }
  },
  {
    id: '3',
    type: 'file_uploaded',
    user: { name: 'Carol Davis', avatar: 'CD' },
    title: 'uploaded file',
    description: 'user-profile-wireframes.figma',
    timestamp: '2024-03-05T11:45:00Z',
    details: {
      fileName: 'user-profile-wireframes.figma',
      fileSize: '2.4 MB'
    }
  },
  {
    id: '4',
    type: 'sprint_started',
    user: { name: 'Alice Johnson', avatar: 'AJ' },
    title: 'started sprint',
    description: 'Sprint 5: User Management Features',
    timestamp: '2024-03-01T09:00:00Z',
    details: {
      sprintName: 'Sprint 5',
      plannedPoints: 42,
      duration: '2 weeks'
    }
  },
  {
    id: '5',
    type: 'task_assigned',
    user: { name: 'Alice Johnson', avatar: 'AJ' },
    title: 'assigned task to',
    description: 'David Wilson - API Integration Testing',
    timestamp: '2024-03-05T10:20:00Z',
    details: {
      assignee: 'David Wilson',
      taskTitle: 'API Integration Testing'
    }
  },
  {
    id: '6',
    type: 'milestone_reached',
    user: { name: 'System', avatar: 'SY' },
    title: 'milestone reached',
    description: 'Authentication Module - 80% Complete',
    timestamp: '2024-03-04T16:30:00Z',
    details: {
      milestone: 'Authentication Module',
      progress: 80
    }
  },
  {
    id: '7',
    type: 'code_commit',
    user: { name: 'Bob Chen', avatar: 'BC' },
    title: 'committed code',
    description: 'feat: add OAuth provider configuration',
    timestamp: '2024-03-04T15:45:00Z',
    details: {
      commitHash: 'a1b2c3d',
      branch: 'feature/oauth-setup',
      filesChanged: 5
    }
  },
  {
    id: '8',
    type: 'task_blocked',
    user: { name: 'David Wilson', avatar: 'DW' },
    title: 'blocked task',
    description: 'Email Service Integration - Waiting for API keys',
    timestamp: '2024-03-04T14:20:00Z',
    details: {
      reason: 'Waiting for external API keys from vendor',
      blockedSince: '2024-03-04'
    }
  }
]

export function ActivityView({ projectId, user }: ActivityViewProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'task_assigned':
        return <Users className="w-4 h-4 text-blue-600" />
      case 'task_blocked':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-blue-600" />
      case 'file_uploaded':
        return <FileText className="w-4 h-4 text-purple-600" />
      case 'sprint_started':
        return <Calendar className="w-4 h-4 text-green-600" />
      case 'milestone_reached':
        return <Flag className="w-4 h-4 text-orange-600" />
      case 'code_commit':
        return <GitCommit className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_completed':
        return 'border-l-green-500'
      case 'task_assigned':
        return 'border-l-blue-500'
      case 'task_blocked':
        return 'border-l-red-500'
      case 'comment_added':
        return 'border-l-blue-500'
      case 'file_uploaded':
        return 'border-l-purple-500'
      case 'sprint_started':
        return 'border-l-green-500'
      case 'milestone_reached':
        return 'border-l-orange-500'
      case 'code_commit':
        return 'border-l-gray-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const renderActivityDetails = (activity: any) => {
    switch (activity.type) {
      case 'task_completed':
        return (
          <div className="mt-2 text-sm text-muted-foreground">
            Story points: {activity.details.storyPoints} • Task ID: {activity.details.taskId}
          </div>
        )
      case 'comment_added':
        return (
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-sm italic">
            "{activity.details.comment}"
          </div>
        )
      case 'file_uploaded':
        return (
          <div className="mt-2 text-sm text-muted-foreground">
            File size: {activity.details.fileSize}
          </div>
        )
      case 'sprint_started':
        return (
          <div className="mt-2 text-sm text-muted-foreground">
            Duration: {activity.details.duration} • Planned points: {activity.details.plannedPoints}
          </div>
        )
      case 'code_commit':
        return (
          <div className="mt-2 text-sm text-muted-foreground">
            Branch: {activity.details.branch} • Files changed: {activity.details.filesChanged}
          </div>
        )
      case 'task_blocked':
        return (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-sm text-red-700 dark:text-red-300">
            Reason: {activity.details.reason}
          </div>
        )
      case 'milestone_reached':
        return (
          <div className="mt-2 text-sm text-muted-foreground">
            Progress: {activity.details.progress}% complete
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Project Activity</h2>
          <p className="text-muted-foreground">Real-time updates and project timeline</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#28A745]">24</div>
            <div className="text-xs text-muted-foreground">Activities Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#007BFF]">156</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#FFC107]">8</div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#DC3545]">2</div>
            <div className="text-xs text-muted-foreground">Blocked Items</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-4 p-4 border-l-4 ${getActivityColor(activity.type)} bg-gray-50 dark:bg-gray-800/50 rounded-r-lg`}
              >
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-[#28A745] text-white text-xs">
                    {activity.user.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getActivityIcon(activity.type)}
                    <span className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>
                      <span className="text-muted-foreground"> {activity.title} </span>
                      <span className="font-medium">{activity.description}</span>
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-1">
                    {formatTimestamp(activity.timestamp)}
                  </div>
                  
                  {renderActivityDetails(activity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button variant="outline" size="sm">
              Load More Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}