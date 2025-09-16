import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { QuickCreate } from '../common/QuickCreate'
import { GlobalSearch } from '../common/GlobalSearch'
import { NotificationCenter } from '../common/NotificationCenter'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Search, Plus, Bell, Sun, Moon, LogOut, Settings, User } from 'lucide-react'
import { toast, Toaster } from 'sonner@2.0.3'
import logoImage from 'figma:asset/6748e9361ee0546a59b88c4fb2d8d612f9260020.png'

interface MainLayoutProps {
  user: any
  onLogout: () => void
}

export function MainLayout({ user, onLogout }: MainLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [showQuickCreate, setShowQuickCreate] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Get current active module from pathname
  const getCurrentModule = () => {
    const path = location.pathname.slice(1) // Remove leading slash
    if (path === '' || path === 'dashboard') return 'dashboard'
    if (path.startsWith('projects/')) return 'projects'
    if (path === 'planning') return 'tasks'
    return path
  }

  const activeModule = getCurrentModule()

  // Set page title based on active module
  useEffect(() => {
    const moduleNames = {
      dashboard: 'Dashboard',
      projects: 'Projects',
      tasks: 'Planning',
      planning: 'Planning',
      boards: 'Project Boards',
      timetracking: 'Time Tracking',
      customers: 'Customers',
      reports: 'Reports',
      admin: 'Admin'
    }

    const moduleName = moduleNames[activeModule as keyof typeof moduleNames] || 'Dashboard'
    document.title = `${moduleName} - Planora`
  }, [activeModule])

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Keyboard shortcuts and click outside handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Quick create: Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
      // New task: T
      if (e.key === 't' && !e.ctrlKey && !e.metaKey && e.target === document.body) {
        e.preventDefault()
        setShowQuickCreate(true)
      }
      // Escape key to close modals and dropdowns
      if (e.key === 'Escape') {
        setShowQuickCreate(false)
        setShowSearch(false)
        setShowNotifications(false)
        setShowUserMenu(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Role-based access control function
  const hasModuleAccess = (userRole: string, module: string) => {
    const roleAccess = {
      admin: ['dashboard', 'projects', 'tasks', 'boards', 'timetracking', 'customers', 'reports', 'admin'],
      super_admin: ['dashboard', 'projects', 'tasks', 'boards', 'timetracking', 'customers', 'reports', 'admin'],
      project_manager: ['dashboard', 'projects', 'tasks', 'boards', 'timetracking', 'customers', 'reports', 'profile'],
      developer: ['dashboard', 'projects', 'tasks', 'boards', 'timetracking', 'reports', 'profile'],
      tester: ['dashboard', 'projects', 'tasks', 'boards', 'timetracking', 'reports', 'profile']
    }

    return roleAccess[userRole as keyof typeof roleAccess]?.includes(module) || false
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-background">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-500/30 dark:border-gray-500/50 shadow-xl backdrop-blur-md" style={{ backgroundColor: '#262626' }}>
        <div className="flex items-center justify-between px-6 h-16">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#28A745] to-[#20943a] shadow-lg">
                <img
                  src={logoImage}
                  alt="Planora Logo"
                  className="w-6 h-6 object-contain filter brightness-0 invert"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white drop-shadow-sm">Planora</h1>
                <p className="text-xs text-gray-200 -mt-0.5 drop-shadow-sm">Project Management</p>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Global Search */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowSearch(true)
              }}
              className="relative min-w-[200px] justify-start text-gray-200 bg-gray-700/40 border-gray-500/40 hover:bg-gray-700/60 hover:text-white backdrop-blur-sm"
            >
              <Search className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Search tasks, projects, users...</span>
              <kbd className="ml-auto text-xs bg-gray-800/60 text-gray-100 px-1.5 py-0.5 rounded border border-gray-500/50">⌘K</kbd>
            </Button>

            {/* Quick Create */}
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowQuickCreate(true)
              }}
              className="bg-gradient-to-r from-[#28A745] to-[#20943a] hover:from-[#218838] hover:to-[#1e7e34] text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create
            </Button>

            {/* Notifications */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowNotifications(true)
              }}
              className="relative bg-gray-700/40 border-gray-500/40 hover:bg-gray-700/60 text-white hover:text-white backdrop-blur-sm"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#DC3545] to-[#c82333] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                3
              </span>
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setDarkMode(!darkMode)
              }}
              className="bg-gray-700/40 border-gray-500/40 hover:bg-gray-700/60 text-white hover:text-white backdrop-blur-sm"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowUserMenu(!showUserMenu)
                }}
                className="flex items-center space-x-3 bg-gray-700/40 border-gray-500/40 hover:bg-gray-700/60 text-white hover:text-white backdrop-blur-sm px-3 py-2 h-10"
              >
                <Avatar className="w-8 h-8 ring-2 ring-green-600/50">
                  <AvatarFallback className="bg-gradient-to-br from-[#28A745] to-[#20943a] text-white text-sm font-medium">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white drop-shadow-sm">{user.name}</p>
                  <p className="text-xs text-gray-200 -mt-0.5 drop-shadow-sm">
                    {user.role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                </div>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl z-[60] backdrop-blur-md border border-gray-500/50" style={{ backgroundColor: '#262626' }}>
                  <div className="p-6 border-b border-gray-500/50">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-14 h-14 ring-4 ring-green-600/30">
                        <AvatarFallback className="bg-gradient-to-br from-[#28A745] to-[#20943a] text-white text-lg font-semibold">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-white drop-shadow-sm text-base">{user.name}</p>
                        <p className="text-sm text-gray-200 mb-2 drop-shadow-sm">{user.email}</p>
                        <Badge
                          className="text-xs font-normal bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30 hover:bg-[#28A745]/30"
                          variant="outline"
                        >
                          {user.role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {/* Show Settings for admin/super_admin users */}
                    {hasModuleAccess(user?.role, 'admin') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-11 px-4 rounded-xl text-white hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                        onClick={() => {
                          navigate('/admin')
                          setShowUserMenu(false)
                        }}
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        Settings & Admin
                      </Button>
                    )}

                    {/* Show My Profile for non-admin users */}
                    {!hasModuleAccess(user?.role, 'admin') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-11 px-4 rounded-xl text-white hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                        onClick={() => {
                          navigate('/profile')
                          setShowUserMenu(false)
                        }}
                      >
                        <User className="w-5 h-5 mr-3" />
                        My Profile
                      </Button>
                    )}

                    <div className="border-t border-gray-500/50 pt-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-11 px-4 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all duration-200"
                        onClick={onLogout}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar
          activeModule={activeModule}
          user={user}
        />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-x-hidden">
          <div className="container-1920 main-content-1920">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Modals */}
      {showQuickCreate && (
        <QuickCreate
          isOpen={showQuickCreate}
          onClose={() => setShowQuickCreate(false)}
          user={user}
        />
      )}

      {showSearch && (
        <GlobalSearch
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          user={user}
        />
      )}

      {showNotifications && (
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          user={user}
        />
      )}

      <Toaster position="top-right" />
    </div>
  )
}