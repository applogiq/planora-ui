import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '../ui/utils'
import { format } from 'date-fns@4.1.0'
import { toast } from 'sonner@2.0.3'
import { 
  CheckSquare, 
  FolderOpen, 
  Users, 
  Calendar as CalendarIcon,
  Clock,
  Flag,
  Tag,
  X
} from 'lucide-react'

interface QuickCreateProps {
  isOpen: boolean
  onClose: () => void
  user?: any
}

const createTypes = [
  { id: 'task', label: 'Task', icon: CheckSquare, color: 'text-[#28A745]' },
  { id: 'project', label: 'Project', icon: FolderOpen, color: 'text-[#007BFF]' },
  { id: 'customer', label: 'Customer', icon: Users, color: 'text-[#FFC107]' }
]

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-[#28A745]' },
  { value: 'medium', label: 'Medium', color: 'bg-[#FFC107]' },
  { value: 'high', label: 'High', color: 'bg-[#DC3545]' }
]

const projects = [
  'Web App Redesign',
  'Mobile App Development',
  'API Integration',
  'Backend Service'
]

const assignees = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Wilson',
  'Alex Chen'
]

export function QuickCreate({ isOpen, onClose, user }: QuickCreateProps) {
  const [createType, setCreateType] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    project: '',
    assignee: '',
    dueDate: undefined as Date | undefined,
    estimatedHours: '',
    tags: [] as string[],
    customer: '',
    industry: '',
    website: '',
    contactName: '',
    contactEmail: ''
  })
  const [newTag, setNewTag] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    // Simulate creation
    toast.success(`${createTypes.find(t => t.id === createType)?.label} created successfully!`)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: '',
      project: '',
      assignee: '',
      dueDate: undefined,
      estimatedHours: '',
      tags: [],
      customer: '',
      industry: '',
      website: '',
      contactName: '',
      contactEmail: ''
    })
    setCreateType('')
    onClose()
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) })
  }

  const renderCreateTypeSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">What would you like to create?</h3>
      <div className="grid grid-cols-1 gap-3">
        {createTypes.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.id}
              onClick={() => setCreateType(type.id)}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <Icon className={`w-6 h-6 ${type.color}`} />
              <div>
                <p className="font-medium">{type.label}</p>
                <p className="text-sm text-muted-foreground">
                  {type.id === 'task' && 'Create a new task with assignee and due date'}
                  {type.id === 'project' && 'Start a new project with timeline and team'}
                  {type.id === 'customer' && 'Add a new customer to your directory'}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderTaskForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Task Title *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title..."
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the task..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <div className="flex items-center space-x-2">
                    <Flag className={`w-4 h-4 ${priority.color.replace('bg-', 'text-')}`} />
                    <span>{priority.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Project</label>
          <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Assignee</label>
          <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {assignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Estimated Hours</label>
        <Input
          type="number"
          value={formData.estimatedHours}
          onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
          placeholder="Enter estimated hours..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Tag className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-[#28A745] hover:bg-[#218838] text-white">
          Create Task
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )

  const renderProjectForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Project Name *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter project name..."
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the project..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <div className="flex items-center space-x-2">
                    <Flag className={`w-4 h-4 ${priority.color.replace('bg-', 'text-')}`} />
                    <span>{priority.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Customer</label>
          <Input
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            placeholder="Enter customer name..."
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-[#28A745] hover:bg-[#218838] text-white">
          Create Project
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )

  const renderCustomerForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Customer Name *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter customer name..."
          autoFocus
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Industry</label>
          <Input
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="e.g., Technology, Healthcare..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <Input
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Contact Name</label>
          <Input
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            placeholder="Primary contact person..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contact Email</label>
          <Input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            placeholder="contact@example.com"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-[#28A745] hover:bg-[#218838] text-white">
          Add Customer
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[920px] max-w-[920px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {!createType ? 'Quick Create' : 
             createType === 'task' ? 'Create New Task' :
             createType === 'project' ? 'Create New Project' :
             'Add New Customer'}
          </DialogTitle>
          <DialogDescription>
            {!createType ? 'Choose what you would like to create' : 
             createType === 'task' ? 'Create a new task with assignee and due date' :
             createType === 'project' ? 'Start a new project with timeline and team' :
             'Add a new customer to your directory'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!createType && renderCreateTypeSelection()}
          {createType === 'task' && renderTaskForm()}
          {createType === 'project' && renderProjectForm()}
          {createType === 'customer' && renderCustomerForm()}
        </div>

        {createType && (
          <div className="flex justify-start pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setCreateType('')}
              className="text-muted-foreground"
            >
              ← Back to selection
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}