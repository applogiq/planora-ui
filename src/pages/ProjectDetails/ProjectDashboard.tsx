import { ScrumProjectDashboard } from './Scrum/ScrumProjectDashboard'
import { KanbanProjectDashboard } from './Kanban/KanbanProjectDashboard'
import { WaterfallProjectDashboard } from './Waterfall/WaterfallProjectDashboard'

interface ProjectDashboardProps {
  project: any
  user: any
  masterData?: any
  masterLoading?: boolean
}

export function ProjectDashboard({ project, user, masterData, masterLoading }: ProjectDashboardProps) {
  // Route to methodology-specific dashboard
  switch (project?.methodology?.toLowerCase()) {
    case 'scrum':
      return <ScrumProjectDashboard project={project} user={user} />
    case 'kanban':
      return <KanbanProjectDashboard project={project} user={user} masterData={masterData} masterLoading={masterLoading} />
    case 'waterfall':
      return <WaterfallProjectDashboard project={project} user={user} />
    default:
      // Default to Scrum dashboard for unknown methodologies
      return <ScrumProjectDashboard project={project} user={user} />
  }
}