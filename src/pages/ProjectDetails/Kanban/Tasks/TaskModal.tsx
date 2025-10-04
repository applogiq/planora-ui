import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select'
import { Badge } from '../../../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar'
import { Label } from '../../../../components/ui/label'
import {
  Clock,
  Calendar,
  User,
  Tag,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Save,
  X,
  Plus
} from 'lucide-react'
import { ProjectStatusItem, ProjectPriorityItem, ProjectMemberDetail } from '../../../../services/projectApi'

interface TaskModalProps {
  task: any
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: any) => void
  user: any
  availableStatuses?: ProjectStatusItem[]
  availablePriorities?: ProjectPriorityItem[]
  projectTeamMembers?: ProjectMemberDetail[]
  projectTeamLead?: ProjectMemberDetail
  project?: any
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

export function TaskModal({ task, isOpen, onClose, onUpdate, user, availableStatuses, availablePriorities, projectTeamMembers = [], projectTeamLead, project }: TaskModalProps) {
  const [editedTask, setEditedTask] = useState(task)
  const [newComment, setNewComment] = useState('')

  // Update editedTask when task prop changes
  useEffect(() => {
    if (task) {
      // Normalize status to match the format expected by Select (lowercase-with-hyphens)
      const normalizedTask = {
        ...task,
        status: task.status ? task.status.toLowerCase().replace(/\s+/g, '-') : 'todo',
        priority: task.priority ? task.priority.toLowerCase().replace(/\s+/g, '-') : 'medium'
      }
      setEditedTask(normalizedTask)
    }
  }, [task])

  // Debug logging for project master data
  useEffect(() => {
  }, [isOpen, availableStatuses, availablePriorities, projectTeamMembers, editedTask])

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
    // Try to find color from available statuses first
    if (availableStatuses && availableStatuses.length > 0) {
      const statusItem = availableStatuses.find(s => s.name.toLowerCase() === status.toLowerCase())
      if (statusItem && statusItem.color) {
        return `bg-[${statusItem.color}] text-white`
      }
    }

    // Fallback to static colors
    const option = statusOptions.find(opt => opt.value === status)
    return option?.color || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    // Try to find color from available priorities first
    if (availablePriorities && availablePriorities.length > 0) {
      const priorityItem = availablePriorities.find(p => p.name.toLowerCase() === priority.toLowerCase())
      if (priorityItem && priorityItem.color) {
        return `bg-[${priorityItem.color}] text-white`
      }
    }

    // Fallback to static colors
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
                    value={editedTask.story_type || 'task'}
                    onValueChange={(value: string) => setEditedTask({ ...editedTask, story_type: value })}
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
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={editedTask.progress || 0}
                    onChange={(e) => setEditedTask({ ...editedTask, progress: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div>
                <Label>Acceptance Criteria</Label>
                <div className="space-y-2 mt-2">
                  {Array.isArray(editedTask.acceptance_criteria) && editedTask.acceptance_criteria.length > 0 ? (
                    editedTask.acceptance_criteria.map((criteria, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Enter acceptance criteria"
                          value={criteria}
                          onChange={(e) => {
                            const newCriteria = [...(editedTask.acceptance_criteria || [])]
                            newCriteria[index] = e.target.value
                            setEditedTask({ ...editedTask, acceptance_criteria: newCriteria })
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newCriteria = editedTask.acceptance_criteria?.filter((_, i) => i !== index) || []
                            setEditedTask({ ...editedTask, acceptance_criteria: newCriteria })
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newCriteria = [...(editedTask.acceptance_criteria || []), '']
                      setEditedTask({ ...editedTask, acceptance_criteria: newCriteria })
                    }}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Acceptance Criteria
                  </Button>
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
                  onValueChange={(value: string) => setEditedTask({ ...editedTask, status: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses && availableStatuses.length > 0 ? (
                      availableStatuses.map((status) => (
                        <SelectItem key={status.id} value={status.name.toLowerCase().replace(/\s+/g, '-')}>
                          <div className="flex items-center space-x-2">
                            {status.color && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: status.color }}
                              />
                            )}
                            <span>{status.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`}></div>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value: string) => setEditedTask({ ...editedTask, priority: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePriorities && availablePriorities.length > 0 ? (
                      availablePriorities.map((priority) => (
                        <SelectItem key={priority.id} value={priority.name.toLowerCase().replace(/\s+/g, '-')}>
                          <div className="flex items-center space-x-2">
                            {priority.color && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: priority.color }}
                              />
                            )}
                            <span>{priority.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-3 h-3" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignment */}
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={editedTask.assignee_id || 'unassigned'}
                onValueChange={(value: string) => {
                  if (value === 'unassigned') {
                    setEditedTask({
                      ...editedTask,
                      assignee_id: null,
                      assignee_name: null
                    })
                  } else {
                    const selectedMember = projectTeamMembers.find(member => member.id === value)
                    setEditedTask({
                      ...editedTask,
                      assignee_id: value,
                      assignee_name: selectedMember?.name || null
                    })
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {projectTeamMembers.length > 0 ? projectTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.role_name}
                    </SelectItem>
                  )) : (
                    <SelectItem value="loading" disabled>Loading team members...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>


            {/* Labels */}
            <div className="space-y-2">
              <Label>Labels</Label>
              <div className="flex flex-wrap gap-1">
                {editedTask.tags && editedTask.tags.length > 0 ? (
                  editedTask.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No labels</span>
                )}
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