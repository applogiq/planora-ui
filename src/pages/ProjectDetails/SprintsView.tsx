import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Calendar } from '../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { Progress } from '../../components/ui/progress'
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'

// Simple date formatting function
const formatDate = (date: Date, formatType: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  if (formatType === 'MMM d') {
    return `${months[date.getMonth()]} ${date.getDate()}`
  } else if (formatType === 'MMM d, yyyy') {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  } else if (formatType === 'PPP') {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }
  return date.toLocaleDateString()
}

interface SprintsViewProps {
  projectId: string
  user: any
}

// Mock sprints data
const mockSprints = [
  {
    id: 'SPRINT-001',
    name: 'Sprint 1 - Authentication Foundation',
    goal: 'Complete basic user authentication and login functionality',
    status: 'active',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-14'),
    totalStoryPoints: 34,
    completedStoryPoints: 21,
    velocity: 18,
    stories: [
      {
        id: 'STORY-001',
        title: 'OAuth 2.0 Integration',
        status: 'done',
        storyPoints: 8,
        assignee: { name: 'Bob Chen', avatar: 'BC' }
      },
      {
        id: 'STORY-002',
        title: 'Login Form UI',
        status: 'done',
        storyPoints: 5,
        assignee: { name: 'Carol Davis', avatar: 'CD' }
      },
      {
        id: 'STORY-003',
        title: 'Password Reset Flow',
        status: 'in-progress',
        storyPoints: 8,
        assignee: { name: 'David Wilson', avatar: 'DW' }
      },
      {
        id: 'STORY-004',
        title: 'Session Management',
        status: 'todo',
        storyPoints: 13,
        assignee: { name: 'Alice Johnson', avatar: 'AJ' }
      }
    ],
    burndownData: [
      { day: 1, remaining: 34 },
      { day: 2, remaining: 32 },
      { day: 3, remaining: 29 },
      { day: 4, remaining: 26 },
      { day: 5, remaining: 24 },
      { day: 6, remaining: 21 },
      { day: 7, remaining: 21 },
      { day: 8, remaining: 18 },
      { day: 9, remaining: 15 },
      { day: 10, remaining: 13 }
    ]
  },
  {
    id: 'SPRINT-002',
    name: 'Sprint 2 - User Profile & Settings',
    goal: 'Implement user profile management and account settings',
    status: 'planning',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-28'),
    totalStoryPoints: 29,
    completedStoryPoints: 0,
    velocity: 0,
    stories: [
      {
        id: 'STORY-005',
        title: 'Profile Edit Interface',
        status: 'todo',
        storyPoints: 8,
        assignee: { name: 'Carol Davis', avatar: 'CD' }
      },
      {
        id: 'STORY-006',
        title: 'Avatar Upload',
        status: 'todo',
        storyPoints: 5,
        assignee: { name: 'Frank Miller', avatar: 'FM' }
      },
      {
        id: 'STORY-007',
        title: 'Account Settings',
        status: 'todo',
        storyPoints: 8,
        assignee: { name: 'Grace Kim', avatar: 'GK' }
      },
      {
        id: 'STORY-008',
        title: 'Notification Preferences',
        status: 'todo',
        storyPoints: 8,
        assignee: { name: 'John Smith', avatar: 'JS' }
      }
    ]
  },
  {
    id: 'SPRINT-003',
    name: 'Sprint 3 - Dashboard Implementation',
    goal: 'Create user dashboard with widgets and analytics',
    status: 'future',
    startDate: new Date('2024-03-29'),
    endDate: new Date('2024-04-11'),
    totalStoryPoints: 0,
    completedStoryPoints: 0,
    velocity: 0,
    stories: []
  }
]

