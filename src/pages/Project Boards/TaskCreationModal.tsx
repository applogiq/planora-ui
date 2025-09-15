import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import { Switch } from '../../components/ui/switch'
import { Calendar } from '../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { 
  Calendar as CalendarIcon,
  User,
  Flag,
  Tag,
  GitBranch,
  Clock,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb,
  Paperclip,
  Users
} from 'lucide-react'
import { PROJECTS, SPRINTS, TEAM_MEMBERS } from '../../mock-data/tasks'
import { toast } from 'sonner@2.0.3'

interface TaskCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (taskData: any) => void
  initialData?: any
}

export function TaskCreationModal({ isOpen, onClose, onCreate, initialData }: TaskCreationModalProps) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    type: 'task',
    status: 'backlog',
    priority: 'medium',
    assignee: '',
    reporter: '',
    project: '',
    sprint: '',
    storyPoints: 0,
    dueDate: '',
    labels: [] as string[],
    acceptanceCriteria: [''],
    subtasks: [] as any[],
    dependencies: [] as string[],
    estimatedHours: 0,
    isBlocked: false,
    blockingReason: '',
    notifyOnUpdate: true,
    ...initialData
  })

  const [activeTab, setActiveTab] = useState('details')
  const [newLabel, setNewLabel] = useState('')
  const [newSubtask, setNewSubtask] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const taskTypes = [
    { value: 'task', label: '⚙️ Task', description: 'General development task' },
    { value: 'story', label: '📖 User Story', description: 'Feature from user perspective' },
    { value: 'bug', label: '🐛 Bug', description: 'Issue to be fixed' },
    { value: 'epic', label: '🎯 Epic', description: 'Large feature or initiative' },
    { value: 'spike', label: '🔍 Spike', description: 'Research or investigation' }
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500' }
  ]

  const statuses = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'testing', label: 'Testing' },
    { value: 'done', label: 'Done' }
  ]

  const storyPointOptions = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

  const handleCreate = () => {
    if (!taskData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    if (!taskData.assignee) {
      toast.error('Please assign the task to a team member')
      return
    }

    if (!taskData.project) {
      toast.error('Please select a project')
      return
    }

    const newTask = {
      id: `TASK-${Date.now()}`,
      ...taskData,
      dueDate: selectedDate?.toISOString().split('T')[0] || '',
      comments: 0,
      attachments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onCreate(newTask)
    toast.success(`${taskData.type === 'story' ? 'User Story' : taskData.type} created successfully`)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setTaskData({
      title: '',
      description: '',
      type: 'task',
      status: 'backlog',
      priority: 'medium',
      assignee: '',
      reporter: '',
      project: '',
      sprint: '',
      storyPoints: 0,
      dueDate: '',
      labels: [],
      acceptanceCriteria: [''],
      subtasks: [],
      dependencies: [],
      estimatedHours: 0,
      isBlocked: false,
      blockingReason: '',
      notifyOnUpdate: true
    })
    setSelectedDate(undefined)
    setActiveTab('details')
  }

  const addLabel = () => {
    if (newLabel.trim() && !taskData.labels.includes(newLabel.trim())) {
      setTaskData(prev => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()]
      }))
      setNewLabel('')
    }
  }

  const removeLabel = (label: string) => {
    setTaskData(prev => ({
      ...prev,
      labels: prev.labels.filter(l => l !== label)
    }))
  }

  const addAcceptanceCriteria = () => {
    setTaskData(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, '']
    }))
  }

  const updateAcceptanceCriteria = (index: number, value: string) => {
    setTaskData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map((criteria, i) => 
        i === index ? value : criteria
      )
    }))
  }

  const removeAcceptanceCriteria = (index: number) => {
    setTaskData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }))
  }

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setTaskData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, {
          id: Date.now(),
          title: newSubtask.trim(),
          completed: false
        }]
      }))
      setNewSubtask('')
    }
  }

  const removeSubtask = (id: number) => {
    setTaskData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(subtask => subtask.id !== id)
    }))
  }

  const getTypeIcon = (type: string) => {
    const typeObj = taskTypes.find(t => t.value === type)
    return typeObj?.label.split(' ')[0] || '⚙️'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon(taskData.type)}</span>
            <span>Create New {taskData.type === 'story' ? 'User Story' : taskData.type}</span>
          </DialogTitle>
          <DialogDescription>
            Define a new work item with all necessary details and requirements
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taskType">Task Type</Label>
                  <Select value={taskData.type} onValueChange={(value) => setTaskData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Title *</Label>
                  <Input
                    id="taskTitle"
                    placeholder={taskData.type === 'story' ? 'As a user, I want...' : 'Brief description of the task'}
                    value={taskData.title}
                    onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea
                    id="taskDescription"
                    placeholder={taskData.type === 'story' ? 
                      'As a [user type], I want [goal] so that [benefit]...' :
                      'Detailed description of what needs to be done...'
                    }
                    value={taskData.description}
                    onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={taskData.priority} onValueChange={(value) => setTaskData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map(priority => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                              <span>{priority.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={taskData.status} onValueChange={(value) => setTaskData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assignee *</Label>
                  <Select value={taskData.assignee} onValueChange={(value) => setTaskData(prev => ({ ...prev, assignee: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_MEMBERS.slice(1).map(member => (
                        <SelectItem key={member} value={member}>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{member}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reporter</Label>
                  <Select value={taskData.reporter} onValueChange={(value) => setTaskData(prev => ({ ...prev, reporter: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reporter" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_MEMBERS.slice(1).map(member => (
                        <SelectItem key={member} value={member}>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{member}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Project *</Label>
                  <Select value={taskData.project} onValueChange={(value) => setTaskData(prev => ({ ...prev, project: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECTS.slice(1).map(project => (
                        <SelectItem key={project} value={project}>
                          <div className="flex items-center space-x-2">
                            <GitBranch className="w-4 h-4" />
                            <span>{project}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sprint</Label>
                  <Select value={taskData.sprint} onValueChange={(value) => setTaskData(prev => ({ ...prev, sprint: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sprint" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPRINTS.slice(1).map(sprint => (
                        <SelectItem key={sprint} value={sprint}>
                          {sprint}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Story Points</Label>
                    <Select value={taskData.storyPoints.toString()} onValueChange={(value) => setTaskData(prev => ({ ...prev, storyPoints: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {storyPointOptions.map(points => (
                          <SelectItem key={points} value={points.toString()}>
                            {points === 0 ? 'Not Estimated' : `${points} points`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estimated Hours</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={taskData.estimatedHours}
                      onChange={(e) => setTaskData(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
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
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Labels</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add label"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addLabel()}
                    />
                    <Button type="button" size="sm" onClick={addLabel}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {taskData.labels.map((label) => (
                      <Badge key={label} variant="outline" className="flex items-center space-x-1">
                        <span>{label}</span>
                        <button onClick={() => removeLabel(label)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {(taskData.type === 'story' || taskData.type === 'epic') && (
                  <div className="space-y-2">
                    <Label>Acceptance Criteria</Label>
                    <div className="space-y-2">
                      {taskData.acceptanceCriteria.map((criteria, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder={`Acceptance criteria ${index + 1}`}
                            value={criteria}
                            onChange={(e) => updateAcceptanceCriteria(index, e.target.value)}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeAcceptanceCriteria(index)}
                            disabled={taskData.acceptanceCriteria.length === 1}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={addAcceptanceCriteria}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Criteria
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subtasks</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add subtask"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                    />
                    <Button type="button" size="sm" onClick={addSubtask}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {taskData.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{subtask.title}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeSubtask(subtask.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isBlocked"
                    checked={taskData.isBlocked}
                    onCheckedChange={(checked) => setTaskData(prev => ({ ...prev, isBlocked: checked }))}
                  />
                  <Label htmlFor="isBlocked">Task is blocked</Label>
                </div>

                {taskData.isBlocked && (
                  <div className="space-y-2">
                    <Label>Blocking Reason</Label>
                    <Textarea
                      placeholder="Explain why this task is blocked..."
                      value={taskData.blockingReason}
                      onChange={(e) => setTaskData(prev => ({ ...prev, blockingReason: e.target.value }))}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifyOnUpdate"
                    checked={taskData.notifyOnUpdate}
                    onCheckedChange={(checked) => setTaskData(prev => ({ ...prev, notifyOnUpdate: checked }))}
                  />
                  <Label htmlFor="notifyOnUpdate">Notify assignee on updates</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Task Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Type:</strong> {taskTypes.find(t => t.value === taskData.type)?.label}
                  </div>
                  <div>
                    <strong>Priority:</strong> {taskData.priority}
                  </div>
                  <div>
                    <strong>Assignee:</strong> {taskData.assignee || 'Not assigned'}
                  </div>
                  <div>
                    <strong>Project:</strong> {taskData.project || 'Not selected'}
                  </div>
                  <div>
                    <strong>Sprint:</strong> {taskData.sprint || 'Not assigned'}
                  </div>
                  <div>
                    <strong>Story Points:</strong> {taskData.storyPoints}
                  </div>
                </div>

                <Separator />

                <div>
                  <strong>Title:</strong>
                  <p className="mt-1">{taskData.title || 'No title provided'}</p>
                </div>

                {taskData.description && (
                  <div>
                    <strong>Description:</strong>
                    <p className="mt-1 text-muted-foreground">{taskData.description}</p>
                  </div>
                )}

                {taskData.labels.length > 0 && (
                  <div>
                    <strong>Labels:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {taskData.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {taskData.isBlocked && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>This task is blocked</span>
                    </div>
                    {taskData.blockingReason && (
                      <p className="text-sm text-red-600 mt-1">{taskData.blockingReason}</p>
                    )}
                  </div>
                )}

                {taskData.acceptanceCriteria.filter(Boolean).length > 0 && (
                  <div>
                    <strong>Acceptance Criteria:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {taskData.acceptanceCriteria.filter(Boolean).map((criteria, index) => (
                        <li key={index} className="text-sm">{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Task Creation Best Practices</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Write clear, actionable titles that describe the outcome</li>
                    <li>• Include acceptance criteria for user stories and features</li>
                    <li>• Estimate story points based on complexity and effort</li>
                    <li>• Add relevant labels for better organization and filtering</li>
                    <li>• Set realistic due dates and notify stakeholders</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            className="bg-[#28A745] hover:bg-[#218838] text-white"
          >
            Create {taskData.type === 'story' ? 'User Story' : taskData.type}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}