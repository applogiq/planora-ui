import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'
import { X, Plus, Lightbulb } from 'lucide-react'

interface BacklogDialogProps {
  open: boolean
  onClose: () => void
  backlogItem: any
  setBacklogItem: (item: any) => void
  projects: any[]
  epicData: any[]
  teamMembers: any[]
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
  teamMembers,
  onSave,
  onAddAcceptanceCriteria,
  onUpdateAcceptanceCriteria,
  onRemoveAcceptanceCriteria,
  isEdit
}: BacklogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {backlogItem.type === 'User Story' && <span>📖</span>}
              {backlogItem.type === 'Task' && <span>⚙️</span>}
              {backlogItem.type === 'Bug' && <span>🐛</span>}
              <span>{isEdit ? 'Edit' : 'Create New'} {backlogItem.type}</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update backlog item details and requirements' : 'Define a new backlog item that can be prioritized and assigned to sprints'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemTitle">Title *</Label>
              <Input
                id="itemTitle"
                placeholder="e.g., User login with email verification"
                value={backlogItem.title}
                onChange={(e) => setBacklogItem(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemType">Type</Label>
              <Select value={backlogItem.type} onValueChange={(value) => setBacklogItem(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User Story">📖 User Story</SelectItem>
                  <SelectItem value="Task">⚙️ Task</SelectItem>
                  <SelectItem value="Bug">🐛 Bug</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemDescription">Description *</Label>
            <Textarea
              id="itemDescription"
              placeholder={backlogItem.type === 'User Story' ? 
                "As a [user role], I want [goal] so that [benefit]..." :
                "Describe the task or bug details..."
              }
              value={backlogItem.description}
              onChange={(e) => setBacklogItem(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemProject">Project *</Label>
              <Select value={backlogItem.projectId} onValueChange={(value) => setBacklogItem(prev => ({ ...prev, projectId: value }))}>
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

            <div className="space-y-2">
              <Label htmlFor="itemEpic">Epic (Optional)</Label>
              <Select value={backlogItem.epicId || "no-epic"} onValueChange={(value) => setBacklogItem(prev => ({ ...prev, epicId: value === "no-epic" ? null : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select epic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-epic">No Epic</SelectItem>
                  {epicData.filter(epic => epic.project_id === backlogItem.projectId).map(epic => (
                    <SelectItem key={epic.id} value={epic.id}>
                      {epic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemPriority">Priority</Label>
              <Select value={backlogItem.priority} onValueChange={(value) => setBacklogItem(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemAssignee">Assignee *</Label>
              <Select value={backlogItem.assigneeId} onValueChange={(value) => setBacklogItem(prev => ({ ...prev, assigneeId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to team member" />
                </SelectTrigger>
                <SelectContent>
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

            <div className="space-y-2">
              <Label htmlFor="itemReporter">Reporter</Label>
              <Select value={backlogItem.reporterId} onValueChange={(value) => setBacklogItem(prev => ({ ...prev, reporterId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reporter" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storyPoints">Story Points</Label>
              <Select value={backlogItem.storyPoints.toString()} onValueChange={(value) => setBacklogItem(prev => ({ ...prev, storyPoints: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Not Estimated</SelectItem>
                  <SelectItem value="1">1 - Trivial</SelectItem>
                  <SelectItem value="2">2 - Minor</SelectItem>
                  <SelectItem value="3">3 - Small</SelectItem>
                  <SelectItem value="5">5 - Medium</SelectItem>
                  <SelectItem value="8">8 - Large</SelectItem>
                  <SelectItem value="13">13 - Extra Large</SelectItem>
                  <SelectItem value="21">21 - XXL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessValue">Business Value</Label>
              <Select value={backlogItem.businessValue} onValueChange={(value) => setBacklogItem(prev => ({ ...prev, businessValue: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="effort">Effort</Label>
              <Select value={backlogItem.effort} onValueChange={(value) => setBacklogItem(prev => ({ ...prev, effort: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Acceptance Criteria</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAddAcceptanceCriteria}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Criteria
              </Button>
            </div>
            
            <div className="space-y-2">
              {backlogItem.acceptanceCriteria.map((criteria: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Acceptance criteria ${index + 1}`}
                      value={criteria}
                      onChange={(e) => onUpdateAcceptanceCriteria(index, e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveAcceptanceCriteria(index)}
                    disabled={backlogItem.acceptanceCriteria.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Backlog Item Best Practices</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Write clear, specific titles that describe the deliverable</li>
                  <li>• Use "As a [user], I want [goal] so that [benefit]" format for user stories</li>
                  <li>• Define measurable acceptance criteria for testing</li>
                  <li>• Keep story points relative to team capacity and velocity</li>
                  <li>• Link to epics to maintain strategic alignment</li>
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
            className="bg-[#28A745] hover:bg-[#218838] text-white"
          >
            {isEdit ? 'Update' : 'Create'} {backlogItem.type}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}