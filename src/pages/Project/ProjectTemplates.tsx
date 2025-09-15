import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Clock, CheckCircle, Zap, BarChart3, GitBranch } from 'lucide-react'

const projectTemplates = [
  {
    id: 'template-1',
    name: 'Software Development Project',
    description: 'Complete template for agile software development with sprints, epics, and user stories',
    methodology: 'Scrum',
    type: 'Software Development',
    estimatedDuration: '3-6 months',
    features: ['Epic & Story Management', 'Sprint Planning', 'Code Review Process', 'QA Testing'],
    icon: '💻'
  },
  {
    id: 'template-2',
    name: 'Marketing Campaign',
    description: 'End-to-end marketing campaign management from planning to execution',
    methodology: 'Kanban',
    type: 'Marketing',
    estimatedDuration: '2-4 months',
    features: ['Content Planning', 'Creative Review', 'Multi-channel Execution', 'Performance Tracking'],
    icon: '📢'
  },
  {
    id: 'template-3',
    name: 'Client Project Delivery',
    description: 'Structured template for client-facing project delivery with milestones',
    methodology: 'Waterfall',
    type: 'Client Services',
    estimatedDuration: '1-3 months',
    features: ['Client Communication', 'Milestone Tracking', 'Deliverable Management', 'Invoice Integration'],
    icon: '🤝'
  },
  {
    id: 'template-4',
    name: 'Data Analytics Project',
    description: 'Comprehensive data analytics project with ETL pipelines and reporting dashboards',
    methodology: 'Kanban',
    type: 'Analytics',
    estimatedDuration: '2-5 months',
    features: ['Data Pipeline Setup', 'Dashboard Creation', 'ML Model Development', 'Automated Reporting'],
    icon: '📊'
  },
  {
    id: 'template-5',
    name: 'Infrastructure Migration',
    description: 'Cloud infrastructure migration project with phased rollout and monitoring',
    methodology: 'Waterfall',
    type: 'Infrastructure',
    estimatedDuration: '4-8 months',
    features: ['Migration Planning', 'Security Assessment', 'Performance Testing', 'Rollback Strategy'],
    icon: '☁️'
  },
  {
    id: 'template-6',
    name: 'Research & Development',
    description: 'R&D project template for exploring new technologies and proof of concepts',
    methodology: 'Scrum',
    type: 'Research',
    estimatedDuration: '1-4 months',
    features: ['Research Documentation', 'Prototype Development', 'Feasibility Analysis', 'Technology Assessment'],
    icon: '🔬'
  }
]

interface ProjectTemplatesProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: typeof projectTemplates[0]) => void
}

export function ProjectTemplates({ isOpen, onClose, onSelectTemplate }: ProjectTemplatesProps) {
  const getMethodologyIcon = (methodology: string) => {
    switch (methodology) {
      case 'Scrum': return <Zap className="w-4 h-4" />
      case 'Kanban': return <BarChart3 className="w-4 h-4" />
      case 'Waterfall': return <GitBranch className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Software Development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Marketing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'Client Services': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Analytics': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'Infrastructure': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'Research': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[1200px] max-w-[1200px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Project Templates</span>
            <Badge variant="outline">{projectTemplates.length} Templates</Badge>
          </DialogTitle>
          <DialogDescription>
            Choose from our curated project templates to jumpstart your project with industry best practices and proven workflows.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-[#28A745]/30 group" 
                onClick={() => onSelectTemplate(template)}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold truncate group-hover:text-[#28A745] transition-colors">
                          {template.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          {getMethodologyIcon(template.methodology)}
                          <span>{template.methodology}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(template.type)}`}>
                          {template.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{template.estimatedDuration}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3" />
                          <span>{template.features.length} features</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Included Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#28A745]" />
              <span className="font-medium text-sm">What's included with templates:</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6">
              <li>• Pre-configured project structure and workflows</li>
              <li>• Industry-specific task templates and checklists</li>
              <li>• Team roles and permission templates</li>
              <li>• Milestone and deliverable frameworks</li>
              <li>• Best practice documentation and guidelines</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}