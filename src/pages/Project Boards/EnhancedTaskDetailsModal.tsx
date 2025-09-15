import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { Calendar } from '../../components/ui/calendar'
import { 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Paperclip, 
  Edit, 
  Save, 
  X, 
  Clock,
  User,
  Flag,
  Tag,
  GitBranch,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Copy,
  Trash2,
  Eye,
  Share2,
  Download,
  Upload,
  Play,
  Pause,
  Timer,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Link,
  Plus,
  Target,
  Zap,
  Archive
} from 'lucide-react'
import { BOARD_TASKS, PROJECTS, SPRINTS, TEAM_MEMBERS } from '../../mock-data/tasks'
import { toast } from 'sonner@2.0.3'

interface EnhancedTaskDetailsModalProps {
  taskId: string
  isOpen: boolean
  onClose: () => void
  onUpdate: (taskId: string, updates: any) => void
  onDelete?: (taskId: string) => void
}

export function EnhancedTaskDetailsModal({ taskId, isOpen, onClose, onUpdate, onDelete }: EnhancedTaskDetailsModalProps) {
  const task = BOARD_TASKS.find(t => t.id === taskId)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task || {})
  const [activeTab, setActiveTab] = useState('overview')
  const [newComment, setNewComment] = useState('')
  const [isTimeTracking, setIsTimeTracking] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  )

  if (!task) return null

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
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'done'
  }

  const calculateProgress = () => {
    // Mock progress calculation based on status
    switch (task.status) {
      case 'backlog': return 0
      case 'todo': return 10
      case 'in_progress': return 45
      case 'in_review': return 75
      case 'testing': return 90
      case 'done': return 100
      default: return 0
    }
  }

  const handleSave = () => {
    const updates = {
      ...editedTask,
      dueDate: selectedDate?.toISOString().split('T')[0] || editedTask.dueDate
    }
    onUpdate(taskId, updates)
    setIsEditing(false)
    toast.success('Task updated successfully')
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      onDelete?.(taskId)
      onClose()
      toast.success('Task deleted successfully')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/tasks/${taskId}`)
    toast.success('Task link copied to clipboard')
  }

  const handleTimeTrackingToggle = () => {
    if (isTimeTracking) {
      setTimeSpent(prev => prev + 1)
      toast.success('Time tracking stopped')
    } else {
      toast.success('Time tracking started')
    }
    setIsTimeTracking(!isTimeTracking)
  }

  const handlePostComment = () => {
    if (newComment.trim()) {
      toast.success('Comment posted')
      setNewComment('')
    }
  }

  // Mock data
  const comments = [
    {
      id: 1,
      author: 'Rajesh Kumar',
      content: 'Started working on the OAuth implementation. Looking into Google and GitHub APIs first.',
      timestamp: '2025-01-20 10:30',
      avatar: 'RK',
      reactions: [{ emoji: '👍', count: 2 }, { emoji: '🎉', count: 1 }]
    },
    {
      id: 2,
      author: 'Sarah Wilson',
      content: 'Make sure to implement proper error handling for failed authentication attempts.',
      timestamp: '2025-01-20 14:15',
      avatar: 'SW',
      reactions: [{ emoji: '👍', count: 1 }]
    },
    {
      id: 3,
      author: 'Mike Johnson',
      content: 'Will help with the security review once the initial implementation is ready.',
      timestamp: '2025-01-21 09:00',
      avatar: 'MJ',
      reactions: []
    }
  ]

  const attachments = [
    { id: 1, name: 'oauth_flow_diagram.png', size: '245 KB', type: 'image', uploadedBy: 'Rajesh Kumar', uploadedAt: '2025-01-20' },
    { id: 2, name: 'api_requirements.pdf', size: '1.2 MB', type: 'document', uploadedBy: 'Sarah Wilson', uploadedAt: '2025-01-19' },
    { id: 3, name: 'security_checklist.md', size: '12 KB', type: 'document', uploadedBy: 'Mike Johnson', uploadedAt: '2025-01-18' }
  ]

  const worklog = [
    { id: 1, user: 'Rajesh Kumar', description: 'Research OAuth providers', timeSpent: '2h 30m', date: '2025-01-20' },
    { id: 2, user: 'Rajesh Kumar', description: 'Setup Google OAuth integration', timeSpent: '4h 15m', date: '2025-01-21' },
    { id: 3, user: 'Sarah Wilson', description: 'Code review and testing', timeSpent: '1h 45m', date: '2025-01-22' }
  ]

  const relatedTasks = [
    { id: 'TASK-045', title: 'User Registration System', status: 'done', relation: 'blocks' },
    { id: 'TASK-024', title: 'Analytics Dashboard Widgets', status: 'in_progress', relation: 'related' },
    { id: 'TASK-012', title: 'Payment Gateway Integration', status: 'backlog', relation: 'blocked_by' }
  ]

  const activityLog = [
    { id: 1, action: 'Status changed from Todo to In Progress', user: 'Rajesh Kumar', timestamp: '2 hours ago' },
    { id: 2, action: 'Assignee changed to Rajesh Kumar', user: 'Sarah Wilson', timestamp: '1 day ago' },
    { id: 3, action: 'Priority changed to High', user: 'Mike Johnson', timestamp: '2 days ago' },
    { id: 4, action: 'Task created', user: 'Sarah Wilson', timestamp: '3 days ago' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground font-mono">{task.id}</span>
                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                  {formatStatus(task.status)}
                </Badge>
                {isOverdue(task.dueDate, task.status) && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>
              {isEditing ? (
                <Input
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-lg font-semibold"
                />
              ) : (
                <DialogTitle className="text-lg font-semibold pr-8">{task.title}</DialogTitle>
              )}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Progress: {calculateProgress()}%</span>
                <span>Story Points: {task.storyPoints}</span>
                <span>Time Spent: {timeSpent}h</span>
                {isTimeTracking && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Timer className="w-3 h-3" />
                    <span>Tracking</span>
                  </div>
                )}
              </div>
              <Progress value={calculateProgress()} className="w-full h-2" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={handleTimeTrackingToggle}>
                {isTimeTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                <Link className="w-4 h-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleCopyLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                    <Separator />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-red-600 hover:text-red-600"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
            <TabsTrigger value="attachments">Files ({attachments.length})</TabsTrigger>
            <TabsTrigger value="worklog">Work Log</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editedTask.description}
                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" size="sm" className="justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Comment
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Mention
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Link className="w-4 h-4 mr-2" />
                        Link Issue
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Performance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{calculateProgress()}%</div>
                        <div className="text-sm text-muted-foreground">Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{timeSpent}h</div>
                        <div className="text-sm text-muted-foreground">Time Spent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{task.storyPoints}</div>
                        <div className="text-sm text-muted-foreground">Story Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{comments.length}</div>
                        <div className="text-sm text-muted-foreground">Comments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Task Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Task Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Assignee */}
                    <div>
                      <Label className="text-sm font-medium flex items-center mb-2">
                        <User className="w-4 h-4 mr-2" />
                        Assignee
                      </Label>
                      {isEditing ? (
                        <Select 
                          value={editedTask.assignee} 
                          onValueChange={(value) => setEditedTask({ ...editedTask, assignee: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TEAM_MEMBERS.slice(1).map((member) => (
                              <SelectItem key={member} value={member}>
                                {member}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                              {getAvatarInitials(task.assignee)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignee}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Status */}
                    <div>
                      <Label className="text-sm font-medium flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Status
                      </Label>
                      {isEditing ? (
                        <Select 
                          value={editedTask.status} 
                          onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="backlog">Backlog</SelectItem>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="testing">Testing</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={`${getStatusColor(task.status)}`}>
                          {formatStatus(task.status)}
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    {/* Priority */}
                    <div>
                      <Label className="text-sm font-medium flex items-center mb-2">
                        <Flag className="w-4 h-4 mr-2" />
                        Priority
                      </Label>
                      {isEditing ? (
                        <Select 
                          value={editedTask.priority} 
                          onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={`${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    {/* Due Date */}
                    <div>
                      <Label className="text-sm font-medium flex items-center mb-2">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Due Date
                      </Label>
                      {isEditing ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <div className={`text-sm ${
                          isOverdue(task.dueDate, task.status) ? 'text-red-600 dark:text-red-400' : ''
                        }`}>
                          {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate, task.status) && (
                            <div className="flex items-center space-x-1 mt-1">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="font-medium">Overdue</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Project & Sprint */}
                    <div>
                      <Label className="text-sm font-medium flex items-center mb-2">
                        <GitBranch className="w-4 h-4 mr-2" />
                        Project & Sprint
                      </Label>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Project:</span>
                          <div className="font-medium">{task.project}</div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Sprint:</span>
                          <div className="font-medium">{task.sprint}</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Labels */}
                    <div>
                      <Label className="text-sm font-medium flex items-center mb-2">
                        <Tag className="w-4 h-4 mr-2" />
                        Labels
                      </Label>
                      <div className="flex flex-wrap gap-1">
                        {task.labels.map((label) => (
                          <Badge key={label} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                          {comment.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        <div className="flex items-center space-x-2">
                          {comment.reactions.map((reaction, index) => (
                            <Button key={index} variant="ghost" size="sm" className="h-6 px-2">
                              <span className="text-xs">{reaction.emoji} {reaction.count}</span>
                            </Button>
                          ))}
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            React
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                      YU
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea 
                      placeholder="Add a comment..." 
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Users className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button size="sm" onClick={handlePostComment}>
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="space-y-4">
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <Card key={attachment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{attachment.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {attachment.size} • Uploaded by {attachment.uploadedBy} on {attachment.uploadedAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or</p>
                  <Button variant="outline">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Work Log Tab */}
          <TabsContent value="worklog" className="space-y-4">
            <div className="space-y-3">
              {worklog.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{entry.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.user} • {entry.date}
                        </div>
                      </div>
                      <Badge variant="outline">{entry.timeSpent}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-4 h-4" />
                    <span className="text-sm font-medium">Log Time</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Time spent (e.g., 2h 30m)" />
                    <Input placeholder="Description" />
                  </div>
                  <Button size="sm">Log Time</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Related Tab */}
          <TabsContent value="related" className="space-y-4">
            <div className="space-y-3">
              {relatedTasks.map((relatedTask) => (
                <Card key={relatedTask.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {relatedTask.relation}
                          </Badge>
                          <span className="text-sm font-mono">{relatedTask.id}</span>
                        </div>
                        <span className="text-sm">{relatedTask.title}</span>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(relatedTask.status)}`}>
                        {formatStatus(relatedTask.status)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Link Related Task
            </Button>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-4">
              {activityLog.map((activity) => (
                <div key={activity.id} className="flex space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {activity.timestamp} by {activity.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}