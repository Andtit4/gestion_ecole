'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/app/components/ui/button'
import { Plus, Edit, Trash2, Eye, AlertCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { Badge } from '@/app/components/ui/badge'
import ProgrammeForm from './ProgrammeForm'
import ProgrammeView from './ProgrammeView'
import { useToast } from '@/app/components/ui/use-toast'
import DeleteConfirmDialog from '@/app/components/ui/DeleteConfirmDialog'
import TableEmpty from '@/app/components/ui/TableEmpty'

export default function ProgrammeList() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [programmes, setProgrammes] = useState([])
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [editingProgramme, setEditingProgramme] = useState(null)
  const [viewingProgramme, setViewingProgramme] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [programmeToDelete, setProgrammeToDelete] = useState(null)

  const levels = ['6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale']

  useEffect(() => {
    fetchProgrammes()
    fetchCourses()
  }, [])

  const fetchProgrammes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/programmes')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des programmes')
      }
      const data = await response.json()
      setProgrammes(data)
    } catch (err) {
      setError('Impossible de charger les programmes')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des matières')
      }
      const data = await response.json()
      setCourses(data)
    } catch (err) {
      console.error('Erreur lors du chargement des matières:', err)
    }
  }

  const handleAdd = () => {
    setEditingProgramme(null)
    setShowForm(true)
  }

  const handleEdit = (programme) => {
    setEditingProgramme(programme)
    setShowForm(true)
  }

  const handleView = (programme) => {
    setViewingProgramme(programme)
    setShowView(true)
  }

  const handleDelete = (programme) => {
    setProgrammeToDelete(programme)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!programmeToDelete) return

    try {
      const response = await fetch(`/api/programmes/${programmeToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      setProgrammes(programmes.filter((p) => p.id !== programmeToDelete.id))
      toast({
        title: 'Programme supprimé',
        description: 'Le programme a été supprimé avec succès',
      })
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le programme',
        variant: 'destructive',
      })
    } finally {
      setShowDeleteDialog(false)
      setProgrammeToDelete(null)
    }
  }

  const handleFormSubmit = (newProgramme) => {
    if (editingProgramme) {
      // Mise à jour d'un programme existant
      setProgrammes(
        programmes.map((p) => (p.id === newProgramme.id ? newProgramme : p))
      )
    } else {
      // Ajout d'un nouveau programme
      setProgrammes([...programmes, newProgramme])
    }
    setShowForm(false)
  }

  const filteredProgrammes = programmes.filter((programme) => {
    const courseMatch = selectedCourse === 'all' || programme.courseId === selectedCourse
    const levelMatch = selectedLevel === 'all' || programme.level === selectedLevel
    return courseMatch && levelMatch
  })

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

  // Vérifier si l'utilisateur a le droit de modifier les programmes
  const canEditProgrammes = session?.user?.role === 'ADMIN' || session?.user?.role === 'TEACHER'

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des programmes...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center p-8">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
        <Button onClick={fetchProgrammes}>Réessayer</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-48">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {canEditProgrammes && (
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Nouveau programme
          </Button>
        )}
      </div>

      {programmes.length === 0 ? (
        <TableEmpty 
          message="Aucun programme n'a été créé" 
          icon={canEditProgrammes && (
            <Button onClick={handleAdd} variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Créer un programme
            </Button>
          )}
        />
      ) : filteredProgrammes.length === 0 ? (
        <TableEmpty message="Aucun programme ne correspond aux critères de filtrage" />
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProgrammes.map((programme) => {
                const course = courses.find(c => c.id === programme.courseId)
                return (
                  <TableRow key={programme.id}>
                    <TableCell className="font-medium">{programme.title}</TableCell>
                    <TableCell>{course?.name || 'Inconnue'}</TableCell>
                    <TableCell>{programme.level}</TableCell>
                    <TableCell>{programme.year}</TableCell>
                    <TableCell>{getStatusBadge(programme.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(programme)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canEditProgrammes && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(programme)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(programme)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {showForm && (
        <ProgrammeForm
          programme={editingProgramme}
          courses={courses}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showView && viewingProgramme && (
        <ProgrammeView
          programme={viewingProgramme}
          courses={courses}
          onClose={() => setShowView(false)}
        />
      )}

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Supprimer le programme"
        description="Êtes-vous sûr de vouloir supprimer ce programme? Cette action est irréversible."
      />
    </div>
  )
} 