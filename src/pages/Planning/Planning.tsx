import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Card } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { SprintList } from './Sprint'
import { BacklogList } from './Backlog'
import { EpicList } from './Epic'
import { TeamList } from './Team'
import { ScrumMethodologyView } from '../Project/MethodologyViews/ScrumMethodologyView'
import { projectApiService } from '../../services/projectApi'
import { useProjectMasters } from '../../hooks/useProjectMasters'
import { useProjectOwners } from '../../hooks/useProjectOwners'
import { Zap, GitBranch, Users, Target, Filter } from 'lucide-react'

export function Planning() {
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('scrum')

  // Filter states
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [methodologyFilter, setMethodologyFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Handlers for Scrum methodology view
  const handleTaskView = (task: any) => {
    // TODO: Implement task detail view
    console.log('Opening task details:', task)
  }

  const handleTaskCreate = () => {
    // Switch to backlog tab and trigger create
    setActiveTab('backlog')
    // TODO: Trigger backlog item creation
    console.log('Creating new task/story')
  }

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
            <span>Planning & Backlog Management</span>
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive Scrum methodology with sprint management, product backlog, and team collaboration</p>
        </div>
      </div>


      {/* Planning Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="scrum" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Scrum Board</span>
          </TabsTrigger>
          <TabsTrigger value="backlog" className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" />
            <span>Backlog</span>
          </TabsTrigger>
          <TabsTrigger value="epics" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Epics</span>
          </TabsTrigger>
          <TabsTrigger value="sprints" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Sprints</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Team</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scrum">
          <ScrumMethodologyView
            project={projects[0] || {}}
            onTaskView={handleTaskView}
            onTaskCreate={handleTaskCreate}
          />
        </TabsContent>

        <TabsContent value="backlog">
          <BacklogList
            projects={projects}
            teamMembers={teamMembers}
            mastersData={mastersData}
          />
        </TabsContent>

        <TabsContent value="epics">
          <EpicList
            projects={projects}
            teamMembers={teamMembers}
            projectOwners={projectOwners}
            masters={mastersData}
          />
        </TabsContent>

        <TabsContent value="sprints">
          <SprintList
            projects={projects}
            teamMembers={teamMembers}
            projectOwners={projectOwners}
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