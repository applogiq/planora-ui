import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { 
  Kanban, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Activity
} from 'lucide-react'

interface KanbanProjectDashboardProps {
  project: any
  user: any
}

// Mock Kanban-specific data
const mockKanbanData = {
  board: {
    columns: [
      { name: 'Backlog', count: 23, limit: null },
      { name: 'To Do', count: 8, limit: 10 },
      { name: 'In Progress', count: 5, limit: 5 },
      { name: 'Review', count: 3, limit: 3 },
      { name: 'Done', count: 42, limit: null }
    ],
    cycleTime: {
      average: 4.2,
      current: 3.8,
      trend: 'improving'
    },
    throughput: {
      weekly: 8,
      monthly: 32,
      trend: 'stable'
    }
  },
  wipLimits: {
    exceeded: 0,
    atLimit: 2,
    underLimit: 3
  }
}

export function KanbanProjectDashboard({ project, user }: KanbanProjectDashboardProps) {
  const totalTasks = mockKanbanData.board.columns.reduce((sum, col) => sum + col.count, 0)
  const completedTasks = mockKanbanData.board.columns.find(col => col.name === 'Done')?.count || 0
  const completionRate = Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="space-y-6">
      {/* Kanban Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Kanban className="w-5 h-5 text-[#007BFF]" />
              <span>Kanban Board Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {mockKanbanData.board.columns.map((column) => (
                <div key={column.name} className="text-center">
                  <div className="mb-2">
                    <h4 className="text-sm font-medium">{column.name}</h4>
                    {column.limit && (
                      <div className="text-xs text-muted-foreground">
                        Limit: {column.limit}
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-semibold">{column.count}</span>
                    </div>
                    
                    {column.limit && column.count >= column.limit && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">!</span>
                      </div>
                    )}
                  </div>
                  
                  {column.limit && (
                    <div className="mt-2">
                      <Progress 
                        value={(column.count / column.limit) * 100} 
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Under Limit</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>At Limit</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Over Limit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#28A745]" />
              <span>Flow Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Cycle Time</span>
                <Badge variant="outline" className="bg-[#28A745]/10 text-[#28A745] border-[#28A745]/30">
                  {mockKanbanData.board.cycleTime.trend}
                </Badge>
              </div>
              <div className="text-2xl font-semibold">{mockKanbanData.board.cycleTime.average} days</div>
              <div className="text-xs text-muted-foreground">
                Current: {mockKanbanData.board.cycleTime.current} days
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Throughput</span>
                <Badge variant="outline" className="bg-[#007BFF]/10 text-[#007BFF] border-[#007BFF]/30">
                  {mockKanbanData.board.throughput.trend}
                </Badge>
              </div>
              <div className="text-2xl font-semibold">{mockKanbanData.board.throughput.weekly}/week</div>
              <div className="text-xs text-muted-foreground">
                Monthly: {mockKanbanData.board.throughput.monthly} items
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-[#28A745]">
                  {completionRate}%
                </div>
                <div className="text-xs text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WIP Limits Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#28A745]/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#28A745]" />
              </div>
              <div>
                <div className="text-lg font-semibold">{mockKanbanData.wipLimits.underLimit}</div>
                <div className="text-xs text-muted-foreground">Columns Under Limit</div>
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
                <div className="text-lg font-semibold">{mockKanbanData.wipLimits.atLimit}</div>
                <div className="text-xs text-muted-foreground">Columns At Limit</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#DC3545]/10 rounded-lg">
                <Activity className="w-5 h-5 text-[#DC3545]" />
              </div>
              <div>
                <div className="text-lg font-semibold">{mockKanbanData.wipLimits.exceeded}</div>
                <div className="text-xs text-muted-foreground">Columns Over Limit</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#6F42C1]" />
            <span>Team Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.team.slice(0, 4).map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#28A745] text-white text-xs">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-center">
                  <div>
                    <div className="text-sm font-semibold">
                      {Math.floor(Math.random() * 5) + 3}
                    </div>
                    <div className="text-xs text-muted-foreground">Tasks/Week</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      {Math.floor(Math.random() * 3) + 2}.{Math.floor(Math.random() * 9)}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Cycle Time</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}