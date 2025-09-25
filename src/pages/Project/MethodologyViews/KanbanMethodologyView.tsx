import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { useMethodologyData } from '../../../hooks/useMethodologyData'
import {
  Plus,
  MoreVertical,
  User,
  Calendar,
  Tag,
  TrendingUp,
  Clock,
  BarChart3,
  AlertTriangle
} from 'lucide-react'

interface KanbanMethodologyViewProps {
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
  currentUser?: { id: string; name: string }
  activeTab?: string
}

export function KanbanMethodologyView({
  project,
  onTaskView,
  onTaskCreate,
  currentUser,
  activeTab = 'board'
}: KanbanMethodologyViewProps) {
  const { data: kanbanData } = useMethodologyData(project?.id, 'Kanban')

  if (!kanbanData) {
    return <div className="p-6">Loading Kanban data...</div>
  }

  const { columns, metrics, cumulativeFlowData } = kanbanData

  const renderBoard = () => (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cycle Time</p>
                <p className="text-2xl font-bold">{metrics.cycleTime} days</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lead Time</p>
                <p className="text-2xl font-bold">{metrics.leadTime} days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Throughput</p>
                <p className="text-2xl font-bold">{metrics.throughput}/week</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">WIP</p>
                <p className="text-2xl font-bold">{metrics.wip}/{metrics.wipLimit}</p>
              </div>
              <AlertTriangle className={`w-8 h-8 ${metrics.wip >= metrics.wipLimit ? 'text-red-500' : 'text-yellow-500'}`} />
            </div>
            <Progress value={(metrics.wip / metrics.wipLimit) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto">
        {columns.map((column: any) => (
          <Card key={column.id} className="min-w-72 lg:min-w-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{column.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {column.limit && (
                    <Badge variant={column.cards.length >= column.limit ? "destructive" : "secondary"}>
                      {column.cards.length}{column.limit && `/${column.limit}`}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {column.cards.map((card: any) => (
                  <div
                    key={card.id}
                    className="p-3 border rounded-lg hover:shadow-md cursor-pointer transition-all"
                    onClick={() => onTaskView?.(card)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{card.title}</h4>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{card.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{card.assignee}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                      <Badge variant={
                        card.priority === 'High' ? 'destructive' :
                        card.priority === 'Medium' ? 'default' : 'secondary'
                      } className="text-xs">
                        {card.priority}
                      </Badge>
                      {card.completedAt && (
                        <Badge variant="default" className="text-xs bg-green-500">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative Flow Diagram */}
        <Card>
          <CardHeader>
            <CardTitle>Cumulative Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cumulativeFlowData.map((data: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{data.date}</span>
                  <div className="flex gap-4 text-sm">
                    <span>Backlog: {data.backlog}</span>
                    <span>Ready: {data.ready}</span>
                    <span>In Progress: {data.inProgress}</span>
                    <span>Review: {data.review}</span>
                    <span>Done: {data.done}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Average Cycle Time</p>
                <p className="text-xl font-bold text-blue-600">{metrics.cycleTime} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Lead Time</p>
                <p className="text-xl font-bold text-green-600">{metrics.leadTime} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Weekly Throughput</p>
                <p className="text-xl font-bold text-purple-600">{metrics.throughput} cards</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current WIP</p>
                <p className="text-xl font-bold text-orange-600">{metrics.wip} items</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">WIP Limit Status</p>
              <Progress value={(metrics.wip / metrics.wipLimit) * 100} />
              <p className="text-xs text-gray-500 mt-1">
                {metrics.wip} of {metrics.wipLimit} items in progress
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Column Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {columns.map((column: any) => (
              <div key={column.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{column.title}</h4>
                  <p className="text-sm text-gray-600">{column.cards.length} cards</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">WIP Limit: </span>
                    <span className="font-medium">{column.limit || 'None'}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WIP Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Global WIP Limit</p>
                <p className="text-xl font-bold">{metrics.wipLimit} items</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current WIP</p>
                <p className="text-xl font-bold">{metrics.wip} items</p>
              </div>
            </div>
            <Progress value={(metrics.wip / metrics.wipLimit) * 100} />
            <p className="text-sm text-gray-600">
              {metrics.wip >= metrics.wipLimit ? (
                <span className="text-red-600 font-medium">⚠️ WIP limit reached</span>
              ) : (
                <span className="text-green-600">✅ Within WIP limits</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="board" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          {renderBoard()}
        </TabsContent>

        <TabsContent value="metrics">
          {renderMetrics()}
        </TabsContent>

        <TabsContent value="settings">
          {renderSettings()}
        </TabsContent>
      </Tabs>
    </div>
  )
}