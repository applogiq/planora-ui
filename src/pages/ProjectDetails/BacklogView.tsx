import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Target,
  AlertTriangle,
  Flag,
  CheckCircle,
  Clock,
  Users,
  GripVertical,
  Edit,
  Trash2,
  Archive
} from 'lucide-react'

interface BacklogViewProps {
  projectId: string
  user: any
}

// Mock backlog data
const mockBacklogItems = [
  {
    id: 'EPIC-001',
    title: 'User Authentication System',
    description: 'Complete user authentication and authorization system with OAuth integration',
    type: 'epic',
    priority: 'high',
    status: 'active',
    storyPoints: 21,
    businessValue: 100,
    assignee: { name: 'Alice Johnson', avatar: 'AJ' },
    reporter: { name: 'Product Owner', avatar: 'PO' },
    labels: ['authentication', 'security', 'backend'],
    createdAt: '2024-02-15',
    stories: [
      {
        id: 'STORY-001',
        title: 'OAuth 2.0 Integration',
        description: 'Implement OAuth 2.0 with Google and GitHub',
        storyPoints: 8,
        priority: 'high',
        status: 'in-progress',
        assignee: { name: 'Bob Chen', avatar: 'BC' }
      },
      {
        id: 'STORY-002',
        title: 'Password Reset Flow',
        description: 'Secure password reset with email verification',
        storyPoints: 5,
        priority: 'medium',
        status: 'todo',
        assignee: { name: 'David Wilson', avatar: 'DW' }
      },
      {
        id: 'STORY-003',
        title: 'User Profile Management',
        description: 'Profile edit and management interface',
        storyPoints: 8,
        priority: 'medium',
        status: 'todo',
        assignee: { name: 'Carol Davis', avatar: 'CD' }
      }
    ]
  },
  {
    id: 'EPIC-002',
    title: 'Payment Processing',
    description: 'Integrate payment gateway and billing system',
    type: 'epic',
    priority: 'high',
    status: 'planning',
    storyPoints: 34,
    businessValue: 90,
    assignee: { name: 'Emma Rodriguez', avatar: 'ER' },
    reporter: { name: 'Product Owner', avatar: 'PO' },
    labels: ['payment', 'integration', 'billing'],
    createdAt: '2024-02-20',
    stories: [
      {
        id: 'STORY-004',
        title: 'Stripe Integration',
        description: 'Integrate Stripe payment gateway',
        storyPoints: 13,
        priority: 'high',
        status: 'todo',
        assignee: { name: 'Frank Miller', avatar: 'FM' }
      },
      {
        id: 'STORY-005',
        title: 'Billing Dashboard',
        description: 'User billing and invoice management',
        storyPoints: 8,
        priority: 'medium',
        status: 'todo',
        assignee: { name: 'Grace Kim', avatar: 'GK' }
      },
      {
        id: 'STORY-006',
        title: 'Payment History',
        description: 'Display payment history and receipts',
        storyPoints: 5,
        priority: 'low',
        status: 'todo',
        assignee: { name: 'John Smith', avatar: 'JS' }
      }
    ]
  },
  {
    id: 'STORY-007',
    title: 'Dark Mode Support',
    description: 'Add dark mode theme support across the application',
    type: 'story',
    priority: 'low',
    status: 'todo',
    storyPoints: 8,
    businessValue: 30,
    assignee: { name: 'Sarah Wilson', avatar: 'SW' },
    reporter: { name: 'UX Designer', avatar: 'UX' },
    labels: ['ui', 'theme', 'frontend'],
    createdAt: '2024-03-01'
  },
  {
    id: 'BUG-001',
    title: 'Login form validation issues',
    description: 'Email validation not working properly on login form',
    type: 'bug',
    priority: 'high',
    status: 'todo',
    storyPoints: 3,
    businessValue: 80,
    assignee: { name: 'Mike Johnson', avatar: 'MJ' },
    reporter: { name: 'QA Tester', avatar: 'QA' },
    labels: ['bug', 'frontend', 'validation'],
    createdAt: '2024-03-03'
  }
]

export function BacklogView({ projectId, user }: BacklogViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'epic': return <Flag className="w-4 h-4 text-purple-600" />
      case 'story': return <Target className="w-4 h-4 text-blue-600" />
      case 'bug': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'task': return <CheckCircle className="w-4 h-4 text-green-600" />
      default: return <Target className="w-4 h-4 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300'
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'done': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const filteredItems = mockBacklogItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority
    
    return matchesSearch && matchesType && matchesPriority
  })

  const BacklogItemCard = ({ item }: { item: any }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
            {getTypeIcon(item.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{item.id}</span>
                <Badge variant="outline" className={getPriorityColor(item.priority)} style={{ fontSize: '10px' }}>
                  {item.priority}
                </Badge>
                {item.storyPoints && (
                  <Badge variant="outline" className="text-xs">
                    {item.storyPoints} pts
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
            
            <h4 className="font-medium mb-1 line-clamp-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-[#28A745] text-white text-xs">
                    {item.assignee.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{item.assignee.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.businessValue && (
                  <Badge variant="outline" className="text-xs">
                    Value: {item.businessValue}
                  </Badge>
                )}
                <Badge variant="outline" className={getStatusColor(item.status)} style={{ fontSize: '10px' }}>
                  {item.status.replace('-', ' ')}
                </Badge>
              </div>
            </div>
            
            {/* Show child stories for epics */}
            {item.type === 'epic' && item.stories && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Child Stories ({item.stories.length})</p>
                <div className="space-y-1">
                  {item.stories.slice(0, 3).map((story: any) => (
                    <div key={story.id} className="flex items-center space-x-2 text-xs">
                      <Target className="w-3 h-3 text-blue-500" />
                      <span className="text-muted-foreground">{story.id}</span>
                      <span className="flex-1 truncate">{story.title}</span>
                      <Badge variant="outline" className={getStatusColor(story.status)} style={{ fontSize: '9px' }}>
                        {story.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  ))}
                  {item.stories.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{item.stories.length - 3} more stories
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Product Backlog</h2>
          <p className="text-muted-foreground">Manage and prioritize product backlog items</p>
        </div>
        
        <Button 
          className="bg-[#28A745] hover:bg-[#218838]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Item
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search backlog items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Backlog Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#6F42C1]">{mockBacklogItems.filter(i => i.type === 'epic').length}</div>
            <div className="text-xs text-muted-foreground">Epics</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#007BFF]">{mockBacklogItems.filter(i => i.type === 'story').length}</div>
            <div className="text-xs text-muted-foreground">Stories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#DC3545]">{mockBacklogItems.filter(i => i.type === 'bug').length}</div>
            <div className="text-xs text-muted-foreground">Bugs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-[#28A745]">{mockBacklogItems.reduce((sum, i) => sum + (i.storyPoints || 0), 0)}</div>
            <div className="text-xs text-muted-foreground">Story Points</div>
          </CardContent>
        </Card>
      </div>

      {/* Backlog Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <BacklogItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Create Item Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Backlog Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Title</Label>
              <Input placeholder="Enter item title" />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea placeholder="Enter item description" rows={3} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storyPoints">Story Points</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="businessValue">Business Value</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-[#28A745] hover:bg-[#218838]">
                Create Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}