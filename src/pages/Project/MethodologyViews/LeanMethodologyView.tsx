import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Separator } from '../../../components/ui/separator'
import {
  TrendingDown,
  BarChart3,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  RefreshCw,
  Plus,
  ChevronRight,
  Trash2,
  Recycle,
  ArrowRight,
  Timer,
  Users,
  TrendingUp,
  Minimize,
  Maximize
} from 'lucide-react'

interface LeanMethodologyViewProps {
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
}

export function LeanMethodologyView({ project, onTaskView, onTaskCreate }: LeanMethodologyViewProps) {
  const [activeTab, setActiveTab] = useState('valuestream')

  const valueStreamMapping = {
    steps: [
      {
        name: 'Requirement Analysis',
        type: 'value-add',
        duration: 2,
        waitTime: 1,
        efficiency: 67,
        improvements: ['Standardize requirement templates', 'Reduce review cycles']
      },
      {
        name: 'Design Review',
        type: 'necessary-non-value',
        duration: 1.5,
        waitTime: 3,
        efficiency: 33,
        improvements: ['Parallel review process', 'Automated design validation']
      },
      {
        name: 'Development',
        type: 'value-add',
        duration: 8,
        waitTime: 0.5,
        efficiency: 94,
        improvements: ['Pair programming', 'Automated testing']
      },
      {
        name: 'Code Review',
        type: 'necessary-non-value',
        duration: 1,
        waitTime: 2,
        efficiency: 33,
        improvements: ['Smaller commits', 'Review guidelines']
      },
      {
        name: 'Testing',
        type: 'value-add',
        duration: 3,
        waitTime: 1,
        efficiency: 75,
        improvements: ['Automated test suites', 'Continuous testing']
      },
      {
        name: 'Deployment',
        type: 'value-add',
        duration: 0.5,
        waitTime: 0.5,
        efficiency: 50,
        improvements: ['CI/CD pipeline', 'Infrastructure as code']
      }
    ],
    metrics: {
      totalLeadTime: 19,
      totalValueAddTime: 13.5,
      totalWasteTime: 8,
      processEfficiency: 71
    }
  }

  const wasteIdentification = {
    categories: [
      {
        type: 'Waiting',
        description: 'Delays between process steps',
        instances: 12,
        impact: 'High',
        cost: 8400,
        examples: ['Code review bottlenecks', 'Environment provisioning delays']
      },
      {
        type: 'Defects',
        description: 'Bugs and rework requirements',
        instances: 8,
        impact: 'Medium',
        cost: 5600,
        examples: ['Integration failures', 'UI inconsistencies']
      },
      {
        type: 'Overproduction',
        description: 'Building unnecessary features',
        instances: 3,
        impact: 'High',
        cost: 12000,
        examples: ['Unused API endpoints', 'Over-engineered solutions']
      },
      {
        type: 'Motion',
        description: 'Unnecessary movement of information',
        instances: 15,
        impact: 'Low',
        cost: 2100,
        examples: ['Manual status updates', 'Email-based approvals']
      },
      {
        type: 'Inventory',
        description: 'Work in progress accumulation',
        instances: 6,
        impact: 'Medium',
        cost: 4200,
        examples: ['Undeployed features', 'Incomplete user stories']
      }
    ],
    totalWasteCost: 32300,
    wasteReduction: 18
  }

  const continuousImprovement = {
    kaizen: [
      {
        id: 'K001',
        title: 'Reduce code review time',
        status: 'In Progress',
        impact: 'High',
        owner: 'Development Team',
        startDate: '2024-01-10',
        expectedCompletion: '2024-01-25',
        progress: 60
      },
      {
        id: 'K002',
        title: 'Automate deployment process',
        status: 'Completed',
        impact: 'High',
        owner: 'DevOps Team',
        startDate: '2023-12-15',
        expectedCompletion: '2024-01-05',
        progress: 100
      },
      {
        id: 'K003',
        title: 'Streamline requirement gathering',
        status: 'Planning',
        impact: 'Medium',
        owner: 'Product Team',
        startDate: '2024-01-20',
        expectedCompletion: '2024-02-10',
        progress: 0
      }
    ],
    metrics: {
      implementedImprovements: 24,
      averageImplementationTime: 12,
      costSavings: 45000,
      efficiencyGain: 23
    }
  }

  const leanMetrics = {
    takt: {
      time: 2.4,
      demand: 125,
      capacity: 150,
      efficiency: 83
    },
    cycleTime: {
      current: 4.2,
      target: 3.5,
      trend: -8
    },
    throughput: {
      daily: 8.5,
      weekly: 42,
      monthly: 168
    },
    quality: {
      firstPassYield: 94,
      defectRate: 2.3,
      reworkTime: 8
    }
  }

  const getWasteImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-[#DC3545] text-white'
      case 'Medium': return 'bg-[#FFC107] text-white'
      case 'Low': return 'bg-[#28A745] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'value-add': return 'bg-[#28A745]/10 border-[#28A745]'
      case 'necessary-non-value': return 'bg-[#FFC107]/10 border-[#FFC107]'
      case 'non-value': return 'bg-[#DC3545]/10 border-[#DC3545]'
      default: return 'bg-muted/10 border-muted'
    }
  }

  const getKaizenStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-[#28A745] bg-[#28A745]/10'
      case 'In Progress': return 'text-[#FFC107] bg-[#FFC107]/10'
      case 'Planning': return 'text-[#007BFF] bg-[#007BFF]/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const getWasteIcon = (type: string) => {
    switch (type) {
      case 'Waiting': return <Clock className="w-4 h-4" />
      case 'Defects': return <AlertTriangle className="w-4 h-4" />
      case 'Overproduction': return <Maximize className="w-4 h-4" />
      case 'Motion': return <Activity className="w-4 h-4" />
      case 'Inventory': return <BarChart3 className="w-4 h-4" />
      default: return <Trash2 className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Lean Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#28A745]/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#28A745]" />
            </div>
            <div>
              <h3 className="font-semibold">Process Efficiency</h3>
              <p className="text-sm text-muted-foreground">Value-add ratio</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#28A745]">{valueStreamMapping.metrics.processEfficiency}%</p>
            <p className="text-sm text-muted-foreground">Value-add time</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#DC3545]/10 rounded-lg">
              <TrendingDown className="w-5 h-5 text-[#DC3545]" />
            </div>
            <div>
              <h3 className="font-semibold">Waste Reduction</h3>
              <p className="text-sm text-muted-foreground">Cost savings</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#DC3545]">${(wasteIdentification.totalWasteCost / 1000).toFixed(0)}k</p>
            <p className="text-sm text-muted-foreground">Identified waste</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#007BFF]/10 rounded-lg">
              <Timer className="w-5 h-5 text-[#007BFF]" />
            </div>
            <div>
              <h3 className="font-semibold">Cycle Time</h3>
              <p className="text-sm text-muted-foreground">Current vs target</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#007BFF]">{leanMetrics.cycleTime.current}d</p>
            <p className="text-sm text-muted-foreground">
              <span className="text-[#28A745]">{leanMetrics.cycleTime.trend}%</span> improvement
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#FFC107]/10 rounded-lg">
              <Recycle className="w-5 h-5 text-[#FFC107]" />
            </div>
            <div>
              <h3 className="font-semibold">Kaizen Events</h3>
              <p className="text-sm text-muted-foreground">Active improvements</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#FFC107]">{continuousImprovement.kaizen.filter(k => k.status !== 'Completed').length}</p>
            <p className="text-sm text-muted-foreground">In progress</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="valuestream">Value Stream</TabsTrigger>
              <TabsTrigger value="waste">Waste Analysis</TabsTrigger>
              <TabsTrigger value="kaizen">Continuous Improvement</TabsTrigger>
              <TabsTrigger value="metrics">Lean Metrics</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze
              </Button>
              <Button size="sm" onClick={onTaskCreate} className="bg-[#007BFF] hover:bg-[#0056b3]">
                <Plus className="w-4 h-4 mr-2" />
                Add Improvement
              </Button>
            </div>
          </div>

          <TabsContent value="valuestream" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Value Stream Mapping</h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Total Lead Time: {valueStreamMapping.metrics.totalLeadTime} days</span>
                <span>•</span>
                <span>Value-Add Time: {valueStreamMapping.metrics.totalValueAddTime} days</span>
              </div>
            </div>

            {/* Value Stream Steps */}
            <div className="space-y-4">
              {valueStreamMapping.steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className={`p-4 border-l-4 ${getStepTypeColor(step.type)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#007BFF] text-white text-sm flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{step.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {step.type.replace('-', ' ')} activity
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{step.efficiency}% efficient</Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Process Time</p>
                        <p className="text-sm font-medium">{step.duration} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Wait Time</p>
                        <p className="text-sm font-medium">{step.waitTime} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Time</p>
                        <p className="text-sm font-medium">{step.duration + step.waitTime} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                        <p className="text-sm font-medium">{step.efficiency}%</p>
                      </div>
                    </div>

                    <Progress value={step.efficiency} className="h-2 mb-3" />

                    <div>
                      <p className="text-sm font-medium mb-2">Improvement Opportunities:</p>
                      <div className="flex flex-wrap gap-2">
                        {step.improvements.map((improvement, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {improvement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Flow Arrow */}
                  {index < valueStreamMapping.steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Value Stream Summary */}
            <Card className="p-4 bg-muted/30">
              <h4 className="font-medium mb-3">Value Stream Summary</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#007BFF]">{valueStreamMapping.metrics.totalLeadTime}</p>
                  <p className="text-sm text-muted-foreground">Total Lead Time (days)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#28A745]">{valueStreamMapping.metrics.totalValueAddTime}</p>
                  <p className="text-sm text-muted-foreground">Value-Add Time (days)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#DC3545]">{valueStreamMapping.metrics.totalWasteTime}</p>
                  <p className="text-sm text-muted-foreground">Waste Time (days)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#FFC107]">{valueStreamMapping.metrics.processEfficiency}%</p>
                  <p className="text-sm text-muted-foreground">Process Efficiency</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="waste" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Waste Analysis (7 Wastes of Lean)</h3>
              <div className="text-sm text-muted-foreground">
                Total Cost Impact: ${(wasteIdentification.totalWasteCost / 1000).toFixed(0)}k
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {wasteIdentification.categories.map((waste, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getWasteIcon(waste.type)}
                      <div>
                        <h4 className="font-medium">{waste.type}</h4>
                        <p className="text-sm text-muted-foreground">{waste.description}</p>
                      </div>
                    </div>
                    <Badge className={getWasteImpactColor(waste.impact)}>
                      {waste.impact}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Instances</p>
                      <p className="text-lg font-bold">{waste.instances}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cost Impact</p>
                      <p className="text-lg font-bold">${(waste.cost / 1000).toFixed(1)}k</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Examples:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {waste.examples.map((example, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>

            {/* Waste Reduction Progress */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Waste Reduction Progress</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#DC3545]">${(wasteIdentification.totalWasteCost / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-muted-foreground">Identified Waste</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#28A745]">{wasteIdentification.wasteReduction}%</p>
                  <p className="text-sm text-muted-foreground">Waste Reduced</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#007BFF]">${((wasteIdentification.totalWasteCost * wasteIdentification.wasteReduction / 100) / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                </div>
              </div>
              <Progress value={wasteIdentification.wasteReduction} className="h-3 mt-4" />
            </Card>
          </TabsContent>

          <TabsContent value="kaizen" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Kaizen (Continuous Improvement) Events</h3>
              <Badge variant="outline">
                {continuousImprovement.kaizen.length} total events
              </Badge>
            </div>

            <div className="space-y-4">
              {continuousImprovement.kaizen.map((kaizen) => (
                <Card key={kaizen.id} className="p-4" onClick={() => onTaskView?.(kaizen)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{kaizen.id}</Badge>
                      <div>
                        <h4 className="font-medium">{kaizen.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Owner: {kaizen.owner} • Started: {kaizen.startDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getWasteImpactColor(kaizen.impact)}>
                        {kaizen.impact} Impact
                      </Badge>
                      <Badge className={getKaizenStatusColor(kaizen.status)}>
                        {kaizen.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{kaizen.progress}%</span>
                    </div>
                    <Progress value={kaizen.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Expected completion: {kaizen.expectedCompletion}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Continuous Improvement Metrics */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Improvement Impact</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#007BFF]">{continuousImprovement.metrics.implementedImprovements}</p>
                  <p className="text-sm text-muted-foreground">Implemented</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#FFC107]">{continuousImprovement.metrics.averageImplementationTime}</p>
                  <p className="text-sm text-muted-foreground">Avg Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#28A745]">${(continuousImprovement.metrics.costSavings / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#DC3545]">{continuousImprovement.metrics.efficiencyGain}%</p>
                  <p className="text-sm text-muted-foreground">Efficiency Gain</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <h3 className="font-semibold">Lean Performance Metrics</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Takt Time */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">Takt Time Analysis</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Takt Time</p>
                      <p className="text-2xl font-bold text-[#007BFF]">{leanMetrics.takt.time}h</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                      <p className="text-2xl font-bold text-[#28A745]">{leanMetrics.takt.efficiency}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Customer Demand</span>
                      <span>{leanMetrics.takt.demand} units/month</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Available Capacity</span>
                      <span>{leanMetrics.takt.capacity} units/month</span>
                    </div>
                  </div>

                  <Progress value={leanMetrics.takt.efficiency} className="h-2" />
                </div>
              </Card>

              {/* Cycle Time */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">Cycle Time Performance</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="text-2xl font-bold text-[#007BFF]">{leanMetrics.cycleTime.current}d</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target</p>
                      <p className="text-2xl font-bold text-[#28A745]">{leanMetrics.cycleTime.target}d</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Improvement Trend</span>
                    <span className="font-semibold text-[#28A745]">{leanMetrics.cycleTime.trend}%</span>
                  </div>

                  <Progress value={Math.abs(leanMetrics.cycleTime.trend)} className="h-2" />
                </div>
              </Card>

              {/* Throughput */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">Throughput Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#007BFF]">{leanMetrics.throughput.daily}</p>
                    <p className="text-xs text-muted-foreground">Daily</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#28A745]">{leanMetrics.throughput.weekly}</p>
                    <p className="text-xs text-muted-foreground">Weekly</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#FFC107]">{leanMetrics.throughput.monthly}</p>
                    <p className="text-xs text-muted-foreground">Monthly</p>
                  </div>
                </div>
              </Card>

              {/* Quality Metrics */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">Quality Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">First Pass Yield</span>
                    <span className="font-semibold text-[#28A745]">{leanMetrics.quality.firstPassYield}%</span>
                  </div>
                  <Progress value={leanMetrics.quality.firstPassYield} className="h-2" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Defect Rate</span>
                      <p className="font-semibold">{leanMetrics.quality.defectRate}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rework Time</span>
                      <p className="font-semibold">{leanMetrics.quality.reworkTime}h</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}