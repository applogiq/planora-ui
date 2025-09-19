import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { MoreHorizontal, Edit3, Trash2, Move, Eye, GitBranch, ArrowRight, Copy } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface BacklogItemActionsProps {
  item: any
  sprints: any[]
  onEdit: (item: any) => void
  onDelete: (itemId: string) => void
  onMoveToSprint: (itemId: string, sprintId: string) => void
  onDuplicate: (item: any) => void
  userRole: string
}

export function BacklogItemActions({
  item,
  sprints,
  onEdit,
  onDelete,
  onMoveToSprint,
  onDuplicate,
  userRole
}: BacklogItemActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [selectedSprintId, setSelectedSprintId] = useState('')

  const canEdit = ['admin', 'super_admin', 'project_manager'].includes(userRole)
  const canDelete = ['admin', 'super_admin', 'project_manager'].includes(userRole)
  const canMove = ['admin', 'super_admin', 'project_manager', 'developer'].includes(userRole)

  const handleMoveToSprint = () => {
    if (selectedSprintId) {
      onMoveToSprint(item.id, selectedSprintId)
      setShowMoveDialog(false)
      setSelectedSprintId('')
      const sprintName = sprints.find(s => s.id === selectedSprintId)?.name
      toast.success(`Moved "${item.title}" to ${sprintName}`)
    }
  }

  const getItemTypeIcon = () => {
    switch (item.type) {
      case 'User Story': return '📖'
      case 'Task': return '⚙️'
      case 'Bug': return '🐛'
      default: return '📝'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter available sprints (same project, not completed)
  const availableSprints = sprints.filter(sprint => 
    sprint.projectId === item.projectId && 
    !['Completed', 'Cancelled'].includes(sprint.status)
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => {}}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
          
          {canEdit && (
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit {item.type}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => onDuplicate(item)}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </DropdownMenuItem>

          {canMove && availableSprints.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowMoveDialog(true)}>
                <Move className="w-4 h-4 mr-2" />
                Move to Sprint
              </DropdownMenuItem>
            </>
          )}

          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <span>{getItemTypeIcon()}</span>
              <span>Delete {item.type}</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {item.type.toLowerCase()}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{item.projectName}</Badge>
                <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                {item.storyPoints > 0 && (
                  <Badge variant="secondary">{item.storyPoints} pts</Badge>
                )}
              </div>
            </div>
            
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              This action cannot be undone. All associated data will be permanently removed.
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onDelete(item.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {item.type}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Move to Sprint Dialog */}
      <AlertDialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              <span>Move to Sprint</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select which sprint you want to move this {item.type.toLowerCase()} to:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span>{getItemTypeIcon()}</span>
                <span className="font-medium">{item.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{item.projectName}</Badge>
                <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                {item.storyPoints > 0 && (
                  <Badge variant="secondary">{item.storyPoints} pts</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Sprint:</label>
              <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose sprint..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSprints.map(sprint => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            sprint.status === 'Active' ? 'bg-green-500' : 
                            sprint.status === 'Planning' ? 'bg-blue-500' : 'bg-gray-400'
                          }`} />
                          <span>{sprint.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{sprint.completedPoints || 0}/{sprint.totalPoints || 0} pts</span>
                          <Badge variant="outline" className="text-xs">{sprint.status}</Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {availableSprints.length === 0 && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                No available sprints found for this project. Create a new sprint first.
              </div>
            )}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedSprintId('')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleMoveToSprint}
              disabled={!selectedSprintId}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Move to Sprint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}