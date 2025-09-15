import { useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Progress } from '../../components/ui/progress'
import { Separator } from '../../components/ui/separator'
import { toast } from 'sonner@2.0.3'
import { 
  Plus, 
  Search, 
  Filter, 
  Building,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  User,
  FileText,
  Link,
  Shield,
  Eye,
  Settings,
  BarChart3,
  Target,
  CheckCircle,
  XCircle,
  Timer,
  Flag,
  ExternalLink,
  Users,
  Activity,
  Briefcase,
  MessageSquare
} from 'lucide-react'

const customers = [
  {
    id: 'CUST-001',
    name: 'Acme Corporation',
    industry: 'Technology',
    contact: {
      name: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+1 (555) 123-4567',
      title: 'VP of Engineering'
    },
    website: 'www.acme.com',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    status: 'Active',
    contractValue: 150000,
    projectsActive: 2,
    projectsCompleted: 5,
    lastActivity: '2025-09-12',
    slaStatus: 'On Track',
    priority: 'High',
    tags: ['Enterprise', 'Long-term'],
    clientPortalAccess: true,
    projectIds: ['PROJ-001', 'PROJ-003'],
    sla: {
      responseTime: 24, // hours
      resolutionTime: 72, // hours
      uptime: 99.9, // percentage
      supportLevel: 'Premium'
    },
    billingInfo: {
      paymentTerms: 'Net 30',
      billingContact: 'finance@acme.com',
      lastInvoice: '2025-09-01',
      nextInvoice: '2025-10-01'
    }
  },
  {
    id: 'CUST-002',
    name: 'Tech Solutions Inc',
    industry: 'Software',
    contact: {
      name: 'Sarah Johnson',
      email: 'sarah@techsolutions.com',
      phone: '+1 (555) 987-6543',
      title: 'CTO'
    },
    website: 'www.techsolutions.com',
    address: {
      street: '456 Innovation Ave',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'USA'
    },
    status: 'Active',
    contractValue: 85000,
    projectsActive: 1,
    projectsCompleted: 3,
    lastActivity: '2025-09-13',
    slaStatus: 'At Risk',
    priority: 'Medium',
    tags: ['SMB', 'Recurring'],
    clientPortalAccess: true,
    projectIds: ['PROJ-002'],
    sla: {
      responseTime: 48, // hours
      resolutionTime: 120, // hours
      uptime: 99.5, // percentage
      supportLevel: 'Standard'
    },
    billingInfo: {
      paymentTerms: 'Net 15',
      billingContact: 'billing@techsolutions.com',
      lastInvoice: '2025-08-15',
      nextInvoice: '2025-09-15'
    }
  },
  {
    id: 'CUST-003',
    name: 'Global Industries',
    industry: 'Manufacturing',
    contact: {
      name: 'Michael Brown',
      email: 'mbrown@globalind.com',
      phone: '+1 (555) 456-7890',
      title: 'Director of IT'
    },
    website: 'www.globalindustries.com',
    address: {
      street: '789 Manufacturing Blvd',
      city: 'Detroit',
      state: 'MI',
      zip: '48201',
      country: 'USA'
    },
    status: 'Prospective',
    contractValue: 250000,
    projectsActive: 0,
    projectsCompleted: 0,
    lastActivity: '2025-09-10',
    slaStatus: 'N/A',
    priority: 'High',
    tags: ['Enterprise', 'New'],
    clientPortalAccess: false,
    projectIds: [],
    sla: {
      responseTime: 24, // hours
      resolutionTime: 48, // hours
      uptime: 99.9, // percentage
      supportLevel: 'Enterprise'
    },
    billingInfo: {
      paymentTerms: 'Net 45',
      billingContact: 'procurement@globalind.com',
      lastInvoice: null,
      nextInvoice: null
    }
  }
]

// Mock project data with customer associations
const customerProjects = [
  {
    id: 'PROJ-001',
    name: 'Web App Redesign',
    customerId: 'CUST-001',
    status: 'In Progress',
    progress: 75,
    startDate: '2025-08-01',
    dueDate: '2025-10-15',
    milestones: [
      { id: 'M1', name: 'UI/UX Design Complete', status: 'Completed', dueDate: '2025-08-15', completedDate: '2025-08-14' },
      { id: 'M2', name: 'Frontend Development', status: 'In Progress', dueDate: '2025-09-15', completedDate: null },
      { id: 'M3', name: 'Backend Integration', status: 'Pending', dueDate: '2025-09-30', completedDate: null },
      { id: 'M4', name: 'Testing & QA', status: 'Pending', dueDate: '2025-10-10', completedDate: null }
    ]
  },
  {
    id: 'PROJ-002',
    name: 'Mobile App Development',
    customerId: 'CUST-002',
    status: 'Planning',
    progress: 25,
    startDate: '2025-09-15',
    dueDate: '2025-12-01',
    milestones: [
      { id: 'M5', name: 'Requirements Gathering', status: 'Completed', dueDate: '2025-09-20', completedDate: '2025-09-18' },
      { id: 'M6', name: 'Technical Architecture', status: 'In Progress', dueDate: '2025-10-01', completedDate: null },
      { id: 'M7', name: 'MVP Development', status: 'Pending', dueDate: '2025-11-15', completedDate: null }
    ]
  },
  {
    id: 'PROJ-003',
    name: 'API Integration',
    customerId: 'CUST-001',
    status: 'In Progress',
    progress: 90,
    startDate: '2025-07-01',
    dueDate: '2025-09-30',
    milestones: [
      { id: 'M8', name: 'API Design', status: 'Completed', dueDate: '2025-07-15', completedDate: '2025-07-12' },
      { id: 'M9', name: 'Implementation', status: 'Completed', dueDate: '2025-08-30', completedDate: '2025-08-28' },
      { id: 'M10', name: 'Testing', status: 'In Progress', dueDate: '2025-09-20', completedDate: null },
      { id: 'M11', name: 'Deployment', status: 'Pending', dueDate: '2025-09-30', completedDate: null }
    ]
  }
]

// SLA compliance tracking
const slaMetrics = [
  {
    customerId: 'CUST-001',
    period: 'September 2025',
    responseTimeCompliance: 98.5,
    resolutionTimeCompliance: 95.2,
    uptimeActual: 99.95,
    ticketsTotal: 24,
    ticketsOnTime: 23,
    avgResponseTime: 18, // hours
    avgResolutionTime: 65 // hours
  },
  {
    customerId: 'CUST-002',
    period: 'September 2025',
    responseTimeCompliance: 87.3,
    resolutionTimeCompliance: 82.1,
    uptimeActual: 99.2,
    ticketsTotal: 15,
    ticketsOnTime: 12,
    avgResponseTime: 52, // hours
    avgResolutionTime: 118 // hours
  }
]

const recentActivities = [
  {
    customer: 'Acme Corporation',
    activity: 'New project milestone reached',
    time: '2 hours ago',
    type: 'milestone'
  },
  {
    customer: 'Tech Solutions Inc',
    activity: 'SLA deadline approaching',
    time: '4 hours ago',
    type: 'alert'
  },
  {
    customer: 'Acme Corporation',
    activity: 'Invoice payment received',
    time: '1 day ago',
    type: 'payment'
  }
]

interface CustomersProps {
  user?: any
}

export function Customers({ user }: CustomersProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [showCustomerDetail, setShowCustomerDetail] = useState(false)
  const [showClientPortal, setShowClientPortal] = useState(false)
  const [showCreateCustomer, setShowCreateCustomer] = useState(false)
  const [selectedClientView, setSelectedClientView] = useState<string | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    industry: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    address: ''
  })

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustomer.name.trim() || !newCustomer.email.trim()) {
      toast.error('Customer name and email are required')
      return
    }
    toast.success('Customer created successfully!')
    setShowCreateCustomer(false)
    setNewCustomer({
      name: '', industry: '', contactName: '', email: '', phone: '', website: '', address: ''
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[#28A745] text-white'
      case 'Inactive': return 'bg-[#6C757D] text-white'
      case 'Prospective': return 'bg-[#007BFF] text-white'
      case 'On Hold': return 'bg-[#FFC107] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'text-[#28A745]'
      case 'At Risk': return 'text-[#FFC107]'
      case 'Overdue': return 'text-[#DC3545]'
      default: return 'text-muted-foreground'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-l-[#DC3545] bg-[#DC3545]/5'
      case 'Medium': return 'border-l-[#FFC107] bg-[#FFC107]/5'
      case 'Low': return 'border-l-[#28A745] bg-[#28A745]/5'
      default: return 'border-l-muted bg-muted/5'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Customer CRM</h1>
          <p className="text-muted-foreground">Lightweight CRM with client portal access & project transparency</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowClientPortal(true)}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Client Portal
          </Button>
          <Button size="sm" className="bg-[#28A745] hover:bg-[#218838] text-white" onClick={() => setShowCreateCustomer(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Project Associations</TabsTrigger>
          <TabsTrigger value="sla">SLA Compliance</TabsTrigger>
          <TabsTrigger value="portal">Client Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-semibold">{customers.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">2 new this month</p>
                </div>
                <div className="p-3 bg-[#007BFF]/10 rounded-full">
                  <Building className="w-6 h-6 text-[#007BFF]" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-semibold">3</p>
                  <p className="text-xs text-muted-foreground mt-1">Across 2 customers</p>
                </div>
                <div className="p-3 bg-[#28A745]/10 rounded-full">
                  <TrendingUp className="w-6 h-6 text-[#28A745]" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contract Value</p>
                  <p className="text-2xl font-semibold">$485k</p>
                  <p className="text-xs text-muted-foreground mt-1">Total active contracts</p>
                </div>
                <div className="p-3 bg-[#FFC107]/10 rounded-full">
                  <DollarSign className="w-6 h-6 text-[#FFC107]" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SLA Alerts</p>
                  <p className="text-2xl font-semibold">1</p>
                  <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                </div>
                <div className="p-3 bg-[#DC3545]/10 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-[#DC3545]" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer List */}
            <div className="lg:col-span-2">
              <Card>
                <div className="p-6 pb-4">
                  <h3 className="text-lg font-semibold mb-4">Customer Directory</h3>
                  
                  <div className="space-y-4">
                    {customers.map((customer) => (
                      <div 
                        key={customer.id} 
                        className={`p-4 border-l-4 rounded-lg cursor-pointer hover:shadow-sm transition-shadow ${getPriorityColor(customer.priority)}`}
                        onClick={() => {
                          setSelectedCustomer(customer.id)
                          setShowCustomerDetail(true)
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-[#007BFF] text-white">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{customer.name}</h4>
                              <p className="text-sm text-muted-foreground">{customer.industry}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{customer.contact.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{customer.contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">${(customer.contractValue / 1000).toFixed(0)}k</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{customer.website}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/20">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{customer.projectsActive} active projects</span>
                            <span>{customer.projectsCompleted} completed</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">SLA:</span>
                            <span className={`text-sm font-medium ${getSLAColor(customer.slaStatus)}`}>
                              {customer.slaStatus}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center space-x-2 mt-3">
                          {customer.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'alert' ? 'bg-[#FFC107]/10' :
                          activity.type === 'payment' ? 'bg-[#28A745]/10' : 
                          'bg-[#007BFF]/10'
                        }`}>
                          {activity.type === 'alert' ? (
                            <AlertTriangle className="w-4 h-4 text-[#FFC107]" />
                          ) : activity.type === 'payment' ? (
                            <DollarSign className="w-4 h-4 text-[#28A745]" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-[#007BFF]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.customer}</p>
                          <p className="text-sm text-muted-foreground">{activity.activity}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    View All Activity
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Customer
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Update
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {/* Project Associations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {customers.map((customer) => {
              const customerProjectList = customerProjects.filter(p => customer.projectIds.includes(p.id))
              return (
                <Card key={customer.id}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#007BFF] text-white text-xs">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.contact.name}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Linked Projects</span>
                        <span className="text-sm text-muted-foreground">{customerProjectList.length} projects</span>
                      </div>
                      
                      {customerProjectList.length > 0 ? (
                        <div className="space-y-2">
                          {customerProjectList.map((project) => (
                            <div key={project.id} className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-sm">{project.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {project.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(project.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground">{project.progress}%</span>
                                  <Progress value={project.progress} className="w-16 h-1" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No projects linked</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Link className="w-3 h-3 mr-1" />
                            Link Project
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Contract Value:</span>
                      <span className="font-medium">${(customer.contractValue / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="sla" className="space-y-6">
          {/* SLA Compliance Tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">SLA Compliance Overview</h3>
                
                <div className="space-y-6">
                  {slaMetrics.map((metric) => {
                    const customer = customers.find(c => c.id === metric.customerId)
                    if (!customer) return null
                    
                    return (
                      <div key={metric.customerId} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-[#007BFF] text-white text-xs">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{customer.name}</h4>
                              <p className="text-sm text-muted-foreground">{customer.sla.supportLevel} Support</p>
                            </div>
                          </div>
                          <Badge className={getSLAColor(customer.slaStatus)}>
                            {customer.slaStatus}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted/30 rounded">
                            <p className="text-xs text-muted-foreground">Response Time</p>
                            <p className="text-sm font-semibold">{metric.responseTimeCompliance.toFixed(1)}%</p>
                            <p className="text-xs text-muted-foreground">Target: {customer.sla.responseTime}h</p>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded">
                            <p className="text-xs text-muted-foreground">Resolution Time</p>
                            <p className="text-sm font-semibold">{metric.resolutionTimeCompliance.toFixed(1)}%</p>
                            <p className="text-xs text-muted-foreground">Target: {customer.sla.resolutionTime}h</p>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded">
                            <p className="text-xs text-muted-foreground">Uptime</p>
                            <p className="text-sm font-semibold">{metric.uptimeActual.toFixed(2)}%</p>
                            <p className="text-xs text-muted-foreground">Target: {customer.sla.uptime}%</p>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded">
                            <p className="text-xs text-muted-foreground">Tickets</p>
                            <p className="text-sm font-semibold">{metric.ticketsOnTime}/{metric.ticketsTotal}</p>
                            <p className="text-xs text-muted-foreground">On Time</p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Response Time Compliance</span>
                            <span>{metric.responseTimeCompliance.toFixed(1)}%</span>
                          </div>
                          <Progress value={metric.responseTimeCompliance} className="h-2" />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Resolution Time Compliance</span>
                            <span>{metric.resolutionTimeCompliance.toFixed(1)}%</span>
                          </div>
                          <Progress value={metric.resolutionTimeCompliance} className="h-2" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold mb-4">SLA Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-[#FFC107]/10 rounded-lg border-l-4 border-[#FFC107]">
                      <AlertTriangle className="w-4 h-4 text-[#FFC107]" />
                      <div>
                        <p className="text-sm font-medium">Tech Solutions Inc</p>
                        <p className="text-xs text-muted-foreground">Response time approaching limit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Compliance Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Overall Compliance:</span>
                      <span className="text-sm font-medium text-[#28A745]">92.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">At Risk Customers:</span>
                      <span className="text-sm font-medium text-[#FFC107]">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Critical Issues:</span>
                      <span className="text-sm font-medium text-[#DC3545]">0</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="portal" className="space-y-6">
          {/* Client Portal Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Client Portal Access</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowClientPortal(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Portal
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#007BFF] text-white text-xs">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.contact.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {customer.clientPortalAccess ? (
                          <>
                            <Badge className="bg-[#28A745] text-white">
                              <Shield className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => setSelectedClientView(customer.id)}>
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Portal
                            </Button>
                          </>
                        ) : (
                          <>
                            <Badge variant="outline">
                              <XCircle className="w-3 h-3 mr-1" />
                              Disabled
                            </Badge>
                            <Button size="sm" className="bg-[#28A745] hover:bg-[#218838] text-white">
                              Enable Access
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Portal Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Portals:</span>
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Logins:</span>
                      <span className="text-sm font-medium">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Session Time:</span>
                      <span className="text-sm font-medium">8.5 min</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Portal Features</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      <span className="text-sm">Project Progress Tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      <span className="text-sm">Milestone Visibility</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      <span className="text-sm">Document Downloads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      <span className="text-sm">Communication Hub</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Customer Modal */}
      <Dialog open={showCreateCustomer} onOpenChange={setShowCreateCustomer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateCustomer} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <Input
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Enter company name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Industry</label>
                <Select value={newCustomer.industry} onValueChange={(value) => setNewCustomer({ ...newCustomer, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contact Name</label>
                <Input
                  value={newCustomer.contactName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contactName: e.target.value })}
                  placeholder="Primary contact name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <Input
                  value={newCustomer.website}
                  onChange={(e) => setNewCustomer({ ...newCustomer, website: e.target.value })}
                  placeholder="www.company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <Textarea
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                placeholder="Company address..."
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 bg-[#28A745] hover:bg-[#218838] text-white">
                Create Customer
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateCustomer(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Client Portal Preview Modal */}
      <Dialog open={showClientPortal} onOpenChange={setShowClientPortal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Client Portal Preview</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Portal Navigation */}
            <div className="flex items-center justify-between p-4 bg-[#28A745] text-white rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Acme Corporation Portal</h3>
                  <p className="text-sm opacity-90">Welcome, John Smith</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/20">
                Client View
              </Badge>
            </div>

            {/* Client Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Active Projects</h4>
                    <Briefcase className="w-5 h-5 text-[#007BFF]" />
                  </div>
                  <p className="text-2xl font-semibold">2</p>
                  <p className="text-sm text-muted-foreground">Currently in progress</p>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Upcoming Milestones</h4>
                    <Flag className="w-5 h-5 text-[#FFC107]" />
                  </div>
                  <p className="text-2xl font-semibold">3</p>
                  <p className="text-sm text-muted-foreground">Next 30 days</p>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Support Tickets</h4>
                    <MessageSquare className="w-5 h-5 text-[#28A745]" />
                  </div>
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-sm text-muted-foreground">Open tickets</p>
                </div>
              </Card>
            </div>

            {/* Project Progress */}
            <Card>
              <div className="p-6">
                <h4 className="font-semibold mb-4">Project Progress</h4>
                <div className="space-y-4">
                  {customerProjects.filter(p => p.customerId === 'CUST-001').map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{project.name}</h5>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Overall Progress</span>
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <h6 className="text-sm font-medium">Milestones:</h6>
                        {project.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              {milestone.status === 'Completed' ? (
                                <CheckCircle className="w-4 h-4 text-[#28A745]" />
                              ) : milestone.status === 'In Progress' ? (
                                <Clock className="w-4 h-4 text-[#007BFF]" />
                              ) : (
                                <Timer className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span>{milestone.name}</span>
                            </div>
                            <div className="text-muted-foreground">
                              {milestone.status === 'Completed' && milestone.completedDate
                                ? `Completed ${new Date(milestone.completedDate).toLocaleDateString()}`
                                : `Due ${new Date(milestone.dueDate).toLocaleDateString()}`
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Communication Section */}
            <Card>
              <div className="p-6">
                <h4 className="font-semibold mb-4">Recent Updates</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-[#28A745]/10 rounded-full">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Milestone Completed: UI/UX Design</p>
                      <p className="text-sm text-muted-foreground">Web App Redesign project milestone completed ahead of schedule</p>
                      <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-[#007BFF]/10 rounded-full">
                      <Activity className="w-4 h-4 text-[#007BFF]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Progress Update: Frontend Development</p>
                      <p className="text-sm text-muted-foreground">75% complete - on track for September 15th deadline</p>
                      <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Modal */}
      <Dialog open={showCustomerDetail} onOpenChange={setShowCustomerDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (() => {
            const customer = customers.find(c => c.id === selectedCustomer)
            if (!customer) return null
            
            return (
              <div className="space-y-6">
                {/* Customer Header */}
                <div className="flex items-center justify-between p-6 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-[#007BFF] text-white">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{customer.name}</h3>
                      <p className="text-muted-foreground">{customer.industry}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                        {customer.clientPortalAccess && (
                          <Badge variant="outline">
                            <Shield className="w-3 h-3 mr-1" />
                            Portal Access
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Customer
                  </Button>
                </div>

                {/* Contact Information */}
                <Card>
                  <div className="p-6">
                    <h4 className="font-semibold mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{customer.contact.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.contact.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{customer.contact.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{customer.contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span>{customer.website}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Address</p>
                        <div className="text-sm text-muted-foreground">
                          <p>{customer.address.street}</p>
                          <p>{customer.address.city}, {customer.address.state} {customer.address.zip}</p>
                          <p>{customer.address.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* SLA & Billing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <div className="p-6">
                      <h4 className="font-semibold mb-4">SLA Terms</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Support Level:</span>
                          <Badge variant="outline">{customer.sla.supportLevel}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Response Time:</span>
                          <span className="text-sm font-medium">{customer.sla.responseTime}h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Resolution Time:</span>
                          <span className="text-sm font-medium">{customer.sla.resolutionTime}h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Uptime SLA:</span>
                          <span className="text-sm font-medium">{customer.sla.uptime}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="p-6">
                      <h4 className="font-semibold mb-4">Billing Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Contract Value:</span>
                          <span className="text-sm font-medium">${(customer.contractValue / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Payment Terms:</span>
                          <span className="text-sm font-medium">{customer.billingInfo.paymentTerms}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Billing Contact:</span>
                          <span className="text-sm font-medium">{customer.billingInfo.billingContact}</span>
                        </div>
                        {customer.billingInfo.nextInvoice && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Next Invoice:</span>
                            <span className="text-sm font-medium">
                              {new Date(customer.billingInfo.nextInvoice).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}