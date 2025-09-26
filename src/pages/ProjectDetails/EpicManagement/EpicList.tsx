import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'
import { epicApiService, Epic, EpicsResponse } from '../../../services/epicApi'
import { EpicCreateModal } from './EpicCreateModal'
import { EpicViewEditModal } from './EpicViewEditModal'
import { toast } from 'sonner'

interface EpicListProps {
  projectId: string
  user: any
}

export function EpicList({ projectId, user }: EpicListProps) {
  const [epics, setEpics] = useState<Epic[]>([])
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null)
  const [showViewEditModal, setShowViewEditModal] = useState(false)
  const [deleteEpicId, setDeleteEpicId] = useState<string | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const loadEpics = async (page = 1) => {
    try {
      setLoading(true)
      const response: EpicsResponse = await epicApiService.getEpics(
        page,
        20,
        projectId,
        statusFilter,
        priorityFilter,
        undefined,
        searchTerm
      )
      setEpics(response.items)
      setTotalItems(response.total)
      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
    } catch (error) {
      console.error('Error loading epics:', error)
      toast.error('Failed to load epics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEpics()
  }, [projectId, searchTerm, statusFilter, priorityFilter])

  const handleCreateEpic = () => {
    setShowCreateModal(true)
  }

  const handleViewEpic = (epic: Epic) => {
    setSelectedEpic(epic)
    setShowViewEditModal(true)
  }

  const handleDeleteEpic = async (epicId: string) => {
    try {
      await epicApiService.deleteEpic(epicId)
      toast.success('Epic deleted successfully')
      loadEpics(currentPage)
      setDeleteEpicId(null)
    } catch (error) {
      console.error('Error deleting epic:', error)
      toast.error('Failed to delete epic')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'in progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'high':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Epic Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage project epics and track their progress
          </p>
        </div>
        <Button onClick={handleCreateEpic} className="bg-[#28A745] hover:bg-[#218838]">
          <Plus className="w-4 h-4 mr-2" />
          Create Epic
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search epics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Epics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Epics ({totalItems})</span>
            <Badge variant="outline">{epics.length} of {totalItems}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#28A745]"></div>
            </div>
          ) : epics.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Epics Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by creating your first epic for this project.
              </p>
              <Button onClick={handleCreateEpic} className="bg-[#28A745] hover:bg-[#218838]">
                <Plus className="w-4 h-4 mr-2" />
                Create Epic
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {epics.map((epic) => (
                    <TableRow key={epic.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {epic.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {epic.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(epic.status)}>
                          {epic.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getPriorityColor(epic.priority)}>
                          {epic.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-[#28A745] flex items-center justify-center text-white text-sm font-medium">
                            {epic.assignee?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm">{epic.assignee?.name || 'Unassigned'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{epic.completion_percentage}%</span>
                            <span className="text-gray-500">
                              {epic.completed_story_points}/{epic.total_story_points} SP
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#28A745] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${epic.completion_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(epic.due_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEpic(epic)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Epic</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{epic.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteEpic(epic.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalItems)} of {totalItems} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadEpics(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadEpics(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <EpicCreateModal
          projectId={projectId}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            loadEpics()
            setShowCreateModal(false)
          }}
          user={user}
        />
      )}

      {showViewEditModal && selectedEpic && (
        <EpicViewEditModal
          epic={selectedEpic}
          isOpen={showViewEditModal}
          onClose={() => {
            setShowViewEditModal(false)
            setSelectedEpic(null)
          }}
          onSuccess={() => {
            loadEpics()
            setShowViewEditModal(false)
            setSelectedEpic(null)
          }}
          user={user}
        />
      )}
    </div>
  )
}