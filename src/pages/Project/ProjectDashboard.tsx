import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Separator } from '../../components/ui/separator'
import { 
  Clock,
  User,
  Calendar,
  Target,
  TrendingUp,
  AlertTriangle,
  PlayCircle,
  CheckCircle,
  Timer,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'

interface ProjectDashboardProps {
  project: any
  onTaskView: (task: any) => void
}

export function ProjectDashboard({ project, onTaskView }: ProjectDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-[#28A745]'
      case 'In Progress': return 'text-[#FFC107]'
      case 'To Do': return 'text-[#DC3545]'
      default: return 'text-muted-foreground'
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

  const activeTasks = project.tasks.filter((task: any) => task.status !== 'Completed')
  const recentTimeEntries = project.timeEntries.slice(0, 5)
  const totalTimeToday = project.timeEntries
    .filter((entry: any) => entry.date === '2025-09-13')
    .reduce((total: number, entry: any) => {
      const [hours, minutes] = entry.duration.split('h ').map((part: string) => parseInt(part) || 0)
      return total + hours + (minutes / 60)
    }, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Project Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Project Overview</h3>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {project.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Start Date:</span>
                <span className="text-sm font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Due Date:</span>
                <span className="text-sm font-medium">{new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Project Owner:</span>
                <span className="text-sm font-medium">
                  {typeof project.owner === 'object' ? project.owner?.name || 'Unknown' : project.owner}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <PlayCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Current Sprint:</span>
                <span className="text-sm font-medium">{project.currentSprint}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Next Milestone:</span>
                <span className="text-sm font-medium">{project.nextMilestone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Version:</span>
                <Badge variant="outline">{project.version}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Tasks</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {activeTasks.slice(0, 5).map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'In Progress' ? 'bg-[#FFC107]' : 'bg-[#DC3545]'
                  }`} />
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                            {typeof task.assignee === 'object' ? task.assignee?.avatar || task.assignee?.name?.charAt(0) || 'U' : task.assignee?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {typeof task.assignee === 'object' ? task.assignee?.name || 'Unknown' : task.assignee}
                        </span>
                      </div>
                      <Badge className={getPriorityColor(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">{task.progress}%</div>
                    <Progress value={task.progress} className="w-16 h-1 mt-1" />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onTaskView(task)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Time Log */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Time Entries</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentTimeEntries.map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <Timer className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{entry.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {typeof entry.user === 'object' ? entry.user?.name || 'Unknown' : entry.user}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {typeof entry.task === 'object' ? entry.task?.title || entry.task?.name || 'Unknown' : entry.task}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium">{entry.duration}</span>
                  <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Task Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Task Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Tasks</span>
              <span className="font-medium">{project.totalTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{project.tasksCompleted}</span>
                <CheckCircle className="w-4 h-4 text-[#28A745]" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{project.tasks.filter((t: any) => t.status === 'In Progress').length}</span>
                <PlayCircle className="w-4 h-4 text-[#FFC107]" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">To Do</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{project.tasks.filter((t: any) => t.status === 'To Do').length}</span>
                <Clock className="w-4 h-4 text-[#DC3545]" />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="font-semibold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </Card>

        {/* Today's Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Time</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#007BFF]">
              {totalTimeToday.toFixed(1)}h
            </div>
            <p className="text-sm text-muted-foreground mt-1">Time logged today</p>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Team Average</span>
              <span className="text-sm font-medium">6.2h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Weekly Total</span>
              <span className="text-sm font-medium">32.5h</span>
            </div>
          </div>
        </Card>

        {/* Team Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Team Status</h3>
          <div className="space-y-3">
            {project.team.slice(0, 5).map((member: any) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {typeof member.role === 'object' ? member.role?.name || 'Unknown' : member.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#28A745] rounded-full" />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="w-4 h-4 mr-2" />
              Create Task
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Timer className="w-4 h-4 mr-2" />
              Start Timer
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}