import { Story } from '../../../../services/storiesApi'

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'story': return 'target'
    case 'bug': return 'alert-triangle'
    case 'task': return 'check-circle'
    default: return 'target'
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-300'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low': return 'bg-green-100 text-green-800 border-green-300'
    default: return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo': return 'bg-gray-100 text-gray-800 border-gray-300'
    case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'done': return 'bg-green-100 text-green-800 border-green-300'
    case 'active': return 'bg-green-100 text-green-800 border-green-300'
    case 'planning': return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    default: return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

export const filterStories = (
  stories: Story[],
  searchTerm: string,
  filterType: string,
  filterPriority: string
) => {
  return stories.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.story_type === filterType
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority

    return matchesSearch && matchesType && matchesPriority
  })
}

export const getStoryStats = (stories: Story[]) => {
  return {
    totalStories: stories.length,
    storiesCount: stories.filter(s => s.story_type === 'story').length,
    bugsCount: stories.filter(s => s.story_type === 'bug').length,
    tasksCount: stories.filter(s => s.story_type === 'task').length,
    totalPoints: stories.reduce((sum, s) => sum + (s.story_points || 0), 0),
    todoCount: stories.filter(s => s.status === 'todo').length,
    inProgressCount: stories.filter(s => s.status === 'in-progress').length,
    doneCount: stories.filter(s => s.status === 'done').length
  }
}

export const formatDate = (dateString: string) => {
  if (!dateString) return 'Not set'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return 'Invalid date'
  }
}

export const getInitials = (name: string) => {
  if (!name) return 'UN'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const validateStoryData = (data: any) => {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push('Title is required')
  }

  if (!data.story_type) {
    errors.push('Story type is required')
  }

  if (!data.priority) {
    errors.push('Priority is required')
  }

  if (!data.status) {
    errors.push('Status is required')
  }

  if (!data.project_id) {
    errors.push('Project ID is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}