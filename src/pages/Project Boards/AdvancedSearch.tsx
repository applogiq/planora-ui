import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Switch } from '../../components/ui/switch'
import { Calendar } from '../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { 
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  Tag,
  User,
  GitBranch,
  Clock,
  Flag,
  Target,
  Save,
  History,
  Star,
  Trash2
} from 'lucide-react'
import { PROJECTS, SPRINTS, TEAM_MEMBERS } from '../../mock-data/tasks'

interface SearchFilter {
  id: string
  name: string
  query: string
  filters: any
  createdAt: Date
  isDefault: boolean
}

interface AdvancedSearchProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (searchCriteria: any) => void
  currentFilters?: any
}

export function AdvancedSearch({ isOpen, onClose, onSearch, currentFilters }: AdvancedSearchProps) {
  const [searchCriteria, setSearchCriteria] = useState({
    // Text search
    title: '',
    description: '',
    taskId: '',
    
    // Basic filters
    projects: [] as string[],
    sprints: [] as string[],
    assignees: [] as string[],
    priorities: [] as string[],
    statuses: [] as string[],
    
    // Date filters
    createdAfter: null as Date | null,
    createdBefore: null as Date | null,
    dueAfter: null as Date | null,
    dueBefore: null as Date | null,
    
    // Advanced filters
    labels: [] as string[],
    storyPointsMin: '',
    storyPointsMax: '',
    hasAttachments: false,
    hasComments: false,
    isOverdue: false,
    isBlocked: false,
    
    // Custom fields
    customQuery: '',
    
    ...currentFilters
  })

  const [savedSearches, setSavedSearches] = useState<SearchFilter[]>([
    {
      id: '1',
      name: 'My High Priority Tasks',
      query: 'priority:high assignee:me',
      filters: { priorities: ['high'], assignees: ['current_user'] },
      createdAt: new Date('2025-01-15'),
      isDefault: false
    },
    {
      id: '2',
      name: 'Overdue Tasks',
      query: 'status:!done due:&lt;today',
      filters: { isOverdue: true },
      createdAt: new Date('2025-01-10'),
      isDefault: true
    },
    {
      id: '3',
      name: 'Sprint 23 Backend Tasks',
      query: 'sprint:"Sprint 23" label:backend',
      filters: { sprints: ['Sprint 23'], labels: ['backend'] },
      createdAt: new Date('2025-01-08'),
      isDefault: false
    }
  ])

  const [newSearchName, setNewSearchName] = useState('')
  const [activeTab, setActiveTab] = useState('basic')

  const handleSearch = () => {
    onSearch(searchCriteria)
    onClose()
  }

  const handleReset = () => {
    setSearchCriteria({
      title: '',
      description: '',
      taskId: '',
      projects: [],
      sprints: [],
      assignees: [],
      priorities: [],
      statuses: [],
      createdAfter: null,
      createdBefore: null,
      dueAfter: null,
      dueBefore: null,
      labels: [],
      storyPointsMin: '',
      storyPointsMax: '',
      hasAttachments: false,
      hasComments: false,
      isOverdue: false,
      isBlocked: false,
      customQuery: ''
    })
  }

  const handleSaveSearch = () => {
    if (!newSearchName.trim()) return

    const newSearch: SearchFilter = {
      id: Date.now().toString(),
      name: newSearchName.trim(),
      query: buildQueryString(),
      filters: { ...searchCriteria },
      createdAt: new Date(),
      isDefault: false
    }

    setSavedSearches(prev => [...prev, newSearch])
    setNewSearchName('')
  }

  const handleLoadSearch = (search: SearchFilter) => {
    setSearchCriteria({ ...searchCriteria, ...search.filters })
  }

  const handleDeleteSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== searchId))
  }

  const buildQueryString = () => {
    const parts = []
    
    if (searchCriteria.title) parts.push(`title:"${searchCriteria.title}"`)
    if (searchCriteria.description) parts.push(`description:"${searchCriteria.description}"`)
    if (searchCriteria.taskId) parts.push(`id:${searchCriteria.taskId}`)
    
    if (searchCriteria.projects.length) {
      parts.push(`project:(${searchCriteria.projects.join(' OR ')})`)
    }
    
    if (searchCriteria.assignees.length) {
      parts.push(`assignee:(${searchCriteria.assignees.join(' OR ')})`)
    }
    
    if (searchCriteria.priorities.length) {
      parts.push(`priority:(${searchCriteria.priorities.join(' OR ')})`)
    }
    
    if (searchCriteria.labels.length) {
      parts.push(`label:(${searchCriteria.labels.join(' AND ')})`)
    }
    
    if (searchCriteria.isOverdue) parts.push('overdue:true')
    if (searchCriteria.isBlocked) parts.push('blocked:true')
    
    return parts.join(' AND ')
  }

  const addToArray = (array: string[], value: string) => {
    if (!array.includes(value)) {
      return [...array, value]
    }
    return array
  }

  const removeFromArray = (array: string[], value: string) => {
    return array.filter(item => item !== value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Advanced Search & Filters</span>
          </DialogTitle>
          <DialogDescription>
            Create complex queries to find exactly the tasks you need
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic">Basic Search</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="saved">Saved Searches</TabsTrigger>
            <TabsTrigger value="query">Query Builder</TabsTrigger>
          </TabsList>

          {/* Basic Search Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Task Title</Label>
                  <Input
                    placeholder="Search in task titles..."
                    value={searchCriteria.title}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Search in descriptions..."
                    value={searchCriteria.description}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Task ID</Label>
                  <Input
                    placeholder="e.g., TASK-001"
                    value={searchCriteria.taskId}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, taskId: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Projects</Label>
                  <Select onValueChange={(value) => {
                    setSearchCriteria(prev => ({
                      ...prev,
                      projects: addToArray(prev.projects, value)
                    }))
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add project filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECTS.slice(1).map(project => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1">
                    {searchCriteria.projects.map(project => (
                      <Badge key={project} variant="secondary" className="flex items-center space-x-1">
                        <span>{project}</span>
                        <button onClick={() => setSearchCriteria(prev => ({
                          ...prev,
                          projects: removeFromArray(prev.projects, project)
                        }))}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assignees</Label>
                  <Select onValueChange={(value) => {
                    setSearchCriteria(prev => ({
                      ...prev,
                      assignees: addToArray(prev.assignees, value)
                    }))
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add assignee filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_MEMBERS.slice(1).map(member => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1">
                    {searchCriteria.assignees.map(assignee => (
                      <Badge key={assignee} variant="secondary" className="flex items-center space-x-1">
                        <span>{assignee}</span>
                        <button onClick={() => setSearchCriteria(prev => ({
                          ...prev,
                          assignees: removeFromArray(prev.assignees, assignee)
                        }))}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['backlog', 'todo', 'in_progress', 'in_review', 'testing', 'done'].map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`status-${status}`}
                          checked={searchCriteria.statuses.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSearchCriteria(prev => ({
                                ...prev,
                                statuses: addToArray(prev.statuses, status)
                              }))
                            } else {
                              setSearchCriteria(prev => ({
                                ...prev,
                                statuses: removeFromArray(prev.statuses, status)
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`status-${status}`} className="text-sm">
                          {status.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Date Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Created After</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {searchCriteria.createdAfter?.toLocaleDateString() || "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={searchCriteria.createdAfter || undefined}
                              onSelect={(date) => setSearchCriteria(prev => ({ ...prev, createdAfter: date || null }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Created Before</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {searchCriteria.createdBefore?.toLocaleDateString() || "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={searchCriteria.createdBefore || undefined}
                              onSelect={(date) => setSearchCriteria(prev => ({ ...prev, createdBefore: date || null }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Story Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Minimum</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={searchCriteria.storyPointsMin}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, storyPointsMin: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Maximum</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={searchCriteria.storyPointsMax}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, storyPointsMax: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Task Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={searchCriteria.hasAttachments}
                        onCheckedChange={(checked) => setSearchCriteria(prev => ({ ...prev, hasAttachments: checked }))}
                      />
                      <Label>Has attachments</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={searchCriteria.hasComments}
                        onCheckedChange={(checked) => setSearchCriteria(prev => ({ ...prev, hasComments: checked }))}
                      />
                      <Label>Has comments</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={searchCriteria.isOverdue}
                        onCheckedChange={(checked) => setSearchCriteria(prev => ({ ...prev, isOverdue: checked }))}
                      />
                      <Label>Is overdue</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={searchCriteria.isBlocked}
                        onCheckedChange={(checked) => setSearchCriteria(prev => ({ ...prev, isBlocked: checked }))}
                      />
                      <Label>Is blocked</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Labels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Input
                        placeholder="Add label filter..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = (e.target as HTMLInputElement).value.trim()
                            if (value) {
                              setSearchCriteria(prev => ({
                                ...prev,
                                labels: addToArray(prev.labels, value)
                              }))
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-1">
                        {searchCriteria.labels.map(label => (
                          <Badge key={label} variant="secondary" className="flex items-center space-x-1">
                            <span>{label}</span>
                            <button onClick={() => setSearchCriteria(prev => ({
                              ...prev,
                              labels: removeFromArray(prev.labels, label)
                            }))}>
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Saved Searches Tab */}
          <TabsContent value="saved" className="space-y-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Save Current Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter search name..."
                      value={newSearchName}
                      onChange={(e) => setNewSearchName(e.target.value)}
                    />
                    <Button onClick={handleSaveSearch} disabled={!newSearchName.trim()}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedSearches.map(search => (
                  <Card key={search.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{search.name}</h4>
                            {search.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono bg-gray-50 p-2 rounded">
                            {search.query}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Created {search.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <Button variant="ghost" size="sm" onClick={() => handleLoadSearch(search)}>
                            Load
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteSearch(search.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Query Builder Tab */}
          <TabsContent value="query" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custom Query</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Query String</Label>
                  <textarea
                    className="w-full p-3 border rounded-md font-mono text-sm"
                    rows={4}
                    placeholder={`title:"OAuth implementation" AND assignee:"Rajesh Kumar" AND priority:high
status:in_progress OR status:in_review
label:backend AND label:security
created:&gt;2025-01-01 AND due:&lt;2025-02-01`}
                    value={searchCriteria.customQuery}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, customQuery: e.target.value }))}
                  />
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Query Examples:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li><code>title:"bug fix" AND priority:high</code> - High priority bug fixes</li>
                    <li><code>assignee:me AND status:!done</code> - My incomplete tasks</li>
                    <li><code>label:frontend OR label:ui</code> - Frontend or UI tasks</li>
                    <li><code>created:&gt;2025-01-01 AND due:&lt;2025-02-01</code> - Tasks created in January with February deadline</li>
                    <li><code>storypoints:&gt;=5 AND sprint:"Sprint 23"</code> - Large tasks in Sprint 23</li>
                  </ul>
                </div>

                <div className="text-sm text-muted-foreground">
                  <strong>Current query:</strong>
                  <div className="mt-1 p-2 bg-gray-50 rounded font-mono">
                    {buildQueryString() || 'No filters applied'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleReset}>
              Reset All
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
          <Button onClick={handleSearch} className="bg-[#28A745] hover:bg-[#218838] text-white">
            <Search className="w-4 h-4 mr-2" />
            Apply Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}