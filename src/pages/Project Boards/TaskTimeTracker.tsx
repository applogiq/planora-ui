import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { 
  Play, 
  Pause, 
  Square, 
  Timer, 
  Clock, 
  Calendar,
  TrendingUp,
  BarChart3,
  Target,
  Zap
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface TimeEntry {
  id: string
  taskId: string
  description: string
  startTime: Date
  endTime: Date | null
  duration: number // in minutes
  isActive: boolean
  category: 'development' | 'testing' | 'review' | 'meeting' | 'research'
}

interface TaskTimeTrackerProps {
  taskId: string
  taskTitle: string
  isOpen: boolean
  onClose: () => void
  onTimeLogged: (entry: TimeEntry) => void
}

export function TaskTimeTracker({ taskId, taskTitle, isOpen, onClose, onTimeLogged }: TaskTimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TimeEntry['category']>('development')
  const [manualTime, setManualTime] = useState({ hours: 0, minutes: 0 })
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])

  // Mock existing time entries
  useEffect(() => {
    const mockEntries: TimeEntry[] = [
      {
        id: '1',
        taskId,
        description: 'Initial research and setup',
        startTime: new Date('2025-01-20T09:00:00'),
        endTime: new Date('2025-01-20T11:30:00'),
        duration: 150,
        isActive: false,
        category: 'research'
      },
      {
        id: '2',
        taskId,
        description: 'OAuth implementation development',
        startTime: new Date('2025-01-20T13:00:00'),
        endTime: new Date('2025-01-20T17:15:00'),
        duration: 255,
        isActive: false,
        category: 'development'
      },
      {
        id: '3',
        taskId,
        description: 'Code review and testing',
        startTime: new Date('2025-01-21T10:00:00'),
        endTime: new Date('2025-01-21T12:00:00'),
        duration: 120,
        isActive: false,
        category: 'testing'
      }
    ]
    setTimeEntries(mockEntries)
  }, [taskId])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking && currentEntry) {
      interval = setInterval(() => {
        const now = new Date()
        const startTime = currentEntry.startTime
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 60000) // minutes
        setElapsedTime(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isTracking, currentEntry])

  const startTimer = () => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId,
      description: description || 'Working on task',
      startTime: new Date(),
      endTime: null,
      duration: 0,
      isActive: true,
      category
    }

    setCurrentEntry(newEntry)
    setIsTracking(true)
    setElapsedTime(0)
    toast.success('Time tracking started')
  }

  const pauseTimer = () => {
    if (currentEntry) {
      const now = new Date()
      const duration = Math.floor((now.getTime() - currentEntry.startTime.getTime()) / 60000)
      
      const updatedEntry: TimeEntry = {
        ...currentEntry,
        endTime: now,
        duration,
        isActive: false
      }

      setTimeEntries(prev => [...prev, updatedEntry])
      onTimeLogged(updatedEntry)
      setCurrentEntry(null)
      setIsTracking(false)
      toast.success(`Time logged: ${formatDuration(duration)}`)
    }
  }

  const stopTimer = () => {
    if (currentEntry) {
      pauseTimer()
    }
    setDescription('')
    setElapsedTime(0)
  }

  const logManualTime = () => {
    const totalMinutes = (manualTime.hours * 60) + manualTime.minutes

    if (totalMinutes === 0) {
      toast.error('Please enter a valid time duration')
      return
    }

    if (!description.trim()) {
      toast.error('Please enter a description for the time entry')
      return
    }

    const now = new Date()
    const startTime = new Date(now.getTime() - (totalMinutes * 60000))

    const manualEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId,
      description: description.trim(),
      startTime,
      endTime: now,
      duration: totalMinutes,
      isActive: false,
      category
    }

    setTimeEntries(prev => [...prev, manualEntry])
    onTimeLogged(manualEntry)
    setDescription('')
    setManualTime({ hours: 0, minutes: 0 })
    toast.success(`Manual time logged: ${formatDuration(totalMinutes)}`)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours === 0) {
      return `${mins}m`
    }
    
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getTotalTime = () => {
    const total = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) + elapsedTime
    return formatDuration(total)
  }

  const getTodayTime = () => {
    const today = new Date().toDateString()
    const todayEntries = timeEntries.filter(entry => 
      entry.startTime.toDateString() === today
    )
    const total = todayEntries.reduce((sum, entry) => sum + entry.duration, 0) + elapsedTime
    return formatDuration(total)
  }

  const getCategoryColor = (cat: TimeEntry['category']) => {
    switch (cat) {
      case 'development': return 'bg-blue-100 text-blue-800'
      case 'testing': return 'bg-green-100 text-green-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'meeting': return 'bg-yellow-100 text-yellow-800'
      case 'research': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Timer className="w-5 h-5" />
            <span>Time Tracker - {taskTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Timer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Active Timer</span>
                </div>
                <div className="text-2xl font-mono">
                  {formatDuration(elapsedTime)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isTracking ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="What are you working on?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TimeEntry['category'])}
                    >
                      <option value="development">Development</option>
                      <option value="testing">Testing</option>
                      <option value="review">Code Review</option>
                      <option value="meeting">Meeting</option>
                      <option value="research">Research</option>
                    </select>
                  </div>
                  <Button onClick={startTimer} className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Start Timer
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Currently tracking:</span>
                    </div>
                    <p className="text-green-600 mt-1">{currentEntry?.description}</p>
                    <Badge className={`mt-2 ${getCategoryColor(currentEntry?.category || 'development')}`}>
                      {currentEntry?.category}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={pauseTimer} className="flex-1">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause & Log
                    </Button>
                    <Button variant="outline" onClick={stopTimer} className="flex-1">
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Time Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Log Manual Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hours</Label>
                  <Input
                    type="number"
                    min="0"
                    max="24"
                    value={manualTime.hours}
                    onChange={(e) => setManualTime(prev => ({ 
                      ...prev, 
                      hours: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minutes</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={manualTime.minutes}
                    onChange={(e) => setManualTime(prev => ({ 
                      ...prev, 
                      minutes: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the work you completed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TimeEntry['category'])}
                >
                  <option value="development">Development</option>
                  <option value="testing">Testing</option>
                  <option value="review">Code Review</option>
                  <option value="meeting">Meeting</option>
                  <option value="research">Research</option>
                </select>
              </div>
              <Button onClick={logManualTime} variant="outline" className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Log Time
              </Button>
            </CardContent>
          </Card>

          {/* Time Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">{getTotalTime()}</div>
                  <div className="text-sm text-muted-foreground">Total Time</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="w-8 h-8 mx-auto text-green-500 mb-2" />
                  <div className="text-2xl font-bold">{getTodayTime()}</div>
                  <div className="text-sm text-muted-foreground">Today</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                  <div className="text-2xl font-bold">{timeEntries.length}</div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Entries History */}
          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timeEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Timer className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No time entries yet</p>
                    <p className="text-sm">Start tracking time to see your work log</p>
                  </div>
                ) : (
                  timeEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={`text-xs ${getCategoryColor(entry.category)}`}>
                            {entry.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {entry.startTime.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm font-medium">{entry.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(entry.startTime)} - {entry.endTime ? formatTime(entry.endTime) : 'In Progress'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{formatDuration(entry.duration)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}