import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Plus, X } from 'lucide-react'

interface BacklogDialogProps {
  open: boolean
  onClose: () => void
  backlogItem: any
  setBacklogItem: (item: any) => void
  projects: any[]
  epicData: any[]
  epicsLoading: boolean
  onLoadEpicsForProject: (projectId: string) => void
  resources: any[]
  reporters: any[]
  onSave: () => void
  onAddAcceptanceCriteria: () => void
  onUpdateAcceptanceCriteria: (index: number, value: string) => void
  onRemoveAcceptanceCriteria: (index: number) => void
  isEdit: boolean
}

export function BacklogDialog({
  open,
  onClose,
  backlogItem,
  setBacklogItem,
  projects,
  epicData,
  epicsLoading,
  onLoadEpicsForProject,
  resources,
  reporters,
  onSave,
  onAddAcceptanceCriteria,
  onUpdateAcceptanceCriteria,
  onRemoveAcceptanceCriteria,
  isEdit
}: BacklogDialogProps) {
  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId)
    setBacklogItem({
      ...backlogItem,
      projectId,
      projectName: selectedProject?.name || '',
      epicId: '',
      epicTitle: ''
    })
    onLoadEpicsForProject(projectId)
  }

  const handleEpicChange = (epicId: string) => {
    const selectedEpic = epicData.find(e => e.id === epicId)
    setBacklogItem({
      ...backlogItem,
      epicId,
      epicTitle: selectedEpic?.title || ''
    })
  }

  const handleAssigneeChange = (assigneeId: string) => {
    const selectedAssignee = resources.find(r => r.id === assigneeId)
    setBacklogItem({
      ...backlogItem,
      assigneeId,
      assigneeName: selectedAssignee?.name || ''
    })
  }

  const handleReporterChange = (reporterId: string) => {
    const selectedReporter = reporters.find(r => r.id === reporterId)
    setBacklogItem({
      ...backlogItem,
      reporterId,
      reporterName: selectedReporter?.name || ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Create'} Backlog Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={backlogItem.type}
                onValueChange={(value) => setBacklogItem({ ...backlogItem, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User Story">User Story</SelectItem>
                  <SelectItem value="Task">Task</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={backlogItem.priority}
                onValueChange={(value) => setBacklogItem({ ...backlogItem, priority: value })}
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
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              placeholder="Enter item title"
              value={backlogItem.title}
              onChange={(e) => setBacklogItem({ ...backlogItem, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              placeholder="Enter item description"
              rows={3}
              value={backlogItem.description}
              onChange={(e) => setBacklogItem({ ...backlogItem, description: e.target.value })}
            />
          </div>

          {/* Project and Epic Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project">Project *</Label>
              <Select
                value={backlogItem.projectId}
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

            <div>
              <Label htmlFor="epic">Epic</Label>
              <Select
                value={backlogItem.epicId}
                onValueChange={handleEpicChange}
                disabled={!backlogItem.projectId || epicsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={epicsLoading ? "Loading..." : "Select epic"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Epic</SelectItem>
                  {epicData.map((epic) => (
                    <SelectItem key={epic.id} value={epic.id}>
                      {epic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignee">Assignee *</Label>
              <Select
                value={backlogItem.assigneeId}
                onValueChange={handleAssigneeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {resources.map((resource) => (
                    <SelectItem key={resource.id} value={resource.id}>
                      {resource.name} - {resource.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reporter">Reporter</Label>
              <Select
                value={backlogItem.reporterId}
                onValueChange={handleReporterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reporter" />
                </SelectTrigger>
                <SelectContent>
                  {reporters.map((reporter) => (
                    <SelectItem key={reporter.id} value={reporter.id}>
                      {reporter.name} - {reporter.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={backlogItem.status}
                onValueChange={(value) => setBacklogItem({ ...backlogItem, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Backlog">Backlog</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="storyPoints">Story Points</Label>
              <Input
                type="number"
                placeholder="0"
                value={backlogItem.storyPoints || ''}
                onChange={(e) => setBacklogItem({ ...backlogItem, storyPoints: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="businessValue">Business Value</Label>
              <Select
                value={backlogItem.businessValue}
                onValueChange={(value) => setBacklogItem({ ...backlogItem, businessValue: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <Label htmlFor="acceptanceCriteria">Acceptance Criteria</Label>
            <div className="space-y-2">
              {backlogItem.acceptanceCriteria?.map((criteria: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter acceptance criteria"
                    value={criteria}
                    onChange={(e) => onUpdateAcceptanceCriteria(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveAcceptanceCriteria(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAddAcceptanceCriteria}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Acceptance Criteria
              </Button>
            </div>
          </div>

          {/* Labels */}
          <div>
            <Label htmlFor="labels">Labels (comma-separated)</Label>
            <Input
              placeholder="frontend, ui, enhancement"
              value={backlogItem.labels?.join(', ') || ''}
              onChange={(e) => setBacklogItem({
                ...backlogItem,
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
              disabled={!backlogItem.title?.trim() || !backlogItem.description?.trim() || !backlogItem.projectId || !backlogItem.assigneeId}
            >
              {isEdit ? 'Update' : 'Create'} Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}