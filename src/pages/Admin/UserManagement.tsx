import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Separator } from '../../components/ui/separator'
import { Switch } from '../../components/ui/switch'
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Key,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Settings,
  Activity,
  UserPlus,
  Lock,
  Unlock
} from 'lucide-react'
import { userRoles, mockUsers } from './Auth'
import { toast } from 'sonner@2.0.3'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar: string
  lastLogin: string
  status: 'active' | 'inactive' | 'suspended'
  authProvider?: string
  createdAt?: string
  permissions?: string[]
}

// Expanded mock data for demonstration
const extendedMockUsers: User[] = [
  ...mockUsers,
  {
    id: '5',
    email: 'client@company.com',
    name: 'Client User',
    role: 'client',
    avatar: 'CU',
    lastLogin: '2025-01-12T14:20:00Z',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '6',
    email: 'manager@planora.com',
    name: 'Sarah Johnson',
    role: 'admin',
    avatar: 'SJ',
    lastLogin: '2025-01-13T11:45:00Z',
    status: 'active',
    authProvider: 'google',
    createdAt: '2024-12-15T00:00:00Z'
  },
  {
    id: '7',
    email: 'inactive@planora.com',
    name: 'Inactive User',
    role: 'developer',
    avatar: 'IU',
    lastLogin: '2024-12-01T09:30:00Z',
    status: 'inactive',
    createdAt: '2024-11-01T00:00:00Z'
  }
]

// Mock audit logs
const auditLogs = [
  {
    id: '1',
    userId: '1',
    userEmail: 'admin@pms.com',
    action: 'login',
    resource: 'authentication',
    timestamp: '2025-01-13T10:30:00Z',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: 'Successful login',
    status: 'success'
  },
  {
    id: '2',
    userId: '2',
    userEmail: 'pm@pms.com',
    action: 'role_change',
    resource: 'user_management',
    timestamp: '2025-01-13T09:15:00Z',
    ip: '192.168.1.101',
    details: 'Role changed from developer to project_manager',
    status: 'success',
    performedBy: 'admin@pms.com'
  },
  {
    id: '3',
    userId: '999',
    userEmail: 'unknown@test.com',
    action: 'login_failed',
    resource: 'authentication',
    timestamp: '2025-01-13T08:45:00Z',
    ip: '192.168.1.200',
    details: 'Invalid credentials',
    status: 'failed'
  },
  {
    id: '4',
    userId: '3',
    userEmail: 'dev@pms.com',
    action: 'permission_grant',
    resource: 'permissions',
    timestamp: '2025-01-13T08:00:00Z',
    ip: '192.168.1.100',
    details: 'Granted tasks:write permission',
    status: 'success',
    performedBy: 'admin@pms.com'
  },
  {
    id: '5',
    userId: '5',
    userEmail: 'manager@pms.com',
    action: 'oauth_login',
    resource: 'authentication',
    timestamp: '2025-01-13T11:45:00Z',
    ip: '192.168.1.150',
    details: 'Google OAuth login successful',
    status: 'success',
    authProvider: 'google'
  }
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(extendedMockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'developer'
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const filteredAuditLogs = auditLogs.slice(0, 10) // Show recent logs

  const handleCreateUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      avatar: newUser.name.split(' ').map(n => n[0]).join(''),
      lastLogin: new Date().toISOString(),
      status: 'active',
      createdAt: new Date().toISOString()
    }
    
    setUsers(prev => [...prev, user])
    setNewUser({ name: '', email: '', role: 'developer' })
    setShowCreateUser(false)
    
    // Log audit event
    console.log('Audit Log: User created', {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: new Date().toISOString(),
      performedBy: 'current_admin'
    })
    
    toast.success('User created successfully')
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ))
    
    const user = users.find(u => u.id === userId)
    console.log('Audit Log: User status changed', {
      userId,
      email: user?.email,
      newStatus: user?.status === 'active' ? 'suspended' : 'active',
      timestamp: new Date().toISOString(),
      performedBy: 'current_admin'
    })
    
    toast.success('User status updated')
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    const oldUser = users.find(u => u.id === userId)
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
    
    console.log('Audit Log: Role changed', {
      userId,
      email: oldUser?.email,
      oldRole: oldUser?.role,
      newRole,
      timestamp: new Date().toISOString(),
      performedBy: 'current_admin'
    })
    
    toast.success('User role updated')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white'
      case 'inactive': return 'bg-yellow-500 text-white'
      case 'suspended': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">User Management & RBAC</h1>
          <p className="text-muted-foreground">Manage users, roles, permissions, and audit compliance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#28A745] hover:bg-[#218838] text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system with role-based permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    {Object.entries(userRoles).map(([key, role]) => (
                      key !== 'super_admin' && (
                        <option key={key} value={key}>{role.name}</option>
                      )
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateUser(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser} className="bg-[#28A745] hover:bg-[#218838]">
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
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Roles</option>
              {Object.entries(userRoles).map(([key, role]) => (
                <option key={key} value={key}>{role.name}</option>
              ))}
            </select>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>System Users ({filteredUsers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Auth Provider</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-[#28A745] text-white text-xs">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-border rounded bg-background"
                        >
                          {Object.entries(userRoles).map(([key, role]) => (
                            <option key={key} value={key}>{role.name}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p>{formatDate(user.lastLogin)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {user.authProvider ? (
                            <Badge variant="outline" className="text-xs">
                              {user.authProvider}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Email</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="h-8 w-8 p-0"
                          >
                            {user.status === 'active' ? (
                              <Lock className="h-4 w-4 text-red-500" />
                            ) : (
                              <Unlock className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowPermissionDialog(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Role Permissions Matrix</span>
              </CardTitle>
              <CardDescription>
                Configure permissions for each role in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(userRoles).map(([roleKey, role]) => (
                <div key={roleKey} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${role.color} text-white`}>
                      {role.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{role.description}</span>
                  </div>
                  <div className="pl-4 space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {role.permissions.includes('*') ? (
                        <Badge variant="outline" className="text-xs">All Permissions</Badge>
                      ) : (
                        role.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Audit Logs</span>
              </CardTitle>
              <CardDescription>
                Security and compliance audit trail for all system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg">
                    {getStatusIcon(log.status)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {log.userEmail} - {log.action.replace('_', ' ')}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>IP: {log.ip}</span>
                        {log.performedBy && <span>By: {log.performedBy}</span>}
                        {log.authProvider && <span>Provider: {log.authProvider}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Permission Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Permissions</DialogTitle>
            <DialogDescription>
              Manage permissions for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#28A745] text-white">
                    {selectedUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <Badge className={`text-xs ${userRoles[selectedUser.role as keyof typeof userRoles]?.color} text-white`}>
                    {userRoles[selectedUser.role as keyof typeof userRoles]?.name}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Current Permissions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {userRoles[selectedUser.role as keyof typeof userRoles]?.permissions.map((permission) => (
                    <div key={permission} className="flex items-center justify-between p-2 bg-muted/10 rounded">
                      <span className="text-sm">{permission}</span>
                      <Switch checked={true} disabled />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}