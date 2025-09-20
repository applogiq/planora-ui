import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Separator } from '../../../components/ui/separator'
import { mockWaterfallData } from '../../../mock-data/methodology'
import {
  GitBranch,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Users,
  Target,
  ArrowDown,
  ArrowRight,
  Plus,
  ChevronRight,
  Flag,
  PlayCircle,
  PauseCircle,
  XCircle
} from 'lucide-react'

interface WaterfallMethodologyViewProps {
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
}

export function WaterfallMethodologyView({ project, onTaskView, onTaskCreate }: WaterfallMethodologyViewProps) {
  const [activeTab, setActiveTab] = useState('phases')

  // Use centralized mock data for Waterfall-specific features
  const { phases, milestones, riskAssessment } = mockWaterfallData

  // Keep quality gates as local data for now
  const qualityGates = [
    { name: 'Requirements Review', status: 'Passed', date: '2024-01-15', criteria: 'All requirements documented and approved' },
    { name: 'Design Review', status: 'Passed', date: '2024-02-05', criteria: 'Architecture and design approved by stakeholders' },
    { name: 'Code Review', status: 'In Progress', date: '2024-03-10', criteria: 'Code quality standards met, 90% test coverage' },
    { name: 'Integration Testing', status: 'Pending', date: '2024-03-25', criteria: 'All system components working together' },
    { name: 'User Acceptance Testing', status: 'Pending', date: '2024-04-05', criteria: 'System meets user requirements' },
    { name: 'Production Readiness', status: 'Pending', date: '2024-04-15', criteria: 'System ready for production deployment' }
  ]

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-[#28A745] bg-[#28A745]/10'
      case 'In Progress': return 'text-[#FFC107] bg-[#FFC107]/10'
      case 'Pending': return 'text-[#6C757D] bg-[#6C757D]/10'
      case 'At Risk': return 'text-[#DC3545] bg-[#DC3545]/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-[#DC3545] text-white'
      case 'Medium': return 'bg-[#FFC107] text-white'
      case 'Low': return 'bg-[#28A745] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-[#28A745]" />
      case 'At Risk': return <AlertTriangle className="w-4 h-4 text-[#FFC107]" />
      case 'Pending': return <Clock className="w-4 h-4 text-[#6C757D]" />
      default: return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getQualityGateStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed': return <CheckCircle className="w-4 h-4 text-[#28A745]" />
      case 'In Progress': return <PlayCircle className="w-4 h-4 text-[#FFC107]" />
      case 'Failed': return <XCircle className="w-4 h-4 text-[#DC3545]" />
      case 'Pending': return <PauseCircle className="w-4 h-4 text-[#6C757D]" />
      default: return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const currentPhase = phases.find(phase => phase.status === 'In Progress')
  const overallProgress = Math.round(phases.reduce((total, phase) => total + phase.progress, 0) / phases.length)

  return (
    <div className="space-y-6">
      {/* Waterfall Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Phase Card */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#007BFF]/10 rounded-lg">
                <GitBranch className="w-5 h-5 text-[#007BFF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Current Phase: {currentPhase?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentPhase?.startDate} - {currentPhase?.endDate}
                </p>
              </div>
            </div>
            <Badge className={getPhaseStatusColor(currentPhase?.status || 'Pending')}>
              {currentPhase?.status}
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#007BFF]">{currentPhase?.progress}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#28A745]">{currentPhase?.completedTasks}</p>
              <p className="text-sm text-muted-foreground">Tasks Done</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#FFC107]">{currentPhase?.tasks}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#DC3545]">
                {currentPhase ? Math.ceil((new Date(currentPhase.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0}
              </p>
              <p className="text-sm text-muted-foreground">Days Left</p>
            </div>
          </div>

          {/* Phase Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Phase Progress</span>
              <span className="text-sm text-muted-foreground">{currentPhase?.progress}%</span>
            </div>
            <Progress value={currentPhase?.progress || 0} className="h-2" />
          </div>

          {/* Deliverables */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Phase Deliverables</h4>
            <ul className="space-y-2">
              {(currentPhase?.deliverables || []).map((deliverable, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#007BFF]" />
                  <span className="text-sm">{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Project Timeline */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#28A745]/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#28A745]" />
            </div>
            <div>
              <h3 className="font-semibold">Project Timeline</h3>
              <p className="text-sm text-muted-foreground">Overall progress</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#007BFF]">{overallProgress}%</p>
              <p className="text-sm text-muted-foreground">Project Complete</p>
            </div>
            <Progress value={overallProgress} className="h-3" />

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Phases Completed</span>
                <span className="font-semibold">{phases.filter(p => p.status === 'Completed').length}/{phases.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Duration</span>
                <span className="font-semibold">{phases.reduce((total, phase) => total + phase.duration, 0)} days</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Upcoming Milestone */}
          <div>
            <h4 className="font-medium mb-3">Next Milestone</h4>
            {milestones.find(m => m.status === 'Pending' || m.status === 'At Risk') && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  {getMilestoneStatusIcon(milestones.find(m => m.status === 'Pending' || m.status === 'At Risk')?.status || 'Pending')}
                  <span className="text-sm font-medium">
                    {milestones.find(m => m.status === 'Pending' || m.status === 'At Risk')?.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Due: {milestones.find(m => m.status === 'Pending' || m.status === 'At Risk')?.date}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="phases">Phases</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="risks">Risk Management</TabsTrigger>
              <TabsTrigger value="quality">Quality Gates</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={onTaskCreate} className="bg-[#007BFF] hover:bg-[#0056b3]">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          <TabsContent value="phases" className="space-y-4">
            <h3 className="font-semibold">Project Phases</h3>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div key={phase.id} className="relative">
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-[#007BFF] text-white text-sm flex items-center justify-center font-medium">
                            {phase.id}
                          </div>
                          <div>
                            <h4 className="font-medium">{phase.name}</h4>
                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className={getPhaseStatusColor(phase.status)}>
                        {phase.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium">{phase.duration} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-sm font-medium">{phase.progress}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tasks</p>
                        <p className="text-sm font-medium">{phase.completedTasks}/{phase.tasks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">End Date</p>
                        <p className="text-sm font-medium">{phase.endDate}</p>
                      </div>
                    </div>

                    <Progress value={phase.progress} className="h-2 mb-3" />

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {phase.deliverables.map((deliverable, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onTaskView?.(phase)}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>

                  {/* Phase Connection Arrow */}
                  {index < phases.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            <h3 className="font-semibold">Project Milestones</h3>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getMilestoneStatusIcon(milestone.status)}
                    <div>
                      <h4 className="font-medium">{milestone.name}</h4>
                      <p className="text-sm text-muted-foreground">{milestone.phase}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{milestone.date}</p>
                    <Badge className={getPhaseStatusColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <h3 className="font-semibold">Risk Assessment</h3>
            <div className="space-y-4">
              {riskAssessment.map((risk, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{risk.category}</h4>
                    <Badge className={getRiskLevelColor(risk.level)}>
                      {risk.level} Risk
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Impact:</p>
                      <p className="text-sm">{risk.impact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mitigation:</p>
                      <p className="text-sm">{risk.mitigation}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <h3 className="font-semibold">Quality Gates</h3>
            <div className="space-y-3">
              {qualityGates.map((gate, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getQualityGateStatusIcon(gate.status)}
                    <div>
                      <h4 className="font-medium">{gate.name}</h4>
                      <p className="text-sm text-muted-foreground">{gate.criteria}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{gate.date}</p>
                    <Badge className={getPhaseStatusColor(gate.status)}>
                      {gate.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}