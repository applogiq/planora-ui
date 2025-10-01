import { EpicList } from './EpicList'

interface EpicProps {
  projectId: string
  user: any
  teamMembers?: any[]
}

export function Epic({ projectId, user, teamMembers = [] }: EpicProps) {
  return <EpicList projectId={projectId} user={user} teamMembers={teamMembers} />
}

export { EpicList } from './EpicList'
export { EpicCreateModal } from './EpicCreateModal'
export { EpicViewEditModal } from './EpicViewEditModal'