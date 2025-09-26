import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { 
  Plus, 
  Search, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Crown,
  Shield,
  User,
  Settings
} from 'lucide-react'

interface TeamViewProps {
  project: any
  user: any
}

// Extended team data with more details
const mockTeamMembers = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'AJ',
    role: 'Scrum Master',
    email: 'alice.johnson@company.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: '2024-01-15',
    workload: 85,
    availability: 'available',
    skills: ['Agile', 'Project Management', 'Scrum', 'Leadership'],
    currentTasks: 3,
    completedTasks: 28,
    hoursLogged: 156,
    teamLead: true,
    permissions: ['manage_team', 'edit_project', 'view_reports']
  },
  {
    id: '2',
    name: 'Bob Chen',
    avatar: 'BC',
    role: 'Lead Developer',
    email: 'bob.chen@company.com',
    phone: '+1 (555) 234-5678',
    location: 'Seattle, WA',
    joinDate: '2024-01-20',
    workload: 92,
    availability: 'busy',
    skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'AWS'],
    currentTasks: 5,
    completedTasks: 42,
    hoursLogged: 189,
    teamLead: false,
    permissions: ['edit_code', 'review_code', 'view_reports']
  },
  {
    id: '3',
    name: 'Carol Davis',
    avatar: 'CD',
    role: 'UI/UX Designer',
    email: 'carol.davis@company.com',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    joinDate: '2024-02-01',
    workload: 78,
    availability: 'available',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    currentTasks: 2,
    completedTasks: 19,
    hoursLogged: 134,
    teamLead: false,
    permissions: ['edit_design', 'view_reports']
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'DW',
    role: 'QA Engineer',
    email: 'david.wilson@company.com',
    phone: '+1 (555) 456-7890',
    location: 'Denver, CO',
    joinDate: '2024-02-10',
    workload: 65,
    availability: 'available',
    skills: ['Test Automation', 'Selenium', 'Jest', 'Quality Assurance', 'Bug Tracking'],
    currentTasks: 4,
    completedTasks: 31,
    hoursLogged: 98,
    teamLead: false,
    permissions: ['create_bugs', 'view_reports']
  },
  {
    id: '5',
    name: 'Emma Rodriguez',
    avatar: 'ER',
    role: 'Product Owner',
    email: 'emma.rodriguez@company.com',
    phone: '+1 (555) 567-8901',
    location: 'New York, NY',
    joinDate: '2024-01-10',
    workload: 70,
    availability: 'available',
    skills: ['Product Strategy', 'User Stories', 'Stakeholder Management', 'Analytics'],
    currentTasks: 2,
    completedTasks: 15,
    hoursLogged: 89,
    teamLead: false,
    permissions: ['manage_backlog', 'edit_project', 'view_reports']
  }
]

export function TeamView({ project, user }: TeamViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterAvailability, setFilterAvailability] = useState('all')
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 border-green-300'
      case 'busy': return 'bg-red-100 text-red-800 border-red-300'
      case 'away': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getRoleIcon = (role: string) => {
    if (role.includes('Lead') || role.includes('Manager') || role.includes('Master')) {
      return <Crown className="w-4 h-4 text-yellow-600" />
    } else if (role.includes('Owner')) {
      return <Shield className="w-4 h-4 text-blue-600" />
    } else {
      return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return 'text-red-600'
    if (workload >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role.toLowerCase().includes(filterRole.toLowerCase())
    const matchesAvailability = filterAvailability === 'all' || member.availability === filterAvailability
    
    return matchesSearch && matchesRole && matchesAvailability
  })

  const TeamMemberCard = ({ member }: { member: any }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedMember(member)}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-[#28A745] text-white text-lg">
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            {member.teamLead && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getRoleIcon(member.role)}
                  <span className="text-sm text-muted-foreground">{member.role}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getAvailabilityColor(member.availability)}>
                  {member.availability}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Workload: <span className={getWorkloadColor(member.workload)}>{member.workload}%</span>
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Active Tasks</span>
                  <p className="font-medium">{member.currentTasks}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Completed</span>
                  <p className="font-medium">{member.completedTasks}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Hours</span>
                  <p className="font-medium">{member.hoursLogged}h</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{member.workload}%</span>
                </div>
                <Progress value={member.workload} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const MemberDetailsModal = ({ member }: { member: any }) => (
    <Dialog open={!!member} onOpenChange={() => setSelectedMember(null)}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-[#28A745] text-white">
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>{member.name}</span>
              <p className="text-sm text-muted-foreground font-normal">{member.role}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{member.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Joined {member.joinDate}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Current Workload</span>
                      <span className={getWorkloadColor(member.workload)}>{member.workload}%</span>
                    </div>
                    <Progress value={member.workload} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-semibold text-[#007BFF]">{member.currentTasks}</div>
                      <div className="text-muted-foreground">Active Tasks</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-2xl font-semibold text-[#28A745]">{member.completedTasks}</div>
                      <div className="text-muted-foreground">Completed</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-semibold text-[#6F42C1]">{member.hoursLogged}</div>
                    <div className="text-muted-foreground">Hours Logged</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <div className="text-center text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-2" />
              <p>Task details would be loaded here</p>
              <p className="text-sm">Integration with task management needed</p>
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Skills & Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill: string) => (
                  <Badge key={skill} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Project Permissions</h4>
              <div className="space-y-2">
                {member.permissions.map((permission: string) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{permission.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Member
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Remove from Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Team</h2>
          <p className="text-muted-foreground">Manage team members and their roles</p>
        </div>
        
        <Button 
          className="bg-[#28A745] hover:bg-[#218838]"
          onClick={() => setShowAddMember(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="scrum">Scrum Master</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="qa">QA Engineer</SelectItem>
            <SelectItem value="owner">Product Owner</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterAvailability} onValueChange={setFilterAvailability}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="away">Away</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#007BFF]">{mockTeamMembers.length}</div>
            <div className="text-xs text-muted-foreground">Total Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#28A745]">{mockTeamMembers.filter(m => m.availability === 'available').length}</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#FFC107]">{mockTeamMembers.reduce((sum, m) => sum + m.currentTasks, 0)}</div>
            <div className="text-xs text-muted-foreground">Active Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#6F42C1]">
              {Math.round(mockTeamMembers.reduce((sum, m) => sum + m.workload, 0) / mockTeamMembers.length)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Workload</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>

      {/* Member Details Modal */}
      {selectedMember && <MemberDetailsModal member={selectedMember} />}

      {/* Add Member Modal */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" placeholder="Enter email address" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="qa">QA Engineer</SelectItem>
                    <SelectItem value="scrum-master">Scrum Master</SelectItem>
                    <SelectItem value="product-owner">Product Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input placeholder="Enter phone number" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input placeholder="Enter location" />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddMember(false)}>
                Cancel
              </Button>
              <Button className="bg-[#28A745] hover:bg-[#218838]">
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}