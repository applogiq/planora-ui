import { EpicList } from './EpicList'

interface EpicManagementProps {
  projectId: string
  user: any
}

export function EpicManagement({ projectId, user }: EpicManagementProps) {
  return <EpicList projectId={projectId} user={user} />
}

export { EpicList } from './EpicList'
export { EpicCreateModal } from './EpicCreateModal'
export { EpicViewEditModal } from './EpicViewEditModal'