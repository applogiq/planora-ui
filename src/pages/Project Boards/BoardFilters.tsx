import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { X, Filter } from 'lucide-react'
import { PROJECTS, SPRINTS, TEAM_MEMBERS, PRIORITIES, STATUSES } from '../../mock-data/tasks'

interface BoardFiltersProps {
  filters: {
    project: string
    sprint: string
    assignee: string
    priority: string
    status: string
  }
  onFiltersChange: (filters: any) => void
}

export function BoardFilters({ filters, onFiltersChange }: BoardFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      project: 'All Projects',
      sprint: 'All Sprints',
      assignee: 'All Members',
      priority: 'All Priorities',
      status: 'All Statuses'
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    !value.startsWith('All ')
  )

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => !value.startsWith('All ')).length
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center space-x-4 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {/* Project Filter */}
        <Select value={filters.project} onValueChange={(value) => updateFilter('project', value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {PROJECTS.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sprint Filter */}
        <Select value={filters.sprint} onValueChange={(value) => updateFilter('sprint', value)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select sprint" />
          </SelectTrigger>
          <SelectContent>
            {SPRINTS.map((sprint) => (
              <SelectItem key={sprint} value={sprint}>
                {sprint}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Assignee Filter */}
        <Select value={filters.assignee} onValueChange={(value) => updateFilter('assignee', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select assignee" />
          </SelectTrigger>
          <SelectContent>
            {TEAM_MEMBERS.map((member) => (
              <SelectItem key={member.id} value={member.name}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.project !== 'All Projects' && (
            <Badge variant="secondary" className="text-xs">
              Project: {filters.project}
              <button 
                onClick={() => updateFilter('project', 'All Projects')}
                className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {filters.sprint !== 'All Sprints' && (
            <Badge variant="secondary" className="text-xs">
              Sprint: {filters.sprint}
              <button 
                onClick={() => updateFilter('sprint', 'All Sprints')}
                className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {filters.assignee !== 'All Members' && (
            <Badge variant="secondary" className="text-xs">
              Assignee: {filters.assignee}
              <button 
                onClick={() => updateFilter('assignee', 'All Members')}
                className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {filters.priority !== 'All Priorities' && (
            <Badge variant="secondary" className="text-xs">
              Priority: {filters.priority}
              <button 
                onClick={() => updateFilter('priority', 'All Priorities')}
                className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {filters.status !== 'All Statuses' && (
            <Badge variant="secondary" className="text-xs">
              Status: {filters.status.replace('_', ' ')}
              <button 
                onClick={() => updateFilter('status', 'All Statuses')}
                className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          <Badge variant="outline" className="text-xs">
            {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
          </Badge>
        </div>
      )}
    </div>
  )
}