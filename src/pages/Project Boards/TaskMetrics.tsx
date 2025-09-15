import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Users,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Timer,
  Zap,
  PieChart,
  LineChart
} from 'lucide-react'
import { BOARD_TASKS } from '../../mock-data/tasks'

interface TaskMetricsProps {
  tasks: any[]
  selectedProject?: string
  selectedSprint?: string
}

export function TaskMetrics({ tasks, selectedProject, selectedSprint }: TaskMetricsProps) {
  const [activeMetric, setActiveMetric] = useState('overview')

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'done').length
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length
    const blockedTasks = tasks.filter(task => 
      task.status === 'backlog' && new Date(task.dueDate) < new Date()
    ).length

    // Story points
    const totalStoryPoints = tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
    const completedStoryPoints = tasks
      .filter(task => task.status === 'done')
      .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

    // Velocity calculation (completed story points)
    const velocity = completedStoryPoints

    // Priority distribution
    const priorityCount = {
      critical: tasks.filter(task => task.priority === 'critical').length,
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    }

    // Status distribution
    const statusCount = {
      backlog: tasks.filter(task => task.status === 'backlog').length,
      todo: tasks.filter(task => task.status === 'todo').length,
      in_progress: tasks.filter(task => task.status === 'in_progress').length,
      in_review: tasks.filter(task => task.status === 'in_review').length,
      testing: tasks.filter(task => task.status === 'testing').length,
      done: tasks.filter(task => task.status === 'done').length
    }

    // Assignee workload
    const assigneeWorkload = tasks.reduce((acc, task) => {
      const assignee = task.assignee
      if (!acc[assignee]) {
        acc[assignee] = { total: 0, completed: 0, inProgress: 0, storyPoints: 0 }
      }
      acc[assignee].total++
      acc[assignee].storyPoints += task.storyPoints || 0
      if (task.status === 'done') acc[assignee].completed++
      if (task.status === 'in_progress') acc[assignee].inProgress++
      return acc
    }, {} as Record<string, any>)

    // Overdue tasks
    const overdueTasks = tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length

    // Completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const storyPointsCompletion = totalStoryPoints > 0 ? Math.round((completedStoryPoints / totalStoryPoints) * 100) : 0

    // Average cycle time (mock calculation)
    const avgCycleTime = 3.2 // days

    // Burndown data (mock)
    const burndownData = [
      { day: 1, planned: 100, actual: 100 },
      { day: 2, planned: 90, actual: 95 },
      { day: 3, planned: 80, actual: 88 },
      { day: 4, planned: 70, actual: 78 },
      { day: 5, planned: 60, actual: 65 },
      { day: 6, planned: 50, actual: 52 },
      { day: 7, planned: 40, actual: 38 },
      { day: 8, planned: 30, actual: 25 },
      { day: 9, planned: 20, actual: 15 },
      { day: 10, planned: 10, actual: 8 },
      { day: 11, planned: 0, actual: 2 }
    ]

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      totalStoryPoints,
      completedStoryPoints,
      velocity,
      priorityCount,
      statusCount,
      assigneeWorkload,
      overdueTasks,
      completionRate,
      storyPointsCompletion,
      avgCycleTime,
      burndownData
    }
  }, [tasks])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'bg-gray-400'
      case 'todo': return 'bg-blue-500'
      case 'in_progress': return 'bg-yellow-500'
      case 'in_review': return 'bg-purple-500'
      case 'testing': return 'bg-orange-500'
      case 'done': return 'bg-green-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{metrics.totalTasks}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <Progress value={metrics.completionRate} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.completionRate}% completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Story Points</p>
                <p className="text-2xl font-bold">
                  {metrics.completedStoryPoints}/{metrics.totalStoryPoints}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <Progress value={metrics.storyPointsCompletion} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.storyPointsCompletion}% completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Velocity</p>
                <p className="text-2xl font-bold">{metrics.velocity}</p>
                <p className="text-xs text-muted-foreground">Story points/sprint</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Cycle Time</p>
                <p className="text-2xl font-bold">{metrics.avgCycleTime}d</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(metrics.overdueTasks > 0 || metrics.blockedTasks > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.overdueTasks > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-700">
                    {metrics.overdueTasks} Overdue Tasks
                  </span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Tasks past their due date need immediate attention
                </p>
              </CardContent>
            </Card>
          )}

          {metrics.blockedTasks > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium text-yellow-700">
                    {metrics.blockedTasks} Blocked Tasks
                  </span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">
                  Tasks waiting for dependencies or resources
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Detailed Metrics */}
      <Tabs value={activeMetric} onValueChange={setActiveMetric}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Status Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.statusCount).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                        <span className="text-sm capitalize">
                          {status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({metrics.totalTasks > 0 ? Math.round((count / metrics.totalTasks) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Priority Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.priorityCount).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
                        <span className="text-sm capitalize">{priority}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({metrics.totalTasks > 0 ? Math.round((count / metrics.totalTasks) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sprint Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Sprint Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tasks Completed</span>
                      <span>{metrics.completedTasks}/{metrics.totalTasks}</span>
                    </div>
                    <Progress value={metrics.completionRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Story Points</span>
                      <span>{metrics.completedStoryPoints}/{metrics.totalStoryPoints}</span>
                    </div>
                    <Progress value={metrics.storyPointsCompletion} className="h-2" />
                  </div>

                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{metrics.inProgressTasks}</div>
                        <div className="text-xs text-muted-foreground">In Progress</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{metrics.velocity}</div>
                        <div className="text-xs text-muted-foreground">Velocity</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Burndown Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5" />
                  <span>Sprint Burndown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Burndown Chart</p>
                    <p className="text-xs text-muted-foreground">Sprint progress visualization</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-medium">{metrics.totalStoryPoints}</div>
                    <div className="text-muted-foreground">Planned</div>
                  </div>
                  <div>
                    <div className="font-medium">{metrics.totalStoryPoints - metrics.completedStoryPoints}</div>
                    <div className="text-muted-foreground">Remaining</div>
                  </div>
                  <div>
                    <div className="font-medium">5</div>
                    <div className="text-muted-foreground">Days Left</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Team Workload</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics.assigneeWorkload).map(([assignee, workload]) => (
                  <div key={assignee} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{assignee}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{workload.storyPoints} SP</Badge>
                        <Badge variant="outline">{workload.total} tasks</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{workload.completed}</div>
                        <div className="text-xs text-green-600">Completed</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">{workload.inProgress}</div>
                        <div className="text-xs text-yellow-600">In Progress</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">
                          {workload.total - workload.completed - workload.inProgress}
                        </div>
                        <div className="text-xs text-blue-600">Pending</div>
                      </div>
                    </div>
                    <Progress 
                      value={workload.total > 0 ? (workload.completed / workload.total) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Performance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Completion Rate</div>
                      <div className="text-sm text-muted-foreground">Last 30 days</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-green-600">+12%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Average Cycle Time</div>
                      <div className="text-sm text-muted-foreground">Last 30 days</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-green-600">-0.8d</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Team Velocity</div>
                      <div className="text-sm text-muted-foreground">Last 3 sprints</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-green-600">+15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-xs text-green-600">Test Coverage</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">2.1</div>
                      <div className="text-xs text-blue-600">Defect Rate</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="text-2xl font-bold text-purple-600">4.2</div>
                      <div className="text-xs text-purple-600">Code Review Time</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded">
                      <div className="text-2xl font-bold text-orange-600">85%</div>
                      <div className="text-xs text-orange-600">First Pass Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}