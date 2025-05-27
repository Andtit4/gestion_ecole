'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClassForm } from '@/components/classes/ClassForm'
import { toast } from 'sonner'

interface Teacher {
  id: string
  firstName: string
  lastName: string
}

interface Class {
  id: string
  name: string
  level: string
  year: number
  teacher: Teacher
  studentCount: number
}

interface FormData {
  name: string
  level: string
  year: number
  teacherId: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [filters, setFilters] = useState({
    level: 'all',
    teacherId: 'all',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
    fetchTeachers()
  }, [filters])

  const fetchClasses = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filters.level !== 'all') params.append('level', filters.level)

      const response = await fetch(`/api/classes?${params.toString()}`)
      if (!response.ok) throw new Error('Erreur lors de la récupération des classes')
      
      const data = await response.json()
      
      // Si un filtre d'enseignant est appliqué, filtrer côté client
      const filteredData = filters.teacherId !== 'all' 
        ? data.filter((c: Class) => c.teacher.id === filters.teacherId)
        : data

      setClasses(filteredData)
    } catch (error) {
      toast.error('Erreur lors de la récupération des classes')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers')
      if (!response.ok) throw new Error('Erreur lors de la récupération des enseignants')
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des enseignants')
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.')) return

    try {
      const response = await fetch(`/api/classes?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression de la classe')
      }
      
      toast.success('Classe supprimée avec succès')
      fetchClasses()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erreur lors de la suppression de la classe')
      }
      console.error(error)
    }
  }

  const handleEdit = (class_: Class) => {
    setSelectedClass(class_)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setSelectedClass(null)
    setIsFormOpen(false)
  }

  const handleFormSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/classes', {
        method: selectedClass ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedClass ? { ...data, id: selectedClass.id } : data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde de la classe')
      }
      
      toast.success(`Classe ${selectedClass ? 'modifiée' : 'ajoutée'} avec succès`)
      handleFormClose()
      fetchClasses()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erreur lors de la sauvegarde de la classe')
      }
      console.error(error)
    }
  }

  // List of available levels (primaire, collège and lycée)
  const levels = [
    'CP', 'CE1', 'CE2', 'CM1', 'CM2',  // Primaire
    '6ème', '5ème', '4ème', '3ème',    // Collège
    '2nde', '1ère', 'Terminale'        // Lycée
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Classes</h1>
        <Button onClick={() => setIsFormOpen(true)}>Ajouter une classe</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={filters.level}
              onValueChange={(value: string) => setFilters({ ...filters, level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les niveaux" />
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
            
            <Select
              value={filters.teacherId}
              onValueChange={(value: string) => setFilters({ ...filters, teacherId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les enseignants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les enseignants</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : classes.length === 0 ? (
            <div className="text-center py-4">Aucune classe trouvée</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Professeur principal</TableHead>
                  <TableHead>Nombre d'élèves</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((class_) => (
                  <TableRow key={class_.id}>
                    <TableCell className="font-medium">{class_.name}</TableCell>
                    <TableCell>{class_.level}</TableCell>
                    <TableCell>{class_.year}</TableCell>
                    <TableCell>
                      {class_.teacher ? 
                        `${class_.teacher.firstName} ${class_.teacher.lastName}` : 
                        'Non assigné'}
                    </TableCell>
                    <TableCell>{class_.studentCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(class_)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(class_.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <ClassForm
          class_={selectedClass}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          teachers={teachers}
          levels={levels}
        />
      )}
    </div>
  )
} 