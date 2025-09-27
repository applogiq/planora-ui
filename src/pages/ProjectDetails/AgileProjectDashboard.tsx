import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Timer,
  BarChart3,
  Activity,
  Zap,
  GitBranch,
  Flag
} from 'lucide-react'
import { TaskModal } from './Tasks/TaskModal'

interface AgileProjectDashboardProps {
  project: any
  user: any
}

// Mock data for Agile/Scrum specifics
const mockSprintData = {
  currentSprint: {
    name: 'Sprint 5',
    startDate: '2024-03-01',
    endDate: '2024-03-14',
    goal: 'Complete user authentication and profile management features',
    progress: 75,
    plannedPoints: 42,
    completedPoints: 31,
    burndownData: [
      { day: 1, planned: 42, actual: 42 },
      { day: 2, planned: 38, actual: 40 },
      { day: 3, planned: 34, actual: 36 },
      { day: 4, planned: 30, actual: 32 },
      { day: 5, planned: 26, actual: 28 },
      { day: 6, planned: 22, actual: 25 },
      { day: 7, planned: 18, actual: 20 },
      { day: 8, planned: 14, actual: 15 },
      { day: 9, planned: 10, actual: 11 },
      { day: 10, planned: 6, actual: 8 }
    ]
  },
  velocity: {
    lastSprint: 38,
    average: 35,
    trend: 'increasing'
  },
  backlog: {
    totalStories: 156,
    prioritized: 89,
    estimated: 134
  }
}

const mockTasks = [
  {
    id: '1',
    title: 'Implement OAuth 2.0 Authentication',
    status: 'in-progress',
    priority: 'high',
    assignee: { name: 'Alice Johnson', avatar: 'AJ' },
    storyPoints: 8,
    type: 'story',
    epic: 'User Management'
  },
  {
    id: '2',
    title: 'Design user profile UI',
    status: 'done',
    priority: 'medium',
    assignee: { name: 'Carol Davis', avatar: 'CD' },
    storyPoints: 5,
    type: 'story',
    epic: 'User Management'
  },
  {
    id: '3',
    title: 'Fix login validation bug',
    status: 'todo',
    priority: 'high',
    assignee: { name: 'Bob Chen', avatar: 'BC' },
    storyPoints: 3,
    type: 'bug',
    epic: 'User Management'
  },
  {
    id: '4',
    title: 'Setup password reset flow',
    status: 'in-progress',
    priority: 'medium',
    assignee: { name: 'David Wilson', avatar: 'DW' },
    storyPoints: 5,
    type: 'story',
    epic: 'User Management'
  }
]

export function AgileProjectDashboard({ project, user }: AgileProjectDashboardProps) {
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'done': return 'bg-green-100 text-green-800 border-green-300'
      case 'blocked': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return <Target className="w-4 h-4" />
      case 'bug': return <AlertTriangle className="w-4 h-4" />
      case 'epic': return <Flag className="w-4 h-4" />
      case 'task': return <CheckCircle className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Sprint Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#28A745]" />
                <span>Current Sprint: {mockSprintData.currentSprint.name}</span>
              </CardTitle>
              <Badge variant="outline" className="bg-[#28A745]/10 text-[#28A745] border-[#28A745]/30">
                {Math.ceil((new Date(mockSprintData.currentSprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Sprint Goal</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">{mockSprintData.currentSprint.goal}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-semibold text-[#28A745]">
                  {mockSprintData.currentSprint.completedPoints}
                </div>
                <div className="text-xs text-muted-foreground">Completed Points</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-semibold text-blue-600">
                  {mockSprintData.currentSprint.plannedPoints}
                </div>
                <div className="text-xs text-muted-foreground">Planned Points</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-semibold text-orange-600">
                  {mockSprintData.currentSprint.plannedPoints - mockSprintData.currentSprint.completedPoints}
                </div>
                <div className="text-xs text-muted-foreground">Remaining Points</div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Sprint Progress</span>
                <span>{mockSprintData.currentSprint.progress}%</span>
              </div>
              <Progress value={mockSprintData.currentSprint.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Team Velocity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#007BFF]" />
              <span>Team Velocity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Sprint</span>
                <span className="font-semibold">{mockSprintData.velocity.lastSprint} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average</span>
                <span className="font-semibold">{mockSprintData.velocity.average} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Trend</span>
                <Badge variant="outline" className="bg-[#28A745]/10 text-[#28A745] border-[#28A745]/30">
                  {mockSprintData.velocity.trend}
                </Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-semibold text-[#007BFF]">
                  {Math.round((mockSprintData.currentSprint.completedPoints / 10) * 100) / 100}
                </div>
                <div className="text-xs text-muted-foreground">Avg Points/Day</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backlog & Active Work */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Backlog Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-[#FFC107]" />
              <span>Product Backlog</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold text-[#007BFF]">
                    {mockSprintData.backlog.totalStories}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Stories</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-[#28A745]">
                    {mockSprintData.backlog.prioritized}
                  </div>
                  <div className="text-xs text-muted-foreground">Prioritized</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-[#FFC107]">
                    {mockSprintData.backlog.estimated}
                  </div>
                  <div className="text-xs text-muted-foreground">Estimated</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
                  Manage Backlog
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-[#DC3545]" />
              <span>Active Sprint Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {mockTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(task.type)}
                      <span className="text-sm font-medium truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusColor(task.status)} style={{ fontSize: '10px' }}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(task.priority)} style={{ fontSize: '10px' }}>
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{task.storyPoints} pts</span>
                    </div>
                  </div>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-[#28A745] text-white text-xs">
                      {task.assignee.avatar}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t mt-4">
              <Button variant="outline" className="w-full" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Sprint Board
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#28A745]/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#28A745]" />
              </div>
              <div>
                <div className="text-lg font-semibold">23</div>
                <div className="text-xs text-muted-foreground">Completed Stories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#007BFF]/10 rounded-lg">
                <Activity className="w-5 h-5 text-[#007BFF]" />
              </div>
              <div>
                <div className="text-lg font-semibold">12</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#FFC107]/10 rounded-lg">
                <Clock className="w-5 h-5 text-[#FFC107]" />
              </div>
              <div>
                <div className="text-lg font-semibold">96h</div>
                <div className="text-xs text-muted-foreground">Time Logged</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#DC3545]/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-[#DC3545]" />
              </div>
              <div>
                <div className="text-lg font-semibold">3</div>
                <div className="text-xs text-muted-foreground">Blocked Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            console.log('Task updated:', updatedTask)
            setSelectedTask(null)
          }}
          user={user}
        />
      )}
    </div>
  )
}