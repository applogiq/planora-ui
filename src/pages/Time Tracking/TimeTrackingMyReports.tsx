import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { BarChart3, Clock, DollarSign, TrendingUp, Activity, Calendar, FileText } from 'lucide-react'
import { Button } from '../../components/ui/button'

// Mock data for Developer Reports
const developerReportsData = {
  weeklyStats: [
    { week: 'Jan 06-12', hours: 42, billable: 38, overtime: 2 },
    { week: 'Jan 13-19', hours: 39, billable: 35, overtime: 0 },
    { week: 'Dec 30-05', hours: 35, billable: 32, overtime: 0 },
    { week: 'Dec 23-29', hours: 28, billable: 25, overtime: 0 }
  ],
  monthlyBreakdown: {
    totalHours: 144,
    billableHours: 130,
    nonBillableHours: 14,
    overtimeHours: 2,
    avgHoursPerDay: 7.2,
    efficiency: 90.3
  },
  projectBreakdown: [
    { project: 'Web App Redesign', hours: 85, percentage: 59, billable: true },
    { project: 'Mobile Development', hours: 32, percentage: 22, billable: true },
    { project: 'API Integration', hours: 18, percentage: 13, billable: true },
    { project: 'Team Meetings', hours: 9, percentage: 6, billable: false }
  ],
  skillDevelopment: [
    { skill: 'React Development', hoursSpent: 45, level: 'Advanced', progress: 85 },
    { skill: 'TypeScript', hoursSpent: 28, level: 'Intermediate', progress: 70 },
    { skill: 'Node.js APIs', hoursSpent: 22, level: 'Intermediate', progress: 65 },
    { skill: 'Database Design', hoursSpent: 15, level: 'Beginner', progress: 40 },
    { skill: 'Testing & QA', hoursSpent: 12, level: 'Beginner', progress: 35 }
  ],
  productivityTrends: [
    { date: '2025-01-14', focusTime: 6.5, distractions: 3, productivity: 'High' },
    { date: '2025-01-13', focusTime: 5.8, distractions: 5, productivity: 'Medium' },
    { date: '2025-01-12', focusTime: 7.2, distractions: 2, productivity: 'High' },
    { date: '2025-01-11', focusTime: 4.5, distractions: 8, productivity: 'Low' },
    { date: '2025-01-10', focusTime: 6.8, distractions: 3, productivity: 'High' }
  ]
}

interface MyReportsTabProps {
  user?: any
}

export function MyReportsTab({ user }: MyReportsTabProps) {
  const { weeklyStats, monthlyBreakdown, projectBreakdown, skillDevelopment, productivityTrends } = developerReportsData

  const getProductivityColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-[#28A745]'
      case 'Medium': return 'text-[#FFC107]'
      case 'Low': return 'text-[#DC3545]'
      default: return 'text-muted-foreground'
    }
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'bg-[#28A745] text-white'
      case 'Intermediate': return 'bg-[#FFC107] text-white'
      case 'Beginner': return 'bg-[#DC3545] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">My Reports & Analytics</h3>
          <p className="text-sm text-muted-foreground">Personal productivity insights and skill development tracking</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-semibold">{monthlyBreakdown.totalHours}</p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </div>
              <div className="p-3 bg-[#007BFF]/10 rounded-full">
                <Clock className="w-6 h-6 text-[#007BFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Billable Hours</p>
                <p className="text-2xl font-semibold">{monthlyBreakdown.billableHours}</p>
                <p className="text-xs text-[#28A745] mt-1">+12% from last month</p>
              </div>
              <div className="p-3 bg-[#28A745]/10 rounded-full">
                <DollarSign className="w-6 h-6 text-[#28A745]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-semibold">{monthlyBreakdown.efficiency}%</p>
                <p className="text-xs text-[#28A745] mt-1">Above average</p>
              </div>
              <div className="p-3 bg-[#FFC107]/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-[#FFC107]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Hours/Day</p>
                <p className="text-2xl font-semibold">{monthlyBreakdown.avgHoursPerDay}</p>
                <p className="text-xs text-muted-foreground mt-1">Target: 8.0</p>
              </div>
              <div className="p-3 bg-[#DC3545]/10 rounded-full">
                <Activity className="w-6 h-6 text-[#DC3545]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
          <TabsTrigger value="projects">Project Breakdown</TabsTrigger>
          <TabsTrigger value="skills">Skill Development</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Weekly Hours Breakdown</span>
              </CardTitle>
              <CardDescription>Your time allocation over recent weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyStats.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium">{week.week}</div>
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <span>Total: {week.hours}h</span>
                        <span className="text-[#28A745]">Billable: {week.billable}h</span>
                        {week.overtime > 0 && (
                          <span className="text-[#FFC107]">Overtime: {week.overtime}h</span>
                        )}
                      </div>
                    </div>
                    <div className="w-48 bg-muted rounded-full h-2">
                      <div 
                        className="bg-[#28A745] h-2 rounded-full" 
                        style={{ width: `${(week.billable / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Time Distribution</CardTitle>
              <CardDescription>How your time is allocated across different projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectBreakdown.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="font-medium">{project.project}</div>
                      <span className={`px-2 py-1 rounded text-xs ${project.billable ? 'bg-[#28A745] text-white' : 'bg-muted text-foreground'}`}>
                        {project.billable ? 'Billable' : 'Non-billable'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">{project.hours}h ({project.percentage}%)</span>
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${project.billable ? 'bg-[#28A745]' : 'bg-muted-foreground'}`}
                          style={{ width: `${project.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Development Progress</CardTitle>
              <CardDescription>Track your learning and skill advancement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillDevelopment.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="font-medium">{skill.skill}</div>
                      <span className={`px-2 py-1 rounded text-xs ${getSkillLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">{skill.hoursSpent}h spent</span>
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-[#007BFF] h-2 rounded-full"
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{skill.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Productivity Metrics</CardTitle>
              <CardDescription>Focus time, distractions, and overall productivity scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productivityTrends.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <span className={`font-medium ${getProductivityColor(day.productivity)}`}>
                        {day.productivity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <span>Focus: {day.focusTime}h</span>
                      <span>Distractions: {day.distractions}</span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            day.productivity === 'High' ? 'bg-[#28A745]' :
                            day.productivity === 'Medium' ? 'bg-[#FFC107]' : 'bg-[#DC3545]'
                          }`}
                          style={{ width: `${(day.focusTime / 8) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}