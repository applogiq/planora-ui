import { useState, useEffect } from 'react'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { Label } from '../../../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'
import {
  CalendarIcon,
  X,
  Plus,
  Edit,
  Save,
  User,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Tag
} from 'lucide-react'
import { epicApiService, Epic } from '../../../../services/epicApi'
import { ProjectStatusItem, ProjectPriorityItem } from '../../../../services/projectApi'
import { toast } from 'sonner'

interface EpicViewEditModalProps {
  epic: Epic
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  user: any
  teamMembers?: any[]
  availableStatuses?: ProjectStatusItem[]
  availablePriorities?: ProjectPriorityItem[]
}

export function EpicViewEditModal({
  epic,
  isOpen,
  onClose,
  onSuccess,
  user,
  teamMembers = [],
  availableStatuses,
  availablePriorities
}: EpicViewEditModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  // Helper function to safely get epic values
  const getSafeEpicValue = (value: any, defaultValue: any) => {
    if (value === null || value === undefined || value === '') {
      return defaultValue
    }
    return value
  }

  const [formData, setFormData] = useState({
    title: getSafeEpicValue(epic.title, ''),
    description: getSafeEpicValue(epic.description, ''),
    priority: getSafeEpicValue(epic.priority, 'Medium'),
    status: getSafeEpicValue(epic.status, 'Not Started'),
    assignee_id: getSafeEpicValue(epic.assignee_id, ''),
    due_date: getSafeEpicValue(epic.due_date, ''),
    total_story_points: getSafeEpicValue(epic.total_story_points, 0),
    completed_story_points: getSafeEpicValue(epic.completed_story_points, 0),
    total_tasks: getSafeEpicValue(epic.total_tasks, 0),
    completed_tasks: getSafeEpicValue(epic.completed_tasks, 0),
    labels: getSafeEpicValue(epic.labels, []),
    business_value: getSafeEpicValue(epic.business_value, '')
  })

  const [newLabel, setNewLabel] = useState('')

  useEffect(() => {
    if (epic) {
      setFormData({
        title: getSafeEpicValue(epic.title, ''),
        description: getSafeEpicValue(epic.description, ''),
        priority: getSafeEpicValue(epic.priority, 'Medium'),
        status: getSafeEpicValue(epic.status, 'Not Started'),
        assignee_id: getSafeEpicValue(epic.assignee_id, ''),
        due_date: getSafeEpicValue(epic.due_date, ''),
        total_story_points: getSafeEpicValue(epic.total_story_points, 0),
        completed_story_points: getSafeEpicValue(epic.completed_story_points, 0),
        total_tasks: getSafeEpicValue(epic.total_tasks, 0),
        completed_tasks: getSafeEpicValue(epic.completed_tasks, 0),
        labels: getSafeEpicValue(epic.labels, []),
        business_value: getSafeEpicValue(epic.business_value, '')
      })
    }
  }, [epic])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()]
      }))
      setNewLabel('')
    }
  }

  const handleRemoveLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Epic title is required')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Epic description is required')
      return
    }

    try {
      setLoading(true)
      await epicApiService.updateEpic(epic.id, formData)
      toast.success('Epic updated successfully')
      setIsEditing(false)
      onSuccess()
    } catch (error) {
      console.error('Error updating epic:', error)
      toast.error('Failed to update epic. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: getSafeEpicValue(epic.title, ''),
      description: getSafeEpicValue(epic.description, ''),
      priority: getSafeEpicValue(epic.priority, 'Medium'),
      status: getSafeEpicValue(epic.status, 'Not Started'),
      assignee_id: getSafeEpicValue(epic.assignee_id, ''),
      due_date: getSafeEpicValue(epic.due_date, ''),
      total_story_points: getSafeEpicValue(epic.total_story_points, 0),
      completed_story_points: getSafeEpicValue(epic.completed_story_points, 0),
      total_tasks: getSafeEpicValue(epic.total_tasks, 0),
      completed_tasks: getSafeEpicValue(epic.completed_tasks, 0),
      labels: getSafeEpicValue(epic.labels, []),
      business_value: getSafeEpicValue(epic.business_value, '')
    })
    setIsEditing(false)
  }

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const formatDateForDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    if (dateValue) {
      const isoDate = new Date(dateValue).toISOString()
      handleInputChange('due_date', isoDate)
    } else {
      handleInputChange('due_date', '')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'in progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'high':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Edit Epic' : 'Epic Details'}</span>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-[#28A745] hover:bg-[#218838]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit the epic details below.' : 'View and manage epic information.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <h3 className="text-lg font-semibold">{epic.title}</h3>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 min-h-[120px]"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="whitespace-pre-wrap">{epic.description}</p>
                </div>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <Select
                    value={formData.status || 'Not Started'}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStatuses && availableStatuses.length > 0 ? (
                        availableStatuses.map((status) => (
                          <SelectItem key={status.id} value={status.name}>
                            {status.name}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge variant="secondary" className={getStatusColor(epic.status)}>
                      {epic.status}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                {isEditing ? (
                  <Select
                    value={formData.priority || 'Medium'}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePriorities && availablePriorities.length > 0 ? (
                        availablePriorities.map((priority) => (
                          <SelectItem key={priority.id} value={priority.name}>
                            {priority.name}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge variant="secondary" className={getPriorityColor(epic.priority)}>
                      {epic.priority}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Assignee */}
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              {isEditing ? (
                <Select
                  value={formData.assignee_id || 'unassigned'}
                  onValueChange={(value) => handleInputChange('assignee_id', value === 'unassigned' ? '' : value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select assignee..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-[#28A745] flex items-center justify-center text-white text-xs font-medium">
                            {member.name?.charAt(0) || 'U'}
                          </div>
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  {epic.assignee_name ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-[#28A745] flex items-center justify-center text-white text-sm font-medium">
                        {epic.assignee_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium">{epic.assignee_name}</div>
                        <div className="text-sm text-gray-500">Team Member</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">Unassigned</span>
                  )}
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              {isEditing ? (
                <div className="mt-1 relative">
                  <Input
                    id="due_date"
                    type="date"
                    value={formatDateForInput(formData.due_date)}
                    onChange={handleDateChange}
                    className="pr-10"
                  />
                  <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formatDateForDisplay(epic.due_date)}</span>
                </div>
              )}
            </div>

            {/* Business Value */}
            <div>
              <Label htmlFor="business_value">Business Value</Label>
              {isEditing ? (
                <Textarea
                  id="business_value"
                  value={formData.business_value}
                  onChange={(e) => handleInputChange('business_value', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="whitespace-pre-wrap">{epic.business_value || 'No business value specified'}</p>
                </div>
              )}
            </div>

            {/* Labels */}
            <div>
              <Label htmlFor="labels">Labels</Label>
              {isEditing ? (
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Add a label"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddLabel()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddLabel}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.labels.map((label, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {label}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => handleRemoveLabel(label)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1">
                  {epic.labels.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {epic.labels.map((label, index) => (
                        <Badge key={index} variant="secondary">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No labels</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Story Points Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Story Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Total Story Points</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.total_story_points}
                          onChange={(e) => handleInputChange('total_story_points', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Completed Story Points</Label>
                        <Input
                          type="number"
                          min="0"
                          max={formData.total_story_points}
                          value={formData.completed_story_points}
                          onChange={(e) => handleInputChange('completed_story_points', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{epic.completed_story_points}/{epic.total_story_points}</span>
                        <span className="text-sm text-gray-500">
                          {epic.total_story_points > 0 ? Math.round((epic.completed_story_points / epic.total_story_points) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#28A745] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${epic.total_story_points > 0 ? (epic.completed_story_points / epic.total_story_points) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tasks Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Total Tasks</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.total_tasks}
                          onChange={(e) => handleInputChange('total_tasks', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Completed Tasks</Label>
                        <Input
                          type="number"
                          min="0"
                          max={formData.total_tasks}
                          value={formData.completed_tasks}
                          onChange={(e) => handleInputChange('completed_tasks', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{epic.completed_tasks}/{epic.total_tasks}</span>
                        <span className="text-sm text-gray-500">
                          {epic.total_tasks > 0 ? Math.round((epic.completed_tasks / epic.total_tasks) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${epic.total_tasks > 0 ? (epic.completed_tasks / epic.total_tasks) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {epic.project_name}
                    </div>
                    <div>
                      <span className="font-medium">ID:</span> {epic.project_id}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignee Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Assignee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {epic.assignee_name ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#28A745] flex items-center justify-center text-white font-medium">
                        {epic.assignee_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{epic.assignee_name}</div>
                        <div className="text-sm text-gray-500">Team Member</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No assignee</p>
                  )}
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Timestamps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {formatDateForDisplay(epic.created_at)}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {formatDateForDisplay(epic.updated_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}