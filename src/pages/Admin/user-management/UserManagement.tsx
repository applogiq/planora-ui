import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Separator } from '../../../components/ui/separator'
import { Switch } from '../../../components/ui/switch'
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
import { userRoles } from '../../Login/Auth'
import { toast } from 'sonner@2.0.3'
import { User } from '../../../services/userApi'
import { RootState, AppDispatch } from '../../../store'
import { fetchUserSummary } from '../../../store/slices/userSlice'

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
  const dispatch = useDispatch<AppDispatch>()
  const { summary, summaryLoading } = useSelector((state: RootState) => state.users)

  // Check if current user has permission to edit users
  const getCurrentUserPermissions = () => {
    try {
      const authApiService = require('../../../services/authApi').authApiService
      const currentUser = authApiService.getUserProfile()

      if (!currentUser) return { canEdit: false, canCreate: false }

      // Get role permissions from userRoles
      const roleKey = currentUser.role_id?.replace('role_', '') || ''
      const userRole = userRoles[roleKey as keyof typeof userRoles]

      if (!userRole) return { canEdit: false, canCreate: false }

      // Check if user has all permissions or specific user management permissions
      const hasAllPermissions = userRole.permissions.includes('*')
      const canEditUsers = hasAllPermissions || userRole.permissions.includes('users:write') || userRole.permissions.includes('users:*')
      const canCreateUsers = hasAllPermissions || userRole.permissions.includes('users:write') || userRole.permissions.includes('users:*')

      return { canEdit: canEditUsers, canCreate: canCreateUsers, role: userRole.name }
    } catch (error) {
      console.error('Error checking user permissions:', error)
      return { canEdit: false, canCreate: false }
    }
  }

  const userPermissions = getCurrentUserPermissions()

  const [users, setUsers] = useState<User[]>(initialUsers)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
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
    role_id: 'role_developer',
    avatar: '',
    is_active: true,
    department: '',
    skills: [] as string[],
    phone: '',
    timezone: 'UTC',
    password: ''
  })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditUser, setShowEditUser] = useState(false)

  // Fetch users function
  const fetchUsers = async (params: { page?: number; per_page?: number; search?: string; role_id?: string } = {}) => {
    setLoading(true)
    try {
      const userApiService = (await import('../../../services/userApi')).userApiService
      const response = await userApiService.getUsers({
        page: params.page || pagination.page,
        per_page: params.per_page || pagination.per_page,
        search: params.search || searchTerm || undefined,
        role_id: params.role_id || (selectedRole !== 'all' ? `role_${selectedRole}` : undefined)
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

  // Fetch users and summary on component mount
  useEffect(() => {
    fetchUsers()
    dispatch(fetchUserSummary())
  }, [dispatch])

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
      const userApiService = (await import('../../../services/userApi')).userApiService
      await userApiService.createUser({
        name: newUser.name,
        email: newUser.email,
        role_id: newUser.role_id,
        avatar: newUser.avatar || newUser.name.split(' ').map(n => n[0]).join(''),
        is_active: newUser.is_active,
        department: newUser.department,
        skills: newUser.skills,
        phone: newUser.phone,
        timezone: newUser.timezone,
        password: newUser.password
      })

      // Refresh the users list and summary
      await fetchUsers()
      dispatch(fetchUserSummary())

      setNewUser({
        name: '',
        email: '',
        role_id: 'role_developer',
        avatar: '',
        is_active: true,
        department: '',
        skills: [],
        phone: '',
        timezone: 'UTC',
        password: ''
      })
      setShowCreateUser(false)

      toast.success('User created successfully')
    } catch (error) {
      console.error('Failed to create user:', error)
      toast.error('Failed to create user')
    }
  }

  const handleEditUser = async () => {
    if (!editingUser) return

    try {
      console.log('Attempting to update user:', editingUser.id, editingUser)
      const userApiService = (await import('../../../services/userApi')).userApiService

      const updateData = {
        name: editingUser.name,
        email: editingUser.email,
        role_id: editingUser.role_id,
        avatar: editingUser.avatar,
        is_active: editingUser.is_active,
        department: editingUser.department,
        skills: editingUser.skills,
        phone: editingUser.phone,
        timezone: editingUser.timezone
      }

      console.log('Update data:', updateData)

      await userApiService.updateUser(editingUser.id, updateData)

      // Refresh the users list and summary
      await fetchUsers()
      dispatch(fetchUserSummary())

      setEditingUser(null)
      setShowEditUser(false)

      toast.success('User updated successfully')
    } catch (error: any) {
      console.error('Failed to update user:', error)

      // Check for specific authorization errors
      if (error.message?.includes('Authentication failed') || error.message?.includes('401') || error.message?.includes('403')) {
        toast.error('You do not have permission to edit users. Please contact your administrator.')
      } else if (error.message?.includes('Network')) {
        toast.error('Network error. Please check your connection and try again.')
      } else {
        toast.error(`Failed to update user: ${error.message || 'Unknown error'}`)
      }
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      const userApiService = (await import('../../../services/userApi')).userApiService
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.active_users || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.inactive_users || 0}</div>
            <p className="text-xs text-muted-foreground">Disabled accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_roles || 0}</div>
            <p className="text-xs text-muted-foreground">System roles</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
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
            <Button
              onClick={() => setShowCreateUser(true)}
              className="flex items-center space-x-2"
              disabled={!userPermissions.canCreate}
              title={!userPermissions.canCreate ? `You don't have permission to create users. Current role: ${userPermissions.role || 'Unknown'}` : 'Create new user'}
            >
              <Plus className="h-4 w-4" />
              <span>Create User</span>
            </Button>
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
                            {user.avatar && user.avatar.startsWith('http') ? (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            ) : null}
                            <AvatarFallback className="bg-[#28A745] text-white text-xs">
                              {user.avatar && !user.avatar.startsWith('http')
                                ? user.avatar
                                : user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
                            onClick={() => {
                              setEditingUser(user)
                              setShowEditUser(true)
                            }}
                            className="h-8 w-8 p-0"
                            disabled={!userPermissions.canEdit}
                            title={!userPermissions.canEdit ? `You don't have permission to edit users. Current role: ${userPermissions.role || 'Unknown'}` : 'Edit user'}
                          >
                            <Edit className={`h-4 w-4 ${userPermissions.canEdit ? 'text-blue-500' : 'text-gray-400'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="h-8 w-8 p-0"
                            title={user.is_active ? "Deactivate user" : "Activate user"}
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
                            title="View permissions"
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
                        <option value={25}>25</option>
                        <option value={50}>50</option>
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
                {summaryLoading && <span className="text-blue-500"> (Loading user counts...)</span>}
                {!summary && !summaryLoading && <span className="text-red-500"> (Unable to load user counts)</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {Object.entries(userRoles).map(([roleKey, role]) => {
                // Create a mapping between API role names and local role names
                const getRoleCount = (roleName: string) => {
                  const apiRoleMapping: { [key: string]: string[] } = {
                    'Super Admin': ['super_admin', 'Super Admin'],
                    'Administrator': ['admin', 'Administrator'],
                    'Project Manager': ['project_manager', 'Project Manager'],
                    'Developer': ['developer', 'Developer'],
                    'Tester': ['tester', 'Tester'],
                    'Client': ['client', 'Client']
                  };

                  // Find matching role from API response
                  for (const [apiRole, localRoles] of Object.entries(apiRoleMapping)) {
                    if (localRoles.includes(roleKey) || localRoles.includes(roleName)) {
                      const found = summary?.role_counts.find(rc => rc.role_name === apiRole);
                      if (found) return found.count;
                    }
                  }

                  // Fallback: try direct match with role name
                  const directMatch = summary?.role_counts.find(rc =>
                    rc.role_name.toLowerCase() === roleName.toLowerCase() ||
                    rc.role_name.toLowerCase() === roleKey.toLowerCase()
                  );

                  return directMatch?.count || 0;
                };

                const roleCount = getRoleCount(role.name);

                return (
                <div key={roleKey} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={`${role.color} text-white`}>
                        {role.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{role.description}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {roleCount} user{roleCount !== 1 ? 's' : ''}
                    </Badge>
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
                );
              })}
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

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system with their details and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                placeholder="Engineering"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                value={newUser.timezone}
                onChange={(e) => setNewUser({ ...newUser, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                value={newUser.role_id}
                onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                {Object.entries(userRoles).map(([key, role]) => (
                  <option key={key} value={`role_${key}`}>{role.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={newUser.avatar}
                onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input
                id="skills"
                value={newUser.skills.join(', ')}
                onChange={(e) => setNewUser({ ...newUser, skills: e.target.value.split(', ').filter(s => s.trim()) })}
                placeholder="JavaScript, React, Node.js"
              />
            </div>
            <div className="flex items-center space-x-2 md:col-span-2">
              <input
                type="checkbox"
                id="is_active"
                checked={newUser.is_active}
                onChange={(e) => setNewUser({ ...newUser, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="is_active">User is active</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateUser(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={!newUser.name || !newUser.email || !newUser.password}
            >
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="john@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editingUser.department}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  placeholder="Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-timezone">Timezone</Label>
                <select
                  id="edit-timezone"
                  value={editingUser.timezone}
                  onChange={(e) => setEditingUser({ ...editingUser, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role *</Label>
                <select
                  id="edit-role"
                  value={editingUser.role_id}
                  onChange={(e) => setEditingUser({ ...editingUser, role_id: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {Object.entries(userRoles).map(([key, role]) => (
                    <option key={key} value={`role_${key}`}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-avatar">Avatar URL</Label>
                <Input
                  id="edit-avatar"
                  value={editingUser.avatar}
                  onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-skills">Skills (comma separated)</Label>
                <Input
                  id="edit-skills"
                  value={editingUser.skills.join(', ')}
                  onChange={(e) => setEditingUser({ ...editingUser, skills: e.target.value.split(', ').filter(s => s.trim()) })}
                  placeholder="JavaScript, React, Node.js"
                />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="edit-is_active"
                  checked={editingUser.is_active}
                  onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="edit-is_active">User is active</Label>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditUser(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              disabled={!editingUser?.name || !editingUser?.email}
            >
              Update User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}