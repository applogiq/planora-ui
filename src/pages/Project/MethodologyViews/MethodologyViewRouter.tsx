import {
  AgileMethodologyView,
  ScrumMethodologyView,
  WaterfallMethodologyView,
  KanbanMethodologyView,
  DevOpsMethodologyView,
  LeanMethodologyView
} from './index'

interface MethodologyViewRouterProps {
  methodology: string
  project: any
  onTaskView?: (task: any) => void
  onTaskCreate?: () => void
}

export function MethodologyViewRouter({
  methodology,
  project,
  onTaskView,
  onTaskCreate
}: MethodologyViewRouterProps) {
  // Normalize methodology name for comparison
  const normalizedMethodology = methodology?.toLowerCase()

  // Route to appropriate methodology view based on project methodology
  switch (normalizedMethodology) {
    case 'agile':
      return (
        <AgileMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
        />
      )

    case 'scrum':
      return (
        <ScrumMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
        />
      )

    case 'waterfall':
      return (
        <WaterfallMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
        />
      )

    case 'kanban':
      return (
        <KanbanMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
        />
      )

    case 'devops':
      return (
        <DevOpsMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
        />
      )

    case 'lean':
      return (
        <LeanMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
        />
      )

    // Default to Agile view for unknown methodologies or as fallback
    default:
      return (
        <AgileMethodologyView
          project={project}
          onTaskView={onTaskView}
          onTaskCreate={onTaskCreate}
        />
      )
  }
}