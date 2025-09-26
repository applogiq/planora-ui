import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { 
  Layers, 
  Flag, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react'

interface WaterfallProjectDashboardProps {
  project: any
  user: any
}

// Mock Waterfall-specific data
const mockWaterfallData = {
  phases: [
    {
      id: 'requirements',
      name: 'Requirements Analysis',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      duration: 31,
      deliverables: ['Requirements Document', 'Use Cases', 'Acceptance Criteria']
    },
    {
      id: 'design',
      name: 'System Design',
      status: 'completed',
      progress: 100,
      startDate: '2024-02-16',
      endDate: '2024-03-15',
      duration: 28,
      deliverables: ['System Architecture', 'Database Design', 'UI Mockups']
    },
    {
      id: 'implementation',
      name: 'Implementation',
      status: 'in-progress',
      progress: 65,
      startDate: '2024-03-16',
      endDate: '2024-05-15',
      duration: 60,
      deliverables: ['Core Features', 'API Implementation', 'Frontend Development']
    },
    {
      id: 'testing',
      name: 'Testing',
      status: 'planned',
      progress: 0,
      startDate: '2024-05-16',
      endDate: '2024-06-15',
      duration: 30,
      deliverables: ['Test Cases', 'Bug Reports', 'Test Results']
    },
    {
      id: 'deployment',
      name: 'Deployment',
      status: 'planned',
      progress: 0,
      startDate: '2024-06-16',
      endDate: '2024-06-30',
      duration: 14,
      deliverables: ['Production Deployment', 'User Training', 'Go-Live']
    }
  ],
  milestones: [
    {
      id: 'milestone-1',
      name: 'Requirements Sign-off',
      date: '2024-02-15',
      status: 'completed',
      critical: true
    },
    {
      id: 'milestone-2',
      name: 'Design Approval',
      date: '2024-03-15',
      status: 'completed',
      critical: true
    },
    {
      id: 'milestone-3',
      name: 'Alpha Release',
      date: '2024-04-30',
      status: 'at-risk',
      critical: false
    },
    {
      id: 'milestone-4',
      name: 'Beta Release',
      date: '2024-05-31',
      status: 'planned',
      critical: true
    },
    {
      id: 'milestone-5',
      name: 'Production Release',
      date: '2024-06-30',
      status: 'planned',
      critical: true
    }
  ]
}

export function WaterfallProjectDashboard({ project, user }: WaterfallProjectDashboardProps) {
  const currentPhase = mockWaterfallData.phases.find(phase => phase.status === 'in-progress')
  const completedPhases = mockWaterfallData.phases.filter(phase => phase.status === 'completed').length
  const totalPhases = mockWaterfallData.phases.length
  const overallProgress = Math.round((completedPhases / totalPhases) * 100 + (currentPhase?.progress || 0) / totalPhases)

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#28A745]/10 text-[#28A745] border-[#28A745]/30'
      case 'in-progress': return 'bg-[#007BFF]/10 text-[#007BFF] border-[#007BFF]/30'
      case 'planned': return 'bg-[#6C757D]/10 text-[#6C757D] border-[#6C757D]/30'
      case 'at-risk': return 'bg-[#FFC107]/10 text-[#FFC107] border-[#FFC107]/30'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#28A745]/10 text-[#28A745] border-[#28A745]/30'
      case 'at-risk': return 'bg-[#FFC107]/10 text-[#FFC107] border-[#FFC107]/30'
      case 'planned': return 'bg-[#6C757D]/10 text-[#6C757D] border-[#6C757D]/30'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-[#28A745]" />
      case 'at-risk': return <AlertTriangle className="w-4 h-4 text-[#FFC107]" />
      default: return <Flag className="w-4 h-4 text-[#6C757D]" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Project Phase Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#007BFF]" />
              <span>Project Phases</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWaterfallData.phases.map((phase, index) => (
                <div key={phase.id} className="relative">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          phase.status === 'completed' ? 'bg-[#28A745] text-white' :
                          phase.status === 'in-progress' ? 'bg-[#007BFF] text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{phase.name}</h4>
                          <Badge variant="outline" className={getPhaseStatusColor(phase.status)}>
                            {phase.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          {phase.startDate} - {phase.endDate} ({phase.duration} days)
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <Progress value={phase.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">{phase.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < mockWaterfallData.phases.length - 1 && (
                    <div className="absolute left-4 top-16 w-0.5 h-4 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Phase Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#28A745]" />
              <span>Current Phase</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPhase ? (
              <>
                <div>
                  <h4 className="font-medium mb-2">{currentPhase.name}</h4>
                  <Badge variant="outline" className={getPhaseStatusColor(currentPhase.status)}>
                    {currentPhase.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{currentPhase.progress}%</span>
                  </div>
                  <Progress value={currentPhase.progress} className="h-3" />
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Key Deliverables:</div>
                  <ul className="space-y-1">
                    {currentPhase.deliverables.map((deliverable, index) => (
                      <li key={index} className="text-sm flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-[#007BFF] rounded-full"></div>
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-[#007BFF]">
                      {Math.ceil((new Date(currentPhase.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs text-muted-foreground">Days Remaining</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No active phase
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flag className="w-5 h-5 text-[#FFC107]" />
            <span>Project Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockWaterfallData.milestones.map((milestone) => (
              <div key={milestone.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getMilestoneIcon(milestone.status)}
                    <span className="font-medium text-sm">{milestone.name}</span>
                  </div>
                  {milestone.critical && (
                    <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">
                      Critical
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {milestone.date}
                </div>
                
                <Badge variant="outline" className={getMilestoneStatusColor(milestone.status)}>
                  {milestone.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#007BFF]">{overallProgress}%</div>
            <div className="text-xs text-muted-foreground">Overall Progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#28A745]">{completedPhases}/{totalPhases}</div>
            <div className="text-xs text-muted-foreground">Phases Complete</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#FFC107]">
              {mockWaterfallData.milestones.filter(m => m.status === 'completed').length}
            </div>
            <div className="text-xs text-muted-foreground">Milestones Reached</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#DC3545]">
              {mockWaterfallData.milestones.filter(m => m.status === 'at-risk').length}
            </div>
            <div className="text-xs text-muted-foreground">At Risk Items</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}