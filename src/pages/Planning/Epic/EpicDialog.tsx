import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'
import { X, Plus, Target, Calendar } from 'lucide-react'

interface EpicDialogProps {
  open: boolean
  onClose: () => void
  epic: any
  setEpic: (epic: any) => void
  projects: any[]
  teamMembers: any[]
  onSave: () => void
  isEdit: boolean
}

export function EpicDialog({
  open,
  onClose,
  epic,
  setEpic,
  projects,
  teamMembers,
  onSave,
  isEdit
}: EpicDialogProps) {
  const [showLabelInput, setShowLabelInput] = useState(false)
  const [newLabel, setNewLabel] = useState('')

  const handleAddLabel = () => {
    if (newLabel.trim() && !epic.labels.includes(newLabel.trim())) {
      setEpic(prev => ({ ...prev, labels: [...prev.labels, newLabel.trim()] }))
      setNewLabel('')
      setShowLabelInput(false)
    }
  }

  const handleCancelLabel = () => {
    setNewLabel('')
    setShowLabelInput(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span>{isEdit ? 'Edit Epic' : 'Create New Epic'}</span>
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update epic details and requirements' : 'Define a new epic to group related stories and tasks'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epicTitle">Epic Title *</Label>
              <Input
                id="epicTitle"
                placeholder="e.g., User Management System"
                value={epic.title}
                onChange={(e) => setEpic(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="epicProject">Project *</Label>
              <Select value={epic.project_id || undefined} onValueChange={(value) => setEpic((prev: any) => ({ ...prev, project_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span>{project.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="epicDescription">Epic Description *</Label>
            <Textarea
              id="epicDescription"
              placeholder="Describe the epic's purpose, goals, and high-level requirements..."
              value={epic.description}
              onChange={(e) => setEpic(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epicPriority">Priority</Label>
              <Select value={epic.priority || undefined} onValueChange={(value) => setEpic((prev: any) => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">
                    <Badge variant="destructive" className="mr-2">Critical</Badge>
                  </SelectItem>
                  <SelectItem value="High">
                    <Badge className="bg-orange-500 mr-2">High</Badge>
                  </SelectItem>
                  <SelectItem value="Medium">
                    <Badge variant="secondary" className="mr-2">Medium</Badge>
                  </SelectItem>
                  <SelectItem value="Low">
                    <Badge variant="outline" className="mr-2">Low</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="epicStatus">Status</Label>
              <Select value={epic.status || undefined} onValueChange={(value: string) => setEpic((prev: any) => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="epicAssignee">Epic Owner</Label>
              <Select value={epic.assignee_id || "unassigned"} onValueChange={(value: string) => setEpic((prev: any) => ({ ...prev, assignee_id: value === "unassigned" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign epic owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">
                    <span className="text-gray-500">No assignee</span>
                  </SelectItem>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                          {member.avatar}
                        </div>
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epicDueDate">Due Date</Label>
              <Input
                id="epicDueDate"
                type="date"
                value={epic.due_date ? epic.due_date.split('T')[0] : ''}
                onChange={(e) => setEpic((prev: any) => ({ ...prev, due_date: e.target.value ? `${e.target.value}T17:00:00Z` : '' }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessValue">Business Value</Label>
              <Textarea
                id="businessValue"
                placeholder="Describe the business value and impact..."
                value={epic.business_value}
                onChange={(e) => setEpic((prev: any) => ({ ...prev, business_value: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Labels</Label>
              {!showLabelInput && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLabelInput(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Label
                </Button>
              )}
            </div>

            {showLabelInput && (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter label name..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddLabel()
                    } else if (e.key === 'Escape') {
                      handleCancelLabel()
                    }
                  }}
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddLabel}
                  disabled={!newLabel.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelLabel}
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {epic.labels?.map((label: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {label}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setEpic((prev: any) => ({
                      ...prev,
                      labels: prev.labels.filter((_: string, i: number) => i !== index)
                    }))}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {epic.total_story_points > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Epic Progress</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-700">Story Points:</span>
                  <span className="ml-2 font-medium">{epic.completed_story_points || 0} / {epic.total_story_points || 0}</span>
                </div>
                <div>
                  <span className="text-purple-700">Tasks:</span>
                  <span className="ml-2 font-medium">{epic.completed_tasks || 0} / {epic.total_tasks || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isEdit ? 'Update Epic' : 'Create Epic'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}