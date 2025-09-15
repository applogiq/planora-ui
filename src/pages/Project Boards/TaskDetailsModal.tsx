import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Separator } from '../../components/ui/separator'
import { 
  Calendar, 
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
  AlertTriangle
} from 'lucide-react'
import { BOARD_TASKS, PROJECTS, SPRINTS, TEAM_MEMBERS } from '../../mock-data/tasks'

interface TaskDetailsModalProps {
  taskId: string
  isOpen: boolean
  onClose: () => void
  onUpdate: (taskId: string, updates: any) => void
}

export function TaskDetailsModal({ taskId, isOpen, onClose, onUpdate }: TaskDetailsModalProps) {
  const task = BOARD_TASKS.find(t => t.id === taskId)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task || {})

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

  const handleSave = () => {
    onUpdate(taskId, editedTask)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
  }

  // Mock comments data
  const comments = [
    {
      id: 1,
      author: 'Rajesh Kumar',
      content: 'Started working on the OAuth implementation. Looking into Google and GitHub APIs first.',
      timestamp: '2025-01-20 10:30',
      avatar: 'RK'
    },
    {
      id: 2,
      author: 'Sarah Wilson',
      content: 'Make sure to implement proper error handling for failed authentication attempts.',
      timestamp: '2025-01-20 14:15',
      avatar: 'SW'
    },
    {
      id: 3,
      author: 'Mike Johnson',
      content: 'Will help with the security review once the initial implementation is ready.',
      timestamp: '2025-01-21 09:00',
      avatar: 'MJ'
    }
  ]

  const attachments = [
    { id: 1, name: 'oauth_flow_diagram.png', size: '245 KB', type: 'image' },
    { id: 2, name: 'api_requirements.pdf', size: '1.2 MB', type: 'document' },
    { id: 3, name: 'security_checklist.md', size: '12 KB', type: 'document' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground font-mono">{task.id}</span>
                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                  {formatStatus(task.status)}
                </Badge>
              </div>
              {isEditing ? (
                <Input
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-lg font-semibold"
                />
              ) : (
                <DialogTitle className="text-lg font-semibold">{task.title}</DialogTitle>
              )}
            </div>
            <div className="flex items-center space-x-2">
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

        <div className="space-y-6">
          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                {isEditing ? (
                  <Textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Activity Tabs */}
              <Tabs defaultValue="comments" className="w-full">
                <TabsList>
                  <TabsTrigger value="comments">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Comments ({comments.length})
                  </TabsTrigger>
                  <TabsTrigger value="attachments">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attachments ({attachments.length})
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <Clock className="w-4 h-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comments" className="space-y-4">
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                            {comment.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                        YU
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea placeholder="Add a comment..." rows={3} />
                      <div className="flex justify-end mt-2">
                        <Button size="sm">Post Comment</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attachments" className="space-y-4">
                  <div className="space-y-3">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{attachment.name}</div>
                            <div className="text-xs text-muted-foreground">{attachment.size}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Add Attachment
                  </Button>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div className="flex-1">
                        <div className="text-sm">Task moved to <Badge variant="outline">In Progress</Badge></div>
                        <div className="text-xs text-muted-foreground">2 hours ago by Rajesh Kumar</div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div className="flex-1">
                        <div className="text-sm">Assignee changed to Rajesh Kumar</div>
                        <div className="text-xs text-muted-foreground">1 day ago by Sarah Wilson</div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <div className="w-2 h-2 rounded-full bg-gray-500 mt-2"></div>
                      <div className="flex-1">
                        <div className="text-sm">Task created</div>
                        <div className="text-xs text-muted-foreground">3 days ago by Mike Johnson</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Assignee */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Assignee
                </h3>
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
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Status
                </h3>
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
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Flag className="w-4 h-4 mr-2" />
                  Priority
                </h3>
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
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Due Date
                </h3>
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
              </div>

              <Separator />

              {/* Project & Sprint */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Project & Sprint
                </h3>
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

              {/* Story Points */}
              <div>
                <h3 className="text-sm font-medium mb-3">Story Points</h3>
                <div className="text-2xl font-bold text-[#28A745]">{task.storyPoints}</div>
              </div>

              <Separator />

              {/* Labels */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Labels
                </h3>
                <div className="flex flex-wrap gap-1">
                  {task.labels.map((label) => (
                    <Badge key={label} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}