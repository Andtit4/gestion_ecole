'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

export default function ProgrammeView({ programme, courses, onClose }) {
  const course = courses.find(c => c.id === programme.courseId)

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Brouillon</Badge>
      case 'PUBLISHED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Publié</Badge>
      case 'ARCHIVED':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Archivé</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {programme.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>{course?.name || 'Matière inconnue'}</span>
            <span className="text-gray-400">•</span>
            <span>{programme.level}</span>
            <span className="text-gray-400">•</span>
            <span>Année {programme.year}</span>
            <span className="text-gray-400">•</span>
            {getStatusBadge(programme.status)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {programme.description && (
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{programme.description}</p>
            </div>
          )}

          {programme.objectives && (
            <div>
              <h3 className="text-lg font-medium mb-2">Objectifs pédagogiques</h3>
              <p className="text-gray-700 whitespace-pre-line">{programme.objectives}</p>
            </div>
          )}

          {programme.content && (
            <div>
              <h3 className="text-lg font-medium mb-2">Contenu du programme</h3>
              <div className="text-gray-700 whitespace-pre-line border p-4 rounded-md bg-gray-50">
                {programme.content}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <div>
                <span className="font-medium">Créé le:</span>{' '}
                {new Date(programme.createdAt).toLocaleDateString('fr-FR')}
              </div>
              <div>
                <span className="font-medium">Dernière mise à jour:</span>{' '}
                {new Date(programme.updatedAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 