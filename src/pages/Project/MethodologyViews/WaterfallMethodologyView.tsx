import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { useMethodologyData } from '../../../hooks/useMethodologyData'
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  PlayCircle
} from 'lucide-react'

interface WaterfallMethodologyViewProps {
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
  currentUser?: { id: string; name: string }
  activeTab?: string
}

export function WaterfallMethodologyView({
  project,
  onTaskView,
  onTaskCreate,
  currentUser,
  activeTab = 'phases'
}: WaterfallMethodologyViewProps) {
  const { data: waterfallData } = useMethodologyData(project?.id, 'Waterfall')

  if (!waterfallData) {
    return <div className="p-6">Loading Waterfall data...</div>
  }

  const { phases, milestones, risks } = waterfallData

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-blue-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderPhases = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Phases</p>
                <p className="text-2xl font-bold">{phases.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {phases.filter((p: any) => p.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {phases.filter((p: any) => p.status === 'in-progress').length}
                </p>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((phases.reduce((sum: number, p: any) => sum + p.progress, 0) / phases.length))}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {phases.map((phase: any, index: number) => (
          <Card key={phase.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(phase.status)}
                  <div>
                    <CardTitle className="text-lg">{phase.name}</CardTitle>
                    <p className="text-sm text-gray-600">{phase.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status.replace('-', ' ')}
                  </Badge>
                  <div className="text-right text-sm">
                    <p className="font-semibold">{phase.progress}%</p>
                    <p className="text-gray-600">{phase.duration} days</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={phase.progress} className="mb-4" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Timeline
                    </h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-600">Start:</span> {new Date(phase.startDate).toLocaleDateString()}</p>
                      <p><span className="text-gray-600">End:</span> {new Date(phase.endDate).toLocaleDateString()}</p>
                      <p><span className="text-gray-600">Duration:</span> {phase.duration} days</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Deliverables
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {phase.deliverables.map((deliverable: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {deliverable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Tasks ({phase.tasks.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {phase.tasks.map((task: any) => (
                      <div
                        key={task.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onTaskView?.(task)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{task.name}</span>
                          <Badge variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'in-progress' ? 'secondary' : 'outline'
                          } className="text-xs">
                            {task.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{task.assignee}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderMilestones = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Project Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(milestone.status)}
                  <div>
                    <h4 className="font-medium">{milestone.name}</h4>
                    <p className="text-sm text-gray-600">
                      Target: {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(milestone.status)}>
                  {milestone.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRisks = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Risk Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {risks.map((risk: any) => (
              <Card key={risk.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium">{risk.description}</h4>
                    <Badge className={getStatusColor(risk.status)}>
                      {risk.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Impact: </span>
                      <Badge variant={
                        risk.impact === 'High' ? 'destructive' :
                        risk.impact === 'Medium' ? 'default' : 'secondary'
                      }>
                        {risk.impact}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Probability: </span>
                      <Badge variant={
                        risk.probability === 'High' ? 'destructive' :
                        risk.probability === 'Medium' ? 'default' : 'secondary'
                      }>
                        {risk.probability}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-1">Mitigation:</span>
                      <p className="text-gray-800">{risk.mitigation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTimeline = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-300"></div>
            <div className="space-y-6">
              {phases.map((phase: any, index: number) => (
                <div key={phase.id} className="relative flex items-start gap-4">
                  <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 ${
                    phase.status === 'completed' ? 'border-green-500' :
                    phase.status === 'in-progress' ? 'border-blue-500' : 'border-gray-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{phase.name}</h4>
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(phase.startDate).toLocaleDateString()}</span>
                      <span>→</span>
                      <span>{new Date(phase.endDate).toLocaleDateString()}</span>
                      <span>({phase.duration} days)</span>
                    </div>
                    <Progress value={phase.progress} className="mt-2 max-w-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="phases">
          {renderPhases()}
        </TabsContent>

        <TabsContent value="milestones">
          {renderMilestones()}
        </TabsContent>

        <TabsContent value="risks">
          {renderRisks()}
        </TabsContent>

        <TabsContent value="timeline">
          {renderTimeline()}
        </TabsContent>
      </Tabs>
    </div>
  )
}