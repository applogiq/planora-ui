import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Label } from '../../components/ui/label'
import { 
  Clock, 
  Calendar, 
  User, 
  Tag, 
  AlertCircle, 
  MessageSquare,
  Paperclip,
  Save,
  X
} from 'lucide-react'

interface TaskModalProps {
  task: any
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: any) => void
  user: any
}

const statusOptions = [
  { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'review', label: 'In Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-800' }
]

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
  { value: 'critical', label: 'Critical', color: 'bg-purple-100 text-purple-800' }
]

const typeOptions = [
  { value: 'story', label: 'User Story' },
  { value: 'task', label: 'Task' },
  { value: 'bug', label: 'Bug' },
  { value: 'epic', label: 'Epic' }
]

export function TaskModal({ task, isOpen, onClose, onUpdate, user }: TaskModalProps) {
  const [editedTask, setEditedTask] = useState(task)
  const [newComment, setNewComment] = useState('')

  const handleSave = () => {
    onUpdate(editedTask)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('')
    }
  }

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status)
    return option?.color || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const option = priorityOptions.find(opt => opt.value === priority)
    return option?.color || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Task Details</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={getStatusColor(editedTask.status)}>
                {editedTask.status.replace('-', ' ')}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(editedTask.priority)}>
                {editedTask.priority} priority
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedTask.description || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  placeholder="Add a description..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={editedTask.type}
                    onValueChange={(value) => setEditedTask({ ...editedTask, type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="storyPoints">Story Points</Label>
                  <Input
                    id="storyPoints"
                    type="number"
                    value={editedTask.storyPoints || 0}
                    onChange={(e) => setEditedTask({ ...editedTask, storyPoints: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Comments</span>
              </h4>

              {/* Add Comment */}
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-[80px]"
                />
                <Button onClick={handleAddComment} size="sm">
                  Add Comment
                </Button>
              </div>

              {/* Existing Comments */}
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#28A745] text-white text-xs">
                        AJ
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Alice Johnson</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm">Started working on the OAuth implementation. Making good progress on the Google provider integration.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedTask.status}
                  onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`}></div>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-3 h-3" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignment */}
            <div className="space-y-2">
              <Label>Assignee</Label>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-[#28A745] text-white text-xs">
                    {editedTask.assignee?.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{editedTask.assignee?.name}</span>
              </div>
            </div>

            {/* Epic */}
            <div className="space-y-2">
              <Label>Epic</Label>
              <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <span className="text-sm text-purple-700 dark:text-purple-300">{editedTask.epic}</span>
              </div>
            </div>

            {/* Time Tracking */}
            <div className="space-y-2">
              <Label>Time Tracking</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Logged:</span>
                  <span>4h 30m</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated:</span>
                  <span>8h</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-[#28A745] h-2 rounded-full" style={{ width: '56%' }}></div>
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="space-y-2">
              <Label>Labels</Label>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">frontend</Badge>
                <Badge variant="outline" className="text-xs">authentication</Badge>
                <Badge variant="outline" className="text-xs">security</Badge>
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Paperclip className="w-4 h-4" />
                <span>Attachments</span>
              </Label>
              <Button variant="outline" size="sm" className="w-full">
                Add Attachment
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Created 3 days ago</span>
            <span>•</span>
            <span>Updated 2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#28A745] hover:bg-[#218838]">
              <Save className="w-4 h-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}