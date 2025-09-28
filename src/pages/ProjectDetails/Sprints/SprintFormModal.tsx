import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { sprintsApiService, Sprint, CreateSprintRequest } from '../../../services/sprintsApi'
import { ProjectMemberDetail, ProjectStatusItem } from '../../../services/projectApi'
import { toast } from 'sonner'

interface SprintFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: string
  projectTeamLead: ProjectMemberDetail | null
  mode: 'create' | 'edit'
  sprint?: Sprint | null
  availableStatuses?: ProjectStatusItem[]
}

export function SprintFormModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  projectTeamLead,
  mode,
  sprint,
  availableStatuses
}: SprintFormModalProps) {
  const [formData, setFormData] = useState<CreateSprintRequest>({
    name: '',
    status: 'planning',
    start_date: '',
    end_date: '',
    goal: '',
    project_id: projectId,
    scrum_master_id: '',
    burndown_trend: 'On Track'
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && sprint) {
      setFormData({
        name: sprint.name,
        status: sprint.status,
        start_date: sprint.start_date?.split('T')[0] || '',
        end_date: sprint.end_date?.split('T')[0] || '',
        goal: sprint.goal,
        project_id: sprint.project_id,
        scrum_master_id: sprint.scrum_master_id || '',
        burndown_trend: sprint.burndown_trend || 'On Track'
      })
    } else if (mode === 'create') {
      setFormData({
        name: '',
        status: 'planning',
        start_date: '',
        end_date: '',
        goal: '',
        project_id: projectId,
        scrum_master_id: '',
        burndown_trend: 'On Track'
      })
    }
  }, [mode, sprint, projectId, isOpen])

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error('Sprint name is required')
        return
      }

      if (!formData.start_date || !formData.end_date) {
        toast.error('Start date and end date are required')
        return
      }

      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        toast.error('End date must be after start date')
        return
      }

      setLoading(true)

      // Prepare data for API
      const apiData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        // Remove empty optional fields
        scrum_master_id: formData.scrum_master_id?.trim() || undefined,
      }

      if (mode === 'create') {
        await sprintsApiService.createSprint(apiData)
        toast.success('Sprint created successfully')
      } else if (mode === 'edit' && sprint) {
        await sprintsApiService.updateSprint(sprint.id, apiData)
        toast.success('Sprint updated successfully')
      }

      onSuccess()
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} sprint:`, error)
      toast.error(`Failed to ${mode === 'create' ? 'create' : 'update'} sprint`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Sprint' : 'Edit Sprint'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Sprint Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Sprint 1, Release 1.0"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses && availableStatuses.length > 0 ? (
                    availableStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.name.toLowerCase()}>
                        {status.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          {/* Goal */}
          <div>
            <Label htmlFor="goal">Sprint Goal</Label>
            <Textarea
              id="goal"
              placeholder="Describe the main objective of this sprint..."
              rows={3}
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            />
          </div>

          {/* Team Information */}
          <div>
            <Label htmlFor="scrum_master_id">Scrum Master</Label>
            <Select
              value={formData.scrum_master_id || 'unassigned'}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  scrum_master_id: value === 'unassigned' ? '' : value
                })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scrum master" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {projectTeamLead ? (
                  <SelectItem value={projectTeamLead.id}>
                    {projectTeamLead.name} - {projectTeamLead.role_name}
                  </SelectItem>
                ) : (
                  <SelectItem value="loading" disabled>Loading project lead...</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Burndown Trend */}
          <div>
            <Label htmlFor="burndown_trend">Burndown Trend</Label>
            <Select
              value={formData.burndown_trend}
              onValueChange={(value) => setFormData({ ...formData, burndown_trend: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On Track">On Track</SelectItem>
                <SelectItem value="Ahead">Ahead</SelectItem>
                <SelectItem value="Behind">Behind</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#28A745] hover:bg-[#218838]"
              onClick={handleSubmit}
              disabled={loading || !formData.name.trim() || !formData.start_date || !formData.end_date}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{mode === 'create' ? 'Creating...' : 'Updating...'}</span>
                </div>
              ) : (
                mode === 'create' ? 'Create Sprint' : 'Update Sprint'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}