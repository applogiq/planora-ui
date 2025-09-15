import { useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { 
  Upload,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FolderOpen,
  Image,
  File,
  Video,
  Archive,
  Music,
  Code,
  Paperclip,
  Calendar,
  User,
  Share2
} from 'lucide-react'

interface FilesViewProps {
  project: any
}

export function FilesView({ project }: FilesViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('uploadedAt')

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-[#DC3545]" />
      case 'figma':
        return <Image className="w-8 h-8 text-[#007BFF]" />
      case 'markdown':
      case 'md':
        return <Code className="w-8 h-8 text-[#28A745]" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-8 h-8 text-[#FFC107]" />
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-8 h-8 text-[#007BFF]" />
      case 'zip':
      case 'rar':
        return <Archive className="w-8 h-8 text-muted-foreground" />
      default:
        return <File className="w-8 h-8 text-muted-foreground" />
    }
  }

  const formatFileSize = (size: string) => {
    return size
  }

  const filteredFiles = project.files.filter((file: any) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return parseFloat(a.size) - parseFloat(b.size)
      case 'uploadedAt':
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case 'type':
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  const categories = [...new Set(project.files.map((f: any) => f.category))]

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sortedFiles.map((file: any) => (
        <Card key={file.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center justify-center w-16 h-16 bg-muted/30 rounded-lg">
              {getFileIcon(file.type)}
            </div>
            <div className="text-center w-full">
              <h4 className="font-medium text-sm truncate" title={file.name}>
                {file.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFileSize(file.size)}
              </p>
              <Badge variant="outline" className="text-xs mt-2">
                {file.category}
              </Badge>
            </div>
            <div className="flex items-center space-x-1 w-full">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <Card className="p-6">
      <div className="space-y-4">
        {sortedFiles.map((file: any) => (
          <div key={file.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-muted/30 rounded">
                {getFileIcon(file.type)}
              </div>
              <div>
                <h4 className="font-medium">{file.name}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {file.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{file.uploadedBy}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Files</h2>
          <Badge variant="outline">
            {filteredFiles.length} of {project.files.length}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FolderOpen className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button className="bg-[#28A745] hover:bg-[#218838] text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uploadedAt">Upload Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-l-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* File Views */}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'grid' && renderGridView()}

      {/* Upload Zone */}
      <Card className="p-8 border-2 border-dashed border-border">
        <div className="text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Drop files here to upload</h3>
          <p className="text-muted-foreground mb-4">
            Or click to browse and select files from your computer
          </p>
          <Button className="bg-[#28A745] hover:bg-[#218838] text-white">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </div>
      </Card>

      {/* Storage Info */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#007BFF]">1.2 GB</div>
            <p className="text-sm text-muted-foreground">Used</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#28A745]">8.8 GB</div>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">10 GB</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>
      </Card>
    </div>
  )
}