/**
 * Session storage utility for managing project-related data persistence
 */

const STORAGE_KEYS = {
  CURRENT_PROJECT_ID: 'planora_current_project_id',
  CURRENT_PROJECT_DATA: 'planora_current_project_data',
  PROJECT_TEAM_DATA: 'planora_project_team_data',
} as const

export class SessionStorageService {
  /**
   * Store the current project ID
   */
  static setCurrentProjectId(projectId: string): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT_ID, projectId)
    } catch (error) {
      console.warn('Failed to store project ID in session storage:', error)
    }
  }

  /**
   * Get the current project ID
   */
  static getCurrentProjectId(): string | null {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT_ID)
    } catch (error) {
      console.warn('Failed to retrieve project ID from session storage:', error)
      return null
    }
  }

  /**
   * Store the current project data
   */
  static setCurrentProjectData(projectData: any): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT_DATA, JSON.stringify(projectData))
    } catch (error) {
      console.warn('Failed to store project data in session storage:', error)
    }
  }

  /**
   * Get the current project data
   */
  static getCurrentProjectData(): any | null {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT_DATA)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.warn('Failed to retrieve project data from session storage:', error)
      return null
    }
  }

  /**
   * Store project team data for the current project
   */
  static setProjectTeamData(projectId: string, teamData: any): void {
    try {
      const key = `${STORAGE_KEYS.PROJECT_TEAM_DATA}_${projectId}`
      sessionStorage.setItem(key, JSON.stringify(teamData))
    } catch (error) {
      console.warn('Failed to store project team data in session storage:', error)
    }
  }

  /**
   * Get project team data for a specific project
   */
  static getProjectTeamData(projectId: string): any | null {
    try {
      const key = `${STORAGE_KEYS.PROJECT_TEAM_DATA}_${projectId}`
      const data = sessionStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.warn('Failed to retrieve project team data from session storage:', error)
      return null
    }
  }

  /**
   * Clear current project session data
   */
  static clearCurrentProject(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_PROJECT_ID)
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_PROJECT_DATA)

      // Clear all project team data
      const keys = Object.keys(sessionStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEYS.PROJECT_TEAM_DATA)) {
          sessionStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear project session data:', error)
    }
  }

  /**
   * Clear all session storage data
   */
  static clearAll(): void {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.warn('Failed to clear session storage:', error)
    }
  }

  /**
   * Extract project ID from current URL
   */
  static getProjectIdFromUrl(): string | null {
    try {
      const pathname = window.location.pathname
      // Match pattern: /projects/{projectId}
      const match = pathname.match(/\/projects\/([a-f0-9-]{36})/i)
      return match ? match[1] : null
    } catch (error) {
      console.warn('Failed to extract project ID from URL:', error)
      return null
    }
  }

  /**
   * Get effective project ID - from props, URL, or session storage
   */
  static getEffectiveProjectId(propsProjectId?: string): string | null {
    // Priority 1: If projectId is provided as prop and is not empty, use it
    if (propsProjectId && propsProjectId.trim() !== '') {
      return propsProjectId
    }

    // Priority 2: Try to extract from current URL
    const urlProjectId = this.getProjectIdFromUrl()
    if (urlProjectId) {
      // Store it in session storage for future use
      this.setCurrentProjectId(urlProjectId)
      return urlProjectId
    }

    // Priority 3: Fall back to session storage
    const sessionProjectId = this.getCurrentProjectId()
    if (sessionProjectId) {
      return sessionProjectId
    }

    return null
  }
}