import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { 
  Upload, 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  Image, 
  Video, 
  File, 
  Download,
  Eye,
  Trash2,
  Share2,
  FolderOpen,
  Plus
} from 'lucide-react'

interface FilesViewProps {
  projectId: string
  user: any
}

// Mock files data
const mockFiles = [
  {
    id: '1',
    name: 'Project Requirements.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedBy: { name: 'Alice Johnson', avatar: 'AJ' },
    uploadedAt: '2024-03-01T10:30:00Z',
    category: 'Documentation',
    tags: ['requirements', 'specifications'],
    url: '#'
  },
  {
    id: '2',
    name: 'User Interface Mockups.figma',
    type: 'figma',
    size: '5.2 MB',
    uploadedBy: { name: 'Carol Davis', avatar: 'CD' },
    uploadedAt: '2024-03-02T14:15:00Z',
    category: 'Design',
    tags: ['ui', 'mockups', 'design'],
    url: '#'
  },
  {
    id: '3',
    name: 'Database Schema.sql',
    type: 'sql',
    size: '156 KB',
    uploadedBy: { name: 'Bob Chen', avatar: 'BC' },
    uploadedAt: '2024-03-03T09:45:00Z',
    category: 'Development',
    tags: ['database', 'schema', 'sql'],
    url: '#'
  },
  {
    id: '4',
    name: 'Sprint Demo Recording.mp4',
    type: 'video',
    size: '25.8 MB',
    uploadedBy: { name: 'Alice Johnson', avatar: 'AJ' },
    uploadedAt: '2024-03-04T16:20:00Z',
    category: 'Meetings',
    tags: ['demo', 'sprint', 'recording'],
    url: '#'
  },
  {
    id: '5',
    name: 'API Documentation.md',
    type: 'markdown',
    size: '89 KB',
    uploadedBy: { name: 'David Wilson', avatar: 'DW' },
    uploadedAt: '2024-03-05T11:10:00Z',
    category: 'Documentation',
    tags: ['api', 'documentation'],
    url: '#'
  },
  {
    id: '6',
    name: 'User Test Results.xlsx',
    type: 'spreadsheet',
    size: '1.2 MB',
    uploadedBy: { name: 'Carol Davis', avatar: 'CD' },
    uploadedAt: '2024-03-05T13:30:00Z',
    category: 'Testing',
    tags: ['testing', 'results', 'users'],
    url: '#'
  }
]

const fileCategories = [
  { id: 'all', label: 'All Files', count: mockFiles.length },
  { id: 'Documentation', label: 'Documentation', count: mockFiles.filter(f => f.category === 'Documentation').length },
  { id: 'Design', label: 'Design', count: mockFiles.filter(f => f.category === 'Design').length },
  { id: 'Development', label: 'Development', count: mockFiles.filter(f => f.category === 'Development').length },
  { id: 'Testing', label: 'Testing', count: mockFiles.filter(f => f.category === 'Testing').length },
  { id: 'Meetings', label: 'Meetings', count: mockFiles.filter(f => f.category === 'Meetings').length }
]

export function FilesView({ projectId, user }: FilesViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'markdown':
        return <FileText className="w-8 h-8 text-red-600" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <Image className="w-8 h-8 text-green-600" />
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-8 h-8 text-purple-600" />
      case 'figma':
        return <Image className="w-8 h-8 text-blue-600" />
      case 'sql':
      case 'spreadsheet':
        return <FileText className="w-8 h-8 text-orange-600" />
      default:
        return <File className="w-8 h-8 text-gray-600" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-800'
      case 'figma':
        return 'bg-blue-100 text-blue-800'
      case 'sql':
        return 'bg-orange-100 text-orange-800'
      case 'video':
        return 'bg-purple-100 text-purple-800'
      case 'markdown':
        return 'bg-gray-100 text-gray-800'
      case 'spreadsheet':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatFileSize = (size: string) => {
    return size
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const FileCard = ({ file }: { file: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          {getFileIcon(file.type)}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>
        
        <h4 className="font-medium text-sm mb-2 line-clamp-2">{file.name}</h4>
        
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className={getFileTypeColor(file.type)} style={{ fontSize: '10px' }}>
            {file.type.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {file.size}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <Avatar className="w-4 h-4">
              <AvatarFallback className="bg-[#28A745] text-white text-xs">
                {file.uploadedBy.avatar}
              </AvatarFallback>
            </Avatar>
            <span>{file.uploadedBy.name}</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          {formatDate(file.uploadedAt)}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const FileListItem = ({ file }: { file: any }) => (
    <Card className="hover:shadow-md transition-shadow mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {getFileIcon(file.type)}
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm mb-1 truncate">{file.name}</h4>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{file.category}</span>
                <span>•</span>
                <span>{file.size}</span>
                <span>•</span>
                <span>Uploaded by {file.uploadedBy.name}</span>
                <span>•</span>
                <span>{formatDate(file.uploadedAt)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className={getFileTypeColor(file.type)} style={{ fontSize: '10px' }}>
                {file.type.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Project Files</h2>
          <p className="text-muted-foreground">Manage project documents and assets</p>
        </div>
        
        <Button className="bg-[#28A745] hover:bg-[#218838]">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {fileCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>{category.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create Folder
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Trash2 className="w-4 h-4 mr-2" />
                Deleted Files
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Files Content */}
        <div className="lg:col-span-3">
          {/* File Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold text-[#007BFF]">{filteredFiles.length}</div>
                <div className="text-xs text-muted-foreground">Total Files</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold text-[#28A745]">
                  {Math.round(filteredFiles.reduce((sum, file) => {
                    const sizeValue = parseFloat(file.size.split(' ')[0])
                    const sizeUnit = file.size.split(' ')[1]
                    return sum + (sizeUnit === 'MB' ? sizeValue : sizeValue / 1000)
                  }, 0) * 10) / 10}
                </div>
                <div className="text-xs text-muted-foreground">Total Size (MB)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold text-[#FFC107]">{fileCategories.length - 1}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold text-[#DC3545]">
                  {new Set(mockFiles.map(f => f.uploadedBy.name)).size}
                </div>
                <div className="text-xs text-muted-foreground">Contributors</div>
              </CardContent>
            </Card>
          </div>

          {/* Files Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFiles.map((file) => (
                <FileListItem key={file.id} file={file} />
              ))}
            </div>
          )}

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No files found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
              </p>
              <Button className="bg-[#28A745] hover:bg-[#218838]">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}