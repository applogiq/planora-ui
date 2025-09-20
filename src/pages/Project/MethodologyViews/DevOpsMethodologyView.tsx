import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Separator } from '../../../components/ui/separator'
import {
  GitBranch,
  Server,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Zap,
  Target,
  RefreshCw,
  Plus,
  ChevronRight,
  Monitor,
  Code,
  Rocket,
  Bug,
  Settings,
  Database,
  Cloud
} from 'lucide-react'

interface DevOpsMethodologyViewProps {
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
}

export function DevOpsMethodologyView({ project, onTaskView, onTaskCreate }: DevOpsMethodologyViewProps) {
  const [activeTab, setActiveTab] = useState('pipeline')

  const cicdPipeline = {
    stages: [
      { name: 'Build', status: 'success', duration: '2m 15s', lastRun: '10 min ago' },
      { name: 'Test', status: 'success', duration: '5m 42s', lastRun: '8 min ago' },
      { name: 'Security Scan', status: 'warning', duration: '3m 30s', lastRun: '6 min ago' },
      { name: 'Deploy to Staging', status: 'success', duration: '1m 20s', lastRun: '4 min ago' },
      { name: 'Integration Tests', status: 'running', duration: '4m 15s', lastRun: 'Running' },
      { name: 'Deploy to Production', status: 'pending', duration: '-', lastRun: 'Pending' }
    ],
    metrics: {
      successRate: 94,
      avgBuildTime: '12m 30s',
      deploymentFrequency: '3.2/day',
      leadTime: '4.5 hours',
      mttr: '23 minutes',
      changeFailureRate: '2.1%'
    }
  }

  const infrastructure = {
    environments: [
      {
        name: 'Development',
        status: 'healthy',
        uptime: '99.8%',
        lastDeploy: '2 hours ago',
        version: 'v2.3.1-dev',
        resources: { cpu: 45, memory: 62, disk: 34 }
      },
      {
        name: 'Staging',
        status: 'healthy',
        uptime: '99.9%',
        lastDeploy: '1 hour ago',
        version: 'v2.3.0',
        resources: { cpu: 38, memory: 55, disk: 28 }
      },
      {
        name: 'Production',
        status: 'warning',
        uptime: '99.7%',
        lastDeploy: '3 days ago',
        version: 'v2.2.8',
        resources: { cpu: 78, memory: 82, disk: 45 }
      }
    ],
    services: [
      { name: 'API Gateway', status: 'healthy', instances: 3, version: '1.4.2' },
      { name: 'User Service', status: 'healthy', instances: 5, version: '2.1.0' },
      { name: 'Payment Service', status: 'warning', instances: 2, version: '1.8.5' },
      { name: 'Database', status: 'healthy', instances: 1, version: '13.2' },
      { name: 'Redis Cache', status: 'healthy', instances: 2, version: '6.2' }
    ]
  }

  const monitoring = {
    alerts: [
      { level: 'critical', message: 'High CPU usage on Production', service: 'User Service', time: '5 min ago' },
      { level: 'warning', message: 'Slow response times detected', service: 'API Gateway', time: '15 min ago' },
      { level: 'info', message: 'Deployment completed successfully', service: 'Payment Service', time: '1 hour ago' }
    ],
    metrics: {
      availability: 99.7,
      responseTime: 245,
      errorRate: 0.12,
      throughput: 1250
    },
    incidents: [
      { id: 'INC-001', title: 'Database connection timeout', status: 'resolved', severity: 'high', duration: '45 min' },
      { id: 'INC-002', title: 'Payment gateway integration issue', status: 'investigating', severity: 'medium', duration: '2 hours' }
    ]
  }

  const automation = {
    workflows: [
      { name: 'Code Quality Check', triggers: 'Pull Request', status: 'active', runs: 245 },
      { name: 'Security Scan', triggers: 'Daily', status: 'active', runs: 30 },
      { name: 'Backup Database', triggers: 'Daily', status: 'active', runs: 30 },
      { name: 'Performance Test', triggers: 'Weekly', status: 'active', runs: 4 },
      { name: 'Dependency Update', triggers: 'Weekly', status: 'paused', runs: 12 }
    ],
    deployments: {
      total: 156,
      successful: 148,
      failed: 8,
      rollbacks: 3
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy': return 'text-[#28A745] bg-[#28A745]/10'
      case 'warning': return 'text-[#FFC107] bg-[#FFC107]/10'
      case 'error':
      case 'critical':
      case 'failed': return 'text-[#DC3545] bg-[#DC3545]/10'
      case 'running': return 'text-[#007BFF] bg-[#007BFF]/10'
      case 'pending': return 'text-[#6C757D] bg-[#6C757D]/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy': return <CheckCircle className="w-4 h-4 text-[#28A745]" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-[#FFC107]" />
      case 'error':
      case 'critical':
      case 'failed': return <XCircle className="w-4 h-4 text-[#DC3545]" />
      case 'running': return <RefreshCw className="w-4 h-4 text-[#007BFF] animate-spin" />
      case 'pending': return <Clock className="w-4 h-4 text-[#6C757D]" />
      default: return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-[#DC3545] text-white'
      case 'warning': return 'bg-[#FFC107] text-white'
      case 'info': return 'bg-[#007BFF] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* DevOps Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#28A745]/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#28A745]" />
            </div>
            <div>
              <h3 className="font-semibold">Deployment Success</h3>
              <p className="text-sm text-muted-foreground">Pipeline success rate</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#28A745]">{cicdPipeline.metrics.successRate}%</p>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#007BFF]/10 rounded-lg">
              <Rocket className="w-5 h-5 text-[#007BFF]" />
            </div>
            <div>
              <h3 className="font-semibold">Deployment Frequency</h3>
              <p className="text-sm text-muted-foreground">Deployments per day</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#007BFF]">{cicdPipeline.metrics.deploymentFrequency}</p>
            <p className="text-sm text-muted-foreground">This week</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#FFC107]/10 rounded-lg">
              <Clock className="w-5 h-5 text-[#FFC107]" />
            </div>
            <div>
              <h3 className="font-semibold">Lead Time</h3>
              <p className="text-sm text-muted-foreground">Commit to production</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#FFC107]">{cicdPipeline.metrics.leadTime}</p>
            <p className="text-sm text-muted-foreground">Average</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#DC3545]/10 rounded-lg">
              <Activity className="w-5 h-5 text-[#DC3545]" />
            </div>
            <div>
              <h3 className="font-semibold">MTTR</h3>
              <p className="text-sm text-muted-foreground">Mean time to recovery</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#DC3545]">{cicdPipeline.metrics.mttr}</p>
            <p className="text-sm text-muted-foreground">Average</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="pipeline">CI/CD Pipeline</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" onClick={onTaskCreate} className="bg-[#007BFF] hover:bg-[#0056b3]">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          <TabsContent value="pipeline" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Current Pipeline Status</h3>
              <Badge variant="outline">Build #{Math.floor(Math.random() * 1000) + 100}</Badge>
            </div>

            {/* Pipeline Stages */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              {cicdPipeline.stages.map((stage, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">{stage.name}</h4>
                    {getStatusIcon(stage.status)}
                  </div>
                  <div className="space-y-2">
                    <Badge className={getStatusColor(stage.status)} size="sm">
                      {stage.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      <p>Duration: {stage.duration}</p>
                      <p>Last run: {stage.lastRun}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pipeline Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Build Performance</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Build Time</span>
                    <span className="font-semibold">{cicdPipeline.metrics.avgBuildTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-semibold text-[#28A745]">{cicdPipeline.metrics.successRate}%</span>
                  </div>
                  <Progress value={cicdPipeline.metrics.successRate} className="h-2" />
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Deployment Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Frequency</span>
                    <span className="font-semibold">{cicdPipeline.metrics.deploymentFrequency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Change Failure Rate</span>
                    <span className="font-semibold">{cicdPipeline.metrics.changeFailureRate}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-[#28A745]" />
                    <span>Deployed to staging</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-[#28A745]" />
                    <span>Security scan passed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-3 h-3 text-[#007BFF]" />
                    <span>Integration tests running</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-6">
            <h3 className="font-semibold">Environment Health</h3>

            {/* Environments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {infrastructure.environments.map((env, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{env.name}</h4>
                    {getStatusIcon(env.status)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uptime</span>
                      <span className="font-semibold text-[#28A745]">{env.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Version</span>
                      <Badge variant="outline">{env.version}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Last Deploy</span>
                      <span className="text-muted-foreground">{env.lastDeploy}</span>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>CPU</span>
                        <span>{env.resources.cpu}%</span>
                      </div>
                      <Progress value={env.resources.cpu} className="h-1" />

                      <div className="flex items-center justify-between text-xs">
                        <span>Memory</span>
                        <span>{env.resources.memory}%</span>
                      </div>
                      <Progress value={env.resources.memory} className="h-1" />

                      <div className="flex items-center justify-between text-xs">
                        <span>Disk</span>
                        <span>{env.resources.disk}%</span>
                      </div>
                      <Progress value={env.resources.disk} className="h-1" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Services */}
            <div>
              <h4 className="font-medium mb-3">Service Status</h4>
              <div className="space-y-3">
                {infrastructure.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h5 className="font-medium">{service.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {service.instances} instance{service.instances > 1 ? 's' : ''} • Version {service.version}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Alerts */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">Active Alerts</h4>
                <div className="space-y-3">
                  {monitoring.alerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Badge className={getAlertLevelColor(alert.level)}>
                        {alert.level}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.service} • {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* System Metrics */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">System Metrics</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Availability</span>
                      <span className="font-semibold text-[#28A745]">{monitoring.metrics.availability}%</span>
                    </div>
                    <Progress value={monitoring.metrics.availability} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Response Time</span>
                      <p className="font-semibold">{monitoring.metrics.responseTime}ms</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Error Rate</span>
                      <p className="font-semibold">{monitoring.metrics.errorRate}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Throughput</span>
                      <p className="font-semibold">{monitoring.metrics.throughput} req/min</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Incidents */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Recent Incidents</h4>
              <div className="space-y-3">
                {monitoring.incidents.map((incident, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{incident.id}</Badge>
                        <h5 className="font-medium">{incident.title}</h5>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Duration: {incident.duration} • Severity: {incident.severity}
                      </p>
                    </div>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Automation Workflows */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">Automation Workflows</h4>
                <div className="space-y-3">
                  {automation.workflows.map((workflow, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{workflow.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          Triggers: {workflow.triggers} • Runs: {workflow.runs}
                        </p>
                      </div>
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Deployment Statistics */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">Deployment Statistics</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#007BFF]">{automation.deployments.total}</p>
                      <p className="text-sm text-muted-foreground">Total Deployments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#28A745]">{automation.deployments.successful}</p>
                      <p className="text-sm text-muted-foreground">Successful</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#DC3545]">{automation.deployments.failed}</p>
                      <p className="text-sm text-muted-foreground">Failed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#FFC107]">{automation.deployments.rollbacks}</p>
                      <p className="text-sm text-muted-foreground">Rollbacks</p>
                    </div>
                  </div>

                  <div className="pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Success Rate</span>
                      <span className="font-semibold text-[#28A745]">
                        {Math.round((automation.deployments.successful / automation.deployments.total) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(automation.deployments.successful / automation.deployments.total) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* DevOps Best Practices */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">DevOps Health Check</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Continuous Integration</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Automated builds and tests on every commit
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">Security Scanning</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Some vulnerabilities detected in dependencies
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Monitor className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Monitoring & Observability</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive monitoring and alerting in place
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}