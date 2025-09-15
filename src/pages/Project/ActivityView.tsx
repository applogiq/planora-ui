import { useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Calendar } from '../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { 
  Search,
  Filter,
  Calendar as CalendarIcon,
  User,
  Clock,
  CheckCircle,
  MessageSquare,
  Upload,
  GitCommit,
  Flag,
  Users,
  FileText,
  Settings,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Plus,
  Trash2,
  Star,
  AlertTriangle
} from 'lucide-react'

interface ActivityViewProps {
  project: any
}

export function ActivityView({ project }: ActivityViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({})

  // Extended activity data with more types
  const allActivities = [
    ...project.recentActivity,
    // Task activities
    {
      id: 4,
      user: 'Sarah Wilson',
      action: 'created task',
      target: 'API endpoint development',
      timestamp: '2 days ago',
      type: 'task',
      details: 'Created new backend task for user authentication endpoints'
    },
    {
      id: 5,
      user: 'Mike Johnson',
      action: 'commented on',
      target: 'User interface mockups',
      timestamp: '3 days ago',
      type: 'comment',
      details: 'Added feedback about mobile responsiveness'
    },
    {
      id: 6,
      user: 'Jane Smith',
      action: 'uploaded file',
      target: 'design-system-v2.figma',
      timestamp: '3 days ago',
      type: 'file',
      details: 'Uploaded updated design system file (15.2 MB)'
    },
    // Milestone activities
    {
      id: 7,
      user: 'John Doe',
      action: 'completed milestone',
      target: 'Alpha Release',
      timestamp: '1 week ago',
      type: 'milestone',
      details: 'Successfully completed Alpha Release milestone'
    },
    {
      id: 8,
      user: 'Alex Chen',
      action: 'started testing',
      target: 'Authentication flow',
      timestamp: '1 week ago',
      type: 'test',
      details: 'Began QA testing for user authentication system'
    },
    // Team activities
    {
      id: 9,
      user: 'John Doe',
      action: 'added team member',
      target: 'Alex Chen',
      timestamp: '2 weeks ago',
      type: 'team',
      details: 'Added Alex Chen as QA Engineer to the project'
    },
    {
      id: 10,
      user: 'Sarah Wilson',
      action: 'merged pull request',
      target: '#42: Add user authentication',
      timestamp: '2 weeks ago',
      type: 'code',
      details: 'Merged authentication feature branch into main'
    },
    // Time tracking activities
    {
      id: 11,
      user: 'Mike Johnson',
      action: 'logged time',
      target: '6h 30m',
      timestamp: 'yesterday',
      type: 'time',
      details: 'Logged 6 hours 30 minutes on frontend development'
    },
    {
      id: 12,
      user: 'Jane Smith',
      action: 'updated progress',
      target: 'User interface mockups',
      timestamp: 'yesterday',
      type: 'progress',
      details: 'Updated task progress from 40% to 60%'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="w-5 h-5 text-[#28A745]" />
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-[#007BFF]" />
      case 'file':
        return <Upload className="w-5 h-5 text-[#FFC107]" />
      case 'milestone':
        return <Flag className="w-5 h-5 text-[#DC3545]" />
      case 'code':
        return <GitCommit className="w-5 h-5 text-[#6f42c1]" />
      case 'team':
        return <Users className="w-5 h-5 text-[#28A745]" />
      case 'time':
        return <Clock className="w-5 h-5 text-[#FFC107]" />
      case 'test':
        return <AlertTriangle className="w-5 h-5 text-[#fd7e14]" />
      case 'progress':
        return <Star className="w-5 h-5 text-[#007BFF]" />
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-[#28A745]/10'
      case 'comment':
        return 'bg-[#007BFF]/10'
      case 'file':
        return 'bg-[#FFC107]/10'
      case 'milestone':
        return 'bg-[#DC3545]/10'
      case 'code':
        return 'bg-[#6f42c1]/10'
      case 'team':
        return 'bg-[#28A745]/10'
      case 'time':
        return 'bg-[#FFC107]/10'
      case 'test':
        return 'bg-[#fd7e14]/10'
      case 'progress':
        return 'bg-[#007BFF]/10'
      default:
        return 'bg-muted/10'
    }
  }

  const filteredActivities = allActivities.filter((activity) => {
    const matchesSearch = activity.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = userFilter === 'all' || activity.user === userFilter
    const matchesType = typeFilter === 'all' || activity.type === typeFilter
    return matchesSearch && matchesUser && matchesType
  })

  const activityTypes = [...new Set(allActivities.map(a => a.type))]
  const users = [...new Set(allActivities.map(a => a.user))]

  const activityStats = {
    total: allActivities.length,
    today: allActivities.filter(a => a.timestamp.includes('hour') || a.timestamp === 'just now').length,
    thisWeek: allActivities.filter(a => a.timestamp.includes('day') || a.timestamp.includes('hour') || a.timestamp === 'just now').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Activity Feed</h2>
          <Badge variant="outline">
            {filteredActivities.length} activities
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
              <p className="text-2xl font-semibold">{activityStats.total}</p>
            </div>
            <div className="p-3 bg-[#007BFF]/10 rounded-full">
              <FileText className="w-6 h-6 text-[#007BFF]" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today</p>
              <p className="text-2xl font-semibold">{activityStats.today}</p>
            </div>
            <div className="p-3 bg-[#28A745]/10 rounded-full">
              <Clock className="w-6 h-6 text-[#28A745]" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Week</p>
              <p className="text-2xl font-semibold">{activityStats.thisWeek}</p>
            </div>
            <div className="p-3 bg-[#FFC107]/10 rounded-full">
              <Star className="w-6 h-6 text-[#FFC107]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {activityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
              />
            </PopoverContent>
          </Popover>
        </div>
      </Card>

      {/* Activity Feed */}
      <Card className="p-6">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/30 transition-colors">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                      {activity.user.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{activity.user}</span>
                  <span className="text-sm text-muted-foreground">{activity.action}</span>
                  <span className="font-medium text-sm">{activity.target}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{activity.timestamp}</span>
                </div>
                {activity.details && (
                  <p className="text-sm text-muted-foreground mt-1 ml-8">
                    {activity.details}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-2 ml-8">
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Summary by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activity by Type</h3>
          <div className="space-y-3">
            {activityTypes.map((type) => {
              const count = allActivities.filter(a => a.type === type).length
              const percentage = (count / allActivities.length) * 100
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getActivityIcon(type)}
                    <span className="capitalize">{type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{count}</span>
                    <span className="text-xs text-muted-foreground">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Active Users</h3>
          <div className="space-y-3">
            {users.map((user) => {
              const count = allActivities.filter(a => a.user === user).length
              return (
                <div key={user} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                        {user.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{count}</span>
                    <span className="text-xs text-muted-foreground">activities</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}