import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Calendar, Zap, Users, Target, PlayCircle } from 'lucide-react'

interface SprintDialogProps {
  open: boolean
  onClose: () => void
  sprint: any
  setSprint: (sprint: any) => void
  projects: any[]
  teamMembers: any[]
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
  onSave,
  isEdit
}: SprintDialogProps) {
  const getSprintDuration = () => {
    if (sprint.startDate && sprint.endDate) {
      const start = new Date(sprint.startDate)
      const end = new Date(sprint.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return 0
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span>{isEdit ? 'Edit Sprint' : 'Create New Sprint'}</span>
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update sprint details and timeline' : 'Define a new sprint with timeline and goals'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sprintName">Sprint Name *</Label>
              <Input
                id="sprintName"
                placeholder="e.g., Sprint 23 - User Authentication"
                value={sprint.name}
                onChange={(e) => setSprint(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sprintProject">Project *</Label>
              <Select value={sprint.projectId} onValueChange={(value) => setSprint(prev => ({ ...prev, projectId: value }))}>
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
            <Label htmlFor="sprintGoal">Sprint Goal *</Label>
            <Textarea
              id="sprintGoal"
              placeholder="Define the main objective and deliverables for this sprint..."
              value={sprint.goal}
              onChange={(e) => setSprint(prev => ({ ...prev, goal: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sprintStatus">Status</Label>
              <Select value={sprint.status} onValueChange={(value) => setSprint(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span>Planning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Active">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Active</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="In Progress">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>In Progress</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Completed">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Completed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Cancelled">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>Cancelled</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scrumMaster">Scrum Master</Label>
              <Select value={sprint.scrumMasterId} onValueChange={(value) => setSprint(prev => ({ ...prev, scrumMasterId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign scrum master" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.filter(m => ['project_manager', 'admin', 'super_admin'].includes(m.role)).map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                          {member.avatar}
                        </div>
                        <span>{member.name}</span>
                        <Badge variant="outline" className="text-xs">{member.role.replace('_', ' ')}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                min="1"
                max="20"
                value={sprint.teamSize}
                onChange={(e) => setSprint(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={sprint.startDate ? sprint.startDate.split('T')[0] : ''}
                onChange={(e) => setSprint(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={sprint.endDate ? sprint.endDate.split('T')[0] : ''}
                onChange={(e) => setSprint(prev => ({ ...prev, endDate: e.target.value }))}
                min={sprint.startDate ? sprint.startDate.split('T')[0] : undefined}
              />
            </div>
          </div>

          {getSprintDuration() > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-orange-900 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Sprint Duration</span>
                </h4>
                <Badge variant="secondary">
                  {getSprintDuration()} days
                </Badge>
              </div>
              
              {getSprintDuration() > 14 && (
                <div className="text-sm text-orange-700 bg-orange-100 p-2 rounded">
                  ⚠️ Consider shorter sprints (1-2 weeks) for better agility and feedback cycles
                </div>
              )}
            </div>
          )}

          {sprint.totalPoints > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Sprint Metrics</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-medium text-blue-600">{sprint.completedPoints || 0}</div>
                  <div className="text-blue-700">Points Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-blue-600">{sprint.completedTasks || 0}</div>
                  <div className="text-blue-700">Tasks Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-blue-600">{sprint.velocity || 0}</div>
                  <div className="text-blue-700">Velocity</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <PlayCircle className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Sprint Best Practices</h4>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>• Keep sprints short (1-4 weeks) for better predictability</li>
                  <li>• Define clear, measurable sprint goals</li>
                  <li>• Ensure team capacity aligns with planned story points</li>
                  <li>• Hold sprint planning, daily standups, and retrospectives</li>
                  <li>• Maintain consistent sprint duration for velocity tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isEdit ? 'Update Sprint' : 'Create Sprint'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}