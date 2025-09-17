// Users and Admin Mock Data

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'super_admin' | 'project_manager' | 'developer' | 'tester';
  avatar: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  department?: string;
  skills?: string[];
  phone?: string;
  timezone?: string;
}


export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  userCount: number;
}

export const mockRoles: Role[] = [];

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
}

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit_001',
    userId: 'admin123',
    userName: 'System Administrator',
    action: 'LOGIN',
    resource: 'Authentication',
    details: 'Successful login from web interface',
    timestamp: '2025-01-15T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success'
  },
  {
    id: 'audit_002',
    userId: 'pm789',
    userName: 'Project Manager',
    action: 'CREATE',
    resource: 'Project',
    details: 'Created new project: Mobile Banking App',
    timestamp: '2025-01-15T09:15:00Z',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    status: 'success'
  },
  {
    id: 'audit_003',
    userId: 'dev101',
    userName: 'Senior Developer',
    action: 'UPDATE',
    resource: 'Task',
    details: 'Updated task status from "In Progress" to "Done"',
    timestamp: '2025-01-15T08:45:00Z',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success'
  },
  {
    id: 'audit_004',
    userId: 'tester202',
    userName: 'QA Tester',
    action: 'LOGIN_FAILED',
    resource: 'Authentication',
    details: 'Failed login attempt - incorrect password',
    timestamp: '2025-01-15T08:30:00Z',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Ubuntu; Linux x86_64) AppleWebKit/537.36',
    status: 'failure'
  },
  {
    id: 'audit_005',
    userId: 'admin123',
    userName: 'System Administrator',
    action: 'DELETE',
    resource: 'User',
    details: 'Deleted inactive user account: old.user@planora.com',
    timestamp: '2025-01-14T16:20:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success'
  }
];

// Utility functions
export const getUserByEmail = (email: string) => undefined;
export const getUserById = (id: string) => undefined;
export const getActiveUsers = () => [];
export const getUsersByRole = (role: string) => [];
export const getRoleById = (id: string) => undefined;
export const getActiveRoles = () => [];