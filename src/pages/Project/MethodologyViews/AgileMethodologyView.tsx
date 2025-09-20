import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Separator } from '../../../components/ui/separator'
import { mockAgileData } from '../../../mock-data/methodology'
import {
  Zap,
  Target,
  Clock,
  Users,
  BarChart3,
  PlayCircle,
  CheckCircle,
  Calendar,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  MessageSquare,
  Activity,
  Plus,
  ChevronRight,
  Timer
} from 'lucide-react'

interface AgileMethodologyViewProps {
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
}

export function AgileMethodologyView({ project, onTaskView, onTaskCreate }: AgileMethodologyViewProps) {
  const [activeSprintTab, setActiveSprintTab] = useState('current')

  // Use centralized mock data for Agile-specific features
  const { currentSprint, sprintTasks, backlogItems, ceremonies } = mockAgileData

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'text-[#28A745] bg-[#28A745]/10'
      case 'In Progress': return 'text-[#FFC107] bg-[#FFC107]/10'
      case 'To Do': return 'text-[#6C757D] bg-[#6C757D]/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-[#DC3545] text-white'
      case 'Medium': return 'bg-[#FFC107] text-white'
      case 'Low': return 'bg-[#28A745] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Agile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Sprint Card */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#007BFF]/10 rounded-lg">
                <Zap className="w-5 h-5 text-[#007BFF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{currentSprint.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentSprint.startDate} - {currentSprint.endDate}
                </p>
              </div>
            </div>
            <Badge className="bg-[#28A745] text-white">Active</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#007BFF]">{currentSprint.daysLeft}</p>
              <p className="text-sm text-muted-foreground">Days Left</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#28A745]">{currentSprint.velocity}</p>
              <p className="text-sm text-muted-foreground">Velocity</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#FFC107]">{sprintTasks.length}</p>
              <p className="text-sm text-muted-foreground">Tasks</p>
            </div>
          </div>

          {/* Sprint Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sprint Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentSprint.totalDays - currentSprint.daysLeft) / currentSprint.totalDays) * 100)}%
              </span>
            </div>
            <Progress
              value={((currentSprint.totalDays - currentSprint.daysLeft) / currentSprint.totalDays) * 100}
              className="h-2"
            />
          </div>

          {/* Sprint Goals */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Sprint Goals</h4>
            <ul className="space-y-2">
              {currentSprint.goals.map((goal, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-[#007BFF]" />
                  <span className="text-sm">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Team Velocity & Burndown */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#28A745]/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#28A745]" />
            </div>
            <div>
              <h3 className="font-semibold">Team Velocity</h3>
              <p className="text-sm text-muted-foreground">Story points per sprint</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Current Sprint</span>
              <span className="font-semibold text-[#28A745]">{currentSprint.velocity} pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Target Velocity</span>
              <span className="font-semibold">{currentSprint.targetVelocity} pts</span>
            </div>
            <Progress
              value={(currentSprint.velocity / currentSprint.targetVelocity) * 100}
              className="h-2"
            />
          </div>

          <Separator className="my-4" />

          {/* Upcoming Ceremonies */}
          <div>
            <h4 className="font-medium mb-3">Upcoming Ceremonies</h4>
            <div className="space-y-2">
              {ceremonies.slice(0, 2).map((ceremony, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{ceremony.name}</span>
                  </div>
                  <span className="text-muted-foreground">{ceremony.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Sprint Management */}
      <Card className="p-6">
        <Tabs value={activeSprintTab} onValueChange={setActiveSprintTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="current">Current Sprint</TabsTrigger>
              <TabsTrigger value="backlog">Product Backlog</TabsTrigger>
              <TabsTrigger value="ceremonies">Ceremonies</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync
              </Button>
              <Button size="sm" onClick={onTaskCreate} className="bg-[#007BFF] hover:bg-[#0056b3]">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          <TabsContent value="current" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Sprint Backlog</h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Total: {sprintTasks.reduce((sum, task) => sum + task.points, 0)} points</span>
                <span>•</span>
                <span>Completed: {sprintTasks.filter(t => t.status === 'Done').reduce((sum, task) => sum + task.points, 0)} points</span>
              </div>
            </div>

            <div className="space-y-3">
              {sprintTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onTaskView?.(task)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {task.points} pts
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">Assigned to {task.assignee}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getTaskStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="backlog" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Product Backlog</h3>
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4 mr-2" />
                Prioritize
              </Button>
            </div>

            <div className="space-y-3">
              {backlogItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-xs">
                      {item.points} pts
                    </Badge>
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Add to Sprint
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ceremonies" className="space-y-4">
            <h3 className="font-semibold">Scrum Ceremonies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ceremonies.map((ceremony, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{ceremony.name}</h4>
                    <Badge variant="outline">{ceremony.frequency}</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{ceremony.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>Next: {ceremony.nextDate}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Agile Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#FFC107]/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-[#FFC107]" />
            </div>
            <div>
              <h3 className="font-semibold">Sprint Burndown</h3>
              <p className="text-sm text-muted-foreground">Remaining work per day</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#FFC107]">{currentSprint.burndownData[currentSprint.burndownData.length - 1]}</p>
            <p className="text-sm text-muted-foreground">Story points remaining</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#28A745]/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-[#28A745]" />
            </div>
            <div>
              <h3 className="font-semibold">Definition of Done</h3>
              <p className="text-sm text-muted-foreground">Completion criteria</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-[#28A745]" />
              <span>Code reviewed</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-[#28A745]" />
              <span>Tests written & passing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-[#28A745]" />
              <span>Documentation updated</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#DC3545]/10 rounded-lg">
              <Activity className="w-5 h-5 text-[#DC3545]" />
            </div>
            <div>
              <h3 className="font-semibold">Team Health</h3>
              <p className="text-sm text-muted-foreground">Sprint retrospective</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Team Satisfaction</span>
              <span className="font-semibold text-[#28A745]">8.5/10</span>
            </div>
            <Progress value={85} className="h-2" />
            <p className="text-xs text-muted-foreground">Based on last retrospective</p>
          </div>
        </Card>
      </div>
    </div>
  )
}