'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StudentForm } from '@/components/students/StudentForm'
import { toast } from 'sonner'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  classId: string | null
  class?: {
    id: string
    name: string
    level: string
  }
  createdAt: string
  updatedAt: string
}

interface Class {
  id: string
  name: string
  level: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  password?: string
  classId: string | null
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    classId: 'all',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [filters])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filters.classId !== 'all') params.append('classId', filters.classId)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/students?${params.toString()}`)
      if (!response.ok) throw new Error('Erreur lors de la récupération des élèves')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des élèves')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) throw new Error('Erreur lors de la récupération des classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des classes')
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) return

    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Erreur lors de la suppression de l\'élève')
      toast.success('Élève supprimé avec succès')
      fetchStudents()
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'élève')
      console.error(error)
    }
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setSelectedStudent(null)
    setIsFormOpen(false)
  }

  const handleFormSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/students', {
        method: selectedStudent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedStudent ? { ...data, id: selectedStudent.id } : data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde de l\'élève')
      }
      
      toast.success(`Élève ${selectedStudent ? 'modifié' : 'ajouté'} avec succès`)
      handleFormClose()
      fetchStudents()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Erreur lors de la sauvegarde de l\'élève')
      } else {
        toast.error('Erreur lors de la sauvegarde de l\'élève')
      }
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Élèves</h1>
        <Button onClick={() => setIsFormOpen(true)}>Ajouter un élève</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Rechercher par nom, prénom ou email"
              value={filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select
              value={filters.classId}
              onValueChange={(value: string) => setFilters({ ...filters, classId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {classes.map((class_) => (
                  <SelectItem key={class_.id} value={class_.id}>
                    {class_.name} ({class_.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Élèves</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-4">Aucun élève trouvé</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.lastName}</TableCell>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.class?.name || 'Non assigné'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
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
        <StudentForm
          student={selectedStudent}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          classes={classes}
        />
      )}
    </div>
  )
} 