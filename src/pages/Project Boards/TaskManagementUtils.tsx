import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Separator } from '../../components/ui/separator'
import { Switch } from '../../components/ui/switch'
import { Progress } from '../../components/ui/progress'
import { 
  Copy,
  Split,
  Merge,
  GitBranch,
  Target,
  Users,
  Calendar,
  Clock,
  Tag,
  FileText,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Archive,
  Trash2,
  Edit,
  Plus,
  X,
  Move,
  Link,
  Zap
} from 'lucide-react'
import { BOARD_TASKS, PROJECTS, SPRINTS, TEAM_MEMBERS } from '../../mock-data/tasks'
import { toast } from 'sonner@2.0.3'

interface TaskTemplate {
  id: string
  name: string
  description: string
  type: 'task' | 'story' | 'bug' | 'epic'
  category: string
  estimatedHours: number
  storyPoints: number
  labels: string[]
  acceptanceCriteria: string[]
  subtasks: string[]
}

interface BulkAction {
  type: 'update_status' | 'assign' | 'move_sprint' | 'add_labels' | 'delete'
  value?: string
  selectedTasks: string[]
}

interface TaskManagementUtilsProps {
  selectedTasks: string[]
  onBulkAction: (action: BulkAction) => void
  onTaskClone: (taskId: string) => void
  onTaskSplit: (taskId: string, subtasks: string[]) => void
  onTaskMerge: (taskIds: string[], newTaskData: any) => void
}

