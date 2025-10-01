import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'
import { Calendar } from '../../../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Download,
  FileText,
  PieChart,
  Activity,
  Clock,
  Target,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

// Simple date formatting function
const formatDate = (date: Date, formatType: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  if (formatType === 'MMM d') {
    return `${months[date.getMonth()]} ${date.getDate()}`
  } else if (formatType === 'MMM d, yyyy' || formatType === 'PPP') {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }
  return date.toLocaleDateString()
}

interface ReportsViewProps {
  projectId: string
  user: any
}

// Mock report data
const mockReportData = {
  velocity: {
    current: 28,
    previous: 24,
    trend: 'up',
    sprints: [
      { name: 'Sprint 1', velocity: 18, planned: 20 },
      { name: 'Sprint 2', velocity: 24, planned: 22 },
      { name: 'Sprint 3', velocity: 28, planned: 25 },
      { name: 'Sprint 4', velocity: 0, planned: 26 }
    ]
  },
  burndown: {
    totalStoryPoints: 120,
    completedStoryPoints: 85,
    remainingStoryPoints: 35,
    burndownData: [
      { day: 1, ideal: 120, actual: 120 },
      { day: 2, ideal: 115, actual: 118 },
      { day: 3, ideal: 110, actual: 115 },
      { day: 4, ideal: 105, actual: 110 },
      { day: 5, ideal: 100, actual: 105 },
      { day: 6, ideal: 95, actual: 98 },
      { day: 7, ideal: 90, actual: 95 },
      { day: 8, ideal: 85, actual: 88 },
      { day: 9, ideal: 80, actual: 85 },
      { day: 10, ideal: 75, actual: 85 }
    ]
  },
  taskCompletion: {
    completed: 45,
    inProgress: 12,
    todo: 23,
    blocked: 3,
    completionRate: 78
  },
  teamPerformance: [
    { name: 'Alice Johnson', tasksCompleted: 28, hoursLogged: 156, efficiency: 92 },
    { name: 'Bob Chen', tasksCompleted: 42, hoursLogged: 189, efficiency: 88 },
    { name: 'Carol Davis', tasksCompleted: 19, hoursLogged: 134, efficiency: 85 },
    { name: 'David Wilson', tasksCompleted: 31, hoursLogged: 98, efficiency: 95 },
    { name: 'Emma Rodriguez', tasksCompleted: 15, hoursLogged: 89, efficiency: 87 }
  ],
  timeTracking: {
    totalHours: 666,
    billableHours: 598,
    avgHoursPerDay: 6.8,
    overtime: 24,
    weeklyData: [
      { week: 'Week 1', hours: 168, planned: 160 },
      { week: 'Week 2', hours: 172, planned: 160 },
      { week: 'Week 3', hours: 158, planned: 160 },
      { week: 'Week 4', hours: 168, planned: 160 }
    ]
  },
  qualityMetrics: {
    bugsFound: 23,
    bugsFixed: 20,
    bugResolutionTime: 2.4,
    codeReviews: 56,
    testCoverage: 87
  }
}