export function SprintsView({ projectId, user }: SprintsViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedSprint, setSelectedSprint] = useState<any>(mockSprints[0])
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300'
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'future': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-green-600" />
      case 'planning': return <Clock className="w-4 h-4 text-blue-600" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-gray-600" />
      case 'future': return <Calendar className="w-4 h-4 text-purple-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredSprints = mockSprints.filter(sprint => {
    const matchesSearch = sprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sprint.goal.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || sprint.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const SprintCard = ({ sprint }: { sprint: any }) => {
    const progress = sprint.totalStoryPoints > 0 ? (sprint.completedStoryPoints / sprint.totalStoryPoints) * 100 : 0
    const daysRemaining = Math.ceil((sprint.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    return (
      <Card 
        className={`cursor-pointer hover:shadow-md transition-shadow ${
          selectedSprint?.id === sprint.id ? 'ring-2 ring-[#28A745] ring-opacity-50' : ''
        }`}
        onClick={() => setSelectedSprint(sprint)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(sprint.status)}
              <div>
                <h3 className="font-semibold text-foreground">{sprint.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{sprint.goal}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={getStatusColor(sprint.status)}>
                {sprint.status}
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {formatDate(sprint.startDate, 'MMM d')} - {formatDate(sprint.endDate, 'MMM d, yyyy')}
              </span>
              {sprint.status === 'active' && (
                <span className="text-muted-foreground">
                  {daysRemaining > 0 ? `${daysRemaining} days left` : 'Sprint ended'}
                </span>
              )}
            </div>
            
            {sprint.totalStoryPoints > 0 && (
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {sprint.completedStoryPoints}/{sprint.totalStoryPoints} points
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{sprint.stories.length} stories</span>
                </div>
                {sprint.velocity > 0 && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Velocity: {sprint.velocity}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center -space-x-1">
                {sprint.stories.slice(0, 3).map((story: any, index: number) => (
                  <Avatar key={story.id} className="w-6 h-6 border-2 border-white">
                    <AvatarFallback className="bg-[#28A745] text-white text-xs">
                      {story.assignee.avatar}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {sprint.stories.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs text-muted-foreground">
                    +{sprint.stories.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const SprintDetails = ({ sprint }: { sprint: any }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{sprint.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getStatusColor(sprint.status)}>
              {sprint.status}
            </Badge>
            {sprint.status === 'active' && (
              <Button size="sm" variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Complete Sprint
              </Button>
            )}
            {sprint.status === 'planning' && (
              <Button size="sm" className="bg-[#28A745] hover:bg-[#218838]">
                <Play className="w-4 h-4 mr-2" />
                Start Sprint
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="burndown">Burndown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Sprint Goal</h4>
              <p className="text-muted-foreground">{sprint.goal}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Duration</h4>
                <p className="text-muted-foreground">
                  {formatDate(sprint.startDate, 'MMM d')} - {formatDate(sprint.endDate, 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Capacity</h4>
                <p className="text-muted-foreground">{sprint.totalStoryPoints} story points</p>
              </div>
            </div>
            
            {sprint.totalStoryPoints > 0 && (
              <div>
                <h4 className="font-medium mb-2">Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Completed: {sprint.completedStoryPoints} points</span>
                    <span>Remaining: {sprint.totalStoryPoints - sprint.completedStoryPoints} points</span>
                  </div>
                  <Progress value={(sprint.completedStoryPoints / sprint.totalStoryPoints) * 100} />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stories" className="space-y-4">
            <div className="space-y-3">
              {sprint.stories.map((story: any) => (
                <Card key={story.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Target className="w-4 h-4 text-blue-600" />
                        <div>
                          <h5 className="font-medium">{story.title}</h5>
                          <p className="text-sm text-muted-foreground">{story.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {story.storyPoints} pts
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${
                          story.status === 'done' ? 'bg-green-100 text-green-800' :
                          story.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {story.status.replace('-', ' ')}
                        </Badge>
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-[#28A745] text-white text-xs">
                            {story.assignee.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="burndown" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Sprint Burndown Chart</h4>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Burndown chart visualization would go here</p>
                  <p className="text-sm">Integration with chart library needed</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Sprints</h2>
          <p className="text-muted-foreground">Manage sprint planning and execution</p>
        </div>
        
        <Button 
          className="bg-[#28A745] hover:bg-[#218838]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Sprint
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search sprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="future">Future</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sprint Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#28A745]">{mockSprints.filter(s => s.status === 'active').length}</div>
            <div className="text-xs text-muted-foreground">Active Sprints</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#007BFF]">{mockSprints.filter(s => s.status === 'planning').length}</div>
            <div className="text-xs text-muted-foreground">Planning</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#6C757D]">{mockSprints.filter(s => s.status === 'completed').length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#FFC107]">
              {mockSprints.reduce((sum, s) => sum + s.velocity, 0) / mockSprints.filter(s => s.velocity > 0).length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Avg Velocity</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprints List */}
        <div className="space-y-4">
          <h3 className="font-medium">Sprints</h3>
          {filteredSprints.map((sprint) => (
            <SprintCard key={sprint.id} sprint={sprint} />
          ))}
        </div>

        {/* Sprint Details */}
        <div className="lg:col-span-2">
          {selectedSprint && <SprintDetails sprint={selectedSprint} />}
        </div>
      </div>

      {/* Create Sprint Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Sprint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Sprint Name</Label>
              <Input placeholder="Enter sprint name" />
            </div>
            
            <div>
              <Label htmlFor="goal">Sprint Goal</Label>
              <Textarea placeholder="Enter sprint goal and objectives" rows={3} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? formatDate(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? formatDate(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-[#28A745] hover:bg-[#218838]">
                Create Sprint
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}