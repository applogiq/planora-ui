import { ScrumProjectDashboard } from './ScrumProjectDashboard'
import { KanbanProjectDashboard } from './KanbanProjectDashboard'
import { WaterfallProjectDashboard } from './WaterfallProjectDashboard'

interface ProjectDashboardProps {
  project: any
  user: any
}

export function ProjectDashboard({ project, user }: ProjectDashboardProps) {
  // Route to methodology-specific dashboard
  switch (project?.methodology?.toLowerCase()) {
    case 'scrum':
      return <ScrumProjectDashboard project={project} user={user} />
    case 'kanban':
      return <KanbanProjectDashboard project={project} user={user} />
    case 'waterfall':
      return <WaterfallProjectDashboard project={project} user={user} />
    default:
      // Default to Scrum dashboard for unknown methodologies
      return <ScrumProjectDashboard project={project} user={user} />
  }
}