export function ReportsView({ projectId, user }: ReportsViewProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: new Date(2024, 2, 1), // March 1, 2024
    to: new Date(2024, 2, 31)   // March 31, 2024
  })
  const [reportType, setReportType] = useState('all')
  const [selectedTab, setSelectedTab] = useState('overview')

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />
      default: return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'stable': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const MetricCard = ({ 
    title, 
    value, 
    unit = '', 
    trend, 
    trendValue, 
    icon: Icon 
  }: { 
    title: string
    value: number | string
    unit?: string
    trend?: string
    trendValue?: number
    icon: any 
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-2xl font-semibold">
              {value}{unit}
            </p>
            {trend && trendValue && (
              <div className={`flex items-center space-x-1 text-sm ${getTrendColor(trend)}`}>
                {getTrendIcon(trend)}
                <span>{trendValue}% vs last period</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ChartPlaceholder = ({ title, type }: { title: string, type: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <p>{type} chart visualization</p>
            <p className="text-sm">Chart library integration needed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Reports</h2>
          <p className="text-muted-foreground">Project analytics and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="velocity">Velocity</SelectItem>
              <SelectItem value="burndown">Burndown</SelectItem>
              <SelectItem value="time">Time Tracking</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {dateRange.from ? formatDate(dateRange.from, "MMM d") : "Start date"} - {dateRange.to ? formatDate(dateRange.to, "MMM d") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button className="bg-[#28A745] hover:bg-[#218838]">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="burndown">Burndown</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Current Velocity"
              value={mockReportData.velocity.current}
              unit=" points"
              trend="up"
              trendValue={17}
              icon={TrendingUp}
            />
            <MetricCard
              title="Completion Rate"
              value={mockReportData.taskCompletion.completionRate}
              unit="%"
              trend="up"
              trendValue={5}
              icon={CheckCircle}
            />
            <MetricCard
              title="Team Efficiency"
              value={89}
              unit="%"
              trend="stable"
              trendValue={0}
              icon={Users}
            />
            <MetricCard
              title="Bug Resolution"
              value={2.4}
              unit=" days"
              trend="down"
              trendValue={12}
              icon={AlertTriangle}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="Sprint Velocity Trend" type="Line" />
            <ChartPlaceholder title="Task Distribution" type="Pie" />
            <ChartPlaceholder title="Burndown Progress" type="Area" />
            <ChartPlaceholder title="Team Performance" type="Bar" />
          </div>
        </TabsContent>

        <TabsContent value="velocity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Current Sprint"
              value={mockReportData.velocity.current}
              unit=" points"
              icon={Target}
            />
            <MetricCard
              title="Previous Sprint"
              value={mockReportData.velocity.previous}
              unit=" points"
              icon={Activity}
            />
            <MetricCard
              title="Average Velocity"
              value={23.3}
              unit=" points"
              icon={TrendingUp}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="Velocity Trend" type="Line" />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sprint Velocity Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReportData.velocity.sprints.map((sprint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{sprint.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Planned: {sprint.planned} points
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{sprint.velocity || 'In Progress'}</p>
                        {sprint.velocity > 0 && (
                          <p className={`text-sm ${sprint.velocity >= sprint.planned ? 'text-green-600' : 'text-red-600'}`}>
                            {sprint.velocity >= sprint.planned ? '+' : ''}{sprint.velocity - sprint.planned} vs planned
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="burndown" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Story Points"
              value={mockReportData.burndown.totalStoryPoints}
              unit=" points"
              icon={Target}
            />
            <MetricCard
              title="Completed"
              value={mockReportData.burndown.completedStoryPoints}
              unit=" points"
              icon={CheckCircle}
            />
            <MetricCard
              title="Remaining"
              value={mockReportData.burndown.remainingStoryPoints}
              unit=" points"
              icon={Clock}
            />
          </div>

          <ChartPlaceholder title="Sprint Burndown Chart" type="Line" />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Burndown Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">On Track</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    The team is performing well and is on track to complete the sprint goals.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">Key Insights</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• 71% of sprint completed</li>
                      <li>• Ahead of ideal burndown line</li>
                      <li>• Consistent daily progress</li>
                      <li>• No major blockers identified</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Recommendations</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Continue current pace</li>
                      <li>• Monitor for scope creep</li>
                      <li>• Prepare for next sprint</li>
                      <li>• Document lessons learned</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Hours"
              value={mockReportData.timeTracking.totalHours}
              unit="h"
              icon={Clock}
            />
            <MetricCard
              title="Billable Hours"
              value={mockReportData.timeTracking.billableHours}
              unit="h"
              icon={Target}
            />
            <MetricCard
              title="Avg Hours/Day"
              value={mockReportData.timeTracking.avgHoursPerDay}
              unit="h"
              icon={TrendingUp}
            />
            <MetricCard
              title="Overtime"
              value={mockReportData.timeTracking.overtime}
              unit="h"
              icon={AlertTriangle}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="Weekly Hours Trend" type="Bar" />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReportData.teamPerformance.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.tasksCompleted} tasks • {member.hoursLogged}h logged
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{member.efficiency}%</p>
                        <p className="text-sm text-muted-foreground">Efficiency</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Bugs Found"
              value={mockReportData.qualityMetrics.bugsFound}
              icon={AlertTriangle}
            />
            <MetricCard
              title="Bugs Fixed"
              value={mockReportData.qualityMetrics.bugsFixed}
              icon={CheckCircle}
            />
            <MetricCard
              title="Resolution Time"
              value={mockReportData.qualityMetrics.bugResolutionTime}
              unit=" days"
              icon={Clock}
            />
            <MetricCard
              title="Test Coverage"
              value={mockReportData.qualityMetrics.testCoverage}
              unit="%"
              icon={Target}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="Bug Trend Analysis" type="Line" />
            <ChartPlaceholder title="Code Quality Metrics" type="Radar" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Code Quality</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Test Coverage</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Code Reviews</span>
                      <span className="text-sm font-medium">56 completed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Technical Debt</span>
                      <span className="text-sm font-medium text-yellow-600">Medium</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Bug Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Open Bugs</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Critical Issues</span>
                      <span className="text-sm font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Resolution</span>
                      <span className="text-sm font-medium">2.4 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}