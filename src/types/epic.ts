// Epic Types and Interfaces

export interface User {
  email: string
  name: string
  role_id: string
  user_profile: string
  is_active: boolean
  department: string
  skills: string[]
  phone: string
  timezone: string
  id: string
  last_login: string
  created_at: string
  updated_at: string
  role: {
    name: string
    description: string
    permissions: string[]
    is_active: boolean
    id: string
    created_at: string
    updated_at: string
  }
}

export interface ProjectDetail {
  name: string
  description: string
  status: string
  progress: number
  start_date: string
  end_date: string
  budget: number
  spent: number
  customer: string
  customer_id: string
  priority: string
  team_lead_id: string
  team_members: string[]
  tags: string[]
  color: string
  methodology: string
  project_type: string
  id: string
  created_at: string
  updated_at: string
  team_lead_detail: {
    id: string
    name: string
    department: string
    role_id: string
    role_name: string
    user_profile: string
  }
  team_members_detail: {
    id: string
    name: string
    department: string
    role_id: string
    role_name: string
    user_profile: string
  }[]
}

export interface Epic {
  id: string
  title: string
  description: string
  priority: string
  status: string
  project_id: string
  assignee_id: string
  due_date: string
  total_story_points: number
  completed_story_points: number
  total_tasks: number
  completed_tasks: number
  labels: string[]
  business_value: string
  created_at: string
  updated_at: string
  project_name: string
  assignee_name: string
  completion_percentage: number
  project: ProjectDetail
  assignee: User
}

export interface EpicsResponse {
  items: Epic[]
  total: number
  page: number
  per_page: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface CreateEpicRequest {
  title: string
  description: string
  priority: string
  status: string
  project_id: string
  assignee_id: string
  due_date: string
  total_story_points: number
  completed_story_points: number
  total_tasks: number
  completed_tasks: number
  labels: string[]
  business_value: string
}

export interface UpdateEpicRequest extends Partial<CreateEpicRequest> {
  id: string
}

export interface EpicQueryParams {
  page?: number
  per_page?: number
  project_id?: string
  status?: string
  priority?: string
  assignee_id?: string
  search?: string
}

export const EpicStatuses = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled'
} as const

export const EpicPriorities = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
} as const

export type EpicStatus = typeof EpicStatuses[keyof typeof EpicStatuses]
export type EpicPriority = typeof EpicPriorities[keyof typeof EpicPriorities]