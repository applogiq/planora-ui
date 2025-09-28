import { userApiService, User } from '../services/userApi'
import { ProjectMemberDetail } from '../services/projectApi'

export interface EnrichedMemberDetail extends ProjectMemberDetail {
  email?: string
  phone?: string
  skills?: string[]
  timezone?: string
  last_login?: string | null
  full_role?: any
  is_active?: boolean
  join_date?: string
}

/**
 * Fetches full user details for project team members
 * Combines project member details with full user profile information
 */
export async function getEnrichedTeamMemberDetails(
  teamMembers: ProjectMemberDetail[]
): Promise<Map<string, EnrichedMemberDetail>> {
  const enrichedMembersMap = new Map<string, EnrichedMemberDetail>()

  if (!teamMembers || teamMembers.length === 0) {
    return enrichedMembersMap
  }

  try {
    // Get all member IDs
    const memberIds = teamMembers.map(member => member.id)

    // Fetch full user details for all team members
    const allUsersResponse = await userApiService.getUsers({ per_page: 100 })
    const userDetailsMap = new Map<string, User>()

    allUsersResponse.items.forEach(user => {
      if (memberIds.includes(user.id)) {
        userDetailsMap.set(user.id, user)
      }
    })

    console.log(`Fetched full details for ${userDetailsMap.size} team members`)

    // Create enriched member details
    teamMembers.forEach(member => {
      const userDetails = userDetailsMap.get(member.id)

      const enrichedMember: EnrichedMemberDetail = {
        ...member,
        email: userDetails?.email || '',
        phone: userDetails?.phone || '',
        skills: userDetails?.skills || [],
        timezone: userDetails?.timezone || '',
        last_login: userDetails?.last_login || null,
        full_role: userDetails?.role || null,
        is_active: userDetails?.is_active ?? true,
        join_date: userDetails?.created_at || ''
      }

      enrichedMembersMap.set(member.id, enrichedMember)
    })

  } catch (error) {
    console.warn('Could not fetch full user details for team members:', error)

    // Fallback: return basic member details without enrichment
    teamMembers.forEach(member => {
      enrichedMembersMap.set(member.id, {
        ...member,
        email: '',
        phone: '',
        skills: [],
        timezone: '',
        last_login: null,
        full_role: null,
        is_active: true,
        join_date: ''
      })
    })
  }

  return enrichedMembersMap
}

/**
 * Gets enriched details for a specific team member by ID
 */
export function getEnrichedMemberById(
  memberId: string,
  enrichedMembersMap: Map<string, EnrichedMemberDetail>
): EnrichedMemberDetail | null {
  return enrichedMembersMap.get(memberId) || null
}

/**
 * Gets assignee display info with rich details
 */
export function getAssigneeDisplayInfo(
  assigneeId: string | null,
  assigneeName: string | null,
  enrichedMembersMap: Map<string, EnrichedMemberDetail>
) {
  if (!assigneeId && !assigneeName) {
    return {
      name: 'Unassigned',
      email: '',
      phone: '',
      skills: [],
      initials: 'UN',
      role: 'No Role',
      department: '',
      isAssigned: false
    }
  }

  const enrichedMember = assigneeId ? enrichedMembersMap.get(assigneeId) : null

  return {
    name: enrichedMember?.name || assigneeName || 'Unknown',
    email: enrichedMember?.email || '',
    phone: enrichedMember?.phone || '',
    skills: enrichedMember?.skills || [],
    initials: (enrichedMember?.name || assigneeName || 'UN').substring(0, 2).toUpperCase(),
    role: enrichedMember?.role_name || 'No Role',
    department: enrichedMember?.department || '',
    isAssigned: true
  }
}