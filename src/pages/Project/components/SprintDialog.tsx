import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'

interface SprintDialogProps {
  open: boolean
  onClose: () => void
  sprint: any
  setSprint: (sprint: any) => void
  projects: any[]
  teamMembers: any[]
  projectOwners: any[]
  onSave: () => void
  isEdit: boolean
}

export function SprintDialog({
  open,
  onClose,
  sprint,
  setSprint,
  projects,
  teamMembers,
  projectOwners,
  onSave,
  isEdit
}: SprintDialogProps) {
  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId)
    setSprint({
      ...sprint,
      projectId,
      projectName: selectedProject?.name || ''
    })
  }

  const handleScrumMasterChange = (scrumMasterId: string) => {
    const selectedScrumMaster = [...teamMembers, ...projectOwners].find(m => m.id === scrumMasterId)
    setSprint({
      ...sprint,
      scrumMasterId,
      scrumMasterName: selectedScrumMaster?.name || ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Create'} Sprint</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Sprint Name *</Label>
              <Input
                placeholder="Enter sprint name"
                value={sprint.name}
                onChange={(e) => setSprint({ ...sprint, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={sprint.status}
                onValueChange={(value) => setSprint({ ...sprint, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Selection */}
          <div>
            <Label htmlFor="project">Project *</Label>
            <Select
              value={sprint.projectId}
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

          {/* Sprint Goal */}
          <div>
            <Label htmlFor="goal">Sprint Goal *</Label>
            <Textarea
              placeholder="Define the sprint goal and objectives"
              rows={2}
              value={sprint.goal}
              onChange={(e) => setSprint({ ...sprint, goal: e.target.value })}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                type="date"
                value={sprint.startDate}
                onChange={(e) => setSprint({ ...sprint, startDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                type="date"
                value={sprint.endDate}
                onChange={(e) => setSprint({ ...sprint, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Team Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scrumMaster">Scrum Master</Label>
              <Select
                value={sprint.scrumMasterId}
                onValueChange={handleScrumMasterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scrum master" />
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
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                type="number"
                placeholder="6"
                min="1"
                max="20"
                value={sprint.teamSize || ''}
                onChange={(e) => setSprint({ ...sprint, teamSize: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Sprint Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="totalPoints">Total Points</Label>
              <Input
                type="number"
                placeholder="0"
                value={sprint.totalPoints || ''}
                onChange={(e) => setSprint({ ...sprint, totalPoints: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="completedPoints">Completed Points</Label>
              <Input
                type="number"
                placeholder="0"
                value={sprint.completedPoints || ''}
                onChange={(e) => setSprint({ ...sprint, completedPoints: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="totalTasks">Total Tasks</Label>
              <Input
                type="number"
                placeholder="0"
                value={sprint.totalTasks || ''}
                onChange={(e) => setSprint({ ...sprint, totalTasks: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="completedTasks">Completed Tasks</Label>
              <Input
                type="number"
                placeholder="0"
                value={sprint.completedTasks || ''}
                onChange={(e) => setSprint({ ...sprint, completedTasks: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="velocity">Velocity</Label>
              <Input
                type="number"
                placeholder="0"
                value={sprint.velocity || ''}
                onChange={(e) => setSprint({ ...sprint, velocity: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="burndownTrend">Burndown Trend</Label>
              <Select
                value={sprint.burndownTrend}
                onValueChange={(value) => setSprint({ ...sprint, burndownTrend: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trend" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="Behind Schedule">Behind Schedule</SelectItem>
                  <SelectItem value="Ahead of Schedule">Ahead of Schedule</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={!sprint.name?.trim() || !sprint.goal?.trim() || !sprint.projectId || !sprint.startDate || !sprint.endDate}
            >
              {isEdit ? 'Update' : 'Create'} Sprint
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}