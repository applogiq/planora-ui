import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Separator } from '../../../components/ui/separator'
import { mockKanbanData } from '../../../mock-data/methodology'
import {
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  Target,
  Plus,
  ChevronRight,
  Timer,
  Activity,
  ArrowRight,
  Zap,
  Flag,
  RefreshCw,
  Filter,
  Settings
} from 'lucide-react'

interface KanbanMethodologyViewProps {
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
}

export function KanbanMethodologyView({ project, onTaskView, onTaskCreate }: KanbanMethodologyViewProps) {
  const [activeTab, setActiveTab] = useState('board')

  // Use centralized mock data for Kanban-specific features
  const { columns: kanbanColumns, metrics: kanbanMetrics } = mockKanbanData

  const flowEfficiency = {
    activeTime: 35,
    waitTime: 65,
    bottlenecks: [
      { stage: 'Review', utilization: 95, reason: 'Limited reviewers available' },
      { stage: 'Testing', utilization: 87, reason: 'Complex test scenarios' }
    ]
  }


  const cumulativeFlow = {
    weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: {
      'To Do': [15, 12, 10, 8],
      'Doing': [8, 10, 12, 9],
      'Review': [5, 7, 8, 6],
      'Done': [22, 31, 40, 47]
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-[#DC3545] text-white'
      case 'High': return 'bg-[#FF6B35] text-white'
      case 'Medium': return 'bg-[#FFC107] text-white'
      case 'Low': return 'bg-[#28A745] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Feature': return <Target className="w-4 h-4" />
      case 'Bug': return <AlertTriangle className="w-4 h-4" />
      case 'Enhancement': return <TrendingUp className="w-4 h-4" />
      case 'Technical': return <Settings className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const isWipLimitExceeded = (column: any) => {
    return column.wipLimit && column.items.length > column.wipLimit
  }

  const totalItems = kanbanColumns.reduce((total, column) => total + column.items.length, 0)
  const completedItems = kanbanColumns.find(col => col.id === 'done')?.items.length || 0
  const completionRate = Math.round((completedItems / totalItems) * 100)

  return (
    <div className="space-y-6">
      {/* Kanban Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#007BFF]/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-[#007BFF]" />
            </div>
            <div>
              <h3 className="font-semibold">Throughput</h3>
              <p className="text-sm text-muted-foreground">Items per week</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#007BFF]">{kanbanMetrics.throughput.weekly}</p>
            <p className="text-sm text-muted-foreground">
              <span className="text-[#28A745]">{kanbanMetrics.throughput.trend}</span> from last week
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#28A745]/10 rounded-lg">
              <Clock className="w-5 h-5 text-[#28A745]" />
            </div>
            <div>
              <h3 className="font-semibold">Cycle Time</h3>
              <p className="text-sm text-muted-foreground">Average days</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#28A745]">{kanbanMetrics.cycleTime.average}</p>
            <p className="text-sm text-muted-foreground">
              <span className="text-[#FFC107]">{kanbanMetrics.cycleTime.trend}</span> days
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#FFC107]/10 rounded-lg">
              <Activity className="w-5 h-5 text-[#FFC107]" />
            </div>
            <div>
              <h3 className="font-semibold">Flow Efficiency</h3>
              <p className="text-sm text-muted-foreground">Active vs wait time</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#FFC107]">{flowEfficiency.activeTime}%</p>
            <p className="text-sm text-muted-foreground">Active time</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#DC3545]/10 rounded-lg">
              <Flag className="w-5 h-5 text-[#DC3545]" />
            </div>
            <div>
              <h3 className="font-semibold">WIP Violations</h3>
              <p className="text-sm text-muted-foreground">Limit breaches</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#28A745]">{kanbanMetrics.wipLimits.violations}</p>
            <p className="text-sm text-muted-foreground">This week</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="board">Kanban Board</TabsTrigger>
              <TabsTrigger value="metrics">Flow Metrics</TabsTrigger>
              <TabsTrigger value="cumulative">Cumulative Flow</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" onClick={onTaskCreate} className="bg-[#007BFF] hover:bg-[#0056b3]">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          <TabsContent value="board" className="space-y-4">
            <div className="grid grid-cols-5 gap-4 min-h-[600px]">
              {kanbanColumns.map((column) => (
                <div key={column.id} className={`rounded-lg p-4 ${column.color} border`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{column.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {column.items.length}
                      </Badge>
                    </div>
                    {column.wipLimit && (
                      <Badge
                        variant={isWipLimitExceeded(column) ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        WIP: {column.wipLimit}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    {column.items.map((item) => (
                      <Card
                        key={item.id}
                        className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-white"
                        onClick={() => onTaskView?.(item)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight">{item.title}</h4>
                            <Badge className={getPriorityColor(item.priority)} size="sm">
                              {item.priority}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-2">
                            {getTypeIcon(item.type)}
                            <span className="text-xs text-muted-foreground">{item.type}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Users className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{item.assignee}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Timer className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{item.estimate}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}

                    {column.items.length === 0 && (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        No items
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Cycle Time Analysis</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Cycle Time</span>
                    <span className="font-semibold text-[#007BFF]">{kanbanMetrics.cycleTime.average} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lead Time (P95)</span>
                    <span className="font-semibold">{kanbanMetrics.leadTime.p95} days</span>
                  </div>

                  <Separator className="my-3" />

                  <h4 className="font-medium mb-2">Recent Items</h4>
                  {kanbanMetrics.cycleTime.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.item}</span>
                      <span className="font-medium">{item.time} days</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-4">Flow Efficiency</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Active Time</span>
                      <span className="font-semibold text-[#28A745]">{flowEfficiency.activeTime}%</span>
                    </div>
                    <Progress value={flowEfficiency.activeTime} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Wait Time</span>
                      <span className="font-semibold text-[#FFC107]">{flowEfficiency.waitTime}%</span>
                    </div>
                    <Progress value={flowEfficiency.waitTime} className="h-2" />
                  </div>

                  <Separator className="my-3" />

                  <h4 className="font-medium mb-2">Bottlenecks</h4>
                  {flowEfficiency.bottlenecks.map((bottleneck, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{bottleneck.stage}</span>
                        <Badge variant="outline">{bottleneck.utilization}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{bottleneck.reason}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Throughput Trends</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#007BFF]">{kanbanMetrics.throughput.weekly}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#28A745]">{kanbanMetrics.throughput.monthly}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#FFC107]">{kanbanMetrics.wipLimits.efficiency}%</p>
                  <p className="text-sm text-muted-foreground">WIP Efficiency</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="cumulative" className="space-y-4">
            <h3 className="font-semibold">Cumulative Flow Diagram</h3>
            <Card className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {Object.entries(cumulativeFlow.data).map(([stage, values]) => (
                  <div key={stage} className="text-center">
                    <p className="text-lg font-bold">{values[values.length - 1]}</p>
                    <p className="text-sm text-muted-foreground">{stage}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Flow Analysis</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Work In Progress:</span>
                    <span className="ml-2 font-medium">
                      {kanbanColumns.filter(col => col.id !== 'done' && col.id !== 'backlog')
                        .reduce((total, col) => total + col.items.length, 0)} items
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Completion Rate:</span>
                    <span className="ml-2 font-medium text-[#28A745]">{completionRate}%</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <h3 className="font-semibold">Process Optimization</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-3">WIP Limit Recommendations</h4>
                <div className="space-y-3">
                  {kanbanColumns.filter(col => col.wipLimit).map((column) => (
                    <div key={column.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{column.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Current: {column.items.length}/{column.wipLimit}
                        </p>
                      </div>
                      <Badge variant={isWipLimitExceeded(column) ? "destructive" : "secondary"}>
                        {isWipLimitExceeded(column) ? 'Over Limit' : 'Within Limit'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Process Improvements</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Review Bottleneck</p>
                        <p className="text-xs text-muted-foreground">
                          Consider adding more reviewers or breaking down review tasks
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Cycle Time Improvement</p>
                        <p className="text-xs text-muted-foreground">
                          Focus on reducing wait times between stages
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Zap className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Flow Efficiency</p>
                        <p className="text-xs text-muted-foreground">
                          Good flow balance maintained this week
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}