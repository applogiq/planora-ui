import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Card } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { SprintList } from './Sprint'
import { BacklogList } from './Backlog'
import { EpicList } from './Epic'
import { TeamList } from './Team'
import { projectApiService } from '../../services/projectApi'
import { useProjectMasters } from '../../hooks/useProjectMasters'
import { useProjectOwners } from '../../hooks/useProjectOwners'
import { Zap, GitBranch, Users, Target, Filter } from 'lucide-react'

export function Planning() {
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [methodologyFilter, setMethodologyFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Get masters data for filters
  const { data: mastersData, loading: mastersLoading, error: mastersError } = useProjectMasters()

  // Get project owners data
  const { data: projectOwnersData, loading: ownersLoading } = useProjectOwners()
  const projectOwners = projectOwnersData?.items || []

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load active projects and team members in parallel
        const [projectsResponse, membersResponse] = await Promise.all([
          projectApiService.getActiveProjectsList(),
          projectApiService.getProjectMembers()
        ])

        console.log('Loaded active projects from API:', projectsResponse)
        setProjects(projectsResponse)
        setTeamMembers(membersResponse.items)
      } catch (error) {
        // Error is handled silently - could add toast notification here if needed
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading || mastersLoading || ownersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading planning module...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Target className="w-8 h-8 text-orange-600" />
            <span>Planning</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage sprints, backlogs, and agile planning</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Project Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-500">Project</label>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center space-x-2">
                      {project.color && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                      )}
                      <span className="truncate">{project.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-500">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {mastersData?.statuses.filter(status => status.is_active).map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span>{status.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-500">Priority</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {mastersData?.priorities.filter(priority => priority.is_active).map((priority) => (
                  <SelectItem key={priority.id} value={priority.id}>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: priority.color }}
                      />
                      <span>{priority.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Methodology Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-500">Methodology</label>
            <Select value={methodologyFilter} onValueChange={setMethodologyFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Methodology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methodology</SelectItem>
                {mastersData?.methodologies.filter(methodology => methodology.is_active).map((methodology) => (
                  <SelectItem key={methodology.id} value={methodology.id}>
                    {methodology.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-500">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {mastersData?.types.filter(type => type.is_active).map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Planning Tabs */}
      <Tabs defaultValue="sprints" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sprints" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Sprints</span>
          </TabsTrigger>
          <TabsTrigger value="backlog" className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" />
            <span>Backlog</span>
          </TabsTrigger>
          <TabsTrigger value="epics" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Epics</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Team</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sprints">
          <SprintList
            projects={projects}
            teamMembers={teamMembers}
            projectOwners={projectOwners}
            filters={{
              project: projectFilter,
              status: statusFilter,
              priority: priorityFilter,
              methodology: methodologyFilter,
              type: typeFilter
            }}
          />
        </TabsContent>

        <TabsContent value="backlog">
          <BacklogList
            projects={projects}
            teamMembers={teamMembers}
            filters={{
              project: projectFilter,
              status: statusFilter,
              priority: priorityFilter,
              methodology: methodologyFilter,
              type: typeFilter
            }}
          />
        </TabsContent>

        <TabsContent value="epics">
          <EpicList
            projects={projects}
            teamMembers={teamMembers}
            projectOwners={projectOwners}
            masters={mastersData}
            filters={{
              project: projectFilter,
              status: statusFilter,
              priority: priorityFilter,
              methodology: methodologyFilter,
              type: typeFilter
            }}
          />
        </TabsContent>

        <TabsContent value="team">
          <TeamList
            projects={projects}
            teamMembers={teamMembers}
            filters={{
              project: projectFilter,
              status: statusFilter,
              priority: priorityFilter,
              methodology: methodologyFilter,
              type: typeFilter
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}