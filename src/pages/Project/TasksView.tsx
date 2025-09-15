import { useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Progress } from '../../components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Calendar } from '../../components/ui/calendar'
import { 
  Plus,
  Search,
  Filter,
  SortAsc,
  List,
  Kanban,
  CalendarDays,
  Eye,
  Edit,
  MoreHorizontal,
  Clock,
  User,
  Flag,
  Tag,
  ChevronDown
} from 'lucide-react'

interface TasksViewProps {
  project: any
  onTaskCreate: () => void
  onTaskEdit: (task: any) => void
  onTaskView: (task: any) => void
}

type ViewMode = 'list' | 'kanban' | 'calendar'

export function TasksView({ project, onTaskCreate, onTaskEdit, onTaskView }: TasksViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-[#DC3545] text-white'
      case 'Medium': return 'bg-[#FFC107] text-white'
      case 'Low': return 'bg-[#28A745] text-white'
      default: return 'bg-muted text-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-[#28A745] bg-[#28A745]/10'
      case 'In Progress': return 'text-[#FFC107] bg-[#FFC107]/10'
      case 'To Do': return 'text-[#DC3545] bg-[#DC3545]/10'
      default: return 'text-muted-foreground bg-muted/10'
    }
  }

  const filteredTasks = project.tasks.filter((task: any) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesAssignee = assigneeFilter === 'all' || task.assignee.name === assigneeFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      case 'status':
        return a.status.localeCompare(b.status)
      case 'assignee':
        return a.assignee.name.localeCompare(b.assignee.name)
      default:
        return 0
    }
  })

  const tasksByStatus = {
    'To Do': sortedTasks.filter(task => task.status === 'To Do'),
    'In Progress': sortedTasks.filter(task => task.status === 'In Progress'),
    'Completed': sortedTasks.filter(task => task.status === 'Completed')
  }

  const renderListView = () => (
    <Card className="p-6">
      <div className="space-y-4">
        {sortedTasks.map((task: any) => (
          <div key={task.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex items-center space-x-4 flex-1">
              <div className={`w-3 h-3 rounded-full ${
                task.status === 'Completed' ? 'bg-[#28A745]' :
                task.status === 'In Progress' ? 'bg-[#FFC107]' : 'bg-[#DC3545]'
              }`} />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium">{task.title}</h4>
                  <Badge variant="outline" className="text-xs">{task.id}</Badge>
                  <Badge className={getPriorityColor(task.priority)} size="sm">
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                        {task.assignee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{task.timeTracked}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  {task.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium">{task.progress}%</div>
                <Progress value={task.progress} className="w-20 h-1 mt-1" />
              </div>
              <Button variant="outline" size="sm" onClick={() => onTaskView(task)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onTaskEdit(task)}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )

  const renderKanbanView = () => (
    <div className="grid grid-cols-3 gap-6">
      {Object.entries(tasksByStatus).map(([status, tasks]) => (
        <Card key={status} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{status}</h3>
              <Badge variant="outline" className="text-xs">
                {tasks.length}
              </Badge>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {tasks.map((task: any) => (
              <Card key={task.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onTaskView(task)}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={getPriorityColor(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{task.id}</span>
                  </div>
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                        {task.assignee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium">{task.progress}%</span>
                      <Progress value={task.progress} className="w-12 h-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {task.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )

  const renderCalendarView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full"
          />
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            Tasks for {selectedDate?.toLocaleDateString()}
          </h3>
          <div className="space-y-3">
            {sortedTasks
              .filter(task => new Date(task.dueDate).toDateString() === selectedDate?.toDateString())
              .map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'Completed' ? 'bg-[#28A745]' :
                      task.status === 'In Progress' ? 'bg-[#FFC107]' : 'bg-[#DC3545]'
                    }`} />
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-xs bg-[#007BFF] text-white">
                            {task.assignee.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                        <Badge className={getPriorityColor(task.priority)} size="sm">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onTaskView(task)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            {sortedTasks.filter(task => new Date(task.dueDate).toDateString() === selectedDate?.toDateString()).length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No tasks scheduled for this date
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Badge variant="outline">
            {filteredTasks.length} of {project.tasks.length}
          </Badge>
        </div>
        <Button onClick={onTaskCreate} className="bg-[#28A745] hover:bg-[#218838] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {project.team.map((member: any) => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="assignee">Assignee</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="rounded-none border-x"
            >
              <Kanban className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="rounded-l-none"
            >
              <CalendarDays className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Task Views */}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'kanban' && renderKanbanView()}
      {viewMode === 'calendar' && renderCalendarView()}
    </div>
  )
}