export function TaskManagementUtils({
  selectedTasks,
  onBulkAction,
  onTaskClone,
  onTaskSplit,
  onTaskMerge
}: TaskManagementUtilsProps) {
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showTaskTemplates, setShowTaskTemplates] = useState(false)
  const [showCloneDialog, setShowCloneDialog] = useState(false)
  const [showSplitDialog, setShowSplitDialog] = useState(false)
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [activeUtilTab, setActiveUtilTab] = useState('bulk')

  // Clone task state
  const [cloneData, setCloneData] = useState({
    sourceTaskId: '',
    title: '',
    assignee: '',
    project: '',
    sprint: '',
    includeSubtasks: true,
    includeAttachments: false,
    includeComments: false
  })

  // Split task state
  const [splitData, setSplitData] = useState({
    sourceTaskId: '',
    subtasks: ['', '']
  })

  // Merge tasks state
  const [mergeData, setMergeData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    project: '',
    sprint: ''
  })

  // Bulk actions state
  const [bulkActionType, setBulkActionType] = useState<BulkAction['type']>('update_status')
  const [bulkActionValue, setBulkActionValue] = useState('')

  // Task templates
  const taskTemplates: TaskTemplate[] = [
    {
      id: '1',
      name: 'Bug Fix Template',
      description: 'Standard template for bug fixes',
      type: 'bug',
      category: 'maintenance',
      estimatedHours: 4,
      storyPoints: 3,
      labels: ['bug', 'high-priority'],
      acceptanceCriteria: [
        'Bug is reproduced and root cause identified',
        'Fix is implemented and tested',
        'Regression tests pass',
        'Documentation is updated if needed'
      ],
      subtasks: [
        'Reproduce the bug',
        'Investigate root cause',
        'Implement fix',
        'Write tests',
        'Test fix'
      ]
    },
    {
      id: '2',
      name: 'Feature Development',
      description: 'Template for new feature development',
      type: 'story',
      category: 'feature',
      estimatedHours: 16,
      storyPoints: 8,
      labels: ['feature', 'frontend'],
      acceptanceCriteria: [
        'Feature requirements are clearly defined',
        'UI/UX designs are approved',
        'Feature is implemented according to specs',
        'Unit and integration tests are written',
        'Feature is tested by QA'
      ],
      subtasks: [
        'Review requirements',
        'Create technical design',
        'Implement backend API',
        'Implement frontend UI',
        'Write tests',
        'QA testing'
      ]
    },
    {
      id: '3',
      name: 'Code Review Task',
      description: 'Template for code review tasks',
      type: 'task',
      category: 'review',
      estimatedHours: 2,
      storyPoints: 1,
      labels: ['review', 'quality'],
      acceptanceCriteria: [
        'Code follows team standards',
        'Security considerations are addressed',
        'Performance implications are considered',
        'Tests are adequate and passing'
      ],
      subtasks: [
        'Review code changes',
        'Check test coverage',
        'Verify documentation',
        'Approve or request changes'
      ]
    }
  ]

  const handleBulkAction = () => {
    if (selectedTasks.length === 0) {
      toast.error('Please select tasks to perform bulk actions')
      return
    }

    const action: BulkAction = {
      type: bulkActionType,
      value: bulkActionValue,
      selectedTasks
    }

    onBulkAction(action)
    setShowBulkActions(false)
    toast.success(`Bulk action applied to ${selectedTasks.length} tasks`)
  }

  const handleCloneTask = () => {
    if (!cloneData.sourceTaskId || !cloneData.title) {
      toast.error('Please select a source task and provide a title')
      return
    }

    onTaskClone(cloneData.sourceTaskId)
    setShowCloneDialog(false)
    setCloneData({
      sourceTaskId: '',
      title: '',
      assignee: '',
      project: '',
      sprint: '',
      includeSubtasks: true,
      includeAttachments: false,
      includeComments: false
    })
    toast.success('Task cloned successfully')
  }

  const handleSplitTask = () => {
    const validSubtasks = splitData.subtasks.filter(task => task.trim())
    
    if (!splitData.sourceTaskId || validSubtasks.length < 2) {
      toast.error('Please select a source task and provide at least 2 subtasks')
      return
    }

    onTaskSplit(splitData.sourceTaskId, validSubtasks)
    setShowSplitDialog(false)
    setSplitData({
      sourceTaskId: '',
      subtasks: ['', '']
    })
    toast.success('Task split into subtasks successfully')
  }

  const handleMergeTasks = () => {
    if (selectedTasks.length < 2 || !mergeData.title) {
      toast.error('Please select at least 2 tasks and provide a title')
      return
    }

    onTaskMerge(selectedTasks, mergeData)
    setShowMergeDialog(false)
    setMergeData({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      project: '',
      sprint: ''
    })
    toast.success('Tasks merged successfully')
  }

  const addSubtask = () => {
    setSplitData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, '']
    }))
  }

  const updateSubtask = (index: number, value: string) => {
    setSplitData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((task, i) => i === index ? value : task)
    }))
  }

  const removeSubtask = (index: number) => {
    setSplitData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-4">
      {/* Quick Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {selectedTasks.length} selected
              </Badge>
              <span className="text-sm text-muted-foreground">
                Choose an action to perform on selected tasks
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowBulkActions(true)}
                disabled={selectedTasks.length === 0}
              >
                <Target className="w-4 h-4 mr-1" />
                Bulk Actions
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCloneDialog(true)}
              >
                <Copy className="w-4 h-4 mr-1" />
                Clone
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSplitDialog(true)}
              >
                <Split className="w-4 h-4 mr-1" />
                Split
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMergeDialog(true)}
                disabled={selectedTasks.length < 2}
              >
                <Merge className="w-4 h-4 mr-1" />
                Merge
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTaskTemplates(true)}
              >
                <FileText className="w-4 h-4 mr-1" />
                Templates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Apply changes to {selectedTasks.length} selected tasks
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select value={bulkActionType} onValueChange={(value: BulkAction['type']) => setBulkActionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="update_status">Update Status</SelectItem>
                  <SelectItem value="assign">Assign to User</SelectItem>
                  <SelectItem value="move_sprint">Move to Sprint</SelectItem>
                  <SelectItem value="add_labels">Add Labels</SelectItem>
                  <SelectItem value="delete">Delete Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bulkActionType === 'update_status' && (
              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={bulkActionValue} onValueChange={setBulkActionValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
              </div>
            )}

            {bulkActionType === 'assign' && (
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={bulkActionValue} onValueChange={setBulkActionValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_MEMBERS.slice(1).map(member => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {bulkActionType === 'move_sprint' && (
              <div className="space-y-2">
                <Label>Sprint</Label>
                <Select value={bulkActionValue} onValueChange={setBulkActionValue}>
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
            )}

            {bulkActionType === 'add_labels' && (
              <div className="space-y-2">
                <Label>Labels (comma-separated)</Label>
                <Input
                  placeholder="e.g., urgent, frontend, review"
                  value={bulkActionValue}
                  onChange={(e) => setBulkActionValue(e.target.value)}
                />
              </div>
            )}

            {bulkActionType === 'delete' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Warning</span>
                </div>
                <p className="text-red-600 mt-1">
                  This will permanently delete {selectedTasks.length} tasks. This action cannot be undone.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowBulkActions(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleBulkAction}
                variant={bulkActionType === 'delete' ? 'destructive' : 'default'}
              >
                Apply Action
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clone Task Dialog */}
      <Dialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Clone Task</DialogTitle>
            <DialogDescription>
              Create a copy of an existing task with customizable options
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Source Task</Label>
              <Select value={cloneData.sourceTaskId} onValueChange={(value) => setCloneData(prev => ({ ...prev, sourceTaskId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task to clone" />
                </SelectTrigger>
                <SelectContent>
                  {BOARD_TASKS.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.id} - {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>New Task Title</Label>
              <Input
                placeholder="Enter title for cloned task"
                value={cloneData.title}
                onChange={(e) => setCloneData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={cloneData.assignee} onValueChange={(value) => setCloneData(prev => ({ ...prev, assignee: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_MEMBERS.slice(1).map(member => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Project</Label>
                <Select value={cloneData.project} onValueChange={(value) => setCloneData(prev => ({ ...prev, project: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECTS.slice(1).map(project => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Clone Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={cloneData.includeSubtasks}
                    onCheckedChange={(checked) => setCloneData(prev => ({ ...prev, includeSubtasks: checked }))}
                  />
                  <Label>Include subtasks</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={cloneData.includeAttachments}
                    onCheckedChange={(checked) => setCloneData(prev => ({ ...prev, includeAttachments: checked }))}
                  />
                  <Label>Include attachments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={cloneData.includeComments}
                    onCheckedChange={(checked) => setCloneData(prev => ({ ...prev, includeComments: checked }))}
                  />
                  <Label>Include comments</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCloneDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCloneTask}>
                Clone Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Split Task Dialog */}
      <Dialog open={showSplitDialog} onOpenChange={setShowSplitDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Split Task</DialogTitle>
            <DialogDescription>
              Break down a large task into smaller, manageable subtasks
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Source Task</Label>
              <Select value={splitData.sourceTaskId} onValueChange={(value) => setSplitData(prev => ({ ...prev, sourceTaskId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task to split" />
                </SelectTrigger>
                <SelectContent>
                  {BOARD_TASKS.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.id} - {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Subtasks</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSubtask}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Subtask
                </Button>
              </div>
              <div className="space-y-2">
                {splitData.subtasks.map((subtask, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      placeholder={`Subtask ${index + 1}`}
                      value={subtask}
                      onChange={(e) => updateSubtask(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSubtask(index)}
                      disabled={splitData.subtasks.length <= 2}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowSplitDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSplitTask}>
                Split Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Merge Tasks Dialog */}
      <Dialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Merge Tasks</DialogTitle>
            <DialogDescription>
              Combine {selectedTasks.length} selected tasks into a single task
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Merged Task Title</Label>
              <Input
                placeholder="Enter title for merged task"
                value={mergeData.title}
                onChange={(e) => setMergeData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the merged task"
                value={mergeData.description}
                onChange={(e) => setMergeData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={mergeData.assignee} onValueChange={(value) => setMergeData(prev => ({ ...prev, assignee: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_MEMBERS.slice(1).map(member => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={mergeData.priority} onValueChange={(value) => setMergeData(prev => ({ ...prev, priority: value }))}>
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
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowMergeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleMergeTasks}>
                Merge Tasks
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Templates Dialog */}
      <Dialog open={showTaskTemplates} onOpenChange={setShowTaskTemplates}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task Templates</DialogTitle>
            <DialogDescription>
              Use predefined templates to quickly create standardized tasks
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taskTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="text-2xl">
                      {template.type === 'bug' ? '🐛' : 
                       template.type === 'story' ? '📖' : 
                       template.type === 'epic' ? '🎯' : '⚙️'}
                    </div>
                    <span className="text-base">{template.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{template.category}</Badge>
                    <Badge variant="outline">{template.storyPoints} SP</Badge>
                    <Badge variant="outline">{template.estimatedHours}h</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium">Labels:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.labels.map((label) => (
                        <Badge key={label} variant="secondary" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium">Includes:</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• {template.acceptanceCriteria.length} acceptance criteria</li>
                      <li>• {template.subtasks.length} predefined subtasks</li>
                    </ul>
                  </div>

                  <Button size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}