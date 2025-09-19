import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Card } from '../../components/ui/card'
import { SprintList } from './Sprint'
import { BacklogList } from './Backlog'
import { EpicList } from './Epic'
import { TeamList } from './Team'
import { projectApiService } from '../../services/projectApi'
import { Zap, GitBranch, Users, Target } from 'lucide-react'

export function Planning() {
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load projects and team members in parallel
        const [projectsResponse, membersResponse] = await Promise.all([
          projectApiService.getProjects({ per_page: 100 }),
          projectApiService.getProjectMembers()
        ])

        setProjects(projectsResponse.items)
        setTeamMembers(membersResponse.items)
      } catch (error) {
        console.error('Error loading planning data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
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
          <SprintList projects={projects} teamMembers={teamMembers} />
        </TabsContent>

        <TabsContent value="backlog">
          <BacklogList projects={projects} teamMembers={teamMembers} />
        </TabsContent>

        <TabsContent value="epics">
          <EpicList projects={projects} teamMembers={teamMembers} />
        </TabsContent>

        <TabsContent value="team">
          <TeamList projects={projects} teamMembers={teamMembers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}