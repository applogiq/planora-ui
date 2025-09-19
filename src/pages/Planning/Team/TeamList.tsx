import { useState, useEffect } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import { Progress } from '../../../components/ui/progress'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { toast } from 'sonner@2.0.3'
import {
  Users,
  Search,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar?: string
  skills: string[]
  currentCapacity: number
  maxCapacity: number
  currentSprints: string[]
  velocity: number
  completedStoryPoints: number
  activeTasksCount: number
  timezone: string
  isActive: boolean
}

interface TeamListProps {
  projects?: any[]
  teamMembers?: any[]
}

export function TeamList({ projects = [], teamMembers = [] }: TeamListProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration
  useEffect(() => {
    const mockTeamMembers: TeamMember[] = [
      {
        id: 'TM-001',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        role: 'Senior Developer',
        department: 'Engineering',
        avatar: 'SW',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        currentCapacity: 32,
        maxCapacity: 40,
        currentSprints: ['Sprint 23', 'Sprint 24'],
        velocity: 24,
        completedStoryPoints: 156,
        activeTasksCount: 5,
        timezone: 'UTC-5',
        isActive: true
      },
      {
        id: 'TM-002',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        role: 'Product Manager',
        department: 'Product',
        avatar: 'MJ',
        skills: ['Product Strategy', 'User Research', 'Analytics', 'Agile'],
        currentCapacity: 35,
        maxCapacity: 40,
        currentSprints: ['Sprint 23'],
        velocity: 18,
        completedStoryPoints: 98,
        activeTasksCount: 8,
        timezone: 'UTC-8',
        isActive: true
      },
      {
        id: 'TM-003',
        name: 'Emma Davis',
        email: 'emma.davis@company.com',
        role: 'UX Designer',
        department: 'Design',
        avatar: 'ED',
        skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
        currentCapacity: 28,
        maxCapacity: 40,
        currentSprints: ['Sprint 24'],
        velocity: 16,
        completedStoryPoints: 72,
        activeTasksCount: 3,
        timezone: 'UTC+1',
        isActive: true
      },
      {
        id: 'TM-004',
        name: 'Alex Chen',
        email: 'alex.chen@company.com',
        role: 'DevOps Engineer',
        department: 'Engineering',
        avatar: 'AC',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        currentCapacity: 40,
        maxCapacity: 40,
        currentSprints: ['Sprint 23', 'Sprint 24'],
        velocity: 20,
        completedStoryPoints: 134,
        activeTasksCount: 6,
        timezone: 'UTC+8',
        isActive: true
      }
    ]

    setTimeout(() => {
      setMembers(mockTeamMembers)
      setLoading(false)
    }, 1000)
  }, [])

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getCapacityBgColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 90) return 'bg-red-100'
    if (percentage >= 70) return 'bg-yellow-100'
    return 'bg-green-100'
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = roleFilter === 'all' || member.role.toLowerCase().includes(roleFilter.toLowerCase())
    const matchesDepartment = departmentFilter === 'all' || member.department.toLowerCase() === departmentFilter.toLowerCase()

    return matchesSearch && matchesRole && matchesDepartment
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <Users className="w-7 h-7 text-orange-600" />
            <span>Team Management</span>
          </h1>
          <p className="text-gray-600 mt-1">Monitor team capacity, velocity, and performance</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="devops">DevOps</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="qa">QA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <p className="text-xs text-gray-500">{member.department}</p>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Capacity</span>
                        <span className={`font-medium ${getCapacityColor(member.currentCapacity, member.maxCapacity)}`}>
                          {member.currentCapacity}/{member.maxCapacity}h
                        </span>
                      </div>
                      <Progress
                        value={(member.currentCapacity / member.maxCapacity) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Active Tasks</span>
                        <span className="font-medium">{member.activeTasksCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Velocity</span>
                        <span className="font-medium">{member.velocity} pts</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{member.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="capacity" className="mt-6">
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-orange-100 text-orange-700">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{member.currentCapacity}</div>
                      <div className="text-xs text-gray-500">Current Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{member.maxCapacity}</div>
                      <div className="text-xs text-gray-500">Max Hours</div>
                    </div>
                    <div className="w-32">
                      <Progress
                        value={(member.currentCapacity / member.maxCapacity) * 100}
                        className="h-3"
                      />
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {Math.round((member.currentCapacity / member.maxCapacity) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="velocity" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-orange-100 text-orange-700">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {member.velocity} pts/sprint
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{member.completedStoryPoints}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{member.activeTasksCount}</div>
                    <div className="text-sm text-gray-600">Active Tasks</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Current Sprints:</div>
                  <div className="flex flex-wrap gap-1">
                    {member.currentSprints.map((sprint, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {sprint}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}