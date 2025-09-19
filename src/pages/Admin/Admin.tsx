import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { 
  Shield,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Key,
  Database,
  Mail,
  Globe,
  Lock,
  UserPlus,
  UserX,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Calendar,
  Clock,
  Eye,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { UserManagement } from './user-management'


const mockRoles = [
  {
    id: 'super_admin',
    name: 'Super Administrator',
    description: 'Complete system access with all administrative privileges',
    permissions: ['all_access', 'user_management', 'system_settings', 'data_export', 'security_management', 'audit_logs'],
    userCount: 1
  },
  {
    id: 'admin',
    name: 'System Administrator',
    description: 'Full system access with user management capabilities',
    permissions: ['all_access', 'user_management', 'system_settings', 'data_export'],
    userCount: 1
  },
  {
    id: 'project_manager',
    name: 'Project Manager',
    description: 'Manage projects, teams, and track progress',
    permissions: ['project_management', 'team_management', 'reports_access', 'time_approval'],
    userCount: 1
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Work on assigned tasks and projects',
    permissions: ['task_management', 'time_tracking', 'project_view', 'comment_tasks'],
    userCount: 1
  },
  {
    id: 'tester',
    name: 'Quality Assurance',
    description: 'Test and ensure quality of deliverables',
    permissions: ['task_testing', 'bug_reporting', 'time_tracking', 'project_view'],
    userCount: 1
  }
]

const systemSettings = [
  {
    category: 'General',
    settings: [
      { key: 'company_name', label: 'Company Name', value: 'Acme Corporation', type: 'text' },
      { key: 'timezone', label: 'Default Timezone', value: 'UTC-5', type: 'select' },
      { key: 'date_format', label: 'Date Format', value: 'MM/DD/YYYY', type: 'select' },
      { key: 'currency', label: 'Default Currency', value: 'USD', type: 'select' }
    ]
  },
  {
    category: 'Security',
    settings: [
      { key: 'password_min_length', label: 'Minimum Password Length', value: '8', type: 'number' },
      { key: 'session_timeout', label: 'Session Timeout (minutes)', value: '60', type: 'number' },
      { key: 'two_factor_auth', label: 'Require Two-Factor Auth', value: true, type: 'boolean' },
      { key: 'login_attempts', label: 'Max Login Attempts', value: '5', type: 'number' }
    ]
  },
  {
    category: 'Notifications',
    settings: [
      { key: 'email_notifications', label: 'Email Notifications', value: true, type: 'boolean' },
      { key: 'slack_integration', label: 'Slack Integration', value: false, type: 'boolean' },
      { key: 'daily_digest', label: 'Daily Digest Emails', value: true, type: 'boolean' },
      { key: 'sla_alerts', label: 'SLA Breach Alerts', value: true, type: 'boolean' }
    ]
  }
]

// Mock audit logs data
const mockAuditLogs = [
  {
    id: 'AL-001',
    timestamp: '2025-01-14 10:30:25',
    user: 'Admin User (admin@planora.com)',
    action: 'User Login',
    details: 'Successful login from IP: 192.168.1.100',
    category: 'Authentication',
    severity: 'info',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'AL-002',
    timestamp: '2025-01-14 10:25:15',
    user: 'Admin User (admin@planora.com)',
    action: 'User Created',
    details: 'New user account created for john.doe@example.com with role: Developer',
    category: 'User Management',
    severity: 'info',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'AL-003',
    timestamp: '2025-01-14 10:15:45',
    user: 'System',
    action: 'System Settings Updated',
    details: 'Session timeout changed from 30 to 60 minutes',
    category: 'System Configuration',
    severity: 'warning',
    ipAddress: 'System',
    userAgent: 'System Process'
  },
  {
    id: 'AL-004',
    timestamp: '2025-01-14 09:45:12',
    user: 'Project Manager (pm@planora.com)',
    action: 'Failed Login Attempt',
    details: 'Failed login attempt - Invalid password',
    category: 'Authentication',
    severity: 'warning',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 'AL-005',
    timestamp: '2025-01-14 09:30:33',
    user: 'Admin User (admin@planora.com)',
    action: 'Role Permissions Updated',
    details: 'Updated permissions for Project Manager role - Added reports access',
    category: 'Permission Management',
    severity: 'info',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'AL-006',
    timestamp: '2025-01-14 08:15:22',
    user: 'Rajesh Kumar (dev@planora.com)',
    action: 'User Login',
    details: 'Successful login from IP: 192.168.1.110',
    category: 'Authentication',
    severity: 'info',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
  },
  {
    id: 'AL-007',
    timestamp: '2025-01-14 07:45:18',
    user: 'System',
    action: 'Database Backup',
    details: 'Automated daily database backup completed successfully',
    category: 'System Maintenance',
    severity: 'info',
    ipAddress: 'System',
    userAgent: 'Automated Process'
  },
  {
    id: 'AL-008',
    timestamp: '2025-01-13 23:30:44',
    user: 'Admin User (admin@planora.com)',
    action: 'User Status Changed',
    details: 'User account test@example.com status changed to inactive',
    category: 'User Management',
    severity: 'warning',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'AL-009',
    timestamp: '2025-01-13 22:15:33',
    user: 'System',
    action: 'Security Alert',
    details: 'Multiple failed login attempts detected from IP: 203.0.113.42',
    category: 'Security',
    severity: 'critical',
    ipAddress: '203.0.113.42',
    userAgent: 'Unknown'
  },
  {
    id: 'AL-010',
    timestamp: '2025-01-13 20:30:15',
    user: 'Praveen Kumar (tester@planora.com)',
    action: 'User Logout',
    details: 'User logged out successfully',
    category: 'Authentication',
    severity: 'info',
    ipAddress: '192.168.1.115',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'AL-011',
    timestamp: '2025-01-13 19:45:28',
    user: 'Admin User (admin@planora.com)',
    action: 'Project Created',
    details: 'New project "Mobile Banking App v2.0" created',
    category: 'Project Management',
    severity: 'info',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'AL-012',
    timestamp: '2025-01-13 18:30:12',
    user: 'System',
    action: 'System Update',
    details: 'System updated to version 2.1.5 - Security patches applied',
    category: 'System Maintenance',
    severity: 'info',
    ipAddress: 'System',
    userAgent: 'Update Process'
  }
]

interface AdminProps {
  user?: any
}

export function Admin({ user }: AdminProps) {
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddRole, setShowAddRole] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  })

  // Audit logs state
  const [currentPage, setCurrentPage] = useState(1)
  const [auditFilter, setAuditFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10


  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-[#DC3545] text-white'
      case 'admin': return 'bg-[#DC3545] text-white'
      case 'project_manager': return 'bg-[#007BFF] text-white'
      case 'developer': return 'bg-[#28A745] text-white'
      case 'tester': return 'bg-[#FFC107] text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-[#28A745] text-white' : 'bg-gray-500 text-white'
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Please fill in all required fields')
      return
    }
    // Mock user creation
    toast.success('User created successfully')
    setShowAddUser(false)
    setNewUser({ name: '', email: '', role: '', password: '' })
  }

  const handleUpdateSetting = (key: string, value: any) => {
    // Mock setting update
    toast.success('Setting updated successfully')
  }

  // Audit logs functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-[#DC3545] text-white'
      case 'warning': return 'bg-[#FFC107] text-white'
      case 'info': return 'bg-[#007BFF] text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Authentication': return 'bg-[#28A745]/10 text-[#28A745] border-[#28A745]/20'
      case 'User Management': return 'bg-[#007BFF]/10 text-[#007BFF] border-[#007BFF]/20'
      case 'System Configuration': return 'bg-[#FFC107]/10 text-[#FFC107] border-[#FFC107]/20'
      case 'Permission Management': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      case 'System Maintenance': return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      case 'Security': return 'bg-[#DC3545]/10 text-[#DC3545] border-[#DC3545]/20'
      case 'Project Management': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  // Filter and search audit logs
  const filteredAuditLogs = mockAuditLogs.filter(log => {
    const matchesFilter = auditFilter === 'all' || log.category.toLowerCase().includes(auditFilter.toLowerCase())
    const matchesSearch = searchTerm === '' || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredAuditLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLogs = filteredAuditLogs.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }


  // Check if current user is admin or super_admin
  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Access Denied: You don't have permission to access the admin panel.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">System Administration</h1>
          <p className="text-muted-foreground">Manage users, roles, permissions, and system settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogTrigger asChild>
              <Button className="bg-[#28A745] hover:bg-[#218838] text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account with appropriate role and permissions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex flex-col">
                            <span>{role.name}</span>
                            <span className="text-xs text-muted-foreground">{role.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Temporary Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter temporary password"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} className="bg-[#28A745] hover:bg-[#218838]">
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          {/* Roles and Permissions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Permissions:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {role.permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#28A745]" />
                          <span className="text-sm">{permission.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/20">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* System Settings */}
          {systemSettings.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category} Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{setting.label}</p>
                      </div>
                      <div className="w-48">
                        {setting.type === 'boolean' ? (
                          <Switch
                            checked={setting.value as boolean}
                            onCheckedChange={(checked) => handleUpdateSetting(setting.key, checked)}
                          />
                        ) : setting.type === 'select' ? (
                          <Select value={setting.value as string}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={setting.value as string}>{setting.value}</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={setting.type}
                            value={setting.value as string}
                            onChange={(e) => handleUpdateSetting(setting.key, e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed Login Attempts (24h)</span>
                    <span className="font-medium text-[#DC3545]">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sessions</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Enabled</span>
                    <span className="font-medium text-[#28A745]">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Password Compliance</span>
                    <span className="font-medium text-[#FFC107]">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-[#28A745] rounded-full"></div>
                    <span>User john@example.com logged in</span>
                    <span className="text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-[#007BFF] rounded-full"></div>
                    <span>Role permissions updated</span>
                    <span className="text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-[#DC3545] rounded-full"></div>
                    <span>Failed login attempt</span>
                    <span className="text-muted-foreground">1 hour ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-[#FFC107] rounded-full"></div>
                    <span>System settings changed</span>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Audit Logs</CardTitle>
                  <CardDescription>Comprehensive log of all system activities and user actions</CardDescription>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={auditFilter} onValueChange={setAuditFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="user">User Management</SelectItem>
                      <SelectItem value="system">System Configuration</SelectItem>
                      <SelectItem value="permission">Permission Management</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="maintenance">System Maintenance</SelectItem>
                      <SelectItem value="project">Project Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Audit Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-[#28A745]/5 rounded-lg border border-[#28A745]/20">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#28A745]" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                      <p className="text-xl font-semibold">{mockAuditLogs.length}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#007BFF]/5 rounded-lg border border-[#007BFF]/20">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-[#007BFF]" />
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Events</p>
                      <p className="text-xl font-semibold">{mockAuditLogs.filter(log => log.timestamp.includes('2025-01-14')).length}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#FFC107]/5 rounded-lg border border-[#FFC107]/20">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-[#FFC107]" />
                    <div>
                      <p className="text-sm text-muted-foreground">Warnings</p>
                      <p className="text-xl font-semibold">{mockAuditLogs.filter(log => log.severity === 'warning').length}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#DC3545]/5 rounded-lg border border-[#DC3545]/20">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-[#DC3545]" />
                    <div>
                      <p className="text-sm text-muted-foreground">Critical</p>
                      <p className="text-xl font-semibold">{mockAuditLogs.filter(log => log.severity === 'critical').length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Logs Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Timestamp</span>
                        </div>
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{log.timestamp.split(' ')[1]}</span>
                            <span className="text-xs text-muted-foreground">{log.timestamp.split(' ')[0]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{log.user.split(' (')[0]}</span>
                            {log.user.includes('(') && (
                              <span className="text-xs text-muted-foreground">{log.user.match(/\((.*?)\)/)?.[1]}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{log.action}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(log.category)}>
                            {log.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(log.severity)}>
                            {log.severity.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="text-sm text-muted-foreground truncate" title={log.details}>
                              {log.details}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">IP: {log.ipAddress}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAuditLogs.length)} of {filteredAuditLogs.length} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}