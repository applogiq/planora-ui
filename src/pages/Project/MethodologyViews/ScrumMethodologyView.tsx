import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Separator } from '../../../components/ui/separator'
import { mockScrumData } from '../../../mock-data/methodology'
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
  Timer,
  GitBranch,
  Flag
} from 'lucide-react'

interface ScrumMethodologyViewProps {
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
}

export function ScrumMethodologyView({ project, onTaskView, onTaskCreate }: ScrumMethodologyViewProps) {
  const [activeTab, setActiveTab] = useState('current')

  // Use centralized mock data for Scrum-specific features
  const { currentSprint, sprintBacklog, productBacklog, scrumEvents, scrumRoles } = mockScrumData

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'text-[#28A745] bg-[#28A745]/10'
      case 'In Progress': return 'text-[#FFC107] bg-[#FFC107]/10'
      case 'Review': return 'text-[#007BFF] bg-[#007BFF]/10'
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Epic': return <Flag className="w-4 h-4" />
      case 'Story': return <Target className="w-4 h-4" />
      case 'Task': return <CheckCircle className="w-4 h-4" />
      default: return <GitBranch className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Scrum Overview */}
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

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#DC3545]">{currentSprint.daysLeft}</p>
              <p className="text-sm text-muted-foreground">Days Left</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#28A745]">{currentSprint.velocity}</p>
              <p className="text-sm text-muted-foreground">Velocity</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#007BFF]">{currentSprint.completedStoryPoints}/{currentSprint.totalStoryPoints}</p>
              <p className="text-sm text-muted-foreground">Story Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#FFC107]">{sprintBacklog.length}</p>
              <p className="text-sm text-muted-foreground">Items</p>
            </div>
          </div>

          {/* Sprint Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sprint Completion</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((currentSprint.completedStoryPoints / currentSprint.totalStoryPoints) * 100)}%
              </span>
            </div>
            <Progress
              value={(currentSprint.completedStoryPoints / currentSprint.totalStoryPoints) * 100}
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

        {/* Scrum Roles & Ceremonies */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#28A745]/10 rounded-lg">
              <Users className="w-5 h-5 text-[#28A745]" />
            </div>
            <div>
              <h3 className="font-semibold">Scrum Team</h3>
              <p className="text-sm text-muted-foreground">Roles & responsibilities</p>
            </div>
          </div>

          <div className="space-y-4">
            {scrumRoles.map((role, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{role.role}</span>
                  {role.count && <Badge variant="outline">{role.count} members</Badge>}
                </div>
                {role.name && <p className="text-sm text-[#007BFF]">{role.name}</p>}
                <p className="text-xs text-muted-foreground">{role.responsibility}</p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Next Ceremony */}
          <div>
            <h4 className="font-medium mb-3">Next Ceremony</h4>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Scrum</span>
                <Badge variant="outline">Tomorrow</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>09:00 AM - 09:15 AM</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Sprint Management */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="current">Sprint Backlog</TabsTrigger>
              <TabsTrigger value="product">Product Backlog</TabsTrigger>
              <TabsTrigger value="ceremonies">Ceremonies</TabsTrigger>
              <TabsTrigger value="burndown">Burndown Chart</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync
              </Button>
              <Button size="sm" onClick={onTaskCreate} className="bg-[#007BFF] hover:bg-[#0056b3]">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          <TabsContent value="current" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Sprint Backlog Items</h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Total: {sprintBacklog.reduce((sum, item) => sum + item.points, 0)} points</span>
                <span>•</span>
                <span>Completed: {sprintBacklog.filter(item => item.status === 'Done').reduce((sum, item) => sum + item.points, 0)} points</span>
              </div>
            </div>

            <div className="space-y-3">
              {sprintBacklog.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onTaskView?.(item)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <Badge variant="outline" className="text-xs">
                        {item.points} pts
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.type} • Assigned to {item.assignee}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getTaskStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="product" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Product Backlog</h3>
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4 mr-2" />
                Prioritize
              </Button>
            </div>

            <div className="space-y-3">
              {productBacklog.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <Badge variant="outline" className="text-xs">
                        {item.points} pts
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.type} • Estimated for {item.estimatedSprint}
                      </p>
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
            <h3 className="font-semibold">Scrum Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scrumEvents.map((event, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{event.name}</h4>
                    <Badge variant="outline">{event.duration}</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>Next: {event.nextDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-3 h-3" />
                      <span>{event.frequency}</span>
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

          <TabsContent value="burndown" className="space-y-4">
            <h3 className="font-semibold">Sprint Burndown Chart</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Current Sprint Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Remaining Work</span>
                    <span className="font-semibold text-[#FFC107]">{currentSprint.burndownData[currentSprint.burndownData.length - 1]} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ideal Burndown</span>
                    <span className="font-semibold">2 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Velocity Trend</span>
                    <span className="font-semibold text-[#28A745]">↗ +5%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Sprint Health</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">On Track</span>
                    <span className="font-semibold text-[#28A745]">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">Sprint likely to complete on time</p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}