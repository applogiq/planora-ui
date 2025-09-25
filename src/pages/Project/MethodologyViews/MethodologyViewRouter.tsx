import { ScrumMethodologyView } from './ScrumMethodologyView'
import { KanbanMethodologyView } from './KanbanMethodologyView'
import { WaterfallMethodologyView } from './WaterfallMethodologyView'

interface MethodologyViewRouterProps {
  methodology: string
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
  currentUser?: { id: string; name: string }
  activeTab?: string
}

export function MethodologyViewRouter({
  methodology,
  project,
  onTaskView,
  onTaskCreate,
  currentUser,
  activeTab = 'methodology'
}: MethodologyViewRouterProps) {
  // Normalize methodology name for comparison
  const normalizedMethodology = methodology?.toLowerCase()

  // Route to appropriate methodology view based on project methodology
  switch (normalizedMethodology) {
    case 'scrum':
      return (
        <ScrumMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
          currentUser={currentUser}
          activeTab={activeTab}
        />
      )

    case 'kanban':
      return (
        <KanbanMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
          currentUser={currentUser}
          activeTab={activeTab}
        />
      )

    case 'waterfall':
      return (
        <WaterfallMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
          currentUser={currentUser}
          activeTab={activeTab}
        />
      )

    // Default to Scrum view for unknown methodologies or as fallback
    default:
      return (
        <ScrumMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
          currentUser={currentUser}
          activeTab={activeTab}
        />
      )
  }
}