import { SprintView } from './SprintView'

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