import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { useMethodologyData, useTimeTracking } from '../../../hooks/useMethodologyData'
import {
  Play,
  Pause,
  BarChart3,
  Users,
  Calendar,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

interface ScrumMethodologyViewProps {
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
  currentUser?: { id: string; name: string }
  activeTab?: string
}

export function ScrumMethodologyView({
  project,
  onTaskView,
  onTaskCreate,
  currentUser,
  activeTab = 'overview'
}: ScrumMethodologyViewProps) {
  const [timerRunning, setTimerRunning] = useState(false)
  const { data: scrumData } = useMethodologyData(project?.id, 'Scrum')
  const { summary: timeData } = useTimeTracking(project?.id, currentUser?.id)

  if (!scrumData) {
    return <div className="p-6">Loading Scrum data...</div>
  }

  const { currentSprint, ceremonies, teamRoles, backlog } = scrumData

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Sprint Card */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {currentSprint.name}
            </span>
            <Badge variant={currentSprint.status === 'active' ? 'default' : 'secondary'}>
              {currentSprint.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-2xl font-bold">{currentSprint.duration} days</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <div className="flex items-center gap-2">
                <Progress value={(currentSprint.completed / currentSprint.capacity) * 100} className="flex-1" />
                <span className="text-sm font-medium">
                  {Math.round((currentSprint.completed / currentSprint.capacity) * 100)}%
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-green-600">{currentSprint.completed}</p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-blue-600">{currentSprint.capacity}</p>
              <p className="text-xs text-gray-600">Capacity</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-orange-600">{currentSprint.remaining}</p>
              <p className="text-xs text-gray-600">Remaining</p>
            </div>
          </div>
          {onTaskCreate && (
            <Button onClick={onTaskCreate} className="w-full">
              Add Task to Sprint
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Time Tracking Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {timeData && (
            <>
              <div className="text-center">
                <p className="text-3xl font-bold">{Math.floor(timeData.todayTotal / 60)}h {timeData.todayTotal % 60}m</p>
                <p className="text-sm text-gray-600">Today</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">This Week</p>
                  <p className="font-semibold">{Math.floor(timeData.weekTotal / 60)}h</p>
                </div>
                <div>
                  <p className="text-gray-600">Billable</p>
                  <p className="font-semibold">{Math.floor(timeData.billableHours / 60)}h</p>
                </div>
              </div>
            </>
          )}
          <div className="flex gap-2">
            <Button
              variant={timerRunning ? "destructive" : "default"}
              size="sm"
              className="flex-1"
              onClick={() => setTimerRunning(!timerRunning)}
            >
              {timerRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {timerRunning ? 'Stop' : 'Start'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Backlog Items */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Active Backlog Items
            </span>
            {onTaskView && (
              <Button variant="outline" size="sm">
                View All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backlog.slice(0, 6).map((item: any) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onTaskView?.(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <Badge variant={
                    item.priority === 'High' ? 'destructive' :
                    item.priority === 'Medium' ? 'default' : 'secondary'
                  }>
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{item.storyPoints} SP</Badge>
                  <Badge variant={
                    item.status === 'Done' ? 'default' :
                    item.status === 'In Progress' ? 'secondary' : 'outline'
                  }>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCeremonies = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ceremonies.map((ceremony: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{ceremony.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Next: {ceremony.nextDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{ceremony.time} ({ceremony.duration})</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{ceremony.frequency}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTeam = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamRoles.map((member: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-blue-600">{member.role}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{member.responsibility}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderVelocity = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Sprint Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentSprint.velocity.map((sprint: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{sprint.sprint}</span>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Planned: </span>
                    <span className="font-semibold">{sprint.planned}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Completed: </span>
                    <span className="font-semibold text-green-600">{sprint.completed}</span>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${(sprint.completed / sprint.planned) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ceremonies">Ceremonies</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="ceremonies">
          {renderCeremonies()}
        </TabsContent>

        <TabsContent value="team">
          {renderTeam()}
        </TabsContent>

        <TabsContent value="velocity">
          {renderVelocity()}
        </TabsContent>
      </Tabs>
    </div>
  )
}