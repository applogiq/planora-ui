import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { X, Mouse, Move, Eye, CheckSquare } from 'lucide-react'

interface DragDropGuideProps {
  isOpen: boolean
  onClose: () => void
}

export function DragDropGuide({ isOpen, onClose }: DragDropGuideProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-labelledby="drag-drop-guide-title" aria-describedby="drag-drop-guide-description">
      <Card className="w-[600px] max-h-[80vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle id="drag-drop-guide-title" className="text-lg">Drag & Drop Guide</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close guide">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p id="drag-drop-guide-description" className="sr-only">
            A comprehensive guide on how to use drag and drop functionality in the project boards
          </p>
          {/* How to Drag */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Move className="w-4 h-4 text-[#28A745]" />
              <h3 className="font-medium">How to Drag Tasks</h3>
            </div>
            <div className="pl-6 space-y-2 text-sm text-muted-foreground">
              <p>• Click and hold on any task card in Board View</p>
              <p>• Look for the grip icon (⋮⋮) on the top-right of task cards</p>
              <p>• Tasks will show a green border when being dragged</p>
              <p>• The original task becomes semi-transparent during drag</p>
            </div>
          </div>

          {/* Where to Drop */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Mouse className="w-4 h-4 text-[#007BFF]" />
              <h3 className="font-medium">Where to Drop</h3>
            </div>
            <div className="pl-6 space-y-2 text-sm text-muted-foreground">
              <p>• Drop tasks into any column to change their status</p>
              <p>• Columns will highlight with a green border when you hover over them</p>
              <p>• A green drop zone indicator will appear at the bottom of columns</p>
              <p>• Empty columns will show helpful drop messages</p>
            </div>
          </div>

          {/* Visual Feedback */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#FFC107]" />
              <h3 className="font-medium">Visual Feedback</h3>
            </div>
            <div className="pl-6 space-y-2 text-sm text-muted-foreground">
              <p>• Dragged tasks show rotation and scaling effects</p>
              <p>• Drop zones highlight with green dashed borders</p>
              <p>• Success notifications show the status change</p>
              <p>• Tasks update immediately without page refresh</p>
            </div>
          </div>

          {/* Status Meanings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-[#DC3545]" />
              <h3 className="font-medium">Column Status Guide</h3>
            </div>
            <div className="pl-6 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-gray-100 text-gray-800">Backlog</Badge>
                <span className="text-muted-foreground">Not started</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">To Do</Badge>
                <span className="text-muted-foreground">Ready to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                <span className="text-muted-foreground">Being worked on</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-purple-100 text-purple-800">In Review</Badge>
                <span className="text-muted-foreground">Under review</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-orange-100 text-orange-800">Testing</Badge>
                <span className="text-muted-foreground">Being tested</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-100 text-green-800">Done</Badge>
                <span className="text-muted-foreground">Completed</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm">💡 Pro Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Drag tasks between any columns to update their status</li>
              <li>• Use filters to focus on specific projects or sprints</li>
              <li>• Click on tasks to view detailed information</li>
              <li>• Changes are saved automatically</li>
            </ul>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} className="bg-[#28A745] hover:bg-[#218838] text-white">
              Got it!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}