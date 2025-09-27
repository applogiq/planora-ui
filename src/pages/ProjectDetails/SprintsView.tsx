import { SprintView } from './Sprints/SprintView'

interface SprintsViewProps {
  project: any
  user: any
}

export function SprintsView({ project, user }: SprintsViewProps) {
  return (
    <SprintView
      projectId={project?.id}
      user={user}
      project={project}
    />
  )
}