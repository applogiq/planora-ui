import React, { useState, useEffect } from 'react'
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
import { userRoles } from '../Login/Auth'
import { toast } from 'sonner@2.0.3'
import { User } from '../../services/userApi'

// Initial empty users array - will be populated from API
const initialUsers: User[] = []

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
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  })
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

  // Fetch users function
  const fetchUsers = async (params: { page?: number; per_page?: number; search?: string; role_id?: string } = {}) => {
    setLoading(true)
    try {
      const userApiService = (await import('../../services/userApi')).userApiService
      const response = await userApiService.getUsers({
        page: params.page || pagination.page,
        per_page: params.per_page || pagination.per_page,
        search: params.search || searchTerm || undefined,
        role_id: params.role_id || (selectedRole !== 'all' ? selectedRole : undefined)
      })

      setUsers(response.items || [])
      setPagination({
        page: response.page,
        per_page: response.per_page,
        total: response.total,
        total_pages: response.total_pages,
        has_next: response.has_next,
        has_prev: response.has_prev
      })
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
      setUsers([]) // Ensure users is always an array
    } finally {
      setLoading(false)
    }
  }

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers({ page: 1 }) // Reset to page 1 when searching
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchTerm, selectedRole])

  // Since we're doing server-side filtering, we don't need client-side filtering
  const filteredUsers = Array.isArray(users) ? users : []

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    fetchUsers({ page: newPage })
  }

  const handlePerPageChange = (perPage: number) => {
    fetchUsers({ page: 1, per_page: perPage })
  }

  const filteredAuditLogs = auditLogs.slice(0, 10) // Show recent logs

  const handleCreateUser = async () => {
    try {
      const userApiService = (await import('../../services/userApi')).userApiService
      await userApiService.createUser({
        name: newUser.name,
        email: newUser.email,
        role_id: `role_${newUser.role}`,
        avatar: newUser.name.split(' ').map(n => n[0]).join(''),
        is_active: true,
        department: '',
        skills: [],
        phone: '',
        timezone: 'UTC'
      })

      // Refresh the users list
      await fetchUsers()

      setNewUser({ name: '', email: '', role: 'developer' })
      setShowCreateUser(false)

      toast.success('User created successfully')
    } catch (error) {
      console.error('Failed to create user:', error)
      toast.error('Failed to create user')
    }
    
  }

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      const userApiService = (await import('../../services/userApi')).userApiService
      await userApiService.toggleUserStatus(userId, !user.is_active)

      // Refresh the users list
      await fetchUsers()

      console.log('Audit Log: User status changed', {
        userId,
        email: user?.email,
        newStatus: !user.is_active ? 'active' : 'inactive',
        timestamp: new Date().toISOString(),
        performedBy: 'current_admin'
      })

      toast.success('User status updated')
    } catch (error) {
      console.error('Failed to update user status:', error)
      toast.error('Failed to update user status')
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
                <option key={key} value={`role_${key}`}>{role.name}</option>
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
                        <div className="text-sm">
                          <Badge variant="outline" className="text-xs">
                            {user.role?.name || user.role_id || 'Unknown'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${user.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p>{user.last_login ? formatDate(user.last_login) : 'Never'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Email</span>
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
                            {user.is_active ? (
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

              {/* Pagination Controls */}
              {pagination.total > 0 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.per_page) + 1} to {Math.min(pagination.page * pagination.per_page, pagination.total)} of {pagination.total} users
                  </div>
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Rows per page</span>
                      <select
                        value={pagination.per_page}
                        onChange={(e) => handlePerPageChange(Number(e.target.value))}
                        className="px-3 py-1 border border-border rounded bg-background text-foreground text-sm"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                      Page {pagination.page} of {pagination.total_pages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(1)}
                        disabled={!pagination.has_prev || loading}
                      >
                        <span className="sr-only">Go to first page</span>
                        ⟨⟨
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.has_prev || loading}
                      >
                        <span className="sr-only">Go to previous page</span>
                        ⟨
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.has_next || loading}
                      >
                        <span className="sr-only">Go to next page</span>
                        ⟩
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(pagination.total_pages)}
                        disabled={!pagination.has_next || loading}
                      >
                        <span className="sr-only">Go to last page</span>
                        ⟩⟩
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
                  <Badge className={`text-xs ${userRoles[selectedUser.role?.name as keyof typeof userRoles]?.color} text-white`}>
                    {selectedUser.role?.name}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Current Permissions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {userRoles[selectedUser.role?.name as keyof typeof userRoles]?.permissions.map((permission) => (
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