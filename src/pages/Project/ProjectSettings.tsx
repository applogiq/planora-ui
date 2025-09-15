import { useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { 
  Settings,
  Save,
  AlertTriangle,
  Archive,
  Trash2,
  Shield,
  Bell,
  Eye,
  Users,
  Clock,
  Database,
  Key,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Download,
  Upload,
  RefreshCw,
  Copy
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface ProjectSettingsProps {
  project: any
  onUpdate: (updatedProject: any) => void
  user?: any
}

export function ProjectSettings({ project, onUpdate, user }: ProjectSettingsProps) {
  const [settings, setSettings] = useState({
    isPublic: project?.isPublic ?? true,
    notifications: project?.notifications ?? true,
    autoArchive: project?.autoArchive ?? false,
    requireApproval: project?.requireApproval ?? false,
    allowGuestAccess: project?.allowGuestAccess ?? false,
    enableTimeTracking: project?.enableTimeTracking ?? true,
    enableFileVersioning: project?.enableFileVersioning ?? true,
    maxFileSize: project?.maxFileSize ?? '100',
    retentionPeriod: project?.retentionPeriod ?? '365',
    backupFrequency: project?.backupFrequency ?? 'daily'
  })
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedProject = {
        ...project,
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.name || 'Current User'
      }
      
      onUpdate(updatedProject)
      toast.success('Project settings updated successfully')
    } catch (error) {
      toast.error('Failed to update project settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchiveProject = async () => {
    if (window.confirm('Are you sure you want to archive this project? This action can be reversed later.')) {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const archivedProject = {
          ...project,
          status: 'Archived',
          archivedAt: new Date().toISOString(),
          archivedBy: user?.name || 'Current User'
        }
        
        onUpdate(archivedProject)
        toast.success('Project archived successfully')
      } catch (error) {
        toast.error('Failed to archive project')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDuplicateProject = () => {
    if (window.confirm('Create a copy of this project with all settings and structure?')) {
      toast.success('Project duplication started. You will be notified when complete.')
      // In a real app, this would trigger project duplication
    }
  }

  const handleExportProject = () => {
    toast.success('Project export started. Download will begin shortly.')
    // In a real app, this would trigger project export
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>General Settings</span>
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Public Project</Label>
              <p className="text-sm text-muted-foreground">Allow all team members to view this project</p>
            </div>
            <Switch
              checked={settings.isPublic}
              onCheckedChange={(checked) => handleSettingChange('isPublic', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email updates for project activities</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Auto Archive</Label>
              <p className="text-sm text-muted-foreground">Automatically archive completed projects after retention period</p>
            </div>
            <Switch
              checked={settings.autoArchive}
              onCheckedChange={(checked) => handleSettingChange('autoArchive', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Require Approval</Label>
              <p className="text-sm text-muted-foreground">All changes require approval from project manager</p>
            </div>
            <Switch
              checked={settings.requireApproval}
              onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Access Control */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Access Control</span>
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Guest Access</Label>
              <p className="text-sm text-muted-foreground">Allow external users to view project with limited permissions</p>
            </div>
            <Switch
              checked={settings.allowGuestAccess}
              onCheckedChange={(checked) => handleSettingChange('allowGuestAccess', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project Visibility</Label>
              <Select value={settings.isPublic ? 'public' : 'private'} onValueChange={(value) => handleSettingChange('isPublic', value === 'public')}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Public - All team members</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Private - Assigned members only</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Features & Integrations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Features & Data</span>
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Time Tracking</Label>
              <p className="text-sm text-muted-foreground">Enable time tracking for project tasks</p>
            </div>
            <Switch
              checked={settings.enableTimeTracking}
              onCheckedChange={(checked) => handleSettingChange('enableTimeTracking', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">File Versioning</Label>
              <p className="text-sm text-muted-foreground">Keep track of file versions and changes</p>
            </div>
            <Switch
              checked={settings.enableFileVersioning}
              onCheckedChange={(checked) => handleSettingChange('enableFileVersioning', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                className="mt-1"
                min="1"
                max="1000"
              />
            </div>
            
            <div>
              <Label>Data Retention (Days)</Label>
              <Input
                type="number"
                value={settings.retentionPeriod}
                onChange={(e) => handleSettingChange('retentionPeriod', e.target.value)}
                className="mt-1"
                min="30"
                max="2555"
              />
            </div>
          </div>

          <div>
            <Label>Backup Frequency</Label>
            <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Project Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <RefreshCw className="w-5 h-5" />
          <span>Project Actions</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={handleDuplicateProject}
            className="flex items-center space-x-2 h-12"
          >
            <Copy className="w-4 h-4" />
            <div className="text-left">
              <p className="font-medium">Duplicate Project</p>
              <p className="text-xs text-muted-foreground">Create a copy with all settings</p>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={handleExportProject}
            className="flex items-center space-x-2 h-12"
          >
            <Download className="w-4 h-4" />
            <div className="text-left">
              <p className="font-medium">Export Project</p>
              <p className="text-xs text-muted-foreground">Download all project data</p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          <span>Danger Zone</span>
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-destructive">Archive Project</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Hide this project from active projects. Can be restored later.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleArchiveProject}
                disabled={isLoading}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>

          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-destructive">Delete Project</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete this project and all its data. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                disabled={true}
                className="opacity-50 cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Contact system administrator to delete projects.
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="bg-[#28A745] hover:bg-[#218838]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}