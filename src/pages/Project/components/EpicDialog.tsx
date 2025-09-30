import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'

interface EpicDialogProps {
  open: boolean
  onClose: () => void
  epic: any
  setEpic: (epic: any) => void
  projects: any[]
  teamMembers: any[]
  projectOwners: any[]
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
  projectOwners,
  onSave,
  isEdit
}: EpicDialogProps) {
  const handleProjectChange = (projectId: string) => {
    setEpic({
      ...epic,
      project_id: projectId
    })
  }

  const handleAssigneeChange = (assigneeId: string) => {
    setEpic({
      ...epic,
      assignee_id: assigneeId
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Create'} Epic</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={epic.priority}
                onValueChange={(value) => setEpic({ ...epic, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={epic.status}
                onValueChange={(value) => setEpic({ ...epic, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              placeholder="Enter epic title"
              value={epic.title}
              onChange={(e) => setEpic({ ...epic, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              placeholder="Enter epic description"
              rows={3}
              value={epic.description}
              onChange={(e) => setEpic({ ...epic, description: e.target.value })}
            />
          </div>

          {/* Project Selection */}
          <div>
            <Label htmlFor="project">Project *</Label>
            <Select
              value={epic.project_id}
              onValueChange={handleProjectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignment and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={epic.assignee_id || ''}
                onValueChange={handleAssigneeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                  {projectOwners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.name} (Owner)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                type="date"
                value={epic.due_date || ''}
                onChange={(e) => setEpic({ ...epic, due_date: e.target.value })}
              />
            </div>
          </div>

          {/* Business Value */}
          <div>
            <Label htmlFor="businessValue">Business Value</Label>
            <Textarea
              placeholder="Describe the business value and objectives of this epic"
              rows={2}
              value={epic.business_value || ''}
              onChange={(e) => setEpic({ ...epic, business_value: e.target.value })}
            />
          </div>

          {/* Story Points and Tasks */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="totalStoryPoints">Total Story Points</Label>
              <Input
                type="number"
                placeholder="0"
                value={epic.total_story_points || ''}
                onChange={(e) => setEpic({ ...epic, total_story_points: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="completedStoryPoints">Completed Story Points</Label>
              <Input
                type="number"
                placeholder="0"
                value={epic.completed_story_points || ''}
                onChange={(e) => setEpic({ ...epic, completed_story_points: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="totalTasks">Total Tasks</Label>
              <Input
                type="number"
                placeholder="0"
                value={epic.total_tasks || ''}
                onChange={(e) => setEpic({ ...epic, total_tasks: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="completedTasks">Completed Tasks</Label>
              <Input
                type="number"
                placeholder="0"
                value={epic.completed_tasks || ''}
                onChange={(e) => setEpic({ ...epic, completed_tasks: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Labels */}
          <div>
            <Label htmlFor="labels">Labels (comma-separated)</Label>
            <Input
              placeholder="frontend, backend, api"
              value={epic.labels?.join(', ') || ''}
              onChange={(e) => setEpic({
                ...epic,
                labels: e.target.value.split(',').map(label => label.trim()).filter(label => label)
              })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={!epic.title?.trim() || !epic.description?.trim() || !epic.project_id}
            >
              {isEdit ? 'Update' : 'Create'} Epic
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}