import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { BoardView } from './BoardView'
import { ListView } from './ListView'
import { CalendarView } from './CalendarView'
import { BoardFilters } from './BoardFilters'
import { TaskDetailsModal } from './TaskDetailsModal'
import { TaskCreationModal } from './TaskCreationModal'
import { EnhancedTaskDetailsModal } from './EnhancedTaskDetailsModal'
import { TaskTimeTracker } from './TaskTimeTracker'
import { TaskManagementUtils } from './TaskManagementUtils'
import { TaskMetrics } from './TaskMetrics'
import { AdvancedSearch } from './AdvancedSearch'
import { DragDropGuide } from './DragDropGuide'
import { Plus, Filter, Search, Download, RefreshCw, BarChart3, HelpCircle } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { toast } from 'sonner@2.0.3'
import { BOARD_TASKS, PROJECTS, SPRINTS, TEAM_MEMBERS, PRIORITIES, STATUSES } from '../../mock-data/tasks'

// Using centralized mock data from src/mock-data/tasks.ts

interface BoardsProps {
  user?: any
}

export function Boards({ user }: BoardsProps) {
  const [activeView, setActiveView] = useState('board')
  const [selectedProject, setSelectedProject] = useState('All Projects')
  const [selectedSprint, setSelectedSprint] = useState('All Sprints')
  const [selectedAssignee, setSelectedAssignee] = useState('All Team Members')
  const [selectedPriority, setSelectedPriority] = useState('All Priorities')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEnhancedModal, setShowEnhancedModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showTimeTracker, setShowTimeTracker] = useState(false)
  const [showUtils, setShowUtils] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [showDragDropGuide, setShowDragDropGuide] = useState(false)

  // Filter tasks based on current selections
  const filteredTasks = useMemo(() => {
    return BOARD_TASKS.filter(task => {
      const matchesProject = selectedProject === 'All Projects' || task.project === selectedProject
      const matchesSprint = selectedSprint === 'All Sprints' || task.sprint === selectedSprint  
      const matchesAssignee = selectedAssignee === 'All Team Members' || task.assignee === selectedAssignee
      const matchesPriority = selectedPriority === 'All Priorities' || task.priority === selectedPriority
      const matchesStatus = selectedStatus === 'All Statuses' || task.status === selectedStatus
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesProject && matchesSprint && matchesAssignee && matchesPriority && matchesStatus && matchesSearch
    })
  }, [selectedProject, selectedSprint, selectedAssignee, selectedPriority, selectedStatus, searchQuery])

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setShowEnhancedModal(true)
  }

  const handleCreateTask = () => {
    setShowCreateModal(true)
  }

  const getStatusCounts = () => {
    return {
      backlog: filteredTasks.filter(t => t.status === 'backlog').length,
      todo: filteredTasks.filter(t => t.status === 'todo').length,
      'in-progress': filteredTasks.filter(t => t.status === 'in-progress').length,
      review: filteredTasks.filter(t => t.status === 'review').length,
      done: filteredTasks.filter(t => t.status === 'done').length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Boards</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage tasks across projects with Kanban boards, lists, and calendar views
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMetrics(true)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Metrics
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUtils(true)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Utils
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDragDropGuide(true)}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Guide
          </Button>
          
          <Button onClick={handleCreateTask}>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {status.replace('-', ' ')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks, projects, assignees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedSearch(true)}
          >
            <Search className="w-4 h-4 mr-2" />
            Advanced
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters && <Badge variant="secondary" className="ml-2">ON</Badge>}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <BoardFilters
          selectedProject={selectedProject}
          selectedSprint={selectedSprint}
          selectedAssignee={selectedAssignee}
          selectedPriority={selectedPriority}
          selectedStatus={selectedStatus}
          onProjectChange={setSelectedProject}
          onSprintChange={setSelectedSprint}
          onAssigneeChange={setSelectedAssignee}
          onPriorityChange={setSelectedPriority}
          onStatusChange={setSelectedStatus}
          projects={PROJECTS}
          sprints={SPRINTS}
          teamMembers={TEAM_MEMBERS}
          priorities={PRIORITIES}
          statuses={STATUSES}
        />
      )}

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="board">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="board" className="mt-6">
          <BoardView 
            tasks={filteredTasks} 
            onTaskClick={handleTaskClick}
            onCreateTask={handleCreateTask}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <ListView 
            tasks={filteredTasks} 
            onTaskClick={handleTaskClick}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <CalendarView 
            tasks={filteredTasks} 
            onTaskClick={handleTaskClick}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showCreateModal && (
        <TaskCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          projects={PROJECTS}
          teamMembers={TEAM_MEMBERS}
          sprints={SPRINTS}
        />
      )}

      {showEnhancedModal && selectedTask && (
        <EnhancedTaskDetailsModal
          isOpen={showEnhancedModal}
          onClose={() => setShowEnhancedModal(false)}
          task={selectedTask}
          projects={PROJECTS}
          teamMembers={TEAM_MEMBERS}
          sprints={SPRINTS}
        />
      )}

      {showTimeTracker && (
        <TaskTimeTracker
          isOpen={showTimeTracker}
          onClose={() => setShowTimeTracker(false)}
          task={selectedTask}
        />
      )}

      {showUtils && (
        <TaskManagementUtils
          isOpen={showUtils}
          onClose={() => setShowUtils(false)}
          tasks={filteredTasks}
        />
      )}

      {showMetrics && (
        <TaskMetrics
          isOpen={showMetrics}
          onClose={() => setShowMetrics(false)}
          tasks={BOARD_TASKS}
        />
      )}

      {showAdvancedSearch && (
        <AdvancedSearch
          isOpen={showAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
          tasks={BOARD_TASKS}
          onTaskSelect={handleTaskClick}
        />
      )}

      {showDragDropGuide && (
        <DragDropGuide
          isOpen={showDragDropGuide}
          onClose={() => setShowDragDropGuide(false)}
        />
      )}
    </div>
  )
}