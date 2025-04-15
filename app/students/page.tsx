/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { StudentForm } from '@/components/students/StudentForm'

interface Student {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  class: {
    id: string
    name: string
    level: string
  } | null
}

export default function StudentsPage() {
  const { data: session } = useSession()
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState([])
  const [parents, setParents] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    classId: 'all',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  useEffect(() => {
    if (session) {
      fetchStudents()
    }
  }, [filters, session])

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchStudents(),
        fetchClasses(),
        fetchParents()
      ])
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      toast.error("Erreur lors du chargement des données")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      let url = '/api/students?'
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.classId !== 'all') params.append('classId', filters.classId)

      url += params.toString()
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Erreur lors de la récupération des étudiants')
      
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des étudiants')
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
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des classes')
    }
  }

  const fetchParents = async () => {
    try {
      const response = await fetch('/api/parents')
      if (!response.ok) throw new Error('Erreur lors de la récupération des parents')
      
      const data = await response.json()
      setParents(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des parents')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.')) return

    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'étudiant')
      }
      
      toast.success('Étudiant supprimé avec succès')
      fetchStudents()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression de l\'étudiant')
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

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/students', {
        method: selectedStudent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedStudent ? { ...data, id: selectedStudent.id } : data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde de l\'étudiant')
      }
      
      toast.success(`Étudiant ${selectedStudent ? 'modifié' : 'ajouté'} avec succès`)
      handleFormClose()
      fetchStudents()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde de l\'étudiant')
      console.error(error)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Étudiants</h1>
        <Button onClick={() => setIsFormOpen(true)}>Ajouter un étudiant</Button>
      </div>


      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Rechercher et filtrer les étudiants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Rechercher par nom ou prénom"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="h-10"
              />
            </div>
            
            <Select
              value={filters.classId}
              onValueChange={(value) => setFilters({ ...filters, classId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {classes.map((cls: any) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants</CardTitle>
          <CardDescription>{students.length} étudiant(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-4">Aucun étudiant trouvé</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.user.lastName}</TableCell>
                      <TableCell>{student.user.firstName}</TableCell>
                      <TableCell>{student.user.email}</TableCell>
                      <TableCell>
                        {student.class ? `${student.class.name} (${student.class.level})` : 'Non assigné'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
            </div>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <StudentForm
          student={selectedStudent}
          classes={classes}
          parents={parents}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
} 
