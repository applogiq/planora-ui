import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Card } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { toast } from 'sonner@2.0.3'
import {
  Plus,
  Zap,
  AlertTriangle,
  Grid,
  List
} from 'lucide-react'
import { sprintApiService, Sprint, SprintsQueryParams } from '../../../services/sprintApi'
import { SprintDialog } from './SprintDialog'
import { SprintCard } from './SprintCard'
import { SprintFilters } from './SprintFilters'

interface SprintListProps {
  projects?: any[]
  teamMembers?: any[]
  projectOwners?: any[]
  filters?: {
    project: string
    status: string
    priority: string
    methodology: string
    type: string
  }
}

export function SprintList({ projects = [], teamMembers = [], projectOwners = [], filters }: SprintListProps) {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedSprint, setSelectedSprint] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

  const [newSprint, setNewSprint] = useState({
    name: '',
    goal: '',
    status: 'Planning',
    startDate: '',
    endDate: '',
    projectId: '',
    scrumMasterId: '',
    teamSize: 1,
    totalPoints: 0,
    completedPoints: 0,
    totalTasks: 0,
    completedTasks: 0,
    velocity: 0,
    burndownTrend: 'On Track'
  })

  const loadSprints = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: SprintsQueryParams = {
        page,
        per_page: 12
      }

      if (searchTerm) params.search = searchTerm
      if (statusFilter !== 'all') params.status = statusFilter
      if (projectFilter !== 'all') params.project_id = projectFilter

      const response = await sprintApiService.getSprints(params)
      setSprints(response.items)
      setTotalPages(response.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sprints')
    } finally {
      setLoading(false)
    }
  }

  // Load sprints when component becomes active
  useEffect(() => {
    loadSprints()
  }, [page, searchTerm, statusFilter, projectFilter])

  const handleCreateSprint = () => {
    setSelectedSprint(newSprint)
    setIsEditMode(false)
    setShowCreateDialog(true)
  }

  const handleEditSprint = (sprint: Sprint) => {
    setSelectedSprint({
      id: sprint.id,
      name: sprint.name,
      goal: sprint.goal,
      status: sprint.status,
      startDate: sprint.start_date,
      endDate: sprint.end_date,
      projectId: sprint.project_id,
      scrumMasterId: sprint.scrum_master_id,
      teamSize: sprint.team_size,
      totalPoints: sprint.total_points,
      completedPoints: sprint.completed_points,
      totalTasks: sprint.total_tasks,
      completedTasks: sprint.completed_tasks,
      velocity: sprint.velocity,
      burndownTrend: sprint.burndown_trend
    })
    setIsEditMode(true)
    setShowCreateDialog(true)
  }

  const handleSprintCreated = async (sprint: Sprint) => {
    // Reload the full list to ensure data consistency
    await loadSprints()
    toast.success('Sprint created successfully')
    setNewSprint({
      name: '',
      goal: '',
      status: 'Planning',
      startDate: '',
      endDate: '',
      projectId: '',
      scrumMasterId: '',
      teamSize: 1,
      totalPoints: 0,
      completedPoints: 0,
      totalTasks: 0,
      completedTasks: 0,
      velocity: 0,
      burndownTrend: 'On Track'
    })
  }

  const handleSprintUpdated = async (updatedSprint: Sprint) => {
    // Reload the full list to ensure data consistency
    await loadSprints()
    toast.success('Sprint updated successfully')
  }

  const handleCloseDialog = () => {
    setShowCreateDialog(false)
    setSelectedSprint(null)
    setIsEditMode(false)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning': return 'bg-gray-100 text-gray-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'in progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && sprints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sprints...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Sprints</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadSprints}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <Zap className="w-7 h-7 text-orange-600" />
            <span>Sprint Management</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage and track your development sprints</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="p-2"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleCreateSprint}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Sprint
          </Button>
        </div>
      </div>

      {/* Filters */}
      <SprintFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        projectFilter={projectFilter}
        setProjectFilter={setProjectFilter}
        projects={projects}
      />

      {/* Sprint Content */}
      {sprints.length === 0 ? (
        <div className="text-center py-12">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sprints Found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first sprint</p>
          <Button
            onClick={handleCreateSprint}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Sprint
          </Button>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sprints.map((sprint) => (
            <SprintCard
              key={sprint.id}
              sprint={sprint}
              onEdit={handleEditSprint}
            />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sprint Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Scrum Master</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sprints.map((sprint) => (
                <TableRow key={sprint.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sprint.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{sprint.goal}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sprint.status)}>
                      {sprint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{sprint.project_name}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress
                        value={sprint.total_points === 0 ? 0 : Math.round((sprint.completed_points / sprint.total_points) * 100)}
                        className="h-2"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {sprint.completed_points}/{sprint.total_points} pts
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(sprint.start_date).toLocaleDateString()}</div>
                      <div className="text-gray-500">→ {new Date(sprint.end_date).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{sprint.team_size} members</div>
                      <div className="text-gray-500">Velocity: {sprint.velocity}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {sprint.scrum_master?.name || sprint.scrum_master_name || 'Unassigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditSprint(sprint)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Sprint Dialog */}
      <SprintDialog
        open={showCreateDialog}
        onClose={handleCloseDialog}
        sprint={selectedSprint || newSprint}
        setSprint={isEditMode ? setSelectedSprint : setNewSprint}
        projects={projects}
        teamMembers={teamMembers}
        projectOwners={projectOwners}
        isEdit={isEditMode}
        onSprintCreated={handleSprintCreated}
        onSprintUpdated={handleSprintUpdated}
      />
    </div>
  )
}