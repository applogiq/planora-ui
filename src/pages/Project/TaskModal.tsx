import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Progress } from '../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Checkbox } from '../../components/ui/checkbox'
import { Label } from '../../components/ui/label'
import { Separator } from '../../components/ui/separator'
import { Calendar } from '../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { format } from 'date-fns'
import { 
  X,
  Save,
  Edit,
  Calendar as CalendarIcon,
  User,
  Flag,
  Clock,
  Tag,
  Paperclip,
  Plus,
  Trash2,
  MessageSquare,
  CheckCircle,
  Link,
  Upload,
  Eye,
  MoreHorizontal,
  Timer,
  BarChart3,
  Hash,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: any
  mode: 'create' | 'edit' | 'view'
  project: any
  teamMembers?: any[]
  onSave: (taskData: any) => void
}

export function TaskModal({ isOpen, onClose, task, mode, project, teamMembers = [], onSave }: TaskModalProps) {
  const [activeTab, setActiveTab] = useState('details')
  const [isEditing, setIsEditing] = useState(mode !== 'view')
  const [taskData, setTaskData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'To Do',
    priority: task?.priority || 'Medium',
    assignee_id: task?.assignee?.id || task?.assignee_id || '',
    startDate: task?.startDate ? new Date(task.startDate) : undefined,
    dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
    tags: task?.tags || [],
    progress: task?.progress || 0,
    timeTracked: task?.timeTracked || '0h',
    recurring: false,
    dependencies: task?.dependencies || []
  })
  const [newTag, setNewTag] = useState('')
  const [newComment, setNewComment] = useState('')
  const [newSubtask, setNewSubtask] = useState('')
  const [subtasks, setSubtasks] = useState(task?.subtasks || [])
  const [comments, setComments] = useState(task?.comments || [])
  const [attachments, setAttachments] = useState(task?.attachments || [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-[#DC3545] text-white'
      case 'Medium': return 'bg-[#FFC107] text-white'
      case 'Low': return 'bg-[#28A745] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-[#28A745] bg-[#28A745]/10'
      case 'In Progress': return 'text-[#FFC107] bg-[#FFC107]/10'
      case 'To Do': return 'text-[#DC3545] bg-[#DC3545]/10'
      default: return 'text-muted-foreground bg-muted/10'
    }
  }

  const handleSave = () => {
    const saveData = {
      ...taskData,
      subtasks,
      comments,
      attachments,
      id: task?.id || `TASK-${Date.now()}`
    }
    onSave(saveData)
  }

  const addTag = () => {
    if (newTag && !taskData.tags.includes(newTag)) {
      setTaskData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTaskData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }))
  }

  const addSubtask = () => {
    if (newSubtask) {
      setSubtasks(prev => [...prev, {
        id: `ST-${Date.now()}`,
        title: newSubtask,
        completed: false
      }])
      setNewSubtask('')
    }
  }

  const toggleSubtask = (subtaskId: string) => {
    setSubtasks(prev => prev.map((st: any) => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    ))
  }

  const addComment = () => {
    if (newComment) {
      setComments(prev => [...prev, {
        id: Date.now(),
        user: 'Current User',
        text: newComment,
        timestamp: 'just now'
      }])
      setNewComment('')
    }
  }

  const modalTitle = mode === 'create' ? 'Create New Task' : 
                   mode === 'edit' ? 'Edit Task' : task?.title || 'Task Details'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[920px] max-w-[920px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{modalTitle}</DialogTitle>
              <DialogDescription>
                {mode === 'create' ? 'Create a new task for the project' :
                 mode === 'edit' ? 'Edit task details and properties' :
                 'View task details and manage progress'}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              {mode === 'view' && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              {isEditing && (
                <Button onClick={handleSave} className="bg-[#28A745] hover:bg-[#218838] text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto max-h-[calc(90vh-200px)] mt-4">
              <TabsContent value="details" className="space-y-6">
                {/* Basic Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Name</Label>
                    <Input
                      id="title"
                      value={taskData.title}
                      onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter task name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={taskData.description}
                      onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Subtasks */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Subtasks</Label>
                    {isEditing && (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          placeholder="Add subtask"
                          className="w-48"
                        />
                        <Button size="sm" onClick={addSubtask}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {subtasks.map((subtask: any) => (
                      <div key={subtask.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() => toggleSubtask(subtask.id)}
                          disabled={!isEditing}
                        />
                        <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Comments */}
                <div>
                  <Label className="mb-4 block">Comments</Label>
                  <div className="space-y-3 mb-4">
                    {comments.map((comment: any) => (
                      <div key={comment.id} className="flex space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#007BFF] text-white text-xs">
                            {comment.user.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={2}
                        className="flex-1"
                      />
                      <Button onClick={addComment}>
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Attachments */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Attachments</Label>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {attachments.map((attachment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground">({attachment.size})</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {isEditing && (
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="properties" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label>Assignee</Label>
                      <Select
                        value={taskData.assignee_id || "unassigned"}
                        onValueChange={(value: string) => setTaskData(prev => ({ ...prev, assignee_id: value === "unassigned" ? "" : value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">
                            <span className="text-gray-500">No assignee</span>
                          </SelectItem>
                          {teamMembers.map((member: any) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                                    {member.avatar || member.name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{member.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Status</Label>
                      <Select 
                        value={taskData.status} 
                        onValueChange={(value) => setTaskData(prev => ({ ...prev, status: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To Do">To Do</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Priority</Label>
                      <Select 
                        value={taskData.priority} 
                        onValueChange={(value) => setTaskData(prev => ({ ...prev, priority: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Progress</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Progress value={taskData.progress} className="flex-1" />
                          <span className="text-sm font-medium w-12">{taskData.progress}%</span>
                        </div>
                        {isEditing && (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={taskData.progress}
                            onChange={(e) => setTaskData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            disabled={!isEditing}
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {taskData.startDate ? format(taskData.startDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={taskData.startDate}
                            onSelect={(date) => setTaskData(prev => ({ ...prev, startDate: date }))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            disabled={!isEditing}
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {taskData.dueDate ? format(taskData.dueDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={taskData.dueDate}
                            onSelect={(date) => setTaskData(prev => ({ ...prev, dueDate: date }))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {taskData.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="flex items-center space-x-1">
                              <span>{tag}</span>
                              {isEditing && (
                                <button onClick={() => removeTag(tag)}>
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                        {isEditing && (
                          <div className="flex space-x-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add tag"
                              onKeyPress={(e) => e.key === 'Enter' && addTag()}
                            />
                            <Button size="sm" onClick={addTag}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Time Tracked</Label>
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{taskData.timeTracked}</span>
                        {isEditing && (
                          <Button variant="outline" size="sm">
                            <Timer className="w-4 h-4 mr-2" />
                            Start Timer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-3">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="flex space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[#007BFF] text-white text-xs">
                          {comment.user.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{comment.user}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Activity log items */}
                  <div className="flex space-x-3 p-3 bg-muted/20 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#28A745] flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">System</span>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                      <p className="text-sm">Task created by {typeof project.owner === 'object' ? project.owner?.name || 'Unknown' : project.owner}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}