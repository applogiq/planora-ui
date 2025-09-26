import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  GitMerge, 
  Zap, 
  Layers, 
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Flag,
  Target
} from 'lucide-react'

interface HybridProjectDashboardProps {
  project: any
  user: any
}

// Mock Hybrid methodology data combining Agile and Waterfall elements
const mockHybridData = {
  methodology: {
    phases: ['Planning (Waterfall)', 'Development (Agile)', 'Testing (Agile)', 'Deployment (Waterfall)'],
    currentPhase: 'Development (Agile)',
    approach: 'waterfall-planning-agile-execution'
  },
  agileMetrics: {
    currentSprint: {
      name: 'Sprint 3',
      progress: 70,
      velocity: 32,
      burndownTrend: 'on-track'
    },
    backlogItems: 45,
    completedStories: 23
  },
  waterfallMetrics: {
    phases: [
      { name: 'Requirements', status: 'completed', progress: 100 },
      { name: 'High-level Design', status: 'completed', progress: 100 },
      { name: 'Development', status: 'in-progress', progress: 65 },
      { name: 'System Testing', status: 'planned', progress: 0 },
      { name: 'Deployment', status: 'planned', progress: 0 }
    ],
    milestones: [
      { name: 'Design Sign-off', status: 'completed', date: '2024-02-15' },
      { name: 'Alpha Release', status: 'at-risk', date: '2024-04-15' },
      { name: 'Beta Release', status: 'planned', date: '2024-05-15' },
      { name: 'Go-Live', status: 'planned', date: '2024-06-30' }
    ]
  }
}

export function HybridProjectDashboard({ project, user }: HybridProjectDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#28A745]/10 text-[#28A745] border-[#28A745]/30'
      case 'in-progress': return 'bg-[#007BFF]/10 text-[#007BFF] border-[#007BFF]/30'
      case 'at-risk': return 'bg-[#FFC107]/10 text-[#FFC107] border-[#FFC107]/30'
      case 'planned': return 'bg-[#6C757D]/10 text-[#6C757D] border-[#6C757D]/30'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Hybrid Methodology Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitMerge className="w-5 h-5 text-[#6F42C1]" />
            <span>Hybrid Methodology Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Project Approach</h4>
              <div className="space-y-2">
                {mockHybridData.methodology.phases.map((phase, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      phase === mockHybridData.methodology.currentPhase 
                        ? 'bg-[#6F42C1] text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm ${
                      phase === mockHybridData.methodology.currentPhase 
                        ? 'font-medium text-[#6F42C1]' 
                        : 'text-muted-foreground'
                    }`}>
                      {phase}
                    </span>
                    {phase === mockHybridData.methodology.currentPhase && (
                      <Badge variant="outline" className="bg-[#6F42C1]/10 text-[#6F42C1] border-[#6F42C1]/30">
                        Current
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Methodology Benefits</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#28A745]" />
                  <span>Structured planning phase (Waterfall)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#28A745]" />
                  <span>Flexible development execution (Agile)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#28A745]" />
                  <span>Iterative feedback and adaptation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#28A745]" />
                  <span>Risk mitigation through phased approach</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="agile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agile" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Agile Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="waterfall" className="flex items-center space-x-2">
            <Layers className="w-4 h-4" />
            <span>Phase Progress</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agile" className="space-y-6">
          {/* Agile Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-[#007BFF]" />
                  <span>Current Sprint</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{mockHybridData.agileMetrics.currentSprint.name}</span>
                      <Badge variant="outline" className="bg-[#28A745]/10 text-[#28A745] border-[#28A745]/30">
                        {mockHybridData.agileMetrics.currentSprint.burndownTrend}
                      </Badge>
                    </div>
                    <Progress value={mockHybridData.agileMetrics.currentSprint.progress} className="h-2" />
                    <div className="text-sm text-muted-foreground mt-1">
                      {mockHybridData.agileMetrics.currentSprint.progress}% Complete
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-[#007BFF]">
                        {mockHybridData.agileMetrics.currentSprint.velocity}
                      </div>
                      <div className="text-xs text-muted-foreground">Sprint Velocity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-[#28A745]">
                        {mockHybridData.agileMetrics.completedStories}
                      </div>
                      <div className="text-xs text-muted-foreground">Stories Done</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-[#FFC107]" />
                  <span>Product Backlog</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-3xl font-semibold text-[#FFC107]">
                      {mockHybridData.agileMetrics.backlogItems}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Items</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold">15</div>
                      <div className="text-muted-foreground">Ready</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">18</div>
                      <div className="text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">12</div>
                      <div className="text-muted-foreground">Refinement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#28A745]" />
                  <span>Team Velocity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[#28A745]">28</div>
                    <div className="text-sm text-muted-foreground">Average Velocity</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sprint 1</span>
                      <span>25 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sprint 2</span>
                      <span>30 pts</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-[#007BFF]">
                      <span>Sprint 3</span>
                      <span>32 pts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="waterfall" className="space-y-6">
          {/* Waterfall Phase Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#007BFF]" />
                  <span>Phase Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHybridData.waterfallMetrics.phases.map((phase, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          phase.status === 'completed' ? 'bg-[#28A745] text-white' :
                          phase.status === 'in-progress' ? 'bg-[#007BFF] text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{phase.name}</div>
                          <Badge variant="outline" className={getStatusColor(phase.status)} style={{ fontSize: '10px' }}>
                            {phase.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">{phase.progress}%</div>
                        <Progress value={phase.progress} className="h-1 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flag className="w-5 h-5 text-[#FFC107]" />
                  <span>Key Milestones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHybridData.waterfallMetrics.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{milestone.name}</div>
                        <div className="text-xs text-muted-foreground">{milestone.date}</div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(milestone.status)}>
                        {milestone.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Team Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#6F42C1]" />
            <span>Team Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {project?.team?.length > 0 ? (
              project.team.map((member: any) => (
              <div key={member.id} className="text-center p-4 border rounded-lg">
                <Avatar className="w-12 h-12 mx-auto mb-3">
                  <AvatarFallback className="bg-[#28A745] text-white">
                    {member.avatar || member.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="font-medium text-sm mb-1">{member.name}</div>
                <div className="text-xs text-muted-foreground mb-3">{member.role}</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Sprint Tasks</span>
                    <span className="font-medium">{Math.floor(Math.random() * 8) + 3}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Phase Tasks</span>
                    <span className="font-medium">{Math.floor(Math.random() * 5) + 2}</span>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-8">
                <p>No team members assigned to this project yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}