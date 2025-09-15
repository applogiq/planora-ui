import { useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Calendar } from '../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { format } from 'date-fns'
import { 
  Timer,
  Play,
  Pause,
  Square,
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  User,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp,
  Edit,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react'

interface TimeTrackingViewProps {
  project: any
}

export function TimeTrackingView({ project }: TimeTrackingViewProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const [selectedTask, setSelectedTask] = useState('')
  const [description, setDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({})
  const [viewMode, setViewMode] = useState<'entries' | 'summary'>('entries')

  const timeEntries = project.timeEntries || []

  const filteredEntries = timeEntries.filter((entry: any) => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.task.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = userFilter === 'all' || entry.user === userFilter
    return matchesSearch && matchesUser
  })

  const totalTime = filteredEntries.reduce((total: number, entry: any) => {
    const [hours, minutes] = entry.duration.split('h ').map((part: string) => parseInt(part) || 0)
    return total + hours + (minutes / 60)
  }, 0)

  const billableTime = filteredEntries
    .filter((entry: any) => entry.billable)
    .reduce((total: number, entry: any) => {
      const [hours, minutes] = entry.duration.split('h ').map((part: string) => parseInt(part) || 0)
      return total + hours + (minutes / 60)
    }, 0)

  const timeByUser = project.team.map((member: any) => {
    const userEntries = filteredEntries.filter((entry: any) => entry.user === member.name)
    const userTime = userEntries.reduce((total: number, entry: any) => {
      const [hours, minutes] = entry.duration.split('h ').map((part: string) => parseInt(part) || 0)
      return total + hours + (minutes / 60)
    }, 0)
    return {
      user: member.name,
      avatar: member.avatar,
      time: userTime,
      entries: userEntries.length
    }
  })

  const timeByTask = project.tasks.map((task: any) => {
    const taskEntries = filteredEntries.filter((entry: any) => entry.task === task.id)
    const taskTime = taskEntries.reduce((total: number, entry: any) => {
      const [hours, minutes] = entry.duration.split('h ').map((part: string) => parseInt(part) || 0)
      return total + hours + (minutes / 60)
    }, 0)
    return {
      task: task.title,
      taskId: task.id,
      time: taskTime,
      entries: taskEntries.length
    }
  }).filter(item => item.time > 0)

  const startTimer = () => {
    setIsTimerRunning(true)
    // In a real app, this would start the actual timer
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    setCurrentTime('00:00:00')
    // In a real app, this would save the time entry
  }

  const formatTime = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const renderTimeEntries = () => (
    <Card className="p-6">
      <div className="space-y-4">
        {filteredEntries.map((entry: any) => (
          <div key={entry.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex items-center space-x-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                  {entry.user.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{entry.description}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{entry.user}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{entry.task}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  {entry.billable && (
                    <Badge variant="outline" className="text-xs bg-[#28A745]/10 text-[#28A745]">
                      Billable
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-medium">{entry.duration}</div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )

  const renderSummary = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time by User */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Time by Team Member</h3>
        <div className="space-y-3">
          {timeByUser.map((user) => (
            <div key={user.user} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.user}</p>
                  <p className="text-xs text-muted-foreground">{user.entries} entries</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatTime(user.time)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Time by Task */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Time by Task</h3>
        <div className="space-y-3">
          {timeByTask.map((task) => (
            <div key={task.taskId} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{task.task}</p>
                <p className="text-xs text-muted-foreground">{task.entries} entries</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatTime(task.time)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Time Tracking</h2>
          <Badge variant="outline">
            {formatTime(totalTime)} total
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Timer Widget */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#007BFF]/10 rounded-full">
              <Timer className="w-8 h-8 text-[#007BFF]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Current Timer</h3>
              <div className="text-3xl font-mono font-bold text-[#007BFF]">
                {currentTime}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {project.tasks.map((task: any) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-48"
              />
            </div>
            <div className="flex space-x-2">
              {!isTimerRunning ? (
                <Button onClick={startTimer} className="bg-[#28A745] hover:bg-[#218838] text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseTimer} className="bg-[#FFC107] hover:bg-[#e0a800] text-white">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={stopTimer} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Time</p>
              <p className="text-2xl font-semibold">{formatTime(totalTime)}</p>
            </div>
            <div className="p-3 bg-[#007BFF]/10 rounded-full">
              <Clock className="w-6 h-6 text-[#007BFF]" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Billable Time</p>
              <p className="text-2xl font-semibold">{formatTime(billableTime)}</p>
            </div>
            <div className="p-3 bg-[#28A745]/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-[#28A745]" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Entries</p>
              <p className="text-2xl font-semibold">{filteredEntries.length}</p>
            </div>
            <div className="p-3 bg-[#FFC107]/10 rounded-full">
              <BarChart3 className="w-6 h-6 text-[#FFC107]" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
              <p className="text-2xl font-semibold">{formatTime(totalTime / 7)}</p>
            </div>
            <div className="p-3 bg-[#DC3545]/10 rounded-full">
              <PieChart className="w-6 h-6 text-[#DC3545]" />
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
                placeholder="Search time entries..."
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
              {project.team.map((member: any) => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name}
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

          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-lg">
            <Button
              variant={viewMode === 'entries' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('entries')}
              className="rounded-r-none"
            >
              Entries
            </Button>
            <Button
              variant={viewMode === 'summary' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('summary')}
              className="rounded-l-none"
            >
              Summary
            </Button>
          </div>
        </div>
      </Card>

      {/* Time Views */}
      {viewMode === 'entries' && renderTimeEntries()}
      {viewMode === 'summary' && renderSummary()}
    </div>
  )
}