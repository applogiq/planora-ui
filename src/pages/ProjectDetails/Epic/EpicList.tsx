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
  teamMembers?: any[]
}

export function EpicList({ projectId, user, teamMembers = [] }: EpicListProps) {
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
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const loadEpics = async (page = 1) => {
    try {
      setLoading(true)
      const response: EpicsResponse = await epicApiService.getEpics(
        page,
        20,
        projectId,
        statusFilter === 'all' ? undefined : statusFilter,
        priorityFilter === 'all' ? undefined : priorityFilter,
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Epic Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage project epics and track their progress
          </p>
        </div>

        {/* Controls Row - All in one line */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative min-w-[300px] flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search epics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300 dark:border-gray-600 focus:border-[#28A745] focus:ring-[#28A745] focus:ring-1"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-10 border-gray-300 dark:border-gray-600 focus:border-[#28A745] focus:ring-[#28A745] focus:ring-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40 h-10 border-gray-300 dark:border-gray-600 focus:border-[#28A745] focus:ring-[#28A745] focus:ring-1">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            {/* Create Epic Button */}
            <Button
              onClick={handleCreateEpic}
              className="bg-[#28A745] hover:bg-[#218838] text-white h-10 px-6 font-medium whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Epic
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Results Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#28A745]/10 rounded-lg">
                <Target className="w-5 h-5 text-[#28A745]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Epics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{totalItems} total epics</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-[#28A745]/10 text-[#28A745] border-[#28A745]/20 font-medium">
              {epics.length} of {totalItems}
            </Badge>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#28A745] mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading epics...</p>
            </div>
          ) : epics.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-6 py-4">Title</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-4">Priority</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-4">Assignee</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-4">Progress</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-4">Due Date</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-6 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {epics.map((epic) => (
                    <TableRow
                      key={epic.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700/50 cursor-pointer"
                      onClick={() => handleViewEpic(epic)}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="space-y-1 max-w-xs">
                          <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                            {epic.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {epic.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant="secondary" className={`${getStatusColor(epic.status)} font-medium px-3 py-1 rounded-full`}>
                          {epic.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant="secondary" className={`${getPriorityColor(epic.priority)} font-medium px-3 py-1 rounded-full`}>
                          {epic.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#28A745] flex items-center justify-center text-white text-sm font-medium">
                            {epic.assignee_name?.charAt(0) || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {epic.assignee_name || 'Unassigned'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="space-y-2 min-w-[120px]">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{epic.completion_percentage}%</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              {epic.completed_story_points}/{epic.total_story_points} SP
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-[#28A745] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${epic.completion_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(epic.due_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewEpic(epic)
                            }}
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
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
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-medium text-gray-900 dark:text-gray-100">{((currentPage - 1) * 20) + 1}</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min(currentPage * 20, totalItems)}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span> results
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadEpics(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 px-4 border-gray-300 dark:border-gray-600"
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Page</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-[#28A745]/10 px-2 py-1 rounded">
                    {currentPage}
                  </span>
                  <span className="text-sm text-gray-500">of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadEpics(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-9 px-4 border-gray-300 dark:border-gray-600"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {epics.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="py-20 px-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#28A745]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-[#28A745]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No epics found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'No epics match your current filters. Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first epic to organize and track related user stories and tasks.'}
              </p>
              <Button
                onClick={handleCreateEpic}
                className="bg-[#28A745] hover:bg-[#218838] text-white h-10 px-6 font-medium shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Epic
              </Button>
            </div>
          </div>
        </div>
      )}

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
          teamMembers={teamMembers}
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
          teamMembers={teamMembers}
        />
      )}
    </div>
  )
}