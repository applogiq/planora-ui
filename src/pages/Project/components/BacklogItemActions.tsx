import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../../components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  ArrowRight,
  Copy
} from 'lucide-react'

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
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [selectedSprintId, setSelectedSprintId] = useState('')

  const handleMoveToSprint = () => {
    if (selectedSprintId) {
      onMoveToSprint(item.id, selectedSprintId)
      setShowMoveDialog(false)
      setSelectedSprintId('')
    }
  }

  const canEdit = userRole === 'admin' || userRole === 'project_manager' || userRole === 'scrum_master'
  const canDelete = userRole === 'admin' || userRole === 'project_manager'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canEdit && (
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onDuplicate(item)}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowMoveDialog(true)}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Move to Sprint
          </DropdownMenuItem>
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Move to Sprint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Move "{item.title}" to a sprint:
            </p>
            <div>
              <Label htmlFor="sprint-select">Select Sprint</Label>
              <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sprint" />
                </SelectTrigger>
                <SelectContent>
                  {sprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      {sprint.name} ({sprint.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowMoveDialog(false)
                  setSelectedSprintId('')
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMoveToSprint}
                disabled={!selectedSprintId}
              >
                Move
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}