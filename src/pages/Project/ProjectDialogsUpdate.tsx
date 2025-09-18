/* Modal width update for Projects.tsx - contains the new project creation dialog */

/* The Create Project Dialog with 1200px width */
{/* This should replace the existing dialog around line 800+ in Projects.tsx */}

{/* Project Template Modal */}
<ProjectTemplates 
  isOpen={showTemplateModal} 
  onClose={() => setShowTemplateModal(false)}
  onSelectTemplate={handleUseTemplate}
/>

{/* Create Project Dialog - Updated width to 1200px */}
<Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
  <DialogContent className="w-[1200px] max-w-[1200px] sm:max-w-[1200px] lg:max-w-[1200px] max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogDescription>
        Set up your project with all the necessary details and configurations
      </DialogDescription>
    </DialogHeader>
    
    <form onSubmit={handleCreateProject} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Name *</label>
          <Input
            value={newProject.name}
            onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter project name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Customer/Client</label>
          <Input
            value={newProject.customer}
            onChange={(e) => setNewProject(prev => ({ ...prev, customer: e.target.value }))}
            placeholder="Enter customer name"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={newProject.description}
          onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the project goals and objectives"
          rows={3}
        />
      </div>
      
      {/* Project Configuration */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Methodology</label>
          <Select value={newProject.methodology} onValueChange={(value) => setNewProject(prev => ({ ...prev, methodology: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select methodology" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scrum">Scrum</SelectItem>
              <SelectItem value="Kanban">Kanban</SelectItem>
              <SelectItem value="Waterfall">Waterfall</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Type</label>
          <Select value={newProject.type} onValueChange={(value) => setNewProject(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Software Development">Software Development</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Analytics">Analytics</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select value={newProject.priority} onValueChange={(value) => setNewProject(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Timeline & Budget */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newProject.startDate ? format(newProject.startDate, 'MMM dd, yyyy') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={newProject.startDate}
                onSelect={(date) => setNewProject(prev => ({ ...prev, startDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newProject.dueDate ? format(newProject.dueDate, 'MMM dd, yyyy') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={newProject.dueDate}
                onSelect={(date) => setNewProject(prev => ({ ...prev, dueDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Budget ($)</label>
          <Input
            type="number"
            value={newProject.budget}
            onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
            placeholder="0"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Project Owner</label>
        <Input
          value={newProject.owner}
          onChange={(e) => setNewProject(prev => ({ ...prev, owner: e.target.value }))}
          placeholder="Enter project owner name"
        />
      </div>
      
      <Separator />
      
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => setShowCreateProject(false)}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#28A745] hover:bg-[#218838]">
          Create Project
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>