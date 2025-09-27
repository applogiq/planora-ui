import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SessionStorageService } from '../utils/sessionStorage'

/**
 * Custom hook to reliably get the current project ID
 * Tries multiple sources: URL params, URL path, session storage
 */
export function useProjectId(): string | null {
  const { projectId: routerProjectId } = useParams<{ projectId: string }>()
  const [projectId, setProjectId] = useState<string | null>(null)

  useEffect(() => {
    const getProjectId = () => {
      // Priority 1: Router params (from useParams)
      if (routerProjectId && routerProjectId.trim() !== '') {
        SessionStorageService.setCurrentProjectId(routerProjectId)
        return routerProjectId
      }

      // Priority 2: Extract from URL directly
      const urlProjectId = SessionStorageService.getProjectIdFromUrl()
      if (urlProjectId) {
        SessionStorageService.setCurrentProjectId(urlProjectId)
        return urlProjectId
      }

      // Priority 3: Session storage
      const sessionProjectId = SessionStorageService.getCurrentProjectId()
      if (sessionProjectId) {
        return sessionProjectId
      }

      return null
    }

    const effectiveProjectId = getProjectId()
    setProjectId(effectiveProjectId)
  }, [routerProjectId])

  return projectId